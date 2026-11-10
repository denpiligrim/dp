import {
  GuideSeo,
  GuidePage,
  GuideBackLink,
  GuideHeader,
  GuideLayout,
  GuideSettings,
  GuideSection,
  GuideArticle,
  GuidePartnerLinks,
  GuideResources,
  GuideSupportFooter,
  GuideFaq,
  GuideCodeBlock as CodeBlock,
  GuideAlert as Alert,
  GuideValues as PreviewPanel,
} from '../components/guides';
import { useMemo, useState } from 'react';
import seo from '../../data/host-front-seo.json';
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';

import InlineCode from '../components/InlineCode';
import FutureIcon from '../svgIcons/FutureIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import IshostingIcon from '../svgIcons/IshostingIcon';

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

  const guideSteps = useMemo(() => [
    { id: "prepare", title: "Подготовьте сервер, хостинг и домен" },
    { id: "dns", title: "Создайте три DNS-записи" },
    { id: "hosting", title: "Настройте сайт, SSL и .htaccess на хостинге" },
    { id: "panel", title: "Создайте inbound в 3x-ui или Remnawave" },
    { id: "nginx", title: "Настройте TLS и Nginx на VPN-сервере" },
    { id: "client", title: "Добавьте подключение и проверьте цепочку" },
  ], []);

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="Host-front" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={guideSteps.length} settingsHref="#guide-settings" >
        <GuidePartnerLinks items={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", icon: <IshostingIcon />, sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", icon: <BegetIcon />, sponsored: true },
          { label: "Обход Глушилок / Белых списков", href: "https://t.me/futuresbp_bot?start=DenPiligrim", icon: <FutureIcon />, sponsored: true }
        ]} />
      </GuideHeader>
      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#guide-settings">
        <Box className="guide-notes"><Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 3 }}>
          Схема соединения: клиент → домен на хостинге → Apache/.htaccess → Nginx на VPN-сервере → локальный Xray-inbound.
        </Alert>
          <Alert severity="warning" sx={{ mb: 3 }}>
            IP shared-хостинга должен быть доступен в нужной вам сети, а тариф — поддерживать безлимитный трафик, HTTPS и проксирование через <b>mod_rewrite/mod_proxy</b>. Условия хостинга могут меняться — уточните их до оплаты.
          </Alert></Box>
        <GuideSettings title={"Параметры настройки Host-front"} layout="custom">
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
        </GuideSettings>
        <Box className="guide-dates"><Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary'>Дата: {new Date('08.14.2026').toLocaleDateString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary' sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('08.15.2026').toLocaleDateString()}</Typography>
          </Grid>
        </Grid></Box>
        <GuideArticle>

          <GuideSection steps={guideSteps} id="prepare">
            <Typography component="p" gutterBottom>Арендуйте зарубежный VPS с Ubuntu или Debian и сохраните его IP <InlineCode copy>{serverIp}</InlineCode>. Затем выберите shared-хостинг. Для этой схемы важны безлимитный трафик, SSL и поддержка директив Apache <InlineCode>RewriteRule</InlineCode> с флагом <InlineCode>[P]</InlineCode>.</Typography>
            <Typography component="p" gutterBottom>Купите домен в любой доступной зоне. Для доменов в некоторых национальных зонах регистратор может запросить идентификационные данные. Перед продолжением отдельно проверьте IP хостинга <InlineCode copy>{hostingIp}</InlineCode> из нужных мобильных сетей.</Typography>

          </GuideSection>
          <GuideSection steps={guideSteps} id="dns">
            <Typography component="p" gutterBottom>В DNS-зоне домена добавьте записи типа <InlineCode>A</InlineCode>:</Typography>
            <PreviewPanel rows={[[originDomain, serverIp], [frontDomain, hostingIp], [panelDomain, serverIp]]} />
            <Typography component="p" gutterBottom><b>Origin</b> принимает трафик от хостинга, <b>front</b> указывается в VPN-клиенте, а отдельный домен панели нужен только для управления. Дождитесь обновления DNS и проверьте записи:</Typography>
            <CodeBlock code={`nslookup ${originDomain}\nnslookup ${frontDomain}\nnslookup ${panelDomain}`} />

          </GuideSection>
          <GuideSection steps={guideSteps} id="hosting">
            <Typography component="p" gutterBottom>В панели хостинга создайте сайт для <InlineCode copy>{frontDomain}</InlineCode>. Уберите ненужные псевдонимы, отключите кэширование и, при необходимости, журналы запросов. Выпустите бесплатный Let&apos;s Encrypt-сертификат и убедитесь, что <InlineCode copy>{`https://${frontDomain}`}</InlineCode> открывается.</Typography>
            <Typography component="p" gutterBottom>Откройте файловый менеджер, перейдите в корневой каталог сайта и вручную создайте файл <InlineCode>.htaccess</InlineCode>. Вставьте в него:</Typography>
            <CodeBlock code={rewriteRule} language="apache" />
            <Alert severity="info" sx={{ mb: 2 }}>Путь в правиле должен полностью совпадать с путём XHTTP-inbound. Файл должен называться именно <b>.htaccess</b>, без расширения <b>.txt</b>.</Alert>
            <Alert severity="warning">Если сервер отвечает 500 или правило не проксирует запрос, уточните в условиях хостинга, разрешены ли <b>mod_proxy</b> и флаг <b>[P]</b> на вашем тарифе. Без серверного reverse proxy эта схема не заработает.</Alert>

          </GuideSection>
          <GuideSection steps={guideSteps} id="panel">
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="nginx">
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="client">
            <Typography component="p" gutterBottom>В клиенте, поддерживающем VLESS XHTTP, создайте профиль со следующими параметрами:</Typography>
            <CodeBlock code={`vless://${clientId}@${frontDomain}:443?alpn=h2&extra=%7B%22mode%22%3A%22packet-up%22%2C%22scMaxEachPostBytes%22%3A%22262144-786432%22%2C%22scMinPostsIntervalMs%22%3A%220%22%2C%22seqKey%22%3A%22offset%22%2C%22seqPlacement%22%3A%22query%22%2C%22sessionIDKey%22%3A%22sid%22%2C%22sessionIDPlacement%22%3A%22query%22%2C%22sessionKey%22%3A%22sid%22%2C%22sessionPlacement%22%3A%22query%22%2C%22uplinkHTTPMethod%22%3A%22DELETE%22%2C%22xPaddingBytes%22%3A%2248-256%22%2C%22xPaddingKey%22%3A%22q%22%2C%22xPaddingMethod%22%3A%22tokenish%22%2C%22xPaddingObfsMode%22%3Atrue%2C%22xPaddingPlacement%22%3A%22query%22%2C%22xmux%22%3A%7B%22cMaxReuseTimes%22%3A0%2C%22hKeepAlivePeriod%22%3A20%2C%22hMaxRequestTimes%22%3A%22600-900%22%2C%22hMaxReusableSecs%22%3A%22120-240%22%2C%22maxConcurrency%22%3A0%2C%22maxConnections%22%3A%2216-32%22%7D%7D&fp=firefox&host=&mode=packet-up&path=%2Fp&security=tls&sni=${frontDomain}&type=xhttp&x_padding_bytes=48-256#HOST-FRONT`} language='http' />
            <Typography component="p" gutterBottom>Ответ 400/404 от Xray при обычном запросе <InlineCode>curl</InlineCode> допустим: важнее, что нет DNS-, TLS-ошибки или 502 от Nginx. После подключения проверьте внешний IP — он должен совпадать с IP зарубежного VPS <InlineCode copy>{serverIp}</InlineCode>, тогда как в настройках клиента должен остаться домен хостинга <InlineCode copy>{frontDomain}</InlineCode>.</Typography>

          </GuideSection>
          <GuideFaq items={seo.faq} title={"Вопросы об установке и настройке Host-front"} />

        </GuideArticle>
        <GuideResources links={[]} moreLinks={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", sponsored: true },
          { label: "Подписка Amnezia Premium с 15% скидкой", href: "https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM", sponsored: true },
          { label: "Хостинг REG.RU", href: "https://www.reg.ru/hosting/?rlink=reflink-32217889", sponsored: false },
          { label: "Бот для проверки IP/домена", href: "https://t.me/bschekbot?start=ref_kscjmjyf", sponsored: true }
        ]} />
        <GuideSupportFooter />
      </GuideLayout>

    </GuidePage>
  );
}
