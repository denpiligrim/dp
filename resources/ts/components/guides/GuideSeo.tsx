import { Helmet } from 'react-helmet';
import { GuideSeoData } from './types';

export function GuideSeo({ seo, breadcrumbName = seo.heading }: { seo: GuideSeoData; breadcrumbName?: string; }) {
  return (
    <Helmet defer={false}>
      <html lang="ru" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: seo.heading,
        description: seo.description,
        mainEntityOfPage: seo.url,
        inLanguage: 'ru-RU',
        author: { '@type': 'Person', name: 'DenPiligrim', url: 'https://denpiligrim.ru/' },
      })}</script>
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://denpiligrim.ru/' },
          { '@type': 'ListItem', position: 2, name: 'Гайды и инструкции', item: 'https://denpiligrim.ru/guides' },
          { '@type': 'ListItem', position: 3, name: breadcrumbName, item: seo.url },
        ],
      })}</script>
    </Helmet>
  );
}
