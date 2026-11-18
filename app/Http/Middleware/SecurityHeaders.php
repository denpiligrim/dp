<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        Vite::useCspNonce();
        $response = $next($request);
        $nonce = Vite::cspNonce();
        $development = app()->environment('local');
        $viteOrigin = $development ? ' http://127.0.0.1:5173' : '';
        $scripts = "'self' 'nonce-{$nonce}'".$viteOrigin;
        $connect = "'self' https://russia.iplist.opencck.org".$viteOrigin.($development ? ' ws://127.0.0.1:5173' : '');
        $response->headers->set('Content-Security-Policy',
            "default-src 'self'; script-src {$scripts}; style-src 'self' 'unsafe-inline'; ".
            "img-src 'self' https: data: blob:{$viteOrigin}; font-src 'self' data:{$viteOrigin}; connect-src {$connect}; ".
            "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://vkvideo.ru https://rutube.ru; ".
            "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'".
            ($development ? '' : '; upgrade-insecure-requests'));
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'no-referrer');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
        if (!$development && ($request->isSecure() || str_starts_with(config('app.url'), 'https://'))) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000');
        }
        return $response;
    }
}
