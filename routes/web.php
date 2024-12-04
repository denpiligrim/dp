<?php

use App\Http\Controllers\CryptoController;
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

Route::get('/api/cryptocurrency/listings/latest', [CryptoController::class, 'cryptocurrencyList']);

Route::view('/{path}', 'welcome', [])
    ->where('path', '.*');
