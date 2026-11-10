export const generateRandomString = (length = 8) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const getRandomPlaceholderPhrase = () => {
  const stringsArray = [
    'Здесь скоро появится что-то новое.\nСайт находится в разработке.',
    'Что-то будет...\nСкоро.',
    'В данный момент сайт находится на стадии разработки.\nПожалуйста, зайдите позже.',
    'Сайт в разработке.\nПриносим извинения за временные неудобства.',
  ];
  const randomIndex = Math.floor(Math.random() * stringsArray.length);
  return stringsArray[randomIndex];
};

export function createPlaceholderHtml({ originHost, randomPhrase }: { originHost: string; randomPhrase: string }) {
  return `<!DOCTYPE html>
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
</html>`;
}

export function createNginxConfig({ inboundPort, originHost, xhttpPath, digit }: { inboundPort: string; originHost: string; xhttpPath: string; digit: number }) {
  return `upstream xray_xhttp {
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
}`;
}

export function createXhttpConfig({ inboundPort, xhttpPath, digit, randomString, cdnDomain }: { inboundPort: string; xhttpPath: string; digit: number; randomString: string; cdnDomain: string }) {
  return `{
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
}`;
}
