import { Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Helmet } from 'react-helmet';
import { GuideBackLink, GuideCatalog, GuideHeader, GuidePage, GuideSupportButton } from '../components/guides';
import guides from '../../data/guides.json';

export default function Guides() {
  return (
    <GuidePage>
      <Helmet defer={false}>
        <html lang="ru" />
        <title>{guides.title}</title>
        <meta name="description" content={guides.description} />
        <link rel="canonical" href={guides.url} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ru_RU" />
        <meta property="og:url" content={guides.url} />
        <meta property="og:title" content={guides.title} />
        <meta property="og:description" content={guides.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={guides.title} />
        <meta name="twitter:description" content={guides.description} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://denpiligrim.ru/' },
            { '@type': 'ListItem', position: 2, name: guides.heading, item: guides.url },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'ItemList', name: guides.heading,
          itemListElement: guides.items.map((guide, index) => ({
            '@type': 'ListItem', position: index + 1, name: guide.title, url: `https://denpiligrim.ru${guide.to}`,
          })),
        })}</script>
      </Helmet>
      <GuideBackLink to="/" label="На главную" />
      <GuideHeader
        title={<>Гайды и <span>инструкции</span></>}
        intro={guides.intro}
        category="БАЗА ЗНАНИЙ"
        eyebrow="ОТ ПЕРВОЙ КОМАНДЫ ДО РЕЗУЛЬТАТА"
        tags={['VPN', 'Прокси', 'CDN', 'Серверы']}
        actions={<><Button component="a" href="#guides-list" variant="contained" endIcon={<ArrowForwardIcon />}>Выбрать гайд</Button><GuideSupportButton /></>}
      />
      <GuideCatalog items={guides.items} />
    </GuidePage>
  );
}
