<?php

namespace App\Http\Controllers;

use App\Services\YouTubeChannel;

class YouTubeController extends Controller
{
    public function channel(YouTubeChannel $youtube)
    {
        $data = $youtube->fetch();

        return response()->json($data, $data['videos'] === null ? 503 : 200)
            ->header('Cache-Control', 'no-store');
    }
}
