<?php

use App\Http\Controllers\CryptoController;
use App\Http\Controllers\TelegramController;
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

Route::view('/{path}', 'welcome', [])
    ->where('path', '.*');
