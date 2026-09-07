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
import InfoIcon from '@mui/icons-material/Info';
import LaunchIcon from '@mui/icons-material/Launch';
import PaidIcon from '@mui/icons-material/Paid';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SmartToyIcon from '@mui/icons-material/SmartToy';
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
import SelectelIcon from '../svgIcons/SelectelIcon';

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

export default function CdnSelectel() {
  const [originHost, setOriginHost] = useState('example.com');
  const [cdnDomain, setCdnDomain] = useState('example.selcdn.net');
  const [inboundPort, setInboundPort] = useState('2053');
  const [xhttpPath, setXhttpPath] = useState('/api/uploadFile/');
  const [xuiPort, setXuiPort] = useState('2222');
  const [clientId, setClientId] = useState('b33a84dc-b8f0...');
  const [useSudo, setUseSudo] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

  const normalizedPath = xhttpPath.startsWith('/') ? xhttpPath : `/${xhttpPath}`;

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Настройка CDN для VLESS XHTTP через 3x-ui и nginx reverse proxy." />
        <meta name="keywords" content="CDN, 3x-ui, vless, xhttp, nginx, selectel, vpn guide" />
        <meta property="og:title" content="Настройка CDN Selectel" />
        <meta property="og:description" content="Гайд по настройке CDN Selectel для VLESS XHTTP инбаунда в 3x-ui." />
        <title>Настройка CDN на Selectel</title>
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
          Настройка CDN на Selectel
        </Typography>

        <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Инструкция показана на примере панели 3x-ui
        </Alert>

        <Card sx={{ mb: 4, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none' }}>
          <CardContent sx={{ p: '16px !important' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <YouTubeIcon sx={{ color: '#FF0000', fontSize: '2rem' }} />
                <Link
                  href="https://youtu.be/-JrL-F-l86E"
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
              <TextField fullWidth label="Домен VPN сервера" value={originHost} onChange={(e) => setOriginHost(e.target.value.trim().toLowerCase())} placeholder="1.1.1.1 или vpn.example.com" />
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
            <Typography variant="body1" color='textSecondary'>Дата: {new Date('09.05.2026').toLocaleDateString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary' sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('09.07.2026').toLocaleDateString()}</Typography>
          </Grid>
        </Grid>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Содержание</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              {[
                ['#domains', '1. Создание поддоменов и DNS записей'],
                ['#ssl-cert', "2. Установка SSL-сертификата Let's Encrypt через Certbot"],
                ['#website', '3. Установка сайта-заглушки и прокси nginx'],
                ['#cdn-resource', '4. Создание CDN ресурса'],
                ['#3x-ui', '5. Установка Xray и панели управления 3x-ui'],
                ['#xhttp-inbound', '6. Настройка VLESS XHTTP в 3x-ui'],
                ['#client-data', '7. Подключение клиента'],
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
                <ListItemButton component="a" href="https://selectel.ru/?ref_code=b25e58bc73" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CDN на Selectel" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Бот для автоматической настройки" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://beget.com/p1519472/cloud/cdn" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Виртуальные сервера и домены" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://t.me/futuresbp_bot?start=DenPiligrim" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="ВПН сервис с обходом белых списков" />
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
                  <SelectelIcon />
                  <Link
                    href="https://selectel.ru/?ref_code=b25e58bc73"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    CDN на Selectel
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
                  <SmartToyIcon />
                  <Link
                    href="https://t.me/cdnsettingvpn_bot?start=all_DENPILIGRIM"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Бот для автоматической настройки
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Typography id="domains" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Создание поддоменов и DNS записей
          </Typography>
          <Typography component="p" gutterBottom>
            В панели управления вашим доменом создайте поддомены <InlineCode copy>{'origin.' + originHost}</InlineCode> и <InlineCode copy>{'panel.' + originHost}</InlineCode>. Это удобно для того, чтобы четко разделять источник от веб панели ВПН сервера.
          </Typography>
          <Typography component="p" gutterBottom>
            Направьте поддомены на ваш зарубежный сервер, добавив A записи:
          </Typography>
          <PreviewPanel
            title="A записи поддоменов"
            rows={[
              ['origin.' + originHost, 'IP адрес ВПН сервера'],
              ['panel.' + originHost, 'IP адрес ВПН сервера']
            ]}
          />
          <Typography component="p" gutterBottom>
            Обычно обновление DNS записей занимает от 5 минут, в редких случаях до 24 часов.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="ssl-cert" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Установка SSL-сертификата Let's Encrypt через Certbot
          </Typography>
          <Typography component="p" gutterBottom>
            Прежде чем начать, обновите пакеты на сервере:
          </Typography>
          <CodeBlock code={`<sudo>apt update && <sudo>apt upgrade -y`} sudo={useSudo} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка Certbot
          </Typography>
          <Typography component="p" gutterBottom>
            Установите Snap и Certbot. Убедитесь, что у вас открыт и свободен 80 порт — это обязательное условие для успешного выпуска сертификата.
          </Typography>
          <CodeBlock code={`<sudo>apt install snapd\n<sudo>snap install --classic certbot\n<sudo>ln -s /snap/bin/certbot /usr/local/bin/certbot`} sudo={useSudo} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Выпуск сертификата
          </Typography>
          <Typography component="p" gutterBottom>
            Запустите команду выпуска сертификата:
          </Typography>
          <CodeBlock code={`<sudo>certbot certonly --standalone -d origin.${originHost}`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            И для другого домена:
          </Typography>
          <CodeBlock code={`<sudo>certbot certonly --standalone -d panel.${originHost}`} sudo={useSudo} />

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
            3. Установка сайта-заглушки и прокси nginx
          </Typography>

          <Typography component="p" gutterBottom>
            Для того, чтобы маскировать сервер как обычный веб-сервер, установим сайт-заглушку. Начнем с установки nginx:
          </Typography>
          <CodeBlock code='<sudo>apt install nginx -y' sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Создайте директорию для сайта и выдайте нужные права:
          </Typography>
          <CodeBlock
            code={`<sudo>mkdir -p /var/www/origin.${originHost}/html\n<sudo>chown -R $USER:$USER /var/www/origin.${originHost}/html`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Создание страницы
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте файл <InlineCode>index.html</InlineCode>:
          </Typography>
          <CodeBlock code={`nano /var/www/origin.${originHost}/html/index.html`} sudo={useSudo} />
          <Typography component="p" gutterBottom>
            Вставьте базовый HTML-код, сохраните <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode> и закройте редактор <InlineCode>Ctrl+X</InlineCode>:
          </Typography>
          <CodeBlock
            code={`<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>origin.${originHost} | Website</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #2c2825;
      color: #e3d9c6;
      font-family: 'Georgia', 'Times New Roman', serif;
    }

    .container {
      text-align: center;
      padding: 60px 80px;
      background: #1f1b18;
      border-radius: 6px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
      border-left: 4px solid #8b5a2b;
    }

    h1 {
      font-weight: normal;
      letter-spacing: 2px;
      margin-bottom: 15px;
      font-size: 2.2em;
    }

    p {
      color: #a89f91;
      font-size: 16px;
      font-style: italic;
      letter-spacing: 1px;
      margin: 0;
    }

    .icon {
      font-size: 45px;
      margin-bottom: 15px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="icon">🕸</div>
    <h1>origin.${originHost}</h1>
    <p>A simple website. Coming Soon.</p>
  </div>
</body>

</html>`}
            language="html"
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Настройка конфигурации Nginx
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте конфигурационный файл для вашего домена:
          </Typography>
          <CodeBlock code={`<sudo>nano /etc/nginx/sites-available/origin.${originHost}`} sudo={useSudo} />
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

    ssl_certificate /etc/letsencrypt/live/origin.${originHost}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/origin.${originHost}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location = /health {
        default_type application/json;
        return 200 '{"status":"ok","service":"media-gateway","version":"4.2.1"}';
    }

    location = /api/uploadFile { return 404; }

    location /api/uploadFile/ {
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
        root /var/www/origin.${originHost}/html; 
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
            Настройка конфига nginx.conf
          </Typography>
          <Typography component="p" gutterBottom>
            Две правки в главном конфиге. Первая — лимит соединений на воркер:
          </Typography>
          <CodeBlock
            code={`<sudo>sed -i 's/worker_connections .*/worker_connections 16384;/' /etc/nginx/nginx.conf`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom>
            Вторая — обязательна именно для Selectel. В /etc/nginx/nginx.conf:
          </Typography>
          <CodeBlock
            code={`<sudo>nano /etc/nginx/nginx.conf`}
            sudo={useSudo}
          />
          <Typography component="p" gutterBottom>
            Добавьте строку внутри http {"{ }"}:
          </Typography>
          <CodeBlock
            code={`large_client_header_buffers 8 64k;`}
            language='nginx'
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
            code={`<sudo>ln -s /etc/nginx/sites-available/origin.${originHost} /etc/nginx/sites-enabled/\n<sudo>rm /etc/nginx/sites-enabled/default\n<sudo>nginx -t\n<sudo>systemctl restart nginx`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Теперь, если перейти по адресу <a href={`https://origin.${originHost}`} target='_blank'>https://origin.{originHost}</a>, вы увидите созданную страницу-заглушку.
          </Typography>

          <Typography component="p" gutterBottom>
            Также важно перенастроить certbot, чобы не было конфликта с nginx при обновлении сертификата:
          </Typography>
          <CodeBlock
            code={`<sudo>certbot reconfigure --cert-name origin.${originHost} --authenticator webroot --webroot-path /var/www/origin.${originHost}/html --deploy-hook "systemctl reload nginx"`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom>
            И для другого домена:
          </Typography>
          <CodeBlock
            code={`<sudo>certbot reconfigure --cert-name panel.${originHost} --authenticator standalone --pre-hook "systemctl stop nginx" --post-hook "systemctl start nginx"`}
            sudo={useSudo}
          />
          <Typography component="p" gutterBottom>
            При выполнении введите <InlineCode>R</InlineCode> и дождитесь успешного завершения.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="cdn-resource" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            4. Создание CDN ресурса
          </Typography>
          <Typography component="p" gutterBottom>
            Теперь, когда по адресу есть страница, то можно приступить к созданию CDN-ресурса. Важно, что для создания CDN необходимо пополнить баланс минимум на 200 руб. Выберите тип CDN - Статика.
          </Typography>
          <PreviewPanel
            title="Параметры CDN"
            rows={[
              ['Источник', 'origin.' + originHost + ':443'],
              ['Протокол к источнику', 'HTTPS'],
              ['Время соединения', '30'],
              ['Отправка запроса', '9999'],
              ['Получение ответа', '9999'],
              ['Кеширование', 'Отключить'],
              ['Разрешенные HTTP-методы', 'POST, DELETE'],
              ['Сжатие Gzip', 'Отключить'],
            ]}
          />
          <Box component="ul" sx={{ pl: 3, my: 1 }}>
            <li><Typography component="span">В поле источника укажите домен VPN сервера (nginx) и порт: <InlineCode copy>{'origin.' + originHost + ':443'}</InlineCode>.</Typography></li>
            <li><Typography component="span">После активации вы получите поддомен CDN: <InlineCode copy>{cdnDomain}</InlineCode>.</Typography></li>
          </Box>

          <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
            При создании CDN ресурса и сохранении параметров должно пройти некоторое время (20-30 минут), прежде чем CDN получит статус ACTIVE
          </Alert>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="3x-ui" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            5. Установка Xray и панели управления 3x-ui
          </Typography>
          <Typography component="p" gutterBottom>
            На основном сервере <b>panel.{originHost}</b> мы установим панель для управления подключениями. Важно, что версия Xray должна быть 26.3.27+, чтобы можно было указать extra параметры.
          </Typography>
          <CodeBlock code='<sudo>bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)' sudo={useSudo} />

          <Typography component="p" gutterBottom>
            При установке выберите порт (можно рандомный) и укажите пункт 3 для кастомных сертификатов и укажите:
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Домен: <InlineCode copy>{'panel.' + originHost}</InlineCode>
          </Typography>
          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Сертификат:
          </Typography>
          <CodeBlock code={`/etc/letsencrypt/live/panel.${originHost}/fullchain.pem`} />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Приватный ключ:
          </Typography>
          <CodeBlock code={`/etc/letsencrypt/live/panel.${originHost}/privkey.pem`} />

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

          <Typography id="xhttp-inbound" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            6. Настройка VLESS XHTTP в 3x-ui
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
  "tag": "in-${inboundPort}-tcp",
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
    "security": "none",
    "externalProxy": [
      {
        "forceTls": "tls",
        "dest": "${cdnDomain}",
        "port": 443,
        "remark": ""
      }
    ],
    "xhttpSettings": {
      "path": "${xhttpPath}upload.m3u8",
      "mode": "packet-up",
      "xPaddingBytes": "80-240",
      "xPaddingObfsMode": true,
      "xPaddingKey": "q",
      "xPaddingHeader": "X-Client-Version",
      "xPaddingPlacement": "query",
      "xPaddingMethod": "tokenish",
      "sessionPlacement": "header",
      "sessionKey": "X-Upload-Token",
      "seqPlacement": "query",
      "seqKey": "page",
      "noSSEHeader": false,
      "scMaxBufferedPosts": 30,
      "scStreamUpServerSecs": "20-80",
      "serverMaxHeaderBytes": 0,
      "uplinkHTTPMethod": "DELETE",
      "uplinkChunkSize": 0,
      "noGRPCHeader": false,
      "enableXmux": true,
      "uplinkDataPlacement": "body",
      "xmux": {
        "maxConcurrency": "16-32",
        "maxConnections": 0,
        "cMaxReuseTimes": 1000,
        "hMaxRequestTimes": "600-900",
        "hMaxReusableSecs": "100",
        "hKeepAlivePeriod": 20000
      },
      "sessionIDPlacement": "query",
      "sessionIDKey": "sid"
    }
  }
}`} language='json' />
          <Typography component="p" gutterBottom>
            Создайте подключение и добавьте клиента.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="client-data" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            7. Подключение клиента
          </Typography>
          <Typography component="p" gutterBottom>
            После создания клиента вы можете открыть информацию о клиенте и скопировать ссылку на подписку или ключ и вставить содержимое в приложение INCY или другие, поддерживающие последнии версии ядра Xray.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
