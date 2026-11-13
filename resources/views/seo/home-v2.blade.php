<title data-react-helmet="true">{{ $seo['title'] }}</title>
<meta name="description" content="{{ $seo['description'] }}" data-react-helmet="true" />
<meta name="robots" content="index, follow" data-react-helmet="true" />
<link rel="canonical" href="{{ $seo['url'] }}" data-react-helmet="true" />
<meta property="og:type" content="website" data-react-helmet="true" />
<meta property="og:site_name" content="DenPiligrim" data-react-helmet="true" />
<meta property="og:locale" content="ru_RU" data-react-helmet="true" />
<meta property="og:url" content="{{ $seo['url'] }}" data-react-helmet="true" />
<meta property="og:title" content="{{ $seo['title'] }}" data-react-helmet="true" />
<meta property="og:description" content="{{ $seo['description'] }}" data-react-helmet="true" />
<meta property="og:image" content="{{ $seo['image'] }}" data-react-helmet="true" />
<meta property="og:image:width" content="1200" data-react-helmet="true" />
<meta property="og:image:height" content="630" data-react-helmet="true" />
<meta property="og:image:alt" content="DenPiligrim — технологии понятнее, интернет свободнее" data-react-helmet="true" />
<meta name="twitter:card" content="summary_large_image" data-react-helmet="true" />
<meta name="twitter:title" content="{{ $seo['title'] }}" data-react-helmet="true" />
<meta name="twitter:description" content="{{ $seo['description'] }}" data-react-helmet="true" />
<meta name="twitter:image" content="{{ $seo['image'] }}" data-react-helmet="true" />
<meta name="twitter:image:alt" content="DenPiligrim — технологии понятнее, интернет свободнее" data-react-helmet="true" />
<script type="application/ld+json" data-react-helmet="true">{!! json_encode($seo['schema'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}</script>
