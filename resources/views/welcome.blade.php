@php
  $isHomeV2 = request()->is('home-v2');
  $homeV2Seo = $isHomeV2
    ? json_decode(file_get_contents(resource_path('data/home-v2-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $isGuidesIndex = request()->is('guides');
  $guidesIndex = $isGuidesIndex
    ? json_decode(file_get_contents(resource_path('data/guides.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $isOpenFlux = request()->is('guides/openflux');
  $isCdnSelectel = request()->is('guides/cdn-selectel');
  $isHostFront = request()->is('guides/host-front');
  $isThreeXUiOnePort = request()->is('guides/3x-ui-one-port');
  $isCdnSetup = request()->is('guides/cdn-setup');
  $isMieruProxy = request()->is('guides/mieru-proxy');
  $isThreeXUiInstall = request()->is('guides/3x-ui-install');
  $isOlcRtcProxy = request()->is('guides/olcrtc-proxy');
  $isVkTurnProxy = request()->is('guides/vk-turn-proxy');
  $isNaiveProxy = request()->is('guides/naive-proxy');
  $isAmneziaCascade = request()->is('guides/amnezia-cascade');
  $isYandexCloudGuide = request()->is('guides/yandex-cloud-vm');
  $isUltimateVpnGuide = request()->is('guides/ultimate-vpn');
  $ultimateVpnGuideSeo = $isUltimateVpnGuide
    ? json_decode(file_get_contents(resource_path('data/ultimate-vpn-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $yandexCloudGuideSeo = $isYandexCloudGuide
    ? json_decode(file_get_contents(resource_path('data/yandex-cloud-vm-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $amneziaCascadeSeo = $isAmneziaCascade
    ? json_decode(file_get_contents(resource_path('data/amnezia-cascade-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $naiveProxySeo = $isNaiveProxy
    ? json_decode(file_get_contents(resource_path('data/naive-proxy-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $vkTurnProxySeo = $isVkTurnProxy
    ? json_decode(file_get_contents(resource_path('data/vk-turn-proxy-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $olcRtcProxySeo = $isOlcRtcProxy
    ? json_decode(file_get_contents(resource_path('data/olcrtc-proxy-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $threeXUiInstallSeo = $isThreeXUiInstall
    ? json_decode(file_get_contents(resource_path('data/3x-ui-install-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $mieruProxySeo = $isMieruProxy
    ? json_decode(file_get_contents(resource_path('data/mieru-proxy-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $cdnSetupSeo = $isCdnSetup
    ? json_decode(file_get_contents(resource_path('data/cdn-setup-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $threeXUiOnePortSeo = $isThreeXUiOnePort
    ? json_decode(file_get_contents(resource_path('data/3x-ui-one-port-seo.json')), true, 512, JSON_THROW_ON_ERROR)
    : null;
  $isRussianGuide = $isGuidesIndex || $isOpenFlux || $isCdnSelectel || $isHostFront || $isThreeXUiOnePort || $isCdnSetup || $isMieruProxy || $isThreeXUiInstall || $isOlcRtcProxy || $isVkTurnProxy || $isNaiveProxy || $isAmneziaCascade || $isYandexCloudGuide || $isUltimateVpnGuide;
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
<html lang="{{ ($isRussianGuide || $isHomeV2) ? 'ru' : str_replace('_', '-', app()->getLocale()) }}" @if($isRussianGuide || $isHomeV2) data-react-helmet="lang" @endif>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <!-- global SEO tags -->
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <meta name="format-detection" content="telephone=no" />
  <link rel="shortcut icon" href="{{ env('APP_URL', '') . '/storage/images/favicon.svg' }}" type="image/x-icon">
  @if($isHomeV2)
    @include('seo.home-v2', ['seo' => $homeV2Seo])
  @elseif($isGuidesIndex)
    @include('seo.guides', ['catalog' => $guidesIndex])
  @elseif($isOpenFlux)
    @include('seo.guide', ['seo' => $openFluxSeo, 'breadcrumbName' => 'OpenFlux'])
  @elseif($isCdnSelectel)
    @include('seo.guide', ['seo' => $cdnSelectelSeo, 'breadcrumbName' => 'CDN Selectel'])
  @elseif($isHostFront)
    @include('seo.guide', ['seo' => $hostFrontSeo, 'breadcrumbName' => 'Host-front'])
  @elseif($isThreeXUiOnePort)
    @include('seo.guide', ['seo' => $threeXUiOnePortSeo, 'breadcrumbName' => '3x-ui: подключения на одном порту'])
  @elseif($isCdnSetup)
    @include('seo.guide', ['seo' => $cdnSetupSeo, 'breadcrumbName' => 'CDN для VLESS XHTTP'])
  @elseif($isMieruProxy)
    @include('seo.guide', ['seo' => $mieruProxySeo, 'breadcrumbName' => 'MieruProxy'])
  @elseif($isThreeXUiInstall)
    @include('seo.guide', ['seo' => $threeXUiInstallSeo, 'breadcrumbName' => 'Установка 3x-ui'])
  @elseif($isOlcRtcProxy)
    @include('seo.guide', ['seo' => $olcRtcProxySeo, 'breadcrumbName' => 'OlcRTC Proxy'])
  @elseif($isVkTurnProxy)
    @include('seo.guide', ['seo' => $vkTurnProxySeo, 'breadcrumbName' => 'VK TURN Proxy'])
  @elseif($isNaiveProxy)
    @include('seo.guide', ['seo' => $naiveProxySeo, 'breadcrumbName' => 'NaiveProxy'])
  @elseif($isAmneziaCascade)
    @include('seo.guide', ['seo' => $amneziaCascadeSeo, 'breadcrumbName' => 'Каскадный Amnezia VPN'])
  @elseif($isYandexCloudGuide)
    @include('seo.guide', ['seo' => $yandexCloudGuideSeo, 'breadcrumbName' => 'Виртуальная машина в Yandex Cloud'])
  @elseif($isUltimateVpnGuide)
    @include('seo.guide', ['seo' => $ultimateVpnGuideSeo, 'breadcrumbName' => 'Свой VPN-сервер'])
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
    @if($isHomeV2)
      <main>
        <h1>{{ $homeV2Seo['heading'] }}</h1>
        <p>{{ $homeV2Seo['intro'] }}</p>
        <h2>Что можно найти на сайте</h2>
        @foreach($homeV2Seo['topics'] as $topic)
          <section>
            <h3><a href="{{ $topic['to'] }}">{{ $topic['title'] }}</a></h3>
            <p>{{ $topic['description'] }}</p>
          </section>
        @endforeach
        <h2>Полезные гайды по VPN и обходу блокировок</h2>
        @foreach($homeV2Seo['guides'] as $guide)
          <article>
            <h3><a href="{{ $guide['to'] }}">{{ $guide['title'] }}</a></h3>
            <p>{{ $guide['description'] }}</p>
          </article>
        @endforeach
        <h2>Смотреть и читать DenPiligrim</h2>
        <p>Видео с объяснениями и настройками — на <a href="{{ $homeV2Seo['socials']['youtube'] }}" rel="me">YouTube</a>. Находки, заметки и обсуждения — в <a href="{{ $homeV2Seo['socials']['telegram'] }}" rel="me">Telegram</a>.</p>
      </main>
    @elseif($isGuidesIndex)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / Гайды и инструкции</nav>
        <h1>{{ $guidesIndex['heading'] }}</h1>
        <p>{{ $guidesIndex['intro'] }}</p>
        @foreach($guidesIndex['items'] as $guide)
          <article>
            <h2><a href="{{ $guide['to'] }}">{{ $guide['title'] }}</a></h2>
            <p>{{ $guide['description'] }}</p>
          </article>
        @endforeach
        <noscript>Включите JavaScript для поиска и фильтрации гайдов.</noscript>
      </main>
    @elseif($isOpenFlux)
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
    @elseif($isCdnSetup)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / CDN для VLESS XHTTP</nav>
        <h1>{{ $cdnSetupSeo['heading'] }}</h1>
        <p>{{ $cdnSetupSeo['intro'] }}</p>
        <h2>Что нужно для настройки CDN и VLESS XHTTP</h2>
        <p>Подготовьте сервер, домен источника и доступ к панели CDN-провайдера. В гайде используются SSL-сертификат, Nginx и панель 3x-ui, а создание CDN-ресурса показано на примере Beget.</p>
        <h2>Порядок настройки CDN для VLESS XHTTP</h2>
        <ol>
          <li>Выпуск SSL-сертификата через Certbot.</li>
          <li>Установка сайта-заглушки и настройка прокси Nginx.</li>
          <li>Установка Xray и панели 3x-ui.</li>
          <li>Создание CDN-ресурса и получение CDN-домена.</li>
          <li>Настройка VLESS XHTTP-инбаунда и добавление клиента.</li>
        </ol>
        <h2>Вопросы о настройке CDN для VLESS XHTTP</h2>
        @foreach($cdnSetupSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки CDN для VLESS XHTTP.</noscript>
      </main>
    @elseif($isMieruProxy)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / MieruProxy</nav>
        <h1>{{ $mieruProxySeo['heading'] }}</h1>
        <p>{{ $mieruProxySeo['intro'] }}</p>
        <h2>Порядок установки и настройки MieruProxy</h2>
        <ol>
          <li>Установка сервера mita.</li>
          <li>Создание пользователей и настройка квот трафика.</li>
          <li>Применение списка пользователей на сервере.</li>
          <li>Подключение клиента через ссылку, QR-код или конфигурацию Clash.</li>
          <li>Настройка перенаправления на промежуточном сервере при необходимости.</li>
        </ol>
        <h2>Вопросы об установке и настройке MieruProxy</h2>
        @foreach($mieruProxySeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки MieruProxy.</noscript>
      </main>
    @elseif($isThreeXUiInstall)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / Установка 3x-ui</nav>
        <h1>{{ $threeXUiInstallSeo['heading'] }}</h1>
        <p>{{ $threeXUiInstallSeo['intro'] }}</p>
        <h2>Что нужно для установки панели 3x-ui</h2>
        <p>Подготовьте сервер с Ubuntu или Debian и доступ по SSH. Если используете домен, заранее направьте его на IP сервера. В форме гайда можно выбрать версию панели и указать адрес сервера.</p>
        <h2>Порядок установки и настройки 3x-ui</h2>
        <ol>
          <li>Установка панели 3x-ui и настройка сертификатов.</li>
          <li>Создание подключения VLESS или Hysteria2.</li>
          <li>Настройка менеджера подписок 3DP-MANAGER.</li>
          <li>Добавление нод и, при необходимости, relay-серверов.</li>
          <li>Создание подписки и подключение клиента.</li>
        </ol>
        <h2>Вопросы об установке и настройке 3x-ui</h2>
        @foreach($threeXUiInstallSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки установки 3x-ui.</noscript>
      </main>
    @elseif($isOlcRtcProxy)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / OlcRTC Proxy</nav>
        <h1>{{ $olcRtcProxySeo['heading'] }}</h1>
        <p>{{ $olcRtcProxySeo['intro'] }}</p>
        <h2>Порядок установки и настройки OlcRTC Proxy</h2>
        <ol>
          <li>Подготовка сервера и установка зависимостей.</li>
          <li>Сборка и запуск сервера OlcRTC.</li>
          <li>Выбор сервиса звонков и транспорта WebRTC.</li>
          <li>Настройка клиента и подключение.</li>
          <li>Обновление или удаление сервера.</li>
        </ol>
        <h2>Вопросы об установке и настройке OlcRTC Proxy</h2>
        @foreach($olcRtcProxySeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки OlcRTC Proxy.</noscript>
      </main>
    @elseif($isVkTurnProxy)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / VK TURN Proxy</nav>
        <h1>{{ $vkTurnProxySeo['heading'] }}</h1>
        <p>{{ $vkTurnProxySeo['intro'] }}</p>
        <h2>Что нужно для настройки VK TURN Proxy</h2>
        <p>Подготовьте сервер с установленной панелью 3x-ui, создайте подключение WireGuard и сохраните ссылку для клиента. В форме гайда укажите адрес сервера, порт WireGuard и порт прокси.</p>
        <h2>Порядок установки и настройки VK TURN Proxy</h2>
        <ol>
          <li>Создание подключения WireGuard в 3x-ui.</li>
          <li>Установка и настройка прокси на сервере.</li>
          <li>Подготовка ссылки на VK-звонок.</li>
          <li>Настройка и запуск локального клиента TURN Proxy.</li>
          <li>Импорт конфигурации WireGuard в Happ и изменение Endpoint.</li>
        </ol>
        <h2>Вопросы об установке и настройке VK TURN Proxy</h2>
        @foreach($vkTurnProxySeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки VK TURN Proxy.</noscript>
      </main>
    @elseif($isNaiveProxy)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / NaiveProxy</nav>
        <h1>{{ $naiveProxySeo['heading'] }}</h1>
        <p>{{ $naiveProxySeo['intro'] }}</p>
        <h2>Что нужно для установки NaiveProxy</h2>
        <p>Подготовьте сервер, домен и доступ по SSH. В форме гайда укажите адрес сервера, домен, порт, логин и пароль. Для дополнительного промежуточного сервера предусмотрен отдельный раздел.</p>
        <h2>Порядок установки и настройки NaiveProxy</h2>
        <ol>
          <li>Подготовка сервера и установка Caddy.</li>
          <li>Настройка конфигурации и запуск службы.</li>
          <li>Настройка промежуточного relay-сервера при необходимости.</li>
          <li>Подключение клиента по HTTPS или QUIC.</li>
        </ol>
        <h2>Вопросы об установке и настройке NaiveProxy</h2>
        @foreach($naiveProxySeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки NaiveProxy.</noscript>
      </main>
    @elseif($isAmneziaCascade)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / Каскадный Amnezia VPN</nav>
        <h1>{{ $amneziaCascadeSeo['heading'] }}</h1>
        <p>{{ $amneziaCascadeSeo['intro'] }}</p>
        <h2>Что нужно для каскадного подключения Amnezia VPN</h2>
        <p>Подготовьте основной VPN-сервер, промежуточный сервер и приложение Amnezia VPN. В форме гайда выберите ОС и укажите адреса серверов. Прямое подключение можно настроить, отключив промежуточный сервер.</p>
        <h2>Порядок установки и настройки каскадного Amnezia VPN</h2>
        <ol>
          <li>Установка приложения и настройка собственного VPN-сервера.</li>
          <li>Настройка маршрутизации и раздельного туннелирования.</li>
          <li>Установка перенаправления на промежуточном сервере.</li>
          <li>Экспорт и изменение конфигураций AmneziaWG или Xray.</li>
          <li>Подключение через промежуточный сервер.</li>
        </ol>
        <h2>Вопросы о настройке каскадного Amnezia VPN</h2>
        @foreach($amneziaCascadeSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть интерактивные настройки каскадного Amnezia VPN.</noscript>
      </main>
    @elseif($isYandexCloudGuide)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / Виртуальная машина в Yandex Cloud</nav>
        <h1>{{ $yandexCloudGuideSeo['heading'] }}</h1>
        <p>{{ $yandexCloudGuideSeo['intro'] }}</p>
        <h2>Порядок создания и настройки ВМ в Яндекс Облаке</h2>
        <ol>
          <li>Регистрация в Yandex Cloud и подготовка аккаунта.</li>
          <li>Создание виртуальной машины.</li>
          <li>Подключение к серверу по SSH.</li>
          <li>Закрепление статического IP-адреса.</li>
          <li>Настройка автоматического запуска после остановки.</li>
          <li>Решение проблем с доступностью IP-адреса.</li>
        </ol>
        <h2>Вопросы о виртуальных машинах в Yandex Cloud</h2>
        @foreach($yandexCloudGuideSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки виртуальной машины в Yandex Cloud.</noscript>
      </main>
    @elseif($isUltimateVpnGuide)
      <main>
        <nav aria-label="Хлебные крошки"><a href="/">Главная</a> / <a href="/guides">Гайды и инструкции</a> / Свой VPN-сервер</nav>
        <h1>{{ $ultimateVpnGuideSeo['heading'] }}</h1>
        <p>{{ $ultimateVpnGuideSeo['intro'] }}</p>
        <h2>Порядок установки и настройки собственного VPN-сервера</h2>
        <ol>
          <li>Настройка SSH-ключа и файрвола UFW.</li>
          <li>Выпуск SSL-сертификатов и установка сайта с Nginx.</li>
          <li>Установка панели 3x-ui.</li>
          <li>Настройка Hysteria2, MTProto или Amnezia VPN по соответствующим разделам.</li>
          <li>Установка 3DP-MANAGER и настройка подписок.</li>
          <li>Подключение через промежуточный relay-сервер при необходимости.</li>
        </ol>
        <h2>Вопросы о создании своего VPN-сервера</h2>
        @foreach($ultimateVpnGuideSeo['faq'] as $item)
          <h3>{{ $item['question'] }}</h3>
          <p>{{ $item['answer'] }}</p>
        @endforeach
        <noscript>Включите JavaScript, чтобы увидеть команды и интерактивные настройки VPN-сервера.</noscript>
      </main>
    @endif
  </div>

</body>

</html>
