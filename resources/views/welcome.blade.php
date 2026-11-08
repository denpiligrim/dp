@php
  $isOpenFlux = request()->is('guides/openflux');
  $openFluxSeo = $isOpenFlux
    ? json_decode(file_get_contents(resource_path('data/openflux-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
@endphp
<!DOCTYPE html>
<html lang="{{ $isOpenFlux ? 'ru' : str_replace('_', '-', app()->getLocale()) }}" @if($isOpenFlux) data-react-helmet="lang" @endif>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <!-- global SEO tags -->
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <meta name="format-detection" content="telephone=no" />
  <link rel="shortcut icon" href="{{ env('APP_URL', '') . '/storage/images/favicon.svg' }}" type="image/x-icon">
  @if($isOpenFlux)
    @include('seo.openflux', ['seo' => $openFluxSeo])
  @else
  <meta name="description" content="Web development services and websites from a private developer with over 15 years of experience." data-react-helmet="true" />
  <meta name="keywords" content="site, development, service, programmer, frontend, backend, react" data-react-helmet="true" />
  <meta property="og:type" content="website" data-react-helmet="true" />
  <meta property="og:site_name" content="{{ env('APP_NAME', '') }}" />
  <meta property="og:url" content="{{ env('APP_URL', '') }}" data-react-helmet="true" />
  <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}" data-react-helmet="true" />
  <meta property="og:title" content="DenPiligrim: Private web developer of websites and services" data-react-helmet="true" />
  <meta property="og:description" content="Web development services and websites from a private developer with over 15 years of experience." data-react-helmet="true" />
  <meta property="og:image" content="{{ env('APP_URL', '') . '/storage/images/preview.webp' }}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <link rel="canonical" href="{{ env('APP_URL', '') }}" data-react-helmet="true" />
  <title data-react-helmet="true">DenPiligrim: Private web developer of websites and services</title>

  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mountain View, USA",
        "postalCode": "94043",
        "streetAddress": "1600 Amphitheatre Pkwy, Mountain View, CA 94043"
      },
      "email": "info@denpiligrim.ru",
      "faxNumber": "+79999999999",
      "name": "DenPiligrim",
      "telephone": "+79999999999"
    }
  </script>
  @endif
  <!-- /global SEO tags -->
  {{-- @include('metrics') --}}
  @viteReactRefresh
  @vite('resources/ts/main.tsx')
</head>

<body>
  <div id="root">
    @if($isOpenFlux)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / OpenFlux</nav>
        <h1>{{ $openFluxSeo['heading'] }}</h1>
        <p>{{ $openFluxSeo['intro'] }}</p>
        <h2>Что нужно для установки OpenFlux</h2>
        <p>Руководство рассчитано на сервер и клиент с Ubuntu или Debian. Для сборки потребуются Git и Go версии, указанной в go.mod проекта.</p>
        <h2>Порядок настройки OpenFlux</h2>
        <ol>
          <li>Подготовка сервера и установка зависимостей.</li>
          <li>Сборка и запуск exit-ноды OpenFlux, создание службы systemd.</li>
          <li>Настройка клиента и подключение через локальный SOCKS5-прокси.</li>
          <li>Диагностика CAPTCHA и ошибок подключения.</li>
          <li>Обновление или удаление сервера OpenFlux.</li>
        </ol>
        <h2>Вопросы об установке и настройке OpenFlux</h2>
        @foreach($openFluxSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды установки и интерактивные настройки OpenFlux.</noscript>
      </main>
    @endif
  </div>

</body>

</html>
