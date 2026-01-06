<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GithubController extends Controller
{
    public function getRepoInfo()
    {
        $data = Cache::remember('github_repo_data', 3600, function () {
            $token = env('GITHUB_TOKEN');
            $owner = env('GITHUB_USERNAME', 'denpiligrim');
            $repoName = env('GITHUB_REPO', '3dp-manager');
            
            $headers = [
                'Authorization' => 'Bearer ' . $token,
                'Accept' => 'application/vnd.github.v3+json',
            ];

            $repoResponse = Http::withHeaders($headers)
                ->get("https://api.github.com/repos/{$owner}/{$repoName}");

            $releaseResponse = Http::withHeaders($headers)
                ->get("https://api.github.com/repos/{$owner}/{$repoName}/releases/latest");

            if ($repoResponse->failed()) {
                return null;
            }

            $repo = $repoResponse->json();
            $release = $releaseResponse->successful() ? $releaseResponse->json() : null;

            return [
                'name' => $repo['name'],
                'full_name' => $repo['full_name'],
                'description' => $repo['description'],
                'stars' => $repo['stargazers_count'],
                'url' => $repo['html_url'],
                'avatar' => $repo['owner']['avatar_url'],
                'latest_release' => $release ? [
                    'tag' => $release['tag_name'],
                    'published_at' => $release['published_at'],
                    'url' => $release['html_url'],
                    'body' => $release['body']
                ] : null,
                'socials' => [
                    ['name' => 'GitHub', 'url' => $repo['html_url']],
                ]
            ];
        });

        if (!$data) {
            return response()->json(['error' => 'Failed to fetch data'], 500);
        }

        return response()->json($data);
    }
}