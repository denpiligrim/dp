<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\TelegramController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/api/global-metrics/quotes/latest', [CryptoController::class, 'globalMetrics']);
Route::get('/api/fear-and-greed/latest', [CryptoController::class, 'fearGreedIndex']);
Route::get('/api/cryptocurrency/listings/latest', [CryptoController::class, 'cryptocurrencyList']);
Route::get('/api/posts', [TelegramController::class, 'fetchLatestPosts']);
Route::get('/api/portfolio', [PortfolioController::class, 'index']);
Route::get('/get-user-info', function (Request $request) {
    $ip = $request->ip();
    if ($ip === '127.0.0.1') {
        $ip = '188.65.247.189';
    }

    $response = Http::get("https://ipapi.co/{$ip}/json/");

    if ($response->successful()) {
        $data = $response->json();
        return response()->json([
            'country' => $data['country'] ?? 'EN',
        ]);
    }

    return response()->json(['country' => 'EN'], 500); // Ошибка по умолчанию
});

Route::view('/{path}', 'welcome', [])
    ->where('path', '.*');