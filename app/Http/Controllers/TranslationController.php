<?php

namespace App\Http\Controllers;

use DeepL\DeepLClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TranslationController extends Controller
{
    public function translate(Request $request)
    {
        $data = $request->validate(['post_id' => 'required|integer|min:1']);
        $text = DB::table('telegram_posts')->where('message_id', $data['post_id'])->value('text');
        abort_unless(is_string($text) && $text !== '', 404);
        abort_if(mb_strlen($text) > 10000, 422);
        try {
            $translated = Cache::remember('translation:en:'.hash('sha256', $text), 86400, function () use ($text) {
                return app(DeepLClient::class)->translateText($text, null, 'en-US')->text;
            });
            return response()->json(['translated_text' => $translated, 'post_id' => $data['post_id']]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Translation is temporarily unavailable.'], 503);
        }
    }
}
