<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TelegramController extends Controller
{
    private string $botToken;
    private string $chatId;

    public function __construct()
    {
        $this->botToken = (string) config('services.telegram.bot_token', '');
        $this->chatId = (string) config('services.telegram.chat_id', '');
    }

    public function getSubscriberCount()
    {
        $count = null;
        if ($this->botToken !== '' && $this->chatId !== '') {
            try {
                $response = Http::connectTimeout(3)->timeout(8)->get(
                    "https://api.telegram.org/bot{$this->botToken}/getChatMemberCount", ['chat_id' => $this->chatId]
                );
                $result = $response->json('result');
                if ($response->successful() && $response->json('ok') === true && is_int($result) && $result >= 0) {
                    $count = $result;
                }
            } catch (ConnectionException $e) {
                // Never log an exception URL containing the bot token.
            }
        }
        return response()->json(['subscriber_count' => $count], $count === null ? 503 : 200)
            ->header('Cache-Control', 'no-store');
    }

    private function getPhotoUrl(array $photos, int $messageId): ?string
    {
        if ($this->botToken === '') return null;
        $photo = collect($photos)->sortByDesc('file_size')->first();
        try {
            $info = Http::connectTimeout(3)->timeout(8)->withoutRedirecting()
                ->get("https://api.telegram.org/bot{$this->botToken}/getFile", ['file_id' => $photo['file_id']]);
            $path = $info->json('result.file_path');
            $size = $info->json('result.file_size');
            if (!$info->successful() || !is_string($path) || !is_int($size) || $size > 5 * 1024 * 1024
                || str_contains($path, '..') || !preg_match('~\Aphotos/[a-zA-Z0-9_/-]+\.(?:jpg|jpeg|png|webp)\z~', $path)) return null;
            $response = Http::connectTimeout(3)->timeout(8)->withoutRedirecting()
                ->withOptions(['progress' => static function ($total, $downloaded) {
                    if ($total > 5 * 1024 * 1024 || $downloaded > 5 * 1024 * 1024) throw new \RuntimeException('Image too large.');
                }])->get("https://api.telegram.org/file/bot{$this->botToken}/{$path}");
            if (!$response->successful() || strlen($response->body()) > 5 * 1024 * 1024) return null;
            $local = 'telegram_images/'.$messageId.'_'.basename($path);
            Storage::disk('public')->put($local, $response->body());
            return '/storage/'.$local;
        } catch (\Throwable $e) {
            Log::warning('Telegram image download failed.', ['message_id' => $messageId]);
            return null;
        }
    }

    public function handleWebhook(Request $request)
    {
        $secret = (string) config('services.telegram.webhook_secret', '');
        abort_if(!preg_match('/\A[a-zA-Z0-9_-]{32,256}\z/', $secret) || $this->chatId === '', 503);
        abort_unless(hash_equals($secret, (string) $request->header('X-Telegram-Bot-Api-Secret-Token', '')), 403);
        abort_if(strlen($request->getContent()) > 65536, 413);
        if (!$request->has('channel_post')) return response()->json(['status' => 'ignored']);
        $data = $request->validate([
            'channel_post' => 'required|array',
            'channel_post.message_id' => 'required|integer|min:1',
            'channel_post.chat' => 'required|array',
            'channel_post.chat.id' => 'required|integer',
            'channel_post.chat.username' => 'nullable|string|max:64|regex:/\A[a-zA-Z0-9_]+\z/',
            'channel_post.chat.title' => 'nullable|string|max:255',
            'channel_post.text' => 'nullable|string|max:10000',
            'channel_post.caption' => 'nullable|string|max:10000',
            'channel_post.date' => 'required|integer|min:1|max:4102444800',
            'channel_post.photo' => 'sometimes|array|max:10',
            'channel_post.photo.*.file_id' => 'required|string|max:256|regex:/\A[a-zA-Z0-9_-]+\z/',
            'channel_post.photo.*.file_size' => 'sometimes|integer|min:1|max:5242880',
        ]);
        $post = $data['channel_post'];
        abort_unless((string) $post['chat']['id'] === $this->chatId, 403);
        try {
            Cache::lock('telegram-post:'.$post['message_id'], 30)->block(2, function () use ($post) {
                if (DB::table('telegram_posts')->where('message_id', $post['message_id'])->exists()) return;
                DB::table('telegram_posts')->insert([
                    'message_id' => $post['message_id'],
                    'chat_username' => $post['chat']['username'] ?? null,
                    'chat_title' => $post['chat']['title'] ?? null,
                    'photo' => !empty($post['photo']) ? $this->getPhotoUrl($post['photo'], $post['message_id']) : null,
                    'text' => $post['caption'] ?? $post['text'] ?? '',
                    'date' => gmdate('Y-m-d H:i:s', $post['date']),
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('Telegram post could not be stored.', ['message_id' => $post['message_id']]);
            return response()->json(['error' => 'Temporarily unavailable.'], 503);
        }
        return response()->json(['status' => 'success']);
    }

    public function getLastPosts()
    {
        return response()->json(DB::table('telegram_posts')->orderBy('date', 'desc')->limit(10)->get());
    }
}
