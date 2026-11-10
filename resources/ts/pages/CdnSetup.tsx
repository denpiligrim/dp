import { ComponentProps, useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Button, Chip, FormControlLabel, Link, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { Helmet } from 'react-helmet';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import BaseCodeBlock from '../components/CodeBlock';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import GikIcon from '../svgIcons/GikIcon';
import seo from '../../data/cdn-setup-seo.json';
import '../../sass/cdn-setup.scss';

const guideSteps = [
  { id: 'ssl-cert', title: 'SSL-сертификат', detail: 'Certbot и HTTPS' },
  { id: 'website', title: 'Сайт и Nginx', detail: 'Страница и проксирование' },
  { id: '3x-ui', title: 'Панель 3x-ui', detail: 'Установка и доступ' },
  { id: 'cdn-resource', title: 'Подключение CDN', detail: 'Источник и домен' },
  { id: 'xhttp-inbound', title: 'VLESS XHTTP', detail: 'Инбаунд и клиент' },
];

const CodeBlock = (props: ComponentProps<typeof BaseCodeBlock>) => (
  <Box className="cdn-code">
    <Box className="cdn-code-header">
      <span>{props.language === 'json' ? 'Конфигурация инбаунда' : props.language === 'nginx' ? 'Конфигурация Nginx' : props.language === 'html' ? 'Страница-заглушка' : 'Терминал · VPN-сервер'}</span>
      <span>{props.language || 'bash'}</span>
    </Box>
    <BaseCodeBlock {...props} mb={0} />
  </Box>
);

const PreviewPanel = ({ title, rows }: { title: string; rows: string[][] }) => (
  <Paper elevation={0} className="cdn-preview">
    <Typography component="h3" className="cdn-preview-title"><TuneIcon fontSize="small" />{title}</Typography>
    <Box component="dl" className="cdn-values">
      {rows.map(([label, value]) => <Box key={label} className="cdn-value"><Typography component="dt">{label}</Typography><Typography component="dd">{value}</Typography></Box>)}
    </Box>
  </Paper>
);

const generateRandomString = (length = 8) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

  const getRandomString = () => {
    const stringsArray = [
      'Здесь скоро появится что-то новое.\nСайт находится в разработке.', 
      'Что-то будет...\nСкоро.', 
      'В данный момент сайт находится на стадии разработки.\nПожалуйста, зайдите позже.', 
      'Сайт в разработке.\nПриносим извинения за временные неудобства.',
    ];
    const randomIndex = Math.floor(Math.random() * stringsArray.length);
    return stringsArray[randomIndex];
  };

export default function CdnSetup() {
  const [searchParams] = useSearchParams();
  const [originHost, setOriginHost] = useState(
    () => searchParams.get('originHost')?.trim().toLowerCase() || 'example.com'
  );
  const [cdnDomain, setCdnDomain] = useState(
    () => searchParams.get('cdnDomain')?.trim().toLowerCase() || 'example.begetcdn.cloud'
  );
  const [inboundPort, setInboundPort] = useState('2053');
  const [xhttpPath, setXhttpPath] = useState('/static/media/live/');
  const [xuiPort, setXuiPort] = useState('2222');
  const [useSudo, setUseSudo] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [randomPhrase] = useState(() => getRandomString());
  const [randomString] = useState(() => generateRandomString(8));
  const [digit] = useState(() => Math.floor(Math.random() * 10));

  const normalizedPath = xhttpPath.startsWith('/') ? xhttpPath : `/${xhttpPath}`;


  const [activeStep, setActiveStep] = useState('ssl-cert');

  useEffect(() => {
    const updateActiveStep = () => {
      let current = guideSteps[0].id;
      for (const step of guideSteps) {
        const section = document.getElementById(step.id);
        if (section && section.getBoundingClientRect().top <= 180) current = step.id;
      }
      setActiveStep(current);
    };
    updateActiveStep();
    window.addEventListener('scroll', updateActiveStep, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveStep);
  }, []);

  return (
    <Box className="cdn-guide">
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
            { '@type': 'ListItem', position: 3, name: 'CDN для VLESS XHTTP', item: seo.url },
          ],
        })}</script>
      </Helmet>
      <Box className="cdn-page">
        <Box className="cdn-breadcrumbs">
          <Link component={RouterLink} to="/guides" color="text.secondary" underline="hover"><ArrowBackIcon fontSize="small" />Все гайды</Link>
        </Box>

        <Box component="header" className="cdn-hero">
          <Box className="cdn-hero-topline">
            <Stack direction="row" spacing={1} className="cdn-eyebrow"><span>СЕТИ И VPN</span><span className="cdn-dot" /><span>ПОШАГОВЫЙ ГАЙД</span></Stack>
            <Chip component="a" href="https://t.me/denpiligrim_web" target="_blank" rel="noopener noreferrer" clickable icon={<TelegramIcon />} label="Telegram-канал" size="small" variant="outlined" className="cdn-telegram" />
          </Box>
          <Typography component="h1">CDN для <span>VLESS XHTTP</span></Typography>
          <Typography component="p" className="cdn-lead">От чистого сервера до подключения через CDN. Настроим HTTPS, Nginx и 3x-ui — с командами, в которые уже подставлены ваши параметры.</Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1} className="cdn-tags"><Chip label="3x-ui" size="small" variant="outlined" /><Chip label="Xray 26.3.27+" size="small" variant="outlined" /><Chip label="5 шагов" size="small" variant="outlined" /><span className="cdn-updated">Обновлено 26 октября 2026</span></Stack>
          <Box className="cdn-hero-actions">
            <Button component="a" href="#guide-settings" variant="contained" endIcon={<ArrowForwardIcon />}>Настроить параметры</Button>
            <Button variant="outlined" startIcon={<FavoriteBorderIcon />} onClick={() => setSupportModalOpen(true)}>Поддержать автора</Button>
            <Button component="a" href="https://youtu.be/-9UJ_Bz03_s" target="_blank" rel="noopener noreferrer" startIcon={<YouTubeIcon sx={{ color: '#ff0000' }} />} variant="text">Смотреть видео</Button>
          </Box>
          <Box className="cdn-flow" aria-label="Схема подключения: клиент, CDN, VPN-сервер">
            <Box><span className="cdn-flow-label">01 / ПОДКЛЮЧЕНИЕ</span><Typography>Ваш клиент</Typography><span>VLESS · XHTTP</span></Box>
            <ArrowForwardIcon className="cdn-flow-arrow" />
            <Box><span className="cdn-flow-label">02 / ДОСТАВКА</span><Typography><CloudQueueIcon fontSize="small" />CDN</Typography><span>{cdnDomain}</span></Box>
            <ArrowForwardIcon className="cdn-flow-arrow" />
            <Box><span className="cdn-flow-label">03 / ИСТОЧНИК</span><Typography><DnsOutlinedIcon fontSize="small" />VPN-сервер</Typography><span>{originHost}</span></Box>
          </Box>
          <Box component="nav" aria-label="Партнёрские сервисы" className="cdn-partners">
            <Link href="https://ishosting.io/affiliate/MjIwOSM4" target="_blank" rel="sponsored noopener noreferrer" underline="none" className="cdn-partner">
              <span className="cdn-partner-icon"><IshostingIcon /></span>
              <Box><strong>Аренда зарубежного сервера</strong><small>is*hosting</small></Box><ArrowForwardIcon className="cdn-partner-arrow" />
            </Link>
            <Link href="https://beget.com/p1519472" target="_blank" rel="sponsored noopener noreferrer" underline="none" className="cdn-partner">
              <span className="cdn-partner-icon"><BegetIcon /></span>
              <Box><strong>CDN и виртуальные серверы</strong><small>Бегет</small></Box><ArrowForwardIcon className="cdn-partner-arrow" />
            </Link>
            <Link href="https://t.me/Gik_VPN_Bot?start=ref9I0EryhK" target="_blank" rel="sponsored noopener noreferrer" underline="none" className="cdn-partner">
              <span className="cdn-partner-icon"><GikIcon /></span>
              <Box><strong>VPN для Wi-Fi и мобильного интернета</strong><small>Gik VPN</small></Box><ArrowForwardIcon className="cdn-partner-arrow" />
            </Link>
          </Box>
        </Box>

        <Box className="cdn-layout">
          <Box component="aside" className="cdn-sidebar">
            <Box component="nav" aria-label="Содержание гайда" className="cdn-toc">
              <Typography component="p" className="cdn-small-label">В ЭТОМ ГАЙДЕ</Typography>
              {guideSteps.map((step, index) => <Link key={step.id} href={`#${step.id}`} aria-current={activeStep === step.id ? 'step' : undefined} className={`cdn-toc-link ${activeStep === step.id ? 'is-active' : ''}`} underline="none" onClick={() => setActiveStep(step.id)}><span className="cdn-toc-number">{String(index + 1).padStart(2, '0')}</span><Box><strong>{step.title}</strong><small>{step.detail}</small></Box></Link>)}
              <Link href="#faq" className="cdn-toc-extra" underline="hover">Частые вопросы ↗</Link>
              <Link href="#guide-settings" className="cdn-toc-extra" underline="hover"><TuneIcon fontSize="small" /> Параметры гайда</Link>
            </Box>
          </Box>

          <Box component="main" className="cdn-main">
            <Paper elevation={0} id="guide-settings" className="cdn-settings">
              <Box className="cdn-settings-heading"><span className="cdn-icon-tile"><TuneIcon /></span><Box><Typography component="h2" variant="h5">Сначала — ваши параметры</Typography><Typography component="p">Заполните один раз. Команды и примеры ниже обновятся автоматически.</Typography></Box></Box>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="IP или домен VPN-сервера" value={originHost} onChange={e => setOriginHost(e.target.value.trim().toLowerCase())} placeholder="vpn.example.com" helperText="Адрес источника для CDN" slotProps={{ inputLabel: { shrink: true }, htmlInput: { spellCheck: false, autoCapitalize: 'none' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Домен CDN" value={cdnDomain} onChange={e => setCdnDomain(e.target.value.trim().toLowerCase())} placeholder="example.begetcdn.cloud" helperText="Выдаётся при создании CDN-ресурса" slotProps={{ inputLabel: { shrink: true }, htmlInput: { spellCheck: false, autoCapitalize: 'none' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Порт XHTTP" value={inboundPort} onChange={e => setInboundPort(e.target.value.trim())} helperText="Одинаковый в Nginx и инбаунде" slotProps={{ htmlInput: { inputMode: 'numeric' } }} /></Grid>
                <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Путь XHTTP" value={xhttpPath} onChange={e => setXhttpPath(e.target.value.trim())} helperText="Путь для передачи запросов" slotProps={{ htmlInput: { spellCheck: false, autoCapitalize: 'none' } }} /></Grid>
              </Grid>
              <Box className="cdn-settings-footer"><FormControlLabel control={<Switch checked={useSudo} onChange={e => setUseSudo(e.target.checked)} size="small" />} label="Добавлять sudo в команды" /><Typography variant="caption">Включите, если работаете не от root</Typography></Box>
            </Paper>

            <Box className="cdn-before"><Typography component="h2">Перед началом</Typography><Box className="cdn-requirements"><span><CheckCircleOutlineIcon />Доступ к серверу по SSH</span><span><CheckCircleOutlineIcon />Домен для HTTPS</span><span><CheckCircleOutlineIcon />CDN с поддержкой GET</span></Box><Typography component="p">Пример показан на панели 3x-ui. Параметры CDN подойдут для провайдеров, которые поддерживают HTTP-метод GET.</Typography></Box>

            <Box component="article" className="cdn-article">
          <Box component="section" id="ssl-cert" className="cdn-step"><Box className="cdn-step-heading"><span className="cdn-step-number">01</span><Box><Typography component="h2" variant="h5">SSL-сертификат</Typography><Typography component="p" className="cdn-step-description">Подготовим сервер и выпустим сертификат для HTTPS.</Typography></Box></Box>
          <Typography component="p" gutterBottom>
            Подключитесь к серверу по SSH и обновите пакеты:
          </Typography>
          <CodeBlock code='<sudo>apt update && apt upgrade -y' sudo={useSudo} />
          <Alert severity="info" icon={<InfoOutlinedIcon />} className="cdn-note"><AlertTitle>Проверьте DNS перед выпуском</AlertTitle>
            Убедитесь, что ваш домен <InlineCode>{originHost}</InlineCode> уже направлен на IP-адрес вашего сервера. Для этого в панели управления доменом должна быть настроена A-запись в DNS.
          </Alert>

          <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка Certbot
          </Typography>
          <Typography component="p" gutterBottom>
            Установите Certbot. Для выпуска сертификата порт 80 должен быть открыт и свободен.
          </Typography>
          <CodeBlock code={`<sudo>apt install snapd\n<sudo>snap install --classic certbot\n<sudo>ln -s /snap/bin/certbot /usr/local/bin/certbot`} sudo={useSudo} />

          <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Выпуск сертификата
          </Typography>
          <Typography component="p" gutterBottom>
            Запустите команду выпуска сертификата:
          </Typography>
          <CodeBlock code={`<sudo>certbot certonly --standalone -d ${originHost}`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Во время установки утилита попросит вас ввести некоторые данные:
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">Введите свой <InlineCode>email</InlineCode> для получения важных уведомлений.</Typography>
            </li>
            <li>
              <Typography component="span">Согласитесь с правилами сервиса: введите <InlineCode>Y</InlineCode> и нажмите Enter.</Typography>
            </li>
            <li>
              <Typography component="span">Откажитесь от рекламной email-рассылки: введите <InlineCode>N</InlineCode>.</Typography>
            </li>
          </Box>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            После успешного выпуска в консоли отобразятся пути к вашему сертификату и закрытому ключу. По умолчанию сертификат будет продлеваться автоматически каждые 90 дней.
          </Typography>
</Box><Box component="section" id="website" className="cdn-step"><Box className="cdn-step-heading"><span className="cdn-step-number">02</span><Box><Typography component="h2" variant="h5">Сайт и прокси Nginx</Typography><Typography component="p" className="cdn-step-description">Создадим страницу-заглушку и настроим передачу запросов в Xray.</Typography></Box></Box>

          <Typography component="p" gutterBottom>
            Установите Nginx: он будет показывать обычную веб-страницу и передавать XHTTP-запросы в Xray.
          </Typography>
          <CodeBlock code='<sudo>apt install nginx -y' sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Создайте директорию для сайта и выдайте нужные права:
          </Typography>
          <CodeBlock
            code={`<sudo>mkdir -p /var/www/${originHost}/html\n<sudo>chown -R $USER:$USER /var/www/${originHost}/html`}
            sudo={useSudo}
          />

          <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Создание страницы
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте файл <InlineCode>index.html</InlineCode>:
          </Typography>
          <CodeBlock code={`nano /var/www/${originHost}/html/index.html`} sudo={useSudo} />
          <Typography component="p" gutterBottom>
            Вставьте базовый HTML-код:
          </Typography>
          <CodeBlock
            customStyle={{ maxHeight: '500px', overflowY: 'auto' }}
            code={`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Hello World!</title>
  <meta
    name="description"
    content="Сайт ${originHost} скоро будет доступен."
  />

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --text: rgba(255, 255, 255, 0.95);
      --text-secondary: rgba(255, 255, 255, 0.62);
      --glass: rgba(255, 255, 255, 0.10);
      --glass-border: rgba(255, 255, 255, 0.22);
      --glass-highlight: rgba(255, 255, 255, 0.28);
    }

    body {
      min-height: 100vh;
      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: var(--text);
      overflow: hidden;

      background:
        radial-gradient(
          circle at 15% 20%,
          rgba(0, 202, 255, 0.36),
          transparent 34%
        ),
        radial-gradient(
          circle at 82% 18%,
          rgba(67, 97, 238, 0.38),
          transparent 35%
        ),
        radial-gradient(
          circle at 70% 85%,
          rgba(0, 255, 200, 0.25),
          transparent 38%
        ),
        linear-gradient(
          135deg,
          #07131d 0%,
          #0b2940 45%,
          #061c2b 100%
        );
    }

    body::before,
    body::after {
      content: "";
      position: fixed;
      border-radius: 50%;
      filter: blur(15px);
      pointer-events: none;
    }

    body::before {
      width: 420px;
      height: 420px;
      top: -160px;
      right: -100px;

      background: linear-gradient(
        135deg,
        rgba(74, 222, 255, 0.25),
        rgba(74, 125, 255, 0.08)
      );

      animation: floatOne 12s ease-in-out infinite alternate;
    }

    body::after {
      width: 360px;
      height: 360px;
      left: -140px;
      bottom: -100px;

      background: linear-gradient(
        135deg,
        rgba(42, 255, 205, 0.18),
        rgba(0, 132, 255, 0.06)
      );

      animation: floatTwo 14s ease-in-out infinite alternate;
    }

    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      isolation: isolate;
    }

    .glass {
      position: relative;

      width: min(600px, 100%);
      padding: 64px 48px;

      text-align: center;

      border: 1px solid var(--glass-border);
      border-radius: 36px;

      background:
        linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.16),
          rgba(255, 255, 255, 0.055)
        );

      backdrop-filter: blur(32px) saturate(150%);
      -webkit-backdrop-filter: blur(32px) saturate(150%);

      box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.28),
        inset 0 1px 0 var(--glass-highlight),
        inset 0 -1px 0 rgba(255, 255, 255, 0.04);

      overflow: hidden;
    }

    .glass::before {
      content: "";
      position: absolute;
      width: 300px;
      height: 120px;

      top: -80px;
      left: 50%;

      transform: translateX(-50%) rotate(-8deg);

      border-radius: 50%;
      background: rgba(255, 255, 255, 0.17);
      filter: blur(22px);

      pointer-events: none;
    }

    .logo {
      width: 72px;
      height: 72px;

      margin: 0 auto 30px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 24px;

      background:
        linear-gradient(
          145deg,
          rgba(255, 255, 255, 0.24),
          rgba(255, 255, 255, 0.08)
        );

      border: 1px solid rgba(255, 255, 255, 0.24);

      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.35),
        0 15px 35px rgba(0, 0, 0, 0.15);

      font-size: 32px;
    }

    h1 {
      font-size: clamp(36px, 7vw, 64px);
      font-weight: 650;
      letter-spacing: -0.045em;
      line-height: 1;
      margin-bottom: 20px;
    }

    h1 span {
      display: block;

      margin-top: 10px;

      font-size: 0.42em;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;

      color: rgba(255, 255, 255, 0.55);
    }

    .description {
      max-width: 420px;
      margin: 0 auto;

      font-size: 16px;
      line-height: 1.7;

      color: var(--text-secondary);
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 9px;

      margin-top: 34px;
      padding: 10px 16px;

      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.14);

      background: rgba(255, 255, 255, 0.07);

      font-size: 13px;
      color: rgba(255, 255, 255, 0.72);
    }

    .status-dot {
      width: 7px;
      height: 7px;

      border-radius: 50%;

      background: #72f2cd;
      box-shadow: 0 0 15px rgba(114, 242, 205, 0.8);

      animation: pulse 2s ease-in-out infinite;
    }

    .domain {
      position: fixed;
      bottom: 24px;
      left: 50%;

      transform: translateX(-50%);

      font-size: 12px;
      letter-spacing: 0.14em;

      color: rgba(255, 255, 255, 0.32);
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }

      50% {
        opacity: 0.45;
        transform: scale(0.8);
      }
    }

    @keyframes floatOne {
      from {
        transform: translate3d(0, 0, 0);
      }

      to {
        transform: translate3d(-50px, 45px, 0);
      }
    }

    @keyframes floatTwo {
      from {
        transform: translate3d(0, 0, 0);
      }

      to {
        transform: translate3d(60px, -35px, 0);
      }
    }

    @media (max-width: 600px) {
      .glass {
        padding: 48px 24px;
        border-radius: 28px;
      }

      .logo {
        width: 64px;
        height: 64px;
        border-radius: 20px;
        font-size: 28px;
      }

      .description {
        font-size: 15px;
      }
    }
  </style>
</head>

<body>
  <main class="page">
    <section class="glass">
      <div class="logo">≈</div>

      <h1>
        Hello World!
        <span>${originHost}</span>
      </h1>

      <p class="description">${randomPhrase}</p>

      <div class="status">
        <span class="status-dot"></span>
        Скоро открытие
      </div>
    </section>

    <div class="domain">${originHost}</div>
  </main>
</body>
</html>`}
            language="html"
          />
          <Typography component="p" gutterBottom>
            Сохраните и выйдите (<InlineCode>Ctrl + O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl + X</InlineCode>).
          </Typography>

          <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Настройка конфигурации Nginx
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте конфигурационный файл для вашего домена:
          </Typography>
          <CodeBlock code={`<sudo>nano /etc/nginx/sites-available/${originHost}`} sudo={useSudo} />
          <Typography component="p" gutterBottom>
            Вставьте следующую конфигурацию, в котором будет указано проксирование к порту <InlineCode>{inboundPort}</InlineCode> инбаунда, который мы создадим на следующем шаге:
          </Typography>
          <CodeBlock
            code={`upstream xray_xhttp {
    server 127.0.0.1:${inboundPort};
    keepalive 128;
}

server {
    listen 80 default_server;
    listen 443 ssl http2 default_server;
    server_name _;

    ssl_certificate /etc/letsencrypt/live/${originHost}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${originHost}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location = /health {
        default_type application/json;
        return 200 '{"status":"ok","service":"media-gateway","version":"4.2.1"}';
    }

    location = ${xhttpPath.replace(/\/$/, '')} { return 404; }

    location ${xhttpPath}segment${digit}.ts/ {
        proxy_pass http://xray_xhttp;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

        proxy_pass_request_headers on;
        proxy_buffering off;
        proxy_request_buffering off;
        proxy_cache off;
        proxy_max_temp_file_size 0;
        gzip off;

        proxy_connect_timeout 10s;
        proxy_read_timeout 1h;
        proxy_send_timeout 1h;
        send_timeout 1h;

        client_max_body_size 0;
        proxy_socket_keepalive on;

        add_header X-Accel-Buffering no always;
        add_header Cache-Control "no-store, no-cache" always;
        add_header CDN-Cache-Control "no-store" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
        add_header Accept-Ranges none always;
    }

    location / { 
        root /var/www/${originHost}/html; 
        index index.html; 
        try_files $uri $uri/ =404; 
    }
}`}
            language="nginx"
          />
          <Typography component="p" gutterBottom>
            Сохраните и выйдите (<InlineCode>Ctrl + O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl + X</InlineCode>).
          </Typography>

          <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Активация сайта
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте символическую ссылку, удалите дефолтный конфиг Nginx и перезапустите службу:
          </Typography>
          <CodeBlock
            code={`<sudo>ln -s /etc/nginx/sites-available/${originHost} /etc/nginx/sites-enabled/\n<sudo>rm /etc/nginx/sites-enabled/default\n<sudo>nginx -t\n<sudo>systemctl restart nginx`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Теперь, если перейти по адресу <Link href={`https://${originHost}`} target='_blank' rel="noopener noreferrer">https://{originHost}</Link>, вы увидите созданную страницу-заглушку.
          </Typography>

          <Typography component="p" gutterBottom>
            Переключите Certbot на проверку через webroot, чтобы продление сертификата не конфликтовало с Nginx:
          </Typography>
          <CodeBlock
            code={`<sudo>certbot reconfigure --cert-name ${originHost} --authenticator webroot --webroot-path /var/www/${originHost}/html --deploy-hook "systemctl reload nginx"`}
            sudo={useSudo}
          />
          <Typography component="p" gutterBottom>
            При выполнении введите <InlineCode>R</InlineCode> и дождитесь успешного завершения.
          </Typography>
</Box><Box component="section" id="3x-ui" className="cdn-step"><Box className="cdn-step-heading"><span className="cdn-step-number">03</span><Box><Typography component="h2" variant="h5">Панель управления 3x-ui</Typography><Typography component="p" className="cdn-step-description">Установим Xray, подключим сертификат и откроем доступ к панели.</Typography></Box></Box>
          <Typography component="p" gutterBottom>
            Установите панель управления подключениями на сервере <b>{originHost}</b>.
          </Typography>
          <Alert severity="info" icon={<InfoOutlinedIcon />}><AlertTitle>Нужен Xray 26.3.27 или новее</AlertTitle>В конфигурации ниже используются дополнительные параметры XHTTP. Проверьте версию ядра в панели перед настройкой инбаунда.</Alert>
          <CodeBlock code='<sudo>bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)' sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Во время установки задайте порт панели. В настройках сертификата выберите пункт 3, укажите домен <InlineCode copy>{originHost}</InlineCode> и пути к файлам ниже.
          </Typography>
          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Сертификат:
          </Typography>
          <CodeBlock code={`/etc/letsencrypt/live/${originHost}/fullchain.pem`} />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Приватный ключ:
          </Typography>
          <CodeBlock code={`/etc/letsencrypt/live/${originHost}/privkey.pem`} />

          <Typography component="p" gutterBottom>
            После установки вы увидите логин, пароль и ссылку на панель управления, сохраните их.
          </Typography>

          <Typography component="p" gutterBottom>
            Также включите порт панели в фаерволе (если он у вас есть):
          </Typography>
          <TextField
            label="Порт панели"
            size='small'
            variant="outlined"
            value={xuiPort}
            onChange={(e) => setXuiPort(e.target.value.trim().toLowerCase())}
            placeholder='2222'
            helperText="Укажите порт, выбранный при установке"
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
            sx={{ mb: 2, width: { xs: '100%', sm: 300 } }}
          />
          <CodeBlock code={`<sudo>ufw allow ${xuiPort}/tcp`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Далее войдите в панель управления и перейдите в раздел Подключения.
          </Typography>
</Box><Box component="section" id="cdn-resource" className="cdn-step"><Box className="cdn-step-heading"><span className="cdn-step-number">04</span><Box><Typography component="h2" variant="h5">Подключение CDN</Typography><Typography component="p" className="cdn-step-description">Укажем источник, выберем домен и отключим кеширование.</Typography></Box></Box>
          <Typography component="p" gutterBottom>
            В <Link href="https://beget.com/p1519472" target="_blank" rel="noopener noreferrer">панели управления</Link> откройте раздел CDN и создайте новый CDN-ресурс. Логика примерно одинаковая для разных CDN-провайдеров.
          </Typography>
          <PreviewPanel
            title="Параметры CDN"
            rows={[
              ['Источник', originHost],
              ['Домен CDN', cdnDomain],
              ['Протокол к источнику', 'HTTPS'],
              ['Кеширование', 'Отключить'],
              ['Всегда онлайн', 'Отключить'],
              ['Игнорировать параметры запроса', 'Отключить'],
            ]}
          />
          <Box component="ul" sx={{ pl: 3, my: 1 }}>
            <li><Typography component="span">В поле источника укажите домен VPN сервера или IP: <InlineCode copy>{originHost}</InlineCode>.</Typography></li>
            <li><Typography component="span">Выберите или создайте поддомен CDN: <InlineCode copy>{cdnDomain}</InlineCode>.</Typography></li>
            <li><Typography component="span">Выберите тип HTTPS, отключите кеширование и выберите HTTP метод GET в качестве разрешенных.</Typography></li>
          </Box>
          <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Кеширование на Бегет</AlertTitle>Если кеширование нельзя отключить, установите минимальное время: 1 секунду.
        </Alert>

          <Typography component="p" gutterBottom>
            Сохраните полученный домен. Он сразу подставится в конфигурацию следующего шага:
          </Typography>
          <TextField
            label="Домен CDN"
            size='small'
            variant="outlined"
            value={cdnDomain}
            onChange={(e) => setCdnDomain(e.target.value.trim().toLowerCase())}
            placeholder='example.begetcdn.cloud'
            helperText="То же значение, что в параметрах в начале гайда"
            slotProps={{ htmlInput: { spellCheck: false, autoCapitalize: 'none' } }}
            sx={{ mb: 2, width: '100%' }}
          />

          <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Собственный домен для CDN</AlertTitle>
            Если CDN требует ваш собственный домен, добавьте CNAME-запись в DNS:
            <InlineCode>cdn.example.com</InlineCode> CNAME <InlineCode>{cdnDomain}</InlineCode> <br />
            Для одного имени нельзя одновременно задавать A- и CNAME-записи.
          </Alert>
</Box><Box component="section" id="xhttp-inbound" className="cdn-step"><Box className="cdn-step-heading"><span className="cdn-step-number">05</span><Box><Typography component="h2" variant="h5">VLESS XHTTP</Typography><Typography component="p" className="cdn-step-description">Соберём конфигурацию инбаунда и добавим клиента.</Typography></Box></Box>
          <Typography component="p" gutterBottom>
            На VPN сервере откройте панель 3x-ui и создайте новый инбаунд. В качестве протокола выберите <InlineCode>vless</InlineCode>, транспорт <InlineCode>xhttp</InlineCode>, а порт выберите такой, который указан в правилах прокси nginx. В данном примере используется порт <InlineCode copy>{inboundPort}</InlineCode>.
          </Typography>
          <PreviewPanel
            title="Основные параметры инбаунда"
            rows={[
              ['Протокол', 'vless'],
              ['Транспорт', 'xhttp'],
              ['Порт', inboundPort],
              ['Путь к ресурсу', normalizedPath + 'segment' + digit + '.ts']
            ]}
          />
          <Typography component="p" gutterBottom>
            Во вкладке <InlineCode>Расширенный шаблон</InlineCode> вставьте следующие параметры:
          </Typography>
          <CodeBlock code={`{
  "listen": "127.0.0.1",
  "port": ${inboundPort},
  "protocol": "vless",
  "tag": "in-${inboundPort}-xhttp",
  "settings": {
    "clients": [],
    "decryption": "none",
    "encryption": "none"
  },
  "sniffing": {
    "enabled": true,
    "destOverride": [
      "http",
      "tls",
      "quic"
    ]
  },
  "streamSettings": {
    "network": "xhttp",
    "xhttpSettings": {
      "path": "${xhttpPath}segment${digit}.ts",
      "host": "",
      "mode": "packet-up",
      "xPaddingBytes": "4-10",
      "xPaddingObfsMode": true,
      "xPaddingKey": "_token",
      "xPaddingHeader": "X-Client-Version",
      "xPaddingPlacement": "query",
      "xPaddingMethod": "tokenish",
      "sessionIDPlacement": "path",
      "sessionIDKey": "sid",
      "sessionIDTable": "${randomString}............",
      "sessionIDLength": "16-24",
      "seqPlacement": "query",
      "seqKey": "offset",
      "uplinkDataPlacement": "body",
      "uplinkDataKey": "",
      "scMaxEachPostBytes": "500000-1000000",
      "noSSEHeader": false,
      "scMaxBufferedPosts": 50,
      "scStreamUpServerSecs": "20-80",
      "serverMaxHeaderBytes": 0,
      "uplinkHTTPMethod": "GET",
      "headers": {},
      "scMinPostsIntervalMs": "50-150",
      "uplinkChunkSize": 0,
      "noGRPCHeader": false,
      "xmux": {
        "maxConcurrency": "16-32",
        "maxConnections": "4-8",
        "cMaxReuseTimes": "0",
        "hMaxRequestTimes": "300-600",
        "hMaxReusableSecs": "900-1800",
        "hKeepAlivePeriod": 0
      },
      "enableXmux": true
    },
    "security": "none",
    "externalProxy": [
      {
        "forceTls": "tls",
        "dest": "${cdnDomain}",
        "port": 443,
        "remark": ""
      }
    ]
  }
}`} language='json' />
          <Typography component="p" gutterBottom>
            На первой вкладке задайте название подключения в поле «Примечание». Если нужен флаг в клиенте, добавьте эмодзи флага в начало названия.
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте подключение и добавьте клиента.
          </Typography>

          <Typography component="p" gutterBottom>
            При большом количестве клиентов увеличьте лимит таблицы <InlineCode>nf_conntrack</InlineCode>:
          </Typography>
          <CodeBlock code={`<sudo>sysctl -w net.netfilter.nf_conntrack_max=131072`} sudo={useSudo} />


</Box>
            </Box>

            <Box component="section" className="cdn-faq" id="faq"><span className="cdn-small-label">ЕСЛИ ОСТАЛИСЬ ВОПРОСЫ</span><Typography component="h2" variant="h5">Частые вопросы</Typography>{seo.faq.map(({ question, answer }) => <Accordion key={question} disableGutters elevation={0}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography component="h3">{question}</Typography></AccordionSummary><AccordionDetails><Typography>{answer}</Typography></AccordionDetails></Accordion>)}</Box>

            <Box component="section" className="cdn-resources"><Typography component="h2" variant="h6">Полезные ссылки</Typography><Typography component="p">Сервисы из инструкции и дополнительные материалы.</Typography><Stack direction="row" useFlexGap flexWrap="wrap" gap={1}><Button component="a" href="https://ishosting.io/affiliate/MjIwOSM4" target="_blank" rel="noopener noreferrer" variant="outlined">Сервер · is*hosting ↗</Button><Button component="a" href="https://beget.com/p1519472/cloud/cdn" target="_blank" rel="noopener noreferrer" variant="outlined">CDN · Бегет ↗</Button><Button component="a" href="https://selectel.ru/?ref_code=b25e58bc73" target="_blank" rel="noopener noreferrer" variant="outlined">CDN · Selectel ↗</Button></Stack><Accordion disableGutters elevation={0}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Ещё сервисы</Typography></AccordionSummary><AccordionDetails><Stack spacing={1.5}>{[
              ['Amnezia Premium · скидка 15%', 'https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM'],
              ['CDN · VK Cloud', 'https://cloud.vk.com/cdn/'], ['CDN · Timeweb', 'https://timeweb.cloud/r/gw781521'], ['CDNvideo', 'https://www.cdnvideo.ru/solutions/cdn-for-website-acceleration/'], ['VPN · Gik', 'https://t.me/Gik_VPN_Bot?start=ref9I0EryhK'],
            ].map(([label, href]) => <Link key={href} href={href} target="_blank" rel="noopener noreferrer" color="text.secondary">{label} ↗</Link>)}</Stack></AccordionDetails></Accordion></Box>

            <Box className="cdn-support"><Box><Typography component="h2" variant="h6">Гайд пригодился?</Typography><Typography>Можно поддержать новые инструкции.</Typography></Box><Button variant="outlined" onClick={() => setSupportModalOpen(true)}>Поддержать автора</Button></Box>
          </Box>
        </Box>
      </Box>
      <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </Box>
  );
}
