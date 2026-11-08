{{-- React Helmet owns these tags after mounting and removes them on SPA navigation. --}}
<title data-react-helmet="true">{{ $seo['title'] }}</title>
<meta name="description" content="{{ $seo['description'] }}" data-react-helmet="true" />
<link rel="canonical" href="{{ $seo['url'] }}" data-react-helmet="true" />
<meta property="og:type" content="article" data-react-helmet="true" />
<meta property="og:site_name" content="DenPiligrim" />
<meta property="og:locale" content="ru_RU" data-react-helmet="true" />
<meta property="og:url" content="{{ $seo['url'] }}" data-react-helmet="true" />
<meta property="og:title" content="{{ $seo['title'] }}" data-react-helmet="true" />
<meta property="og:description" content="{{ $seo['description'] }}" data-react-helmet="true" />
<meta property="og:image" content="https://denpiligrim.ru/storage/images/preview.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" data-react-helmet="true" />
<meta name="twitter:title" content="{{ $seo['title'] }}" data-react-helmet="true" />
<meta name="twitter:description" content="{{ $seo['description'] }}" data-react-helmet="true" />
<script type="application/ld+json" data-react-helmet="true">
{!! json_encode([
  '@context' => 'https://schema.org',
  '@type' => 'TechArticle',
  'headline' => $seo['heading'],
  'description' => $seo['description'],
  'mainEntityOfPage' => $seo['url'],
  'inLanguage' => 'ru-RU',
  'author' => ['@type' => 'Person', 'name' => 'DenPiligrim', 'url' => 'https://denpiligrim.ru/'],
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}
</script>
<script type="application/ld+json" data-react-helmet="true">
{!! json_encode([
  '@context' => 'https://schema.org',
  '@type' => 'BreadcrumbList',
  'itemListElement' => [
    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Главная', 'item' => 'https://denpiligrim.ru/'],
    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Гайды и инструкции', 'item' => 'https://denpiligrim.ru/guides'],
    ['@type' => 'ListItem', 'position' => 3, 'name' => 'OpenFlux', 'item' => $seo['url']],
  ],
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}
</script>
