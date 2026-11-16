<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('security:telegram-webhook', function () {
    $token = (string) config('services.telegram.bot_token', '');
    $secret = (string) config('services.telegram.webhook_secret', '');
    $base = rtrim((string) config('app.url'), '/');
    if ($token === '' || !preg_match('/\A[a-zA-Z0-9_-]{32,256}\z/', $secret) || !str_starts_with($base, 'https://')) {
        $this->error('Configure HTTPS APP_URL, TELEGRAM_BOT_TOKEN and a random TELEGRAM_WEBHOOK_SECRET (32+ characters).');
        return 1;
    }
    try {
        $response = \Illuminate\Support\Facades\Http::connectTimeout(3)->timeout(10)->withoutRedirecting()
            ->post("https://api.telegram.org/bot{$token}/setWebhook", [
                'url' => $base.'/telegram/webhook', 'secret_token' => $secret,
                'allowed_updates' => ['channel_post'], 'drop_pending_updates' => false,
            ]);
        if (!$response->successful() || $response->json('ok') !== true) {
            $this->error('Telegram did not accept the webhook configuration.');
            return 1;
        }
    } catch (\Throwable $e) {
        $this->error('Could not configure Telegram webhook.');
        return 1;
    }
    $this->info('Telegram webhook configured with secret authentication.');
    return 0;
})->purpose('Register the HTTPS Telegram webhook using secrets from server configuration');
