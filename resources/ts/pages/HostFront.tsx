import { useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Card, CardContent, Checkbox, Divider,
  FormControlLabel,
  Link,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, Typography,
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PaidIcon from '@mui/icons-material/Paid';
import LaunchIcon from '@mui/icons-material/Launch';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CodeBlock from '../components/CodeBlock';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import FutureIcon from '../svgIcons/FutureIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import IshostingIcon from '../svgIcons/IshostingIcon';

const PreviewPanel = ({ rows }: { rows: string[][] }) => (
  <Paper elevation={0} sx={{ my: 2, p: 2, borderRadius: '15px', bgcolor: '#090f16', border: '1px solid rgba(255,255,255,.12)' }}>
    <Grid container spacing={1.5}>
      {rows.map(([label, value]) => (
        <Grid key={label} size={{ xs: 12, sm: 6 }}>
          <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'rgba(255,255,255,.04)' }}>
            <Typography variant="caption" color="text.secondary" component="p">{label}</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ overflowWrap: 'anywhere' }}>{value}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

export default function HostFront() {
  const [serverIp, setServerIp] = useState('1.1.1.1');
  const [hostingIp, setHostingIp] = useState('2.2.2.2');
  const [originDomain, setOriginDomain] = useState('origin.example.com');
  const [frontDomain, setFrontDomain] = useState('front.example.com');
  const [panelDomain, setPanelDomain] = useState('panel.example.com');
  const [inboundPort, setInboundPort] = useState('2053');
  const [xhttpPath, setXhttpPath] = useState('/p');
  const [clientId, setClientId] = useState('ВАШ-UUID');
  const [useSudo, setUseSudo] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = xhttpPath.startsWith('/') ? xhttpPath : `/${xhttpPath}`;
  const pathWithoutSlash = path.replace(/^\//, '');
  const rewriteRule = `RewriteEngine On
RewriteRule ^p$ http://${serverIp}${path} [P]`;

  const nginxConfig = `upstream xray_xhttp {
    server 127.0.0.1:${inboundPort};
    keepalive 128;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name _;

    ssl_certificate /etc/letsencrypt/live/${originDomain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${originDomain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location = /health {
        default_type application/json;
        return 200 '{"status":"ok","service":"media-gateway","version":"4.2.1"}';
    }

    location /p {
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;

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

    location /sub/ {
        proxy_hide_header Profile-Web-Page-Url;
        add_header Profile-Web-Page-Url "https://$host$request_uri" always;
        proxy_pass http://127.0.0.1:2096;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /json/ {
        proxy_hide_header Profile-Web-Page-Url;
        add_header Profile-Web-Page-Url "https://$host$request_uri" always;
        proxy_pass http://127.0.0.1:2096;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ =404;
    }
}`;

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Ручная настройка Host-front через shared-хостинг VLESS XHTTP и Nginx." />
        <meta name="keywords" content="Host-front, VPN, VLESS, XHTTP, 3x-ui, Remnawave, Nginx" />
        <meta property="og:title" content="Ручная настройка VPN через Host-front" />
        <meta property="og:description" content="Настройка Host-front без скриптов: .htaccess, inbound и Nginx." />
        <title>VPN через Host-front — ручная настройка</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/host-front'} />
      </Helmet>

      <Grid container><Grid size={{ xs: 12 }} pt={3} pb={1}>
        <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigate('/guides')}>{t('guidesPage')}</Button>
      </Grid></Grid>

      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1000px', mx: 'auto' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>VPN через Host-front</Typography>
        <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 3 }}>
          Схема соединения: клиент → домен на хостинге → Apache/.htaccess → Nginx на VPN-сервере → локальный Xray-inbound.
        </Alert>
        <Alert severity="warning" sx={{ mb: 3 }}>
          IP shared-хостинга должен быть доступен в нужной вам сети, а тариф — поддерживать безлимитный трафик, HTTPS и проксирование через <b>mod_rewrite/mod_proxy</b>. Условия хостинга могут меняться — уточните их до оплаты.
        </Alert>

        <Card sx={{ mb: 4, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none' }}>
          <CardContent sx={{ p: '16px !important' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <YouTubeIcon sx={{ color: '#FF0000', fontSize: '2rem' }} />
                <Link
                  href="https://youtu.be/Ksn_OOQBqDs"
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

        <Paper sx={{ p: 3, mb: 1, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255,255,255,.12)' }}>
          <Typography variant="h6" sx={{ mb: 3 }}>Ваши данные</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="IP VPN-сервера" value={serverIp} onChange={e => setServerIp(e.target.value.trim())} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="IP shared-хостинга" value={hostingIp} onChange={e => setHostingIp(e.target.value.trim())} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Origin-домен" value={originDomain} onChange={e => setOriginDomain(e.target.value.trim().toLowerCase())} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Front-домен" value={frontDomain} onChange={e => setFrontDomain(e.target.value.trim().toLowerCase())} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Домен панели" value={panelDomain} onChange={e => setPanelDomain(e.target.value.trim().toLowerCase())} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Порт inbound" value={inboundPort} onChange={e => setInboundPort(e.target.value.trim())} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="Путь XHTTP" value={xhttpPath} onChange={e => setXhttpPath(e.target.value.trim())} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="UUID клиента" value={clientId} onChange={e => setClientId(e.target.value.trim())} /></Grid>
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
            <Typography variant="body1" color='textSecondary'>Дата: {new Date('08.14.2026').toLocaleDateString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary' sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('08.15.2026').toLocaleDateString()}</Typography>
          </Grid>
        </Grid>

        <Accordion><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>Содержание</Typography></AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}><List>{[
            ['#prepare', '1. Сервер, хостинг и домен'], ['#dns', '2. DNS-записи'], ['#hosting', '3. Сайт, SSL и .htaccess на хостинге'],
            ['#panel', '4. Панель и XHTTP-inbound'], ['#nginx', '5. TLS и Nginx на VPN-сервере'], ['#client', '6. Клиент и проверка'],
          ].map(([href, label]) => <ListItem key={href}><ListItemButton component="a" href={href}><ListItemText primary={label} /></ListItemButton></ListItem>)}</List></AccordionDetails>
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
                <ListItemButton component="a" href="https://beget.com/p1519472" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Аренда РУ сервера и домен" />
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
                <ListItemButton component="a" href="https://www.reg.ru/hosting/?rlink=reflink-32217889" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Хостинг REG.RU" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://t.me/bschekbot?start=ref_kscjmjyf" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Бот для проверки IP/домена" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://t.me/cdnsettingvpn_bot?start=ref_DENPILIGRIM" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Скрипт для автоматической настройки" />
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
                    Аренда РУ сервера и домен
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
              <Stack direction="row" spacing={1.5} alignItems="center">
                <FutureIcon />
                <Link href="https://t.me/futuresbp_bot?start=DenPiligrim" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  Обход Глушилок / Белых списков
                </Link>
              </Stack>
            </CardContent>
          </Card>

          <Typography id="prepare" variant="h5" gutterBottom fontWeight="bold">1. Подготовьте сервер, хостинг и домен</Typography>
          <Typography component="p" gutterBottom>Арендуйте зарубежный VPS с Ubuntu или Debian и сохраните его IP <InlineCode copy>{serverIp}</InlineCode>. Затем выберите shared-хостинг. Для этой схемы важны безлимитный трафик, SSL и поддержка директив Apache <InlineCode>RewriteRule</InlineCode> с флагом <InlineCode>[P]</InlineCode>.</Typography>
          <Typography component="p" gutterBottom>Купите домен в любой доступной зоне. Для доменов в некоторых национальных зонах регистратор может запросить идентификационные данные. Перед продолжением отдельно проверьте IP хостинга <InlineCode copy>{hostingIp}</InlineCode> из нужных мобильных сетей.</Typography>

          <Divider sx={{ my: 4 }} />
          <Typography id="dns" variant="h5" gutterBottom fontWeight="bold">2. Создайте три DNS-записи</Typography>
          <Typography component="p" gutterBottom>В DNS-зоне домена добавьте записи типа <InlineCode>A</InlineCode>:</Typography>
          <PreviewPanel rows={[[originDomain, serverIp], [frontDomain, hostingIp], [panelDomain, serverIp]]} />
          <Typography component="p" gutterBottom><b>Origin</b> принимает трафик от хостинга, <b>front</b> указывается в VPN-клиенте, а отдельный домен панели нужен только для управления. Дождитесь обновления DNS и проверьте записи:</Typography>
          <CodeBlock code={`nslookup ${originDomain}\nnslookup ${frontDomain}\nnslookup ${panelDomain}`} />

          <Divider sx={{ my: 4 }} />
          <Typography id="hosting" variant="h5" gutterBottom fontWeight="bold">3. Настройте сайт, SSL и .htaccess на хостинге</Typography>
          <Typography component="p" gutterBottom>В панели хостинга создайте сайт для <InlineCode copy>{frontDomain}</InlineCode>. Уберите ненужные псевдонимы, отключите кэширование и, при необходимости, журналы запросов. Выпустите бесплатный Let&apos;s Encrypt-сертификат и убедитесь, что <InlineCode copy>{`https://${frontDomain}`}</InlineCode> открывается.</Typography>
          <Typography component="p" gutterBottom>Откройте файловый менеджер, перейдите в корневой каталог сайта и вручную создайте файл <InlineCode>.htaccess</InlineCode>. Вставьте в него:</Typography>
          <CodeBlock code={rewriteRule} language="apache" />
          <Alert severity="info" sx={{ mb: 2 }}>Путь в правиле должен полностью совпадать с путём XHTTP-inbound. Файл должен называться именно <b>.htaccess</b>, без расширения <b>.txt</b>.</Alert>
          <Alert severity="warning">Если сервер отвечает 500 или правило не проксирует запрос, уточните в условиях хостинга, разрешены ли <b>mod_proxy</b> и флаг <b>[P]</b> на вашем тарифе. Без серверного reverse proxy эта схема не заработает.</Alert>

          <Divider sx={{ my: 4 }} />
          <Typography id="panel" variant="h5" gutterBottom fontWeight="bold">4. Создайте inbound в 3x-ui или Remnawave</Typography>
          <Typography component="p" gutterBottom>Установите одну панель на VPN-сервер: <b>3x-ui</b> — если управляете одиночным сервером, либо <b>Remnawave</b> — если уже используете её панель и ноды. Привяжите веб-интерфейс к <InlineCode copy>{panelDomain}</InlineCode>, настройте HTTPS по документации выбранной панели и не оставляйте панель с паролем по умолчанию.</Typography>
          <Typography component="p" gutterBottom>В 3x-ui откройте <b>Подключения → Добавить inbound</b>. В Remnawave создайте профиль/инбаунд ноды с теми же параметрами:</Typography>
          <PreviewPanel rows={[["Протокол", "VLESS"], ["Транспорт", "XHTTP"], ["Listen IP", "127.0.0.1"], ["Порт", inboundPort], ["Путь", path], ["Security", "none"]]} />
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
    "decryption": "none"
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
        "dest": "${frontDomain}",
        "port": 443,
        "remark": "",
        "sni": "${frontDomain}",
        "fingerprint": "firefox",
        "alpn": "h2"
      }
    ],
    "xhttpSettings": {
      "path": "${xhttpPath}",
      "host": "",
      "mode": "packet-up",
      "noSSEHeader": false,
      "scMaxEachPostBytes": "262144-786432",
      "scMinPostsIntervalMs": "0",
      "xPaddingBytes": "48-256",
      "xPaddingObfsMode": true,
      "xPaddingKey": "q",
      "xPaddingMethod": "tokenish",
      "xPaddingPlacement": "query",
      "sessionIDKey": "sid",
      "sessionIDPlacement": "query",
      "seqKey": "offset",
      "seqPlacement": "query",
      "uplinkHTTPMethod": "DELETE",
      "xmux": {
        "maxConcurrency": 0,
        "maxConnections": "16-32",
        "cMaxReuseTimes": 0,
        "hMaxRequestTimes": "600-900",
        "hMaxReusableSecs": "120-240",
        "hKeepAlivePeriod": 20
      },
      "enableXmux": true
    }
  }
}`} language='json' />
          <Typography component="p" gutterBottom>Добавьте клиента, сохраните его UUID и включите inbound. TLS внутри Xray не нужен: внешнее HTTPS-соединение завершает Nginx. Порт <InlineCode>{inboundPort}</InlineCode> не открывайте в firewall — он слушает только localhost.</Typography>

          <Divider sx={{ my: 4 }} />
          <Typography id="nginx" variant="h5" gutterBottom fontWeight="bold">5. Настройте TLS и Nginx на VPN-сервере</Typography>
          <Typography component="p" gutterBottom>Подключитесь по SSH и установите Nginx с Certbot:</Typography>
          <CodeBlock code={`<sudo>apt update\n<sudo>apt install nginx certbot python3-certbot-nginx -y`} sudo={useSudo} />
          <Typography component="p" gutterBottom>Пока порт 80 свободен и DNS origin-домена уже обновился, выпустите сертификат:</Typography>
          <CodeBlock code={`<sudo>systemctl stop nginx\n<sudo>certbot certonly --standalone -d ${originDomain}\n<sudo>systemctl start nginx`} sudo={useSudo} />
          <Typography component="p" gutterBottom>Создайте конфигурацию:</Typography>
          <CodeBlock code={`<sudo>nano /etc/nginx/sites-available/${originDomain}`} sudo={useSudo} />
          <CodeBlock code={nginxConfig} language="nginx" />
          <Typography component="p" gutterBottom>Сохраните файл и активируйте сайт:</Typography>
          <CodeBlock code={`<sudo>ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default\n<sudo>nginx -t\n<sudo>systemctl reload nginx`} sudo={useSudo} />
          <Typography component="p" gutterBottom>Проверьте автоматическое продление сертификата и разрешите только веб-порты (а также SSH и порт панели, если они нужны):</Typography>
          <CodeBlock code={`<sudo>certbot renew --dry-run\n<sudo>ufw allow 80/tcp\n<sudo>ufw allow 443/tcp`} sudo={useSudo} />

          <Divider sx={{ my: 4 }} />
          <Typography id="client" variant="h5" gutterBottom fontWeight="bold">6. Добавьте подключение и проверьте цепочку</Typography>
          <Typography component="p" gutterBottom>В клиенте, поддерживающем VLESS XHTTP, создайте профиль со следующими параметрами:</Typography>
          <CodeBlock code={`vless://${clientId}@${frontDomain}:443?alpn=h2&extra=%7B%22mode%22%3A%22packet-up%22%2C%22scMaxEachPostBytes%22%3A%22262144-786432%22%2C%22scMinPostsIntervalMs%22%3A%220%22%2C%22seqKey%22%3A%22offset%22%2C%22seqPlacement%22%3A%22query%22%2C%22sessionIDKey%22%3A%22sid%22%2C%22sessionIDPlacement%22%3A%22query%22%2C%22sessionKey%22%3A%22sid%22%2C%22sessionPlacement%22%3A%22query%22%2C%22uplinkHTTPMethod%22%3A%22DELETE%22%2C%22xPaddingBytes%22%3A%2248-256%22%2C%22xPaddingKey%22%3A%22q%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22query%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A0%2C%22hKeepAlivePeriod%22%3A20%2C%22hMaxRequestTimes%22%3A%22600-900%22%2C%22hMaxReusableSecs%22%3A%22120-240%22%2C%22maxConcurrency%22%3A0%2C%22maxConnections%22%3A%2216-32%22%7D%7D&fp=firefox&host=&mode=packet-up&path=%2Fp&security=tls&sni=${frontDomain}&type=xhttp&x_padding_bytes=48-256#HOST-FRONT`} language='http' />          
          <Typography component="p" gutterBottom>Ответ 400/404 от Xray при обычном запросе <InlineCode>curl</InlineCode> допустим: важнее, что нет DNS-, TLS-ошибки или 502 от Nginx. После подключения проверьте внешний IP — он должен совпадать с IP зарубежного VPS <InlineCode copy>{serverIp}</InlineCode>, тогда как в настройках клиента должен остаться домен хостинга <InlineCode copy>{frontDomain}</InlineCode>.</Typography>
        </Box>
      </Box>
    </>
  );
}
