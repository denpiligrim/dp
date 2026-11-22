import { xhttpProxyLocation } from '../cdn-setup/templates';

export const ports = {
  site: { label: 'Порт сайта', initial: '8443' },
  reality: { label: 'Порт VLESS REALITY', initial: '11001' },
  xhttp: { label: 'Порт VLESS XHTTP', initial: '11002' },
  warp: { label: 'Порт VLESS REALITY WARP', initial: '11003' },
};
export type PortValues = Record<keyof typeof ports, string>;

export const firewall = `<sudo>ufw allow "\${SSH_CONNECTION##* }/tcp" &&
<sudo>ufw allow 80/tcp &&
<sudo>ufw allow 443/tcp &&
<sudo>ufw allow 443/udp &&
<sudo>ufw allow 2013/tcp &&
<sudo>ufw --force enable
<sudo>ufw status`;

export function relayScript(domain: string) {
  return `<sudo>apt update && <sudo>apt install -y rinetd ufw
<sudo>tee /etc/rinetd.conf >/dev/null <<'RULES'
0.0.0.0 80/tcp   ${domain} 80/tcp
0.0.0.0 443/tcp  ${domain} 443/tcp
0.0.0.0 443/udp  ${domain} 443/udp
0.0.0.0 2013/tcp ${domain} 2013/tcp
RULES
<sudo>systemctl enable rinetd
<sudo>systemctl restart rinetd
${firewall}`;
}

export function nginxConfig(domains: string[], p: PortValues) {
  return domains.map(domain => `server {
    listen 127.0.0.1:${p.site} ssl http2;
    listen 127.0.0.2:${p.site};
    server_name ${domain};
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

${xhttpProxyLocation('/xhttp/', '127.0.0.1:' + p.xhttp)}

    location / {
        root /var/www/self-steal;
        index index.html;
        try_files $uri $uri/ =404;
    }
}`).join('\n\n');
}

export function inboundTemplates(domains: string[], p: PortValues, shortId: string) {
  const host = domains[domains.length - 1];
  const endpoint = (forceTls: string) => [{ dest: host, port: 443, forceTls, remark: '' }];
  const vless = { clients: [], decryption: 'none', encryption: 'none' };
  const sniffing = { enabled: false };
  const rawChild = (port: string, path: string) => ({
    listen: '127.0.0.1', port: Number(port), protocol: 'vless', tag: `inbound-${port}`,
    settings: vless, sniffing,
    streamSettings: {
      network: 'tcp', security: 'none',
      tcpSettings: { header: { type: 'http', request: { method: 'GET', path: [path], headers: { Host: [host] } } } },
      externalProxy: endpoint('same'),
    },
  });
  const site = `127.0.0.2:${p.site}`;
  return {
    reality: rawChild(p.reality, '/reality'),
    xhttp: {
      listen: '127.0.0.1', port: Number(p.xhttp), protocol: 'vless', tag: `inbound-${p.xhttp}`,
      settings: vless, sniffing,
      streamSettings: {
        network: 'xhttp', security: 'none',
        xhttpSettings: { path: '/xhttp/', mode: 'packet-up', host },
        externalProxy: endpoint('tls'),
      },
    },
    warp: rawChild(p.warp, '/warp'),
    hy2: {
      listen: '0.0.0.0', port: 443, protocol: 'hysteria', tag: 'self-steal-hy2',
      settings: { version: 2, clients: [] }, sniffing,
      streamSettings: {
        network: 'hysteria', hysteriaSettings: { version: 2 }, security: 'tls',
        tlsSettings: {
          serverName: host, alpn: ['h3'],
          certificates: domains.map(name => ({
            certificateFile: `/etc/letsencrypt/live/${name}/fullchain.pem`,
            keyFile: `/etc/letsencrypt/live/${name}/privkey.pem`,
          })),
        },
        externalProxy: endpoint('tls'),
      },
    },
    main: {
      listen: '0.0.0.0', port: 443, protocol: 'vless', tag: 'self-steal-main',
      settings: { ...vless, fallbacks: [
        { dest: site, xver: 0 }, { path: '/xhttp/', dest: site, xver: 0 },
        { path: '/reality', dest: Number(p.reality), xver: 0 },
        { path: '/warp', dest: Number(p.warp), xver: 0 },
      ] }, sniffing,
      streamSettings: {
        network: 'tcp', security: 'reality',
        realitySettings: {
          target: `127.0.0.1:${p.site}`, serverNames: [host], shortIds: [shortId],
          privateKey: 'PRIVATE_KEY', settings: { publicKey: 'PUBLIC_KEY', fingerprint: 'chrome', serverName: host },
        },
        externalProxy: endpoint('same'),
      },
    },
  };
}
