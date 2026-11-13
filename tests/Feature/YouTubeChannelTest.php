<?php

namespace Tests\Feature;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class YouTubeChannelTest extends TestCase
{
    private function channelHtml(?string $count = '11.4K subscribers'): string
    {
        return '<script>var ytInitialData = '.json_encode([
            'metadata' => ['channelMetadataRenderer' => ['title' => 'DenPiligrim', 'description' => 'Channel description']],
            'header' => ['pageHeaderRenderer' => ['content' => ['pageHeaderViewModel' => ['metadata' => ['contentMetadataViewModel' => [
                'metadataRows' => [['metadataParts' => [['text' => ['content' => $count]]]]],
            ]]]]]],
        ]).';</script>';
    }

    private function feed(int $count = 15): string
    {
        $xml = '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015">';
        for ($i = 1; $i <= $count; $i++) {
            $id = sprintf('%011d', $i);
            $date = sprintf('2026-10-%02dT12:00:00+00:00', $i);
            $xml .= "<entry><yt:videoId>{$id}</yt:videoId><title>Video {$i} &amp; more</title><published>{$date}</published></entry>";
        }

        return $xml.'</feed>';
    }

    private function fakeSources(string $feed, ?string $channel = null): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'www.youtube.com/feeds/videos.xml*' => Http::response($feed),
            'www.youtube.com/@denpiligrim/videos*' => Http::response($channel ?? $this->channelHtml()),
        ]);
    }

    public function test_it_returns_the_ten_latest_videos_and_public_channel_count(): void
    {
        $this->fakeSources($this->feed());
        $response = $this->getJson('/api/youtube/channel?channel_id=other')->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertJsonPath('channel.subscriber_count', 11400)
            ->assertJsonPath('channel.title', 'DenPiligrim')
            ->assertJsonPath('channel.description', 'Channel description')
            ->assertJsonCount(10, 'videos')
            ->assertJsonPath('videos.0.title', 'Video 15 & more')
            ->assertJsonPath('videos.9.title', 'Video 6 & more');
        $this->assertSame('https://www.youtube.com/watch?v=00000000015', $response->json('videos.0.url'));
        Http::assertSent(fn ($request) => str_contains($request->url(), '/feeds/videos.xml')
            && $request['channel_id'] === 'UCOv2tFFYDY4mXOM60PVz8zw');
    }

    public function test_hidden_subscriber_count_does_not_hide_the_videos(): void
    {
        $this->fakeSources($this->feed(2), $this->channelHtml(null));
        $this->getJson('/api/youtube/channel')->assertOk()
            ->assertJsonPath('channel.subscriber_count', null)->assertJsonCount(2, 'videos');
    }

    public function test_a_consent_page_or_changed_header_does_not_break_the_feed(): void
    {
        $this->fakeSources($this->feed(1), '<html>Before you continue</html>');
        $this->getJson('/api/youtube/channel')->assertOk()
            ->assertJsonPath('channel.subscriber_count', null)->assertJsonCount(1, 'videos');
    }

    public function test_empty_feed_is_a_successful_empty_state(): void
    {
        $this->fakeSources($this->feed(0));
        $this->getJson('/api/youtube/channel')->assertOk()->assertJsonPath('videos', []);
    }

    public function test_malformed_feed_is_reported_as_unavailable(): void
    {
        $this->fakeSources('<html>not a feed</html>');
        $this->getJson('/api/youtube/channel')->assertStatus(503)
            ->assertJsonPath('videos', null)->assertJsonPath('channel.title', 'DenPiligrim');
    }

    public function test_connection_failure_returns_the_channel_link_and_no_fake_videos(): void
    {
        Http::fake(fn () => throw new ConnectionException('Unavailable'));
        $this->getJson('/api/youtube/channel')->assertStatus(503)
            ->assertJsonPath('videos', null)
            ->assertJsonPath('channel.url', 'https://www.youtube.com/@denpiligrim');
    }

    public function test_http_errors_do_not_appear_as_an_empty_successful_feed(): void
    {
        Http::fake(['www.youtube.com/*' => Http::response('Unavailable', 503)]);
        $this->getJson('/api/youtube/channel')->assertStatus(503)->assertJsonPath('videos', null);
    }

    public function test_legacy_header_and_zero_subscribers_are_supported(): void
    {
        $html = '<script>var ytInitialData = '.json_encode([
            'header' => ['c4TabbedHeaderRenderer' => ['subscriberCountText' => ['simpleText' => '0 subscribers']]],
        ]).';</script>';
        $this->fakeSources($this->feed(1), $html);
        $this->getJson('/api/youtube/channel')->assertOk()->assertJsonPath('channel.subscriber_count', 0);
    }
}
