<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class CryptoController extends Controller
{
    private function fetch(string $path)
    {
        try {
            $data = Cache::remember('cmc:'.hash('sha256', $path), 120, function () use ($path) {
                return Http::connectTimeout(3)->timeout(8)->withoutRedirecting()
                    ->withHeaders(['X-CMC_PRO_API_KEY' => config('services.cmc.key', '')])
                    ->get('https://pro-api.coinmarketcap.com'.$path)->throw()->json();
            });
            return response()->json(['status' => true, 'result' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['status' => false, 'message' => 'Market data is temporarily unavailable.'], 503);
        }
    }

    public function cryptocurrencyList() { return $this->fetch('/v1/cryptocurrency/listings/latest'); }
    public function globalMetrics() { return $this->fetch('/v1/global-metrics/quotes/latest'); }
    public function fearGreedIndex() { return $this->fetch('/v3/fear-and-greed/latest'); }
}
