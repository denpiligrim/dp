<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ env('APP_NAME', '') }}</title>

    @viteReactRefresh
    @vite('resources/ts/main.tsx')
    </head>
    <body>
      <div id="root"></div>

    </body>
</html>