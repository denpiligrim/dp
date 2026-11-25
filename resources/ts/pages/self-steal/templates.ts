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

export const firewall = (subscription: string) => `<sudo>ufw default deny incoming
<sudo>ufw default allow outgoing
<sudo>ufw allow "\${SSH_CONNECTION##* }/tcp"
<sudo>ufw allow 80/tcp
<sudo>ufw allow 80/udp
<sudo>ufw allow 443/tcp
<sudo>ufw allow 443/udp
<sudo>ufw allow ${subscription}/tcp
<sudo>ufw --force enable
<sudo>ufw status`;

export function relayScript(ip: string, subscription: string) {
  return `<sudo>env ORIGIN_IP="${ip}" FORWARDING_TCP_PORTS="80,443,${subscription}" FORWARDING_UDP_PORTS="80,443" bash -c "$(curl -fsSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)"`;
}

export function nginxConfig(domains: string[], p: PortValues) {
  const origin = domains[0];
  const servers = domains.map((name, i) => {
    const index = i === 0 ? 'index.html' : 'index_ru.html';
    return `server {
    listen 80;
    listen [::]:80;
    server_name ${name};

    return 301 https://$host$request_uri;
}

server {
    listen 127.0.0.1:${p.site} ssl http2;
    listen 127.0.0.2:${p.site};
    listen 127.0.2.2:${p.site} http2;
    server_name ${name};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_certificate /etc/letsencrypt/live/${name}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${name}/privkey.pem;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location = /static/media/live { return 404; }

    location /static/media/live/segment9.ts/ {
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

` + servers.join('\n\n');
}

export function inboundTemplates(domains: string[], p: PortValues, password: string) {
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
  xhttp.streamSettings.xhttpSettings.path = '/static/media/live/segment' + Math.floor(Math.random() * 10) + '.ts';
  xhttp.streamSettings.xhttpSettings.sessionIDTable = Math.random().toString(36).slice(2, 10) + '............';
  const warp = structuredClone(warpTemplate);
  warp.port = Number(p.warp);
  warp.tag = `in-${p.warp}-tcp`;
  warp.streamSettings.tcpSettings.header.request.path = ['/' + Math.random().toString(36).slice(2, 10)];
  const externalProxy = xhttp.streamSettings.externalProxy;
  Object.assign(warp.streamSettings, { externalProxy });
  if (domains.length > 1) {
    Object.assign(main.streamSettings, { externalProxy });
    Object.assign(hy2.streamSettings, { externalProxy });
  }
  return { main, warp, xhttp, hy2 };
}
