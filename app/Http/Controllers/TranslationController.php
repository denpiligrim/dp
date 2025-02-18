<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DeepL\DeepLClient;

class TranslationController extends Controller
{
    public function translate(Request $request)
    {
        $request->validate([
            'text' => 'required|string',
            'post_id' => 'required|integer'
        ]);

        $authKey = env('DEEPL_API_KEY', '');
        $deeplClient = new DeepLClient($authKey);

        try {
            $result = $deeplClient->translateText($request->input('text'), null, 'en-US');
            return response()->json(['translated_text' => $result->text, 'post_id' => $request->post_id]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}