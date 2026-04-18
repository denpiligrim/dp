<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IpController extends Controller
{
    public function getIpInfo($ip)
    {
        // Базовая проверка наличия IP
        if (!$ip) {
            return response()->json(['error' => 'IP адрес не предоставлен'], 400);
        }

        try {
            // Отправляем запрос к стороннему API с помощью Laravel HTTP Client
            $response = Http::get("http://ip-api.com/json/{$ip}");

            // Если сервер ip-api.com вернул 5xx или 4xx ошибку
            if ($response->failed()) {
                return response()->json(['error' => 'Ошибка при обращении к стороннему API'], 500);
            }

            $data = $response->json();

            // Специфичная логика ip-api.com: статус 200, но внутри status: "fail" 
            // (например, локальный IP или неверный формат)
            if (isset($data['status']) && $data['status'] === 'fail') {
                return response()->json([
                    'error' => 'Не удалось определить локацию',
                    'details' => $data['message'] ?? 'Неизвестная ошибка'
                ], 400);
            }

            // Возвращаем успешный ответ
            return response()->json($data, 200);

        } catch (\Exception $e) {
            // Логируем реальную ошибку для отладки
            Log::error('Ошибка проксирования IP: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Внутренняя ошибка сервера при получении данных IP'
            ], 500);
        }
    }
}