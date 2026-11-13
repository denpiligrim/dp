<?php

namespace Tests\Feature;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Env;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TelegramSubscriberCountTest extends TestCase
{
    private array $originalEnvironment = [];

    protected function setUp(): void
    {
        parent::setUp();
        foreach (['TELEGRAM_BOT_TOKEN' => 'test-token', 'TELEGRAM_CHAT_ID' => '@test-channel'] as $key => $value) {
            $this->originalEnvironment[$key] = Env::get($key);
            Env::getRepository()->set($key, $value);
        }
        Http::preventStrayRequests();
    }

    protected function tearDown(): void
    {
        foreach ($this->originalEnvironment as $key => $value) {
            if ($value === null) {
                Env::getRepository()->clear($key);
            } else {
                Env::getRepository()->set($key, $value);
            }
        }
        parent::tearDown();
    }

    public function test_it_requests_the_configured_channel_and_refreshes_every_time(): void
    {
        Http::fake(['api.telegram.org/*' => Http::sequence()
            ->push(['ok' => true, 'result' => 8123])
            ->push(['ok' => true, 'result' => 8124])]);

        $this->getJson('/api/telegram/subscribers?chat_id=@other-channel')
            ->assertOk()->assertExactJson(['subscriber_count' => 8123])
            ->assertHeader('Cache-Control', 'no-store, private');
        $this->getJson('/api/telegram/subscribers')->assertOk()
            ->assertExactJson(['subscriber_count' => 8124]);
        Http::assertSentCount(2);
        Http::assertSent(fn ($request) => str_starts_with($request->url(), 'https://api.telegram.org/bottest-token/getChatMemberCount')
            && $request['chat_id'] === '@test-channel');
    }

    public function test_zero_is_a_valid_count(): void
    {
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => true, 'result' => 0])]);
        $this->getJson('/api/telegram/subscribers')->assertOk()->assertExactJson(['subscriber_count' => 0]);
    }

    public function test_telegram_errors_do_not_expose_credentials_or_invent_a_count(): void
    {
        Http::fake(['api.telegram.org/*' => Http::response(['ok' => false, 'description' => 'test-token'], 403)]);
        $this->getJson('/api/telegram/subscribers')->assertStatus(503)
            ->assertExactJson(['subscriber_count' => null]);
    }

    public function test_invalid_results_are_not_displayed_as_counts(): void
    {
        Http::fake(['api.telegram.org/*' => Http::sequence()
            ->push(['ok' => true, 'result' => '8123'])
            ->push(['ok' => true, 'result' => -1])
            ->push(['ok' => true])]);
        for ($i = 0; $i < 3; $i++) {
            $this->getJson('/api/telegram/subscribers')->assertStatus(503)
                ->assertExactJson(['subscriber_count' => null]);
        }
    }

    public function test_connection_failure_keeps_the_response_safe(): void
    {
        Http::fake(fn () => throw new ConnectionException('test-token'));
        $this->getJson('/api/telegram/subscribers')->assertStatus(503)
            ->assertExactJson(['subscriber_count' => null]);
    }

    public function test_missing_configuration_does_not_make_a_telegram_request(): void
    {
        Env::getRepository()->set('TELEGRAM_BOT_TOKEN', '');
        Http::fake();
        $this->getJson('/api/telegram/subscribers')->assertStatus(503)
            ->assertExactJson(['subscriber_count' => null]);
        Http::assertNothingSent();
    }
}
