import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InfoIcon from '@mui/icons-material/Info';
import LaunchIcon from '@mui/icons-material/Launch';
import PaidIcon from '@mui/icons-material/Paid';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CodeBlock from '../components/CodeBlock';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import BegetIcon from '../svgIcons/BegetIcon';
import IshostingIcon from '../svgIcons/IshostingIcon';
import FutureIcon from '../svgIcons/FutureIcon';

const PreviewPanel = ({ title, rows }: { title: string; rows: string[][] }) => (
  <Paper
    elevation={0}
    sx={{
      my: 2,
      p: 2,
      borderRadius: '15px',
      bgcolor: '#090f16',
      border: '1px solid rgba(255, 255, 255, 0.12)'
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <CloudQueueIcon />
      <Typography variant="h6" fontWeight="bold">{title}</Typography>
    </Stack>
    <Grid container spacing={1.5}>
      {rows.map(([label, value]) => (
        <Grid key={label} size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Typography variant="caption" color="text.secondary" component="p">{label}</Typography>
            <Typography variant="body2" fontWeight="bold">{value}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

export default function CdnSetup() {
  const [originHost, setOriginHost] = useState('example.com');
  const [cdnDomain, setCdnDomain] = useState('example.begetcdn.cloud');
  const [inboundPort, setInboundPort] = useState('2053');
  const [xhttpPath, setXhttpPath] = useState('/static/media/live/');
  const [xuiPort, setXuiPort] = useState('2222');
  const [useSudo, setUseSudo] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

  const normalizedPath = xhttpPath.startsWith('/') ? xhttpPath : `/${xhttpPath}`;

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Настройка CDN для VLESS XHTTP через 3x-ui и nginx reverse proxy." />
        <meta name="keywords" content="CDN, 3x-ui, vless, xhttp, nginx, beget, vpn guide" />
        <meta property="og:title" content="Настройка CDN" />
        <meta property="og:description" content="Гайд по настройке CDN для VLESS XHTTP инбаунда в 3x-ui." />
        <title>Настройка CDN</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/cdn-setup'} />
      </Helmet>

      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/guides')}>
            {t('guidesPage')}
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1000px', mx: 'auto' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Настройка CDN
        </Typography>

        <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Инструкция показана на примере панели 3x-ui и подойдет для любого CDN провайдера, поддерживающего HTTP метод GET
        </Alert>

        <Card sx={{
          mb: 4,
          borderRadius: '15px',
          bgcolor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'none',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))'
        }}>
          <CardContent sx={{ p: '16px !important' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <YouTubeIcon sx={{ color: '#FF0000', fontSize: '2rem' }} />
                <Link
                  href="https://youtu.be/-9UJ_Bz03_s"
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                  color="text.primary"
                  sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  Смотреть гайд на Ютуб
                </Link>
              </Stack>
              <Button variant="contained" color="secondary" startIcon={<PaidIcon />} onClick={() => setSupportModalOpen(true)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 'bold', px: 3 }}>
                Поддержать автора
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />

        <Paper sx={{ p: 3, mb: 1, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Вводные данные</Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="IP/домен VPN сервера" value={originHost} onChange={(e) => setOriginHost(e.target.value.trim().toLowerCase())} placeholder="1.1.1.1 или vpn.example.com" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Домен CDN" value={cdnDomain} onChange={(e) => setCdnDomain(e.target.value.trim().toLowerCase())} placeholder="example.begetcdn.cloud" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Порт XHTTP инбаунда" value={inboundPort} onChange={(e) => setInboundPort(e.target.value.trim())} placeholder="2053" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Путь к ресурсу XHTTP" value={xhttpPath} onChange={(e) => setXhttpPath(e.target.value.trim())} placeholder="/api/getFile/" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox checked={useSudo} onChange={(e) => setUseSudo(e.target.checked)} color="primary" />}
                label={<Typography fontWeight="medium">Использовать <b>sudo</b> в командах</Typography>}
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary'>Дата: {new Date('06.22.2026').toLocaleDateString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary' sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('10.02.2026').toLocaleDateString()}</Typography>
          </Grid>
        </Grid>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Содержание</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              {[
                ['#ssl-cert', "1. Установка SSL-сертификата Let's Encrypt через Certbot"],
                ['#website', '2. Установка сайта-заглушки и прокси nginx'],
                ['#3x-ui', '3. Установка Xray и панели управления 3x-ui'],
                ['#cdn-resource', '4. Создание CDN ресурса'],
                ['#xhttp-inbound', '5. Настройка VLESS XHTTP в 3x-ui'],
              ].map(([href, label]) => (
                <ListItem key={href}>
                  <ListItemButton component="a" href={href} rel="noopener">
                    <ListItemText primary={label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Полезные ссылки</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              <ListItem>
                <ListItemButton component="a" href="https://ishosting.io/affiliate/MjIwOSM4" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Аренда зарубежного сервера" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Подписка Amnezia Premium с 15% скидкой" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://beget.com/p1519472/cloud/cdn" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDN на Бегет" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://selectel.ru/?ref_code=b25e58bc73" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDN на Selectel" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://cloud.vk.com/cdn/" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDN на VK Cloud" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/services/cdn" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDN на Yandex Cloud" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://timeweb.cloud/r/gw781521" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDN на Timeweb" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://www.cdnvideo.ru/solutions/cdn-for-website-acceleration/" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDN на CDNvideo" />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Box component="article">
          <Card sx={{
            mt: 2,
            mb: 1,
            borderRadius: '15px',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'none',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))'
          }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IshostingIcon />
                  <Link
                    href="https://ishosting.io/affiliate/MjIwOSM4"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Аренда зарубежного сервера
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{
            mb: 1,
            borderRadius: '15px',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'none',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))'
          }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <BegetIcon />
                  <Link
                    href="https://beget.com/p1519472"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    CDN и виртуальные сервера
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{
            mb: 4,
            borderRadius: '15px',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'none',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))'
          }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <FutureIcon />
                <Link href="https://t.me/futuresbp_bot?start=DenPiligrim" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  Обход Глушилок / Белых списков
                </Link>
              </Stack>
            </CardContent>
          </Card>

          <Typography id="ssl-cert" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Установка SSL-сертификата Let's Encrypt через Certbot
          </Typography>
          <Typography component="p" gutterBottom>
            Первое, что необходимо сделать - это обновить пакеты на сервере:
          </Typography>
          <CodeBlock code='<sudo>apt update && apt upgrade -y' sudo={useSudo} />
          <Typography component="p" gutterBottom>
            Перед началом убедитесь, что ваш домен <InlineCode>{originHost}</InlineCode> уже направлен на IP-адрес вашего сервера. Для этого в панели управления доменом должна быть настроена A-запись в DNS.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка Certbot
          </Typography>
          <Typography component="p" gutterBottom>
            Обновите список пакетов и установите Certbot. Убедитесь, что у вас открыт и свободен 80 порт — это обязательное условие для успешного выпуска сертификата.
          </Typography>
          <CodeBlock code={`<sudo>apt install snapd\n<sudo>snap install --classic certbot\n<sudo>ln -s /snap/bin/certbot /usr/local/bin/certbot`} sudo={useSudo} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="website" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Установка сайта-заглушки и прокси nginx
          </Typography>

          <Typography component="p" gutterBottom>
            Для того, чтобы маскировать сервер как обычный веб-сервер, установим сайт-заглушку. Начнем с установки nginx:
          </Typography>
          <CodeBlock code='<sudo>apt install nginx -y' sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Создайте директорию для сайта и выдайте нужные права:
          </Typography>
          <CodeBlock
            code={`<sudo>mkdir -p /var/www/${originHost}/html\n<sudo>chown -R $USER:$USER /var/www/${originHost}/html`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Создание страницы
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте файл <InlineCode>index.html</InlineCode>:
          </Typography>
          <CodeBlock code={`nano /var/www/${originHost}/html/index.html`} sudo={useSudo} />
          <Typography component="p" gutterBottom>
            Вставьте базовый HTML-код, сохраните <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode> и закройте редактор <InlineCode>Ctrl+X</InlineCode>:
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

      <p class="description">
        Здесь скоро появится что-то новое.
        Сайт находится в разработке.
      </p>

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

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

    location ${xhttpPath}segment0.ts/ {
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

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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
            Теперь, если перейти по адресу <a href={`https://${originHost}`} target='_blank'>https://{originHost}</a>, вы увидите созданную страницу-заглушку.
          </Typography>

          <Typography component="p" gutterBottom>
            Также важно перенастроить certbot, чобы не было конфликта с nginx при обновлении сертификата:
          </Typography>
          <CodeBlock
            code={`<sudo>certbot reconfigure --cert-name ${originHost} --authenticator webroot --webroot-path /var/www/${originHost}/html --deploy-hook "systemctl reload nginx"`}
            sudo={useSudo}
          />
          <Typography component="p" gutterBottom>
            При выполнении введите <InlineCode>R</InlineCode> и дождитесь успешного завершения.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="3x-ui" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            3. Установка Xray и панели управления 3x-ui
          </Typography>
          <Typography component="p" gutterBottom>
            На основном сервере <b>{originHost}</b> мы установим панель для управления подключениями. Важно, что версия Xray должна быть 26.3.27+, чтобы можно было указать extra параметры.
          </Typography>
          <CodeBlock code='<sudo>bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)' sudo={useSudo} />

          <Typography component="p" gutterBottom>
            При установке выберите порт (можно рандомный) и укажите свой путь к сертификату (выбрать пункт 3) и домен <InlineCode copy>{originHost}</InlineCode>.
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
            sx={{ mb: 1 }}
          />
          <CodeBlock code={`<sudo>ufw allow ${xuiPort}/tcp`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Далее войдите в панель управления и перейдите в раздел Подключения.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="cdn-resource" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            4. Создание CDN ресурса
          </Typography>
          <Typography component="p" gutterBottom>
            В панели управления откройте раздел CDN и создайте новый CDN-ресурс. Логика примерно одинаковая для разных CDN-провайдеров.
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

          <Typography component="p" gutterBottom>
            Введите полученный домен CDN:
          </Typography>
          <TextField
            label="Домен CDN"
            size='small'
            variant="outlined"
            value={cdnDomain}
            onChange={(e) => setCdnDomain(e.target.value.trim().toLowerCase())}
            placeholder='example.begetcdn.cloud'
            sx={{ mb: 1 }}
          />

          <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
            В некоторых сервисах требуется использовать свой домен для CDN, в таком случае необходимо прописать <b>cname</b> запись в DNS. Например:
            <InlineCode>cdn.example.com</InlineCode> CNAME <InlineCode>{cdnDomain}</InlineCode> <br />
            Важно! Нельзя одновременно указывать для домена A и CNAME запись.
          </Alert>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="xhttp-inbound" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            5. Настройка VLESS XHTTP в 3x-ui
          </Typography>
          <Typography component="p" gutterBottom>
            На VPN сервере откройте панель 3x-ui и создайте новый инбаунд. В качестве протокола выберите <InlineCode>vless</InlineCode>, транспорт <InlineCode>xhttp</InlineCode>, а порт выберите такой, который указан в правилах прокси nginx. В данном примере используется порт <InlineCode copy>{inboundPort}</InlineCode>.
          </Typography>
          <PreviewPanel
            title="Основные параметры инбаунда"
            rows={[
              ['Протокол', 'vless'],
              ['Транспорт', 'xhttp'],
              ['Порт', inboundPort],
              ['Путь к ресурсу', normalizedPath]
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
      "path": "${xhttpPath}segment0.ts",
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
      "sessionIDTable": "kdleowms............",
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
            В первой вкладке в поле Примечание введите название подключения, чтобы отображался флаг в клиенте в начале примечания нужно добавить эмодзи флага.
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте подключение и добавьте клиента.
          </Typography>

          <Typography component="p" gutterBottom>
            Теперь рекомендуется увеличить лимит таблицы <InlineCode>nf_conntrack</InlineCode>, при большом количестве клиентов это может быть критично. Выполните:
          </Typography>
          <CodeBlock code={`<sudo>sysctl -w net.netfilter.nf_conntrack_max=131072`} sudo={useSudo} />

        </Box>
      </Box>
    </>
  );
}