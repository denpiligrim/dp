<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class IpCountryController extends Controller
{
    public function __invoke(string $ip): JsonResponse
    {
        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return response()->json(['country' => null], 422);
        }

        if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_GLOBAL_RANGE)
            || preg_match('/^(192\.0\.2|198\.51\.100|203\.0\.113)\./', $ip)) {
            return response()->json(['country' => null, 'reason' => 'non_public']);
        }

        try {
            $country = Cache::remember('ip-country:'.$ip, 3600, function () use ($ip) {
                $response = Http::acceptJson()->withoutRedirecting()->connectTimeout(2)->timeout(5)
                    ->get('https://api.country.is/'.$ip);
                if ($response->notFound()) {
                    return null;
                }
                $code = $response->json('country');
                abort_unless($response->successful() && is_string($code) && preg_match('/^[A-Z]{2}$/D', $code), 503);
                return $code;
            });
        } catch (ConnectionException) {
            return response()->json(['country' => null], 503);
        }

        return response()->json(['country' => $country]);
    }
}
