<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\GithubController;
use App\Http\Controllers\IpCountryController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\YouTubeController;
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

Route::middleware('throttle:public-data')->group(function () {
Route::get('/api/ip-country/{ip}', IpCountryController::class)->where('ip', '[0-9.]{1,15}');
Route::get('/api/global-metrics/quotes/latest', [CryptoController::class, 'globalMetrics']);
Route::get('/api/fear-and-greed/latest', [CryptoController::class, 'fearGreedIndex']);
Route::get('/api/cryptocurrency/listings/latest', [CryptoController::class, 'cryptocurrencyList']);
Route::get('/api/posts', [TelegramController::class, 'getLastPosts']);
Route::get('/api/telegram/subscribers', [TelegramController::class, 'getSubscriberCount']);
Route::get('/api/youtube/channel', [YouTubeController::class, 'channel']);
Route::get('/api/portfolio', [PortfolioController::class, 'index']);
// Route::post('/api/createPost', [PostController::class, 'newPost']);
Route::get('/api/manager-info', [GithubController::class, 'getRepoInfo']);
});
Route::post('/api/translate', [TranslationController::class, 'translate'])->middleware('throttle:translations');

Route::post('/telegram/webhook', [TelegramController::class, 'handleWebhook'])->middleware('throttle:telegram-webhook');

// Retired endpoints must not fall through to the SPA's catch-all route.
Route::any('/fetch-html', fn () => response()->json(['error' => 'Endpoint retired.'], 410));
Route::any('/api/install-forwarding', fn () => response()->json(['error' => 'Use your own SSH terminal.'], 410));
Route::any('/get-user-info', fn () => response()->json(['error' => 'Endpoint retired.'], 410));
Route::any('/api/ip-info/{ip?}', fn () => response()->json(['error' => 'Endpoint retired.'], 410))->where('ip', '.*');

Route::view('/{path}', 'welcome', [])
    ->where('path', '.*');
