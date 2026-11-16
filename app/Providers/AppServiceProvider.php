<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\DeepL\DeepLClient::class, fn () => new \DeepL\DeepLClient(
            (string) config('services.deepl.key', ''), ['timeout' => 8, 'max_retries' => 0]
        ));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // A leftover public/hot must never make production load a development server.
        if ($this->app->environment('production')) {
            \Illuminate\Support\Facades\Vite::useHotFile('');
        }
    }
}
