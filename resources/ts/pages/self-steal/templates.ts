import mainTemplate from './vless_443.json';
import warpTemplate from './vless_warp.json';
import xhttpTemplate from './vless_xhttp.json';
import hy2Template from './hy2.json';

export const ports = {
  panel: { label: 'Порт панели' },
  subscription: { label: 'Порт подписки' },
  site: { label: 'Порт сайта' },
  xhttp: { label: 'Порт VLESS XHTTP' },
  warp: { label: 'Порт VLESS WARP' },
};
export type PortValues = Record<keyof typeof ports, string>;

export function randomPorts(): PortValues {
  const used = new Set<number>();
  const entries = Object.keys(ports).map(key => {
    let port: number;
    do { port = 8443 + Math.floor(Math.random() * 11558); } while (used.has(port));
    used.add(port);
    return [key, String(port)];
  });
  return Object.fromEntries(entries) as PortValues;
}

export const firewall = (subscription?: string) => `<sudo>ufw default deny incoming
<sudo>ufw default allow outgoing
<sudo>ufw allow "\${SSH_CONNECTION##* }/tcp"
<sudo>ufw allow 80/tcp
<sudo>ufw allow 80/udp
<sudo>ufw allow 443/tcp
<sudo>ufw allow 443/udp${subscription ? `\n<sudo>ufw allow ${subscription}/tcp` : ''}
<sudo>ufw --force enable
<sudo>ufw status`;

export function relayScript(ip: string, subscription?: string) {
  return `<sudo>env ORIGIN_IP="${ip}" FORWARDING_TCP_PORTS="80,443${subscription ? ',' + subscription : ''}" FORWARDING_UDP_PORTS="80,443" bash -c "$(curl -fsSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)"`;
}

export function nginxConfig(domains: string[], p: PortValues, xhttpPath: string, subscriptionPath?: string) {
  const origin = domains[0];
  const location = `    location ${xhttpPath}/ {
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
    }`;
  const servers = domains.map((name, i) => {
    const index = i === 0 ? 'index.html' : 'index_ru.html';
    return `server {
    listen 80;
    listen [::]:80;
    server_name ${name};

    return 301 https://$host$request_uri;
}

server {
    listen 127.0.0.1:${p.site} ssl;
    listen 127.0.0.2:${p.site};
    listen 127.0.2.2:${p.site};
    http2 on;
    server_name ${name};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_certificate /etc/letsencrypt/live/${name}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${name}/privkey.pem;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location = /static/media/live { return 404; }

${location}${subscriptionPath ? `

    location ^~ ${subscriptionPath} {
        proxy_pass http://xui_subscription;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Port 443;
    }` : ''}

    location / {
        root /var/www/${origin}/html;
        index ${index};
        try_files $uri $uri/ =404;
    }
}`;
  });
  return `upstream xray_xhttp {
    server 127.0.0.1:${p.xhttp};
    keepalive 128;
}

` + (subscriptionPath ? `upstream xui_subscription {
    server 127.0.0.1:${p.subscription};
}

` : '') + servers.join('\n\n');
}

export async function generateRealityCredentials() {
  const pair = await crypto.subtle.generateKey({ name: 'X25519' }, true, ['deriveBits']) as CryptoKeyPair;
  const jwk = await crypto.subtle.exportKey('jwk', pair.privateKey);
  if (!jwk.d || !jwk.x) throw new Error('X25519 key export failed');
  const hex = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), b => b.toString(16).padStart(2, '0')).join('');
  return { privateKey: jwk.d, publicKey: jwk.x, shortId: hex(), spiderX: '/' + hex() };
}
export type RealityCredentials = Awaited<ReturnType<typeof generateRealityCredentials>>;

export function randomInboundParameters() {
  return {
    warpPath: '/' + Math.random().toString(36).slice(2, 10),
    xhttpPath: '/static/media/live/segment' + Math.floor(Math.random() * 10) + '.ts',
    sessionIDTable: Math.random().toString(36).slice(2, 10) + '............',
  };
}

export function inboundTemplates(domains: string[], p: PortValues, password: string, parameters: ReturnType<typeof randomInboundParameters>, reality?: RealityCredentials, cdn = '') {
  const host = domains[domains.length - 1];
  const main = structuredClone(mainTemplate);
  const tls = main.streamSettings.tlsSettings;
  tls.serverName = host;
  tls.certificates = domains.map(name => ({
    ...tls.certificates[0],
    certificateFile: `/etc/letsencrypt/live/${name}/fullchain.pem`,
    keyFile: `/etc/letsencrypt/live/${name}/privkey.pem`,
  }));
  const hy2 = structuredClone(hy2Template);
  hy2.streamSettings.tlsSettings.serverName = host;
  hy2.streamSettings.tlsSettings.certificates = tls.certificates.slice(-1);
  hy2.streamSettings.finalmask.udp[0].settings.password = password;
  const xhttp = structuredClone(xhttpTemplate);
  xhttp.port = Number(p.xhttp);
  xhttp.tag = `in-${p.xhttp}-tcp`;
  xhttp.streamSettings.externalProxy[0].dest = host;
  xhttp.streamSettings.xhttpSettings.path = parameters.xhttpPath;
  xhttp.streamSettings.xhttpSettings.sessionIDTable = parameters.sessionIDTable;
  const warp = structuredClone(warpTemplate);
  warp.port = Number(p.warp);
  warp.tag = `in-${p.warp}-tcp`;
  warp.streamSettings.tcpSettings.header.request.path = [parameters.warpPath];
  const externalProxy = xhttp.streamSettings.externalProxy;
  if (cdn) xhttp.streamSettings.externalProxy = [{ ...externalProxy[0], dest: cdn, forceTls: 'tls' }];
  Object.assign(warp.streamSettings, { externalProxy });
  if (domains.length > 1) {
    Object.assign(main.streamSettings, { externalProxy });
    Object.assign(hy2.streamSettings, { externalProxy });
  }
  if (reality) {
    const { tlsSettings, ...stream } = main.streamSettings;
    const realityProxy = [{ ...externalProxy[0], forceTls: 'same' }];
    if (!cdn) xhttp.streamSettings.externalProxy = realityProxy;
    Object.assign(warp.streamSettings, { externalProxy: realityProxy });
    const realityMain = { ...main, streamSettings: {
      ...stream, security: 'reality',
      externalProxy: realityProxy,
      realitySettings: {
        target: `127.0.0.1:${p.site}`, xver: 0, serverNames: [host],
        privateKey: reality.privateKey, shortIds: [reality.shortId],
        settings: { publicKey: reality.publicKey, fingerprint: 'firefox', serverName: host, spiderX: reality.spiderX },
      },
    } };
    return { main: realityMain, warp, xhttp, hy2 };
  }
  return { main, warp, xhttp, hy2 };
}
