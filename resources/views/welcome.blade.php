@php
  $isOpenFlux = request()->is('guides/openflux');
  $isCdnSelectel = request()->is('guides/cdn-selectel');
  $isHostFront = request()->is('guides/host-front');
  $isThreeXUiOnePort = request()->is('guides/3x-ui-one-port');
  $threeXUiOnePortSeo = $isThreeXUiOnePort
    ? json_decode(file_get_contents(resource_path('data/3x-ui-one-port-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $isRussianGuide = $isOpenFlux || $isCdnSelectel || $isHostFront || $isThreeXUiOnePort;
  $hostFrontSeo = $isHostFront
    ? json_decode(file_get_contents(resource_path('data/host-front-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $cdnSelectelSeo = $isCdnSelectel
    ? json_decode(file_get_contents(resource_path('data/cdn-selectel-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $openFluxSeo = $isOpenFlux
    ? json_decode(file_get_contents(resource_path('data/openflux-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
@endphp
<!DOCTYPE html>
<html lang="{{ $isRussianGuide ? 'ru' : str_replace('_', '-', app()->getLocale()) }}" @if($isRussianGuide) data-react-helmet="lang" @endif>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <!-- global SEO tags -->
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <meta name="format-detection" content="telephone=no" />
  <link rel="shortcut icon" href="{{ env('APP_URL', '') . '/storage/images/favicon.svg' }}" type="image/x-icon">
  @if($isOpenFlux)
    @include('seo.guide', ['seo' => $openFluxSeo, 'breadcrumbName' => 'OpenFlux'])
  @elseif($isCdnSelectel)
    @include('seo.guide', ['seo' => $cdnSelectelSeo, 'breadcrumbName' => 'CDN Selectel'])
  @elseif($isHostFront)
    @include('seo.guide', ['seo' => $hostFrontSeo, 'breadcrumbName' => 'Host-front'])
  @elseif($isThreeXUiOnePort)
    @include('seo.guide', ['seo' => $threeXUiOnePortSeo, 'breadcrumbName' => '3x-ui: подключения на одном порту'])
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
    @elseif($isCdnSelectel)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / CDN Selectel</nav>
        <h1>{{ $cdnSelectelSeo['heading'] }}</h1>
        <p>{{ $cdnSelectelSeo['intro'] }}</p>
        <h2>Что нужно для настройки CDN Selectel</h2>
        <p>Подготовьте сервер, домен и доступ к панели Selectel. Инструкция показывает настройку VLESS XHTTP на примере панели 3x-ui с Nginx в качестве обратного прокси.</p>
        <h2>Порядок настройки CDN Selectel</h2>
        <ol>
          <li>Создание поддоменов и DNS-записей.</li>
          <li>Выпуск SSL-сертификатов через Certbot.</li>
          <li>Установка сайта-заглушки и настройка прокси Nginx.</li>
          <li>Создание CDN-ресурса Selectel.</li>
          <li>Установка Xray и панели 3x-ui.</li>
          <li>Настройка инбаунда VLESS XHTTP.</li>
          <li>Подключение клиента через CDN.</li>
        </ol>
        <h2>Вопросы о настройке CDN Selectel</h2>
        @foreach($cdnSelectelSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки CDN Selectel.</noscript>
      </main>
    @elseif($isHostFront)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / Host-front</nav>
        <h1>{{ $hostFrontSeo['heading'] }}</h1>
        <p>{{ $hostFrontSeo['intro'] }}</p>
        <h2>Что нужно для настройки HOST-фронта</h2>
        <p>Подготовьте VPS с Ubuntu или Debian, домен и shared-хостинг с HTTPS и поддержкой mod_rewrite/mod_proxy. Проверьте доступность IP хостинга из нужной сети и условия тарифа.</p>
        <h2>Порядок установки и настройки Host-front</h2>
        <ol>
          <li>Подготовка сервера, хостинга и домена.</li>
          <li>Создание DNS-записей для origin, front и панели.</li>
          <li>Настройка сайта, SSL и .htaccess на хостинге.</li>
          <li>Создание VLESS XHTTP-inbound в 3x-ui или Remnawave.</li>
          <li>Настройка TLS и Nginx на VPN-сервере.</li>
          <li>Подключение клиента и проверка цепочки.</li>
        </ol>
        <h2>Вопросы об установке и настройке Host-front</h2>
        @foreach($hostFrontSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки Host-front.</noscript>
      </main>
    @elseif($isThreeXUiOnePort)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / 3x-ui: подключения на одном порту</nav>
        <h1>{{ $threeXUiOnePortSeo['heading'] }}</h1>
        <p>{{ $threeXUiOnePortSeo['intro'] }}</p>
        <h2>Что нужно для установки 3x-ui</h2>
        <p>Подготовьте сервер с Ubuntu или Debian и доступ по SSH. Если используете домен, заранее направьте его на IP сервера. В гайде можно выбрать версию панели и включить настройку промежуточного сервера.</p>
        <h2>Порядок настройки подключений в 3x-ui</h2>
        <ol>
          <li>Установка панели 3x-ui и настройка сертификатов.</li>
          <li>Создание подключений VLESS или Hysteria2.</li>
          <li>Настройка основного VLESS TCP TLS-inbound и fallback.</li>
          <li>Создание подписки и маршрутизации для Happ или Incy.</li>
          <li>Настройка промежуточного сервера при необходимости.</li>
        </ol>
        <h2>Вопросы о настройке 3x-ui на одном порту</h2>
        @foreach($threeXUiOnePortSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки 3x-ui.</noscript>
      </main>
    @endif
  </div>

</body>

</html>
