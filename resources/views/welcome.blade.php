<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <!-- global SEO tags -->
  <meta name="referrer" content="no-referrer-when-downgrade" />
  <meta name="format-detection" content="telephone=no" />
  <link rel="shortcut icon" href="{{ env('APP_URL', '') . '/storage/images/favicon.svg' }}" type="image/x-icon">
  <meta name="description" content="Web development services and websites from a private developer with over 15 years of experience." data-rh="true" />
  <meta name="keywords" content="site, development, service, programmer, frontend, backend, react" data-rh="true" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="{{ env('APP_NAME', '') }}" />
  <meta property="og:url" content="{{ env('APP_URL', '') }}" />
  <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}" />
  <meta property="og:title" content="DenPiligrim: Private web developer of websites and services" />
  <meta property="og:description" content="Web development services and websites from a private developer with over 15 years of experience." />
  <meta property="og:image" content="{{ env('APP_URL', '') . '/storage/images/preview.webp' }}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <link rel="canonical" href="{{ env('APP_URL', '') }}" data-rh="true" />
  <title>DenPiligrim: Private web developer of websites and services</title>

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
      "faxNumber": "+79030647005",
      "name": "DenPiligrim",
      "telephone": "+79030647005"
    }
  </script>
  <!-- /global SEO tags -->
  @include('metrics')
  @viteReactRefresh
  @vite('resources/ts/main.tsx')
</head>

<body>
  <div id="root"></div>

</body>

</html>