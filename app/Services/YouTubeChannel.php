<?php

namespace App\Services;

use DOMDocument;
use DOMXPath;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use JsonException;

class YouTubeChannel
{
    public function fetch(): array
    {
        $channel = [
            'title' => 'DenPiligrim',
            'url' => 'https://www.youtube.com/@denpiligrim',
            'description' => '',
            'subscriber_count' => null,
        ];
        $videos = null;

        try {
            $response = Http::connectTimeout(3)->timeout(12)->get('https://www.youtube.com/feeds/videos.xml', [
                'channel_id' => 'UCOv2tFFYDY4mXOM60PVz8zw',
            ]);
            if ($response->successful()) {
                $videos = $this->parseFeed($response->body());
            }
        } catch (ConnectionException $e) {
            // Report an unavailable feed without hiding the channel link.
        }

        try {
            $response = Http::connectTimeout(3)->timeout(12)
                ->withHeaders(['Accept-Language' => 'en-US,en;q=0.9'])
                ->get($channel['url'].'/videos', ['hl' => 'en', 'ucbcb' => '1']);
            if ($response->successful()) {
                $channel = array_replace($channel, $this->parseChannel($response->body()));
            }
        } catch (ConnectionException $e) {
            // Videos remain usable if the public subscriber count is unavailable.
        }

        return ['channel' => $channel, 'videos' => $videos];
    }

    private function parseChannel(string $html): array
    {
        if (!preg_match('/(?:var\s+)?ytInitialData\s*=\s*(\{.*?\});\s*<\/script>/s', $html, $matches)) {
            return [];
        }
        try {
            $data = json_decode($matches[1], true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            return [];
        }
        $metadata = data_get($data, 'metadata.channelMetadataRenderer', []);
        $countText = data_get($data, 'header.c4TabbedHeaderRenderer.subscriberCountText.simpleText');
        $rows = data_get($data, 'header.pageHeaderRenderer.content.pageHeaderViewModel.metadata.contentMetadataViewModel.metadataRows', []);
        foreach ($rows as $row) {
            foreach ($row['metadataParts'] ?? [] as $part) {
                $text = data_get($part, 'text.content', '');
                if (is_string($text) && preg_match('/subscribers?$/i', $text)) {
                    $countText = $text;
                }
            }
        }

        $count = null;
        if (is_string($countText) && preg_match('/^([\d,.]+)\s*([KMB]?)\s+subscribers?$/i', trim($countText), $match)) {
            $multiplier = ['' => 1, 'K' => 1000, 'M' => 1000000, 'B' => 1000000000][strtoupper($match[2])];
            // Preserve YouTube's publicly displayed, rounded subscriber count.
            $count = (int) round((float) str_replace(',', '', $match[1]) * $multiplier);
        }

        return [
            'title' => is_string($metadata['title'] ?? null) ? $metadata['title'] : 'DenPiligrim',
            'description' => is_string($metadata['description'] ?? null) ? $metadata['description'] : '',
            'subscriber_count' => $count,
        ];
    }

    private function parseFeed(string $xml): ?array
    {
        if (stripos($xml, '<!DOCTYPE') !== false) {
            return null;
        }
        $document = new DOMDocument();
        $previous = libxml_use_internal_errors(true);
        try {
            if (!$document->loadXML($xml, LIBXML_NONET | LIBXML_NOBLANKS)) {
                return null;
            }
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }
        $xpath = new DOMXPath($document);
        $xpath->registerNamespace('atom', 'http://www.w3.org/2005/Atom');
        $xpath->registerNamespace('yt', 'http://www.youtube.com/xml/schemas/2015');
        if ($xpath->query('/atom:feed')->length !== 1) {
            return null;
        }
        $videos = [];
        foreach ($xpath->query('/atom:feed/atom:entry') as $entry) {
            $id = $xpath->evaluate('string(yt:videoId)', $entry);
            $title = $xpath->evaluate('string(atom:title)', $entry);
            $published = $xpath->evaluate('string(atom:published)', $entry);
            if (!preg_match('/^[\w-]{11}$/D', $id) || $title === '' || strtotime($published) === false) {
                continue;
            }
            $videos[$id] = [
                'id' => $id,
                'title' => $title,
                'published_at' => $published,
                'url' => 'https://www.youtube.com/watch?v='.$id,
                'thumbnail' => 'https://i.ytimg.com/vi/'.$id.'/hqdefault.jpg',
            ];
        }
        usort($videos, fn ($a, $b) => strtotime($b['published_at']) <=> strtotime($a['published_at']));

        return array_slice($videos, 0, 10);
    }
}
