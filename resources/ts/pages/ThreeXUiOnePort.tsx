import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import InfoIcon from '@mui/icons-material/Info';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CodeBlock from '../components/CodeBlock';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
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
      <SettingsEthernetIcon />
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
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

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

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Установка панели 3x-ui, настройка VLESS, Hysteria2." />
        <meta name="keywords" content="3x-ui, xray, vless, hysteria2, vpn guide" />
        <meta property="og:title" content="Подключения на одном порту в 3x-ui" />
        <meta property="og:description" content="Гайд по установке 3x-ui и настройке подключений." />
        <title>Подключения на одном порту в 3x-ui</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/3x-ui-one-port'} />
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
          Подключения на одном порту в 3x-ui
        </Typography>

        <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Гайд предполагает, что у вас уже есть сервер Ubuntu или Debian. Если у вас есть домен, заранее направьте домен на IP сервера.
        </Alert>

        <Card sx={{ mb: 4, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none' }}>
          <CardContent sx={{ p: '16px !important' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <YouTubeIcon sx={{ color: '#FF0000', fontSize: '2rem' }} />
                <Link
                  href="https://youtu.be/I_WjyKyhljo"
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

        <Paper sx={{ p: 3, mb: 5, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Вводные данные</Typography>
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
        </Paper>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Содержание</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              {[
                ['#install-panel', '1. Установка панели 3x-ui на сервер'],
                ['#create-inbound', '2. Создание подключений vless/hysteria'],
                ['#main-inbound', `3. Создание основного инбаунда на ${mainPort} порту`],
                ['#create-sub', '4. Создание подписки и добавление маршрутизации клиента'],
                ['#relay-server', '5. Настройка промежуточного сервера']
              ].map(([href, label]) => (
                <>
                  {!useRelay && href === '#relay-server' ? <></> : (
                    <ListItem key={href}>
                      <ListItemButton component="a" href={href} rel="noopener">
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  )}
                </>
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
                <ListItemButton component="a" href="https://github.com/MHSanaei/3x-ui" target="_blank" rel="noopener">
                  <ListItemIcon><LaunchIcon /></ListItemIcon>
                  <ListItemText primary="Репозиторий 3x-ui" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://github.com/denpiligrim/3dp-manager" target="_blank" rel="noopener">
                  <ListItemIcon><LaunchIcon /></ListItemIcon>
                  <ListItemText primary="Репозиторий 3DP-MANAGER" />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Box component="article">
          <Card sx={{ mt: 2, mb: 1, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IshostingIcon />
                <Link href="https://ishosting.io/affiliate/MjIwOSM4" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  Аренда зарубежного сервера
                </Link>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ mb: 1, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <BegetIcon />
                <Link href="https://beget.com/p1519472" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  Аренда RU сервера и домен
                </Link>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ mb: 4, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none' }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <FutureIcon />
                <Link href="https://t.me/futuresbp_bot?start=DenPiligrim" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  Обход Глушилок / Белых списков
                </Link>
              </Stack>
            </CardContent>
          </Card>

          <Typography id="install-panel" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Установка панели 3x-ui на сервер
          </Typography>
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

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="create-inbound" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Создание подключений vless/hysteria
          </Typography>
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

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="main-inbound" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            3. Создание основного инбаунда на {mainPort} порту
          </Typography>
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

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="create-sub" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            4. Создание подписки и добавление маршрутизации клиента
          </Typography>
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

          {useRelay && (
            <>
              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Typography id="relay-server" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                5. Настройка промежуточного сервера
              </Typography>
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
            </>
          )}
        </Box>
      </Box>
    </>
  );
}