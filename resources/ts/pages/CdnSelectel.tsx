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
import seo from '../../data/cdn-selectel-seo.json';
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';

import InlineCode from '../components/InlineCode';

import IshostingIcon from '../svgIcons/IshostingIcon';

import SelectelIcon from '../svgIcons/SelectelIcon';
import GikIcon from '../svgIcons/GikIcon';

export default function CdnSelectel() {
  const [originHost, setOriginHost] = useState('example.com');
  const [cdnDomain, setCdnDomain] = useState('example.selcdn.net');
  const [inboundPort, setInboundPort] = useState('2053');
  const [xhttpPath, setXhttpPath] = useState('/api/uploadFile/');
  const [xuiPort, setXuiPort] = useState('2222');
  const [useSudo, setUseSudo] = useState(false);

  const normalizedPath = xhttpPath.startsWith('/') ? xhttpPath : `/${xhttpPath}`;

  const guideSteps = useMemo(() => [
    { id: "domains", title: "Создание поддоменов и DNS записей" },
    { id: "ssl-cert", title: "Установка SSL-сертификата Let's Encrypt через Certbot" },
    { id: "website", title: "Установка сайта-заглушки и прокси nginx" },
    { id: "cdn-resource", title: "Создание CDN ресурса" },
    { id: "3x-ui", title: "Установка Xray и панели управления 3x-ui" },
    { id: "xhttp-inbound", title: "Настройка VLESS XHTTP в 3x-ui" },
    { id: "client-data", title: "Подключение клиента" },
  ], []);

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="CDN Selectel" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={guideSteps.length} settingsHref="#guide-settings" videoUrl="https://youtu.be/-JrL-F-l86E">
        <GuidePartnerLinks items={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", icon: <IshostingIcon />, sponsored: true },
          { label: "CDN на Selectel", href: "https://selectel.ru/?ref_code=b25e58bc73", icon: <SelectelIcon />, sponsored: true },
          { label: "ВПН для WI-Fi и мобильного интернета", href: "https://t.me/Gik_VPN_Bot?start=ref9I0EryhK", icon: <GikIcon />, sponsored: true }
        ]} />
      </GuideHeader>
      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#guide-settings">
        <Box className="guide-notes"><Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Инструкция показана на примере панели 3x-ui
        </Alert></Box>
        <GuideSettings title={"Параметры настройки CDN Selectel"} layout="custom">
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
        </GuideSettings>
        <Box className="guide-dates"><Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary'>Дата: {new Date('09.05.2026').toLocaleDateString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary' sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('09.09.2026').toLocaleDateString()}</Typography>
          </Grid>
        </Grid></Box>
        <GuideArticle>

          <GuideSection steps={guideSteps} id="domains">
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="ssl-cert">
            <Typography component="p" gutterBottom>
              Прежде чем начать, обновите пакеты на сервере:
            </Typography>
            <CodeBlock code={`<sudo>apt update && <sudo>apt upgrade -y`} sudo={useSudo} />

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Установка Certbot
            </Typography>
            <Typography component="p" gutterBottom>
              Установите Snap и Certbot. Убедитесь, что у вас открыт и свободен 80 порт — это обязательное условие для успешного выпуска сертификата.
            </Typography>
            <CodeBlock code={`<sudo>apt install snapd\n<sudo>snap install --classic certbot\n<sudo>ln -s /snap/bin/certbot /usr/local/bin/certbot`} sudo={useSudo} />

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="website">

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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

    location = ${xhttpPath.replace(/\/$/, '')} { return 404; }

    location ${xhttpPath} {
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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="cdn-resource">
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="3x-ui">
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="xhttp-inbound">
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="client-data">
            <Typography component="p" gutterBottom>
              После создания клиента вы можете открыть информацию о клиенте и скопировать ссылку на подписку или ключ и вставить содержимое в приложение INCY или другие, поддерживающие последнии версии ядра Xray.
            </Typography>

          </GuideSection>
          <GuideFaq items={seo.faq} title={"Вопросы о настройке CDN Selectel"} />

        </GuideArticle>
        <GuideResources links={[]} moreLinks={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", sponsored: true },
          { label: "CDN на Selectel", href: "https://selectel.ru/?ref_code=b25e58bc73", sponsored: true },
          { label: "Виртуальные сервера и домены", href: "https://beget.com/p1519472/cloud/cdn", sponsored: true },
          { label: "ВПН сервис с обходом белых списков", href: "https://t.me/futuresbp_bot?start=DenPiligrim", sponsored: true },
          { label: "Подписка Amnezia Premium с 15% скидкой", href: "https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM", sponsored: true }
        ]} />
        <GuideSupportFooter />
      </GuideLayout>

    </GuidePage>
  );
}
