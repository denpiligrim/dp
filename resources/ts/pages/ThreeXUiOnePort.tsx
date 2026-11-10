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
import seo from '../../data/3x-ui-one-port-seo.json';
import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';

import InlineCode from '../components/InlineCode';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';

import GikIcon from '../svgIcons/GikIcon';

export default function ThreeXUiOnePort() {
  const [useSudo, setUseSudo] = useState(false);
  const [useRelay, setUseRelay] = useState(false);
  const [installVersion, setInstallVersion] = useState('latest');
  const [customVersion, setCustomVersion] = useState('2.9.4');
  const [activeConnectionTab, setActiveConnectionTab] = useState(0);
  const [vpnDomain, setVpnDomain] = useState('');
  const [relayHost, setRelayHost] = useState('relay.example.com');
  const [serverIp, setServerIp] = useState('1.1.1.1');
  const [mainPort, setMainPort] = useState('443');
  const [xuiPort, setXuiPort] = useState('2222');

  const hy2ObfsPass = Math.random().toString(36).slice(-10);

  const inboundRows = {
    vless: [
      ['Протокол', 'vless'],
      ['Адрес', '127.0.0.1'],
      ['Стратегия адреса для ссылок', useRelay ? relayHost : 'default'],
      ['Порт', '2026'],
      ['Транспорт', 'TCP (RAW)'],
      ['Безопасность', 'none']
    ],
    vless443: [
      ['Протокол', 'vless'],
      ['Стратегия адреса для ссылок', useRelay ? relayHost : 'default'],
      ['Порт', mainPort],
      ['Fallback', 'vless-2026'],
      ['Транспорт', 'TCP (RAW)'],
      ['Безопасность', 'TLS'],
      ['SNI', vpnDomain || serverIp],
      ['uTLS', 'firefox'],
      ['Путь к сертификату (SSL)', 'Установить сертификат панели']
    ],
    hysteria: [
      ['Протокол', 'hysteria2'],
      ['Стратегия адреса для ссылок', useRelay ? relayHost : 'default'],
      ['Порт', '8443'],
      ['Masquerade', '404'],
      ['SNI', vpnDomain || serverIp],
      ['uTLS', 'firefox'],
      ['Путь к сертификату (SSL)', 'Установить сертификат панели']
    ]
  };

  const versionCommand = installVersion === 'latest'
    ? 'bash <(curl -Ls https://raw.githubusercontent.com/MHSanaei/3x-ui/master/install.sh)'
    : `VERSION=v${customVersion} && bash <(curl -Ls "https://raw.githubusercontent.com/MHSanaei/3x-ui/$VERSION/install.sh") $VERSION`;

  const inboundType = activeConnectionTab === 0 ? 'vless' : 'hysteria';

  const guideSteps = useMemo(() => [
    { id: "install-panel", title: "Установка панели 3x-ui на сервер" },
    { id: "create-inbound", title: "Создание подключений vless/hysteria" },
    { id: "main-inbound", title: [" 3. Создание основного инбаунда на ", mainPort, " порту "].join('').replace(/^\s*\d+\.\s*/, '').trim() },
    { id: "create-sub", title: "Создание подписки и добавление маршрутизации клиента" },
    ...(useRelay ? [{ id: "relay-server", title: "Настройка промежуточного сервера" }] : []),
  ], [mainPort, useRelay]);

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="3x-ui: подключения на одном порту" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={guideSteps.length} settingsHref="#guide-settings" videoUrl="https://youtu.be/I_WjyKyhljo">
        <GuidePartnerLinks items={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", icon: <IshostingIcon />, sponsored: true },
          { label: "Аренда RU сервера и домен", href: "https://beget.com/p1519472", icon: <BegetIcon />, sponsored: true },
          { label: "ВПН для WI-Fi и мобильного интернета", href: "https://t.me/Gik_VPN_Bot?start=ref9I0EryhK", icon: <GikIcon />, sponsored: true }
        ]} />
      </GuideHeader>
      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#guide-settings">
        <Box className="guide-notes"><Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Гайд предполагает, что у вас уже есть сервер Ubuntu или Debian. Если у вас есть домен, заранее направьте домен на IP сервера.
        </Alert></Box>
        <GuideSettings title={"Параметры настройки 3x-ui"} layout="custom">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="IP сервера" value={serverIp} onChange={(e) => setServerIp(e.target.value.trim())} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Домен сервера (опционально)" value={vpnDomain} onChange={(e) => setVpnDomain(e.target.value.trim().toLowerCase())} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Версия 3x-ui</InputLabel>
                <Select value={installVersion} label="Версия 3x-ui" onChange={(e) => setInstallVersion(e.target.value)}>
                  <MenuItem value="latest">Последняя версия</MenuItem>
                  <MenuItem value="custom">Указать версию вручную</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {installVersion === 'custom' && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Номер версии" value={customVersion} onChange={(e) => setCustomVersion(e.target.value.trim())} placeholder="2.9.4" />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Порт для подключений" placeholder='443' value={mainPort} onChange={(e) => setMainPort(e.target.value.trim().toLowerCase())} />
            </Grid>
            <Grid size={{ xs: 12, md: useRelay ? 6 : 12 }}>
              <FormControlLabel
                control={<Checkbox checked={useRelay} onChange={(e) => setUseRelay(e.target.checked)} color="primary" />}
                label={<Typography fontWeight="medium">Использовать <b>промежуточный</b> сервер</Typography>}
              />
            </Grid>
            {useRelay && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="IP адрес/домен промежуточного" value={relayHost} onChange={(e) => setRelayHost(e.target.value.trim())} />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={<Checkbox checked={useSudo} onChange={(e) => setUseSudo(e.target.checked)} color="primary" />}
                label={<Typography fontWeight="medium">Использовать <b>sudo</b> в командах</Typography>}
              />
            </Grid>
          </Grid>
        </GuideSettings>

        <GuideArticle>

          <GuideSection steps={guideSteps} id="install-panel">
            <Typography component="p" gutterBottom>
              Подключитесь к серверу командой <InlineCode copy>{`ssh root@${serverIp}`}</InlineCode>, обновите систему и установите необходимые пакеты.
            </Typography>
            <CodeBlock code={`<sudo>apt update && <sudo>apt upgrade -y`} sudo={useSudo} />
            <Typography component="p" gutterBottom>
              Установите выбранную версию панели. По умолчанию используется последняя версия из основного репозитория.
            </Typography>
            <CodeBlock code={`<sudo>${versionCommand}`} sudo={useSudo} />
            <Typography component="p" gutterBottom>
              Во время установки задайте порт панели, выберите базу данных, параметр установки сертификатов. После установки вы увидите ссылку на панель и доступы. Дополнительные параметры управления вы можете увидеть, выполнив команду <InlineCode copy>x-ui</InlineCode>.
            </Typography>
            <Typography component="p" gutterBottom>
              Если у вас на сервере настроен файрвол, то обязательно включите порт панели:
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
            <CodeBlock code={`<sudo>ufw allow ${xuiPort}/tcp\n<sudo>ufw allow ${mainPort}/tcp\n<sudo>ufw allow 8443/udp`} sudo={useSudo} />

          </GuideSection>
          <GuideSection steps={guideSteps} id="create-inbound">
            <Typography component="p" gutterBottom>
              Создайте инбаунд в разделе Подключения, указав основные параметры (остальное можно оставить по умолчанию):
            </Typography>
            <Tabs value={activeConnectionTab} onChange={(e, newValue) => setActiveConnectionTab(newValue)} variant="fullWidth" textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
              <Tab label="VLESS TCP" />
              <Tab label="Hysteria2" />
            </Tabs>
            <PreviewPanel title={`Обязательные параметры: ${activeConnectionTab === 0 ? 'VLESS TCP' : 'Hysteria2'}`} rows={inboundRows[inboundType]} />
            {activeConnectionTab === 0 ? (
              <>
                <CodeBlock code={`{
  "listen": "127.0.0.1",
  "port": 2026,
  "protocol": "vless",
  "tag": "in-2026-tcp",
  "settings": {
    "clients": [],
    "decryption": "none",
    "encryption": "none",
    "testseed": [
      900,
      500,
      900,
      256
    ]
  },
  "sniffing": {
    "enabled": false
  },
  "streamSettings": {
    "network": "tcp",
    "tcpSettings": {
      "acceptProxyProtocol": true,
      "header": {
        "type": "none"
      }
    },
    "security": "none"
  }
}`} language='json' />
              </>
            ) : (
              <>
                <CodeBlock code={`{
  "listen": "",
  "port": 8443,
  "protocol": "hysteria",
  "tag": "in-8443-udp",
  "settings": {
    "clients": [],
    "version": 2
  },
  "sniffing": {
    "enabled": false
  },
  "streamSettings": {
    "network": "hysteria",
    "hysteriaSettings": {
      "version": 2,
      "udpIdleTimeout": 60,
      "masquerade": {
        "type": "",
        "dir": "",
        "url": "",
        "rewriteHost": false,
        "insecure": false,
        "content": "",
        "headers": {},
        "statusCode": 0
      }
    },
    "security": "tls",
    "tlsSettings": {
      "serverName": "${serverIp}",
      "minVersion": "1.2",
      "maxVersion": "1.3",
      "cipherSuites": "",
      "rejectUnknownSni": false,
      "disableSystemRoot": false,
      "enableSessionResumption": false,
      "certificates": [
        {
          "certificateFile": "/root/cert/ip/fullchain.pem",
          "keyFile": "/root/cert/ip/privkey.pem",
          "ocspStapling": 0,
          "oneTimeLoading": false,
          "usage": "encipherment",
          "buildChain": false,
          "useFile": true
        }
      ],
      "alpn": [
        "h3",
        "h2",
        "http/1.1"
      ],
      "echServerKeys": "",
      "settings": {
        "fingerprint": "firefox",
        "echConfigList": "",
        "pinnedPeerCertSha256": [],
        "verifyPeerCertByName": ""
      }
    },
    "finalmask": {
      "udp": [
        {
          "type": "salamander",
          "settings": {
            "password": "${hy2ObfsPass}"
          }
        }
      ]
    }
  }
}`} language='json' />
              </>
            )}

          </GuideSection>
          <GuideSection steps={guideSteps} id="main-inbound">
            <Typography component="p" gutterBottom>
              Добавьте основной инбаунд на сервер.
            </Typography>
            <PreviewPanel title={`Обязательные параметры: VLESS TCP TLS`} rows={inboundRows['vless443']} />
            <CodeBlock code={`{
  "listen": "",
  "port": ${mainPort},
  "protocol": "vless",
  "tag": "in-${mainPort}-tcp",
  "settings": {
    "clients": [],
    "decryption": "none",
    "encryption": "none",
    "testseed": [
      900,
      500,
      900,
      256
    ]
  },
  "sniffing": {
    "enabled": false
  },
  "streamSettings": {
    "network": "tcp",
    "tcpSettings": {
      "acceptProxyProtocol": false,
      "header": {
        "type": "none"
      }
    },
    "security": "tls",
    "tlsSettings": {
      "serverName": "${serverIp}",
      "minVersion": "1.2",
      "maxVersion": "1.3",
      "cipherSuites": "",
      "rejectUnknownSni": false,
      "disableSystemRoot": false,
      "enableSessionResumption": false,
      "certificates": [
        {
          "certificateFile": "/root/cert/ip/fullchain.pem",
          "keyFile": "/root/cert/ip/privkey.pem",
          "ocspStapling": 0,
          "oneTimeLoading": false,
          "usage": "encipherment",
          "buildChain": false,
          "useFile": true
        }
      ],
      "alpn": [
        "h2",
        "http/1.1"
      ],
      "echServerKeys": "",
      "settings": {
        "fingerprint": "firefox",
        "echConfigList": "",
        "pinnedPeerCertSha256": [],
        "verifyPeerCertByName": ""
      }
    }
  }
}`} language='json' />

          </GuideSection>
          <GuideSection steps={guideSteps} id="create-sub">
            <Typography component="p" gutterBottom>
              В разделе Клиенты добавьте нового клиента и выберите ранее созданные подключения.
            </Typography>
            <Typography component="p" gutterBottom>
              Далее перейдите в Настройки панели {'>'} Подписки. Во вкладке Happ добавьте профиль маршрутизации happ://routing:
            </Typography>
            <CodeBlock code='happ://routing/add/ewogICAgIkJsb2NrSXAiOiBbCiAgICBdLAogICAgIkJsb2NrU2l0ZXMiOiBbCiAgICBdLAogICAgIkRpcmVjdElwIjogWwogICAgICAgICIxMC4wLjAuMC84IiwKICAgICAgICAiMTcyLjE2LjAuMC8xMiIsCiAgICAgICAgIjE5Mi4xNjguMC4wLzE2IiwKICAgICAgICAiMTY5LjI1NC4wLjAvMTYiLAogICAgICAgICIyMjQuMC4wLjAvNCIsCiAgICAgICAgIjI1NS4yNTUuMjU1LjI1NSIsCiAgICAgICAgImdlb2lwOlJVIgogICAgXSwKICAgICJEaXJlY3RTaXRlcyI6IFsKICAgICAgICAiZ2Vvc2l0ZTpDQVRFR09SWS1SVSIKICAgIF0sCiAgICAiRG5zSG9zdHMiOiB7CiAgICAgICAgImNsb3VkZmxhcmUtZG5zLmNvbSI6ICIxLjEuMS4xIiwKICAgICAgICAiZG5zLmdvb2dsZSI6ICI4LjguOC44IgogICAgfSwKICAgICJEb21haW5TdHJhdGVneSI6ICJJUElmTm9uTWF0Y2giLAogICAgIkRvbWVzdGljRE5TRG9tYWluIjogImh0dHBzOi8vZG5zLmdvb2dsZS9kbnMtcXVlcnkiLAogICAgIkRvbWVzdGljRE5TSVAiOiAiOC44LjguOCIsCiAgICAiRG9tZXN0aWNETlNUeXBlIjogIkRvSCIsCiAgICAiRmFrZUROUyI6ICJmYWxzZSIsCiAgICAiR2VvaXB1cmwiOiAiaHR0cHM6Ly9naXRodWIuY29tL0xveWFsc29sZGllci92MnJheS1ydWxlcy1kYXQvcmVsZWFzZXMvbGF0ZXN0L2Rvd25sb2FkL2dlb2lwLmRhdCIsCiAgICAiR2Vvc2l0ZXVybCI6ICJodHRwczovL2dpdGh1Yi5jb20vTG95YWxzb2xkaWVyL3YycmF5LXJ1bGVzLWRhdC9yZWxlYXNlcy9sYXRlc3QvZG93bmxvYWQvZ2Vvc2l0ZS5kYXQiLAogICAgIkdsb2JhbFByb3h5IjogInRydWUiLAogICAgIkxhc3RVcGRhdGVkIjogMTc3NTgyODUxNCwKICAgICJOYW1lIjogIlJVIiwKICAgICJQcm94eUlwIjogWwogICAgXSwKICAgICJQcm94eVNpdGVzIjogWwogICAgXSwKICAgICJSZW1vdGVETlNEb21haW4iOiAiaHR0cHM6Ly9jbG91ZGZsYXJlLWRucy5jb20vZG5zLXF1ZXJ5IiwKICAgICJSZW1vdGVETlNJUCI6ICIxLjEuMS4xIiwKICAgICJSZW1vdGVETlNUeXBlIjogIkRvSCIsCiAgICAiUm91dGVPcmRlciI6ICJibG9jay1kaXJlY3QtcHJveHkiCn0K' language='http' />
            <Typography component="p" gutterBottom>
              Во вкладке Incy добавьте профиль маршрутизации incy://routing:
            </Typography>
            <CodeBlock code='incy://routing/add/ewogICAgIkJsb2NrSXAiOiBbCiAgICBdLAogICAgIkJsb2NrU2l0ZXMiOiBbCiAgICBdLAogICAgIkRpcmVjdElwIjogWwogICAgICAgICIxMC4wLjAuMC84IiwKICAgICAgICAiMTcyLjE2LjAuMC8xMiIsCiAgICAgICAgIjE5Mi4xNjguMC4wLzE2IiwKICAgICAgICAiMTY5LjI1NC4wLjAvMTYiLAogICAgICAgICIyMjQuMC4wLjAvNCIsCiAgICAgICAgIjI1NS4yNTUuMjU1LjI1NSIsCiAgICAgICAgImdlb2lwOlJVIgogICAgXSwKICAgICJEaXJlY3RTaXRlcyI6IFsKICAgICAgICAiZ2Vvc2l0ZTpDQVRFR09SWS1SVSIKICAgIF0sCiAgICAiRG5zSG9zdHMiOiB7CiAgICAgICAgImNsb3VkZmxhcmUtZG5zLmNvbSI6ICIxLjEuMS4xIiwKICAgICAgICAiZG5zLmdvb2dsZSI6ICI4LjguOC44IgogICAgfSwKICAgICJEb21haW5TdHJhdGVneSI6ICJJUElmTm9uTWF0Y2giLAogICAgIkRvbWVzdGljRE5TRG9tYWluIjogImh0dHBzOi8vZG5zLmdvb2dsZS9kbnMtcXVlcnkiLAogICAgIkRvbWVzdGljRE5TSVAiOiAiOC44LjguOCIsCiAgICAiRG9tZXN0aWNETlNUeXBlIjogIkRvSCIsCiAgICAiRmFrZUROUyI6ICJmYWxzZSIsCiAgICAiR2VvaXB1cmwiOiAiaHR0cHM6Ly9naXRodWIuY29tL0xveWFsc29sZGllci92MnJheS1ydWxlcy1kYXQvcmVsZWFzZXMvbGF0ZXN0L2Rvd25sb2FkL2dlb2lwLmRhdCIsCiAgICAiR2Vvc2l0ZXVybCI6ICJodHRwczovL2dpdGh1Yi5jb20vTG95YWxzb2xkaWVyL3YycmF5LXJ1bGVzLWRhdC9yZWxlYXNlcy9sYXRlc3QvZG93bmxvYWQvZ2Vvc2l0ZS5kYXQiLAogICAgIkdsb2JhbFByb3h5IjogInRydWUiLAogICAgIkxhc3RVcGRhdGVkIjogMTc3NTgyODUxNCwKICAgICJOYW1lIjogIlJVIiwKICAgICJQcm94eUlwIjogWwogICAgXSwKICAgICJQcm94eVNpdGVzIjogWwogICAgXSwKICAgICJSZW1vdGVETlNEb21haW4iOiAiaHR0cHM6Ly9jbG91ZGZsYXJlLWRucy5jb20vZG5zLXF1ZXJ5IiwKICAgICJSZW1vdGVETlNJUCI6ICIxLjEuMS4xIiwKICAgICJSZW1vdGVETlNUeXBlIjogIkRvSCIsCiAgICAiUm91dGVPcmRlciI6ICJibG9jay1kaXJlY3QtcHJveHkiCn0K' language='http' />
            <Typography component="p" gutterBottom>
              Сохраните и перезапустите панель. После снова перейдите в раздел Клиенты и скопируйте ссылку на подписку. Вставьте ссылку в приложение Happ или Incy и проверьте подключение.
            </Typography>

          </GuideSection>
          {useRelay && (
            <>

              <GuideSection steps={guideSteps} id="relay-server">
                <Typography component="p" gutterBottom>
                  Подключитесь к промежуточному серверу командой <InlineCode copy>{`ssh root@${relayHost || 'IP_ADDRESS'}`}</InlineCode>. Выполните установку перенаправления на сервере, указав IP <InlineCode>{serverIp}</InlineCode> основного сервера.
                </Typography>
                <CodeBlock code={`<sudo>ORIGIN_IP="${serverIp}" bash -c "$(curl -sSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)"`} sudo={useSudo} />

                <Typography component="p" gutterBottom>
                  После установки перенаправления вы можете отредактировать порты, которые будут перенаправляться. Откройте файл в редакторе:
                </Typography>
                <CodeBlock code={`<sudo>nano /etc/ufw/before.rules`} sudo={useSudo} />

                <Typography component="p" gutterBottom>
                  Отредактируйте 2 строки для транспорта TCP и UDP, указав нужные порты. Например:
                </Typography>
                <CodeBlock code={`-A PREROUTING -p tcp -m multiport --dports ${mainPort},8443 -j DNAT --to-destination $ORIGIN_IP\n-A PREROUTING -p udp -m multiport --dports ${mainPort},8443 -j DNAT --to-destination $ORIGIN_IP`} language="shell" />
                <Typography component="p" gutterBottom>
                  Выйти и сохранить изменения: <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl+X</InlineCode>
                </Typography>

                <Typography component="p" gutterBottom>
                  Далее перезапустите файрвол <InlineCode copy>ufw reload</InlineCode> и систему <InlineCode copy>reboot</InlineCode>.
                </Typography>
              </GuideSection>
            </>
          )}

          <GuideFaq items={seo.faq} title={"Вопросы о настройке 3x-ui на одном порту"} />

        </GuideArticle>
        <GuideResources links={[]} moreLinks={[
          { label: "Репозиторий 3x-ui", href: "https://github.com/MHSanaei/3x-ui", sponsored: false },
          { label: "Репозиторий 3DP-MANAGER", href: "https://github.com/denpiligrim/3dp-manager", sponsored: false }
        ]} />
        <GuideSupportFooter />
      </GuideLayout>

    </GuidePage>
  );
}
