<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramController extends Controller
{
    private string $botToken;
    private string $chatId;

    public function __construct()
    {
        // Установите токен бота и chat_id вашего канала
        $this->botToken = env('TELEGRAM_BOT_TOKEN');
        $this->chatId = env('TELEGRAM_CHAT_ID');
    }

    public function fetchLatestPosts()
    {
        $url = "https://api.telegram.org/bot{$this->botToken}/getUpdates";

        // Делаем запрос к Telegram API
        $response = Http::get($url);

        if ($response->failed()) {
            return response()->json(['error' => 'Failed to fetch updates from Telegram'], 500);
        }

        $data = $response->json();

        // Проверяем, есть ли данные
        if (!isset($data['ok']) || !$data['ok'] || empty($data['result'])) {
            return response()->json(['error' => 'No data available'], 404);
        }

        $posts = collect($data['result'])
            ->whereNotNull('channel_post') // Берем только объекты с "channel_post"
            ->map(function ($item) {
                $post = $item['channel_post'];

                return [
                    'chat_username' => $post['chat']['username'],
                    'chat_title' => $post['chat']['title'],
                    'message_id' => $post['message_id'],
                    'date' => date('Y-m-d H:i:s', $post['date']),
                    'caption' => $post['caption'] ?? null,
                    'photo' => isset($post['photo']) ? $this->getPhotoUrl($post['photo']) : null,
                ];
            })
            ->take(10) // Берем последние 10 постов
            ->values();

        return response()->json($posts);
    }

    private function getPhotoUrl(array $photos): ?string
    {
        // Находим фото с наибольшим размером
        $largestPhoto = collect($photos)->sortByDesc('file_size')->first();

        if (!$largestPhoto || !isset($largestPhoto['file_id'])) {
            return null;
        }

        // Получаем file_path через Telegram API
        $fileResponse = Http::get("https://api.telegram.org/bot{$this->botToken}/getFile?file_id={$largestPhoto['file_id']}");

        if ($fileResponse->failed() || !isset($fileResponse->json()['result']['file_path'])) {
            return null;
        }

        $filePath = $fileResponse->json()['result']['file_path'];

        return "https://api.telegram.org/file/bot{$this->botToken}/{$filePath}";
    }

    public function handleWebhook(Request $request)
    {
        $data = $request->all();

        if (isset($data['channel_post'])) {
            $post = $data['channel_post'];

            // Проверяем, что пост пришёл из нужного канала
            if ($post['chat']['id'] == $this->chatId) {
                try {
                    // Проверяем, существует ли пост с таким message_id
                    $exists = DB::table('telegram_posts')
                        ->where('message_id', $post['message_id'])
                        ->exists();

                    if (!$exists) {
                        // Добавляем новый пост в таблицу
                        DB::table('telegram_posts')->insert([
                            'message_id' => $post['message_id'],
                            'chat_username' => $post['chat']['username'] ?? null,
                            'chat_title' => $post['chat']['title'] ?? null,
                            'photo' => isset($post['photo']) ? $this->getPhotoUrl($post['photo']) : null,
                            'text' => isset($post['caption']) ? $post['caption'] : $post['text'],
                            'date' => date('Y-m-d H:i:s', $post['date'])
                        ]);

                        Log::info('New post added to telegram_posts', [
                            'message_id' => $post['message_id'],
                            'chat_title' => $post['chat']['title'] ?? null,
                        ]);
                    } else {
                        Log::info('Duplicate post ignored', [
                            'message_id' => $post['message_id'],
                        ]);
                    }
                } catch (\Exception $e) {
                    // Логирование ошибок
                    Log::error('Failed to insert post into telegram_posts', [
                        'error' => $e->getMessage(),
                        'post_data' => $post,
                    ]);
                }
            } else {
                Log::warning('Post ignored from unauthorized chat', [
                    'chat_id' => $post['chat']['id'],
                ]);
            }
        }

        return response()->json(['status' => 'success']);
    }

    public function getLastPosts()
    {
        $posts = DB::table('telegram_posts')
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        return response()->json($posts);
    }
}