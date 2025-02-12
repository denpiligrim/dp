<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PostController extends Controller
{
    public function newPost(Request $request)
    {
        $validatedData = $request->validate([
            'text' => 'required|string',
            'images.*' => 'nullable|image',
            'socialNetworks' => 'required|json',
        ]);

        $text = $validatedData['text'];
        $socialNetworks = json_decode($validatedData['socialNetworks'], true);
        $images = $request->file('images', []);

        if ($socialNetworks['vk'] ?? false) {
            $this->postToVk($text, $images);
        }

        if ($socialNetworks['telegram'] ?? false) {
            $this->postToTelegram($text, $images);
        }

        if ($socialNetworks['x'] ?? false) {
            $textEN = $this->translateToEnglish($text);
            $this->postToX($textEN, $images);
        }

        return response()->json(['message' => 'Post created successfully!'], 200);
    }

    private function translateToEnglish($text)
    {
        $response = Http::post('https://api-free.deepl.com/v2/translate', [
            'auth_key' => env('DEEPL_API_KEY'),
            'text' => $text,
            'target_lang' => 'EN',
        ]);

        return $response->json()['translations'][0]['text'] ?? $text;
    }

    private function postToVk($text, $images)
    {
        // Реализация публикации в ВК через API
    }

    private function postToTelegram($text, $images = [])
    {
        $botToken = env('TELEGRAM_BOT_TOKEN'); // Токен вашего бота
        // $chatId = env('TELEGRAM_CHAT_ID');     // ID канала/чата
        $chatId = '-1001849053708';     // ID канала/чата
    
        if (count($images) > 1) {
            // Если несколько изображений, используем sendMediaGroup
            $mediaGroup = [];
            foreach ($images as $index => $image) {
                $mediaGroup[] = [
                    'type' => 'photo',
                    'media' => 'attach://' . $image->getClientOriginalName(),
                    'caption' => $index === 0 ? $text : null, // Текст добавляем только к первой картинке
                    'parse_mode' => 'HTML',
                ];
            }
    
            $mediaRequest = Http::asMultipart();
            foreach ($images as $image) {
                $mediaRequest->attach(
                    $image->getClientOriginalName(),
                    file_get_contents($image->getRealPath())
                );
            }
    
            $response = $mediaRequest->post("https://api.telegram.org/bot{$botToken}/sendMediaGroup", [
                'chat_id' => $chatId,
                'media' => json_encode($mediaGroup),
            ]);
    
            if ($response->failed()) {
                throw new \Exception('Ошибка при отправке группы изображений в Telegram: ' . $response->body());
            }
        } elseif (count($images) === 1) {
            // Если одна картинка, используем sendPhoto
            $image = $images[0];
            $response = Http::attach(
                'photo',
                file_get_contents($image->getRealPath()),
                $image->getClientOriginalName()
            )->post("https://api.telegram.org/bot{$botToken}/sendPhoto", [
                'chat_id' => $chatId,
                'caption' => $text,
                'parse_mode' => 'HTML',
            ]);
    
            if ($response->failed()) {
                throw new \Exception('Ошибка при отправке изображения в Telegram: ' . $response->body());
            }
        } else {
            // Если изображений нет, используем sendMessage
            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML',
            ]);
    
            if ($response->failed()) {
                throw new \Exception('Ошибка при отправке текста в Telegram: ' . $response->body());
            }
        }
    }    

    private function postToX($text, $images = [])
    {
        $bearerToken = env('X_BEARER_TOKEN'); // Токен доступа для API X
        $mediaIds = [];
    
        // Загрузка изображений, если они есть
        if (!empty($images)) {
            foreach ($images as $image) {
                $uploadResponse = Http::withToken($bearerToken)
                    ->attach(
                        'media',
                        file_get_contents($image->getRealPath()),
                        $image->getClientOriginalName()
                    )
                    ->post('https://upload.twitter.com/1.1/media/upload.json');
    
                if ($uploadResponse->failed()) {
                    throw new \Exception('Ошибка при загрузке изображения в X: ' . $uploadResponse->body());
                }
    
                $mediaIds[] = $uploadResponse->json()['media_id_string'];
            }
        }
    
        // Подготовка данных для публикации твита
        $tweetData = ['text' => $text];
        if (!empty($mediaIds)) {
            $tweetData['media'] = ['media_ids' => $mediaIds];
        }
    
        // Публикация твита
        $response = Http::withToken($bearerToken)
            ->post('https://api.x.com/2/tweets', $tweetData);
    
        if ($response->failed()) {
            throw new \Exception('Ошибка при отправке поста в X: ' . $response->body());
        }
    
        return $response->json();
    }    
}