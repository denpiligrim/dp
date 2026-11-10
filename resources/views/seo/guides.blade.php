<title data-react-helmet="true">{{ $catalog['title'] }}</title>
<meta name="description" content="{{ $catalog['description'] }}" data-react-helmet="true" />
<link rel="canonical" href="{{ $catalog['url'] }}" data-react-helmet="true" />
<meta property="og:type" content="website" data-react-helmet="true" />
<meta property="og:site_name" content="DenPiligrim" />
<meta property="og:locale" content="ru_RU" data-react-helmet="true" />
<meta property="og:url" content="{{ $catalog['url'] }}" data-react-helmet="true" />
<meta property="og:title" content="{{ $catalog['title'] }}" data-react-helmet="true" />
<meta property="og:description" content="{{ $catalog['description'] }}" data-react-helmet="true" />
<meta property="og:image" content="https://denpiligrim.ru/storage/images/preview.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" data-react-helmet="true" />
<meta name="twitter:title" content="{{ $catalog['title'] }}" data-react-helmet="true" />
<meta name="twitter:description" content="{{ $catalog['description'] }}" data-react-helmet="true" />
<script type="application/ld+json" data-react-helmet="true">
{!! json_encode([
  '@context' => 'https://schema.org',
  '@type' => 'BreadcrumbList',
  'itemListElement' => [
    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Главная', 'item' => 'https://denpiligrim.ru/'],
    ['@type' => 'ListItem', 'position' => 2, 'name' => $catalog['heading'], 'item' => $catalog['url']],
  ],
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}
</script>
<script type="application/ld+json" data-react-helmet="true">
{!! json_encode([
  '@context' => 'https://schema.org',
  '@type' => 'ItemList',
  'name' => $catalog['heading'],
  'itemListElement' => array_map(fn ($guide, $index) => [
    '@type' => 'ListItem', 'position' => $index + 1, 'name' => $guide['title'], 'url' => 'https://denpiligrim.ru'.$guide['to'],
  ], $catalog['items'], array_keys($catalog['items'])),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}
</script>
