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
import RouteIcon from '@mui/icons-material/Route';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TokenIcon from '@mui/icons-material/Token';
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

const generateHexSecret = (len: number) => {
  const array = new Uint8Array(len);
  window.crypto.getRandomValues(array);

  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const inboundRows = {
  vless: [
    ['Примечание', 'my-inbound'],
    ['Протокол', 'vless'],
    ['Порт', '443'],
    ['Flow', 'xtls-rprx-vision'],
    ['Транспорт', 'TCP (RAW)'],
    ['Безопасность', 'reality'],
    ['uTLS', 'chrome'],
    ['Target', 'yastatic.net:443'],
    ['SNI', 'yastatic.net'],
  ],
  hysteria: [
    ['Протокол', 'hysteria2'],
    ['Порт', '8443'],
    ['Masquerade (Proxy)', 'https://google.com'],
    ['Insecure', 'включен'],
    ['UDP Mask (salamander)', generateHexSecret(4)],
    ['SNI', 'vpn.example.com'],
    ['uTLS', 'chrome'],
    ['Путь к сертификату (SSL)', 'Установить сертификат панели'],
  ]
};

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

export default function ThreeXUiInstall() {
  const [useSudo, setUseSudo] = useState(false);
  const [installVersion, setInstallVersion] = useState('latest');
  const [customVersion, setCustomVersion] = useState('2.9.4');
  const [activeConnectionTab, setActiveConnectionTab] = useState(0);
  const [panelDomain, setPanelDomain] = useState('panel.example.com');
  const [vpnDomain, setVpnDomain] = useState('vpn.example.com');
  const [serverIp, setServerIp] = useState('1.1.1.1');
  const [relayIp, setRelayIp] = useState('2.2.2.2');
  const [xuiPort, setXuiPort] = useState('2222');
  const [managerToken, setManagerToken] = useState('node-token-from-3dp-manager');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

  const versionCommand = installVersion === 'latest'
    ? 'bash <(curl -Ls https://raw.githubusercontent.com/MHSanaei/3x-ui/master/install.sh)'
    : `VERSION=v${customVersion} && bash <(curl -Ls "https://raw.githubusercontent.com/MHSanaei/3x-ui/$VERSION/install.sh") $VERSION`;

  const inboundType = activeConnectionTab === 0 ? 'vless' : 'hysteria';

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Установка панели 3x-ui, настройка VLESS, Hysteria2, Warp, нод и 3DP-MANAGER." />
        <meta name="keywords" content="3x-ui, xray, vless, hysteria2, warp, 3dp-manager, vpn guide" />
        <meta property="og:title" content="Установка панели 3x-ui" />
        <meta property="og:description" content="Гайд по установке 3x-ui и настройке подключений, Warp, нод и 3DP-MANAGER." />
        <title>Установка панели 3x-ui</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/3x-ui-install'} />
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
          Установка панели 3x-ui
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
                  href="https://youtu.be/vm1Rmq218bU"
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
              <TextField fullWidth label="Домен сервера" value={vpnDomain} onChange={(e) => setVpnDomain(e.target.value.trim().toLowerCase())} />
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
                ['#create-inbound', '2. Создание подключения'],
                ['#manager', '3. Менеджер подписок 3DP-MANAGER']
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
                <Link href="https://ishosting.io/affiliate/MjIwOSM2" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>
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
            Во время установки задайте порт панели, выберите параметр установки сертификатов. После установки вы увидите ссылку на панель и доступы. Дополнительные параметры управления вы можете увидеть, выполнив команду <InlineCode copy>x-ui</InlineCode>.
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
          <CodeBlock code={`<sudo>ufw allow ${xuiPort}/tcp`} sudo={useSudo} />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="create-inbound" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Создание подключения
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте инбаунд в разделе Подключения, указав основные параметры (остальное можно оставить по умолчанию):
              </Typography>
          <Tabs value={activeConnectionTab} onChange={(e, newValue) => setActiveConnectionTab(newValue)} variant="fullWidth" textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
            <Tab label="VLESS Reality" />
            <Tab label="Hysteria2" />
          </Tabs>
          <PreviewPanel title={`Обязательные параметры: ${activeConnectionTab === 0 ? 'VLESS Reality' : 'Hysteria2'}`} rows={inboundRows[inboundType]} />
          {activeConnectionTab === 0 ? (
            <>
              <Typography component="p" gutterBottom>
                VLESS Reality удобно использовать как основной TCP-профиль.
              </Typography>
              <Box component="ul" sx={{ pl: 3, my: 1 }}>
                <li><Typography component="span">Порт <InlineCode copy>443</InlineCode> выглядит естественно для TLS-трафика.</Typography></li>
                <li><Typography component="span">В поле SNI используйте популярный сайт, который стабильно открывается из вашей локации.</Typography></li>
                <li><Typography component="span">Для клиентов на базе Xray обычно выбирайте flow <InlineCode>xtls-rprx-vision</InlineCode>.</Typography></li>
              </Box>
            </>
          ) : (
            <>
              <Typography component="p" gutterBottom>
                Hysteria2 выдает большую скорость соединения.
              </Typography>
              <Box component="ul" sx={{ pl: 3, my: 1 }}>
                <li><Typography component="span">В SNI укажите ваш домен.</Typography></li>
                <li><Typography component="span">Используйте сертификат и приватный ключ панели, который уже выпущен для вашего домена.</Typography></li>
              </Box>
            </>
          )}

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="manager" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            3. Менеджер подписок 3DP-MANAGER
          </Typography>
          <Typography component="p" gutterBottom>
            Установите менеджер на сервер, где будет храниться подписка и список ваших серверов.
          </Typography>
          <CodeBlock code={`<sudo>bash <(curl -fsSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/install.sh)`} sudo={useSudo} />
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Добавление ноды по токену
          </Typography>
          <TextField fullWidth label="Токен ноды" value={managerToken} onChange={(e) => setManagerToken(e.target.value.trim())} sx={{ my: 2 }} />
          <CodeBlock language="text" code={`Название: DE-1
Адрес панели: https://${panelDomain}
Публичный адрес: ${vpnDomain}
Токен: ${managerToken}`} copy={false} />
          <Typography component="p" gutterBottom>
            В 3DP-MANAGER откройте раздел <InlineCode>Ноды</InlineCode>, выберите добавление по токену, вставьте токен и проверьте соединение. После успешной проверки нода станет доступна при генерации подписки.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Добавление relay сервера
          </Typography>
          <Typography component="p" gutterBottom>
            Relay сервер нужен, когда пользователь должен подключаться к промежуточному серверу, а трафик дальше перенаправляется на основную ноду.
          </Typography>
          <CodeBlock code={`<sudo>ORIGIN_IP="${serverIp}" bash -c "$(curl -sSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)"`} sudo={useSudo} />
          <Box component="ul" sx={{ pl: 3, my: 1 }}>
            <li><Typography component="span">В разделе <InlineCode>Relay</InlineCode> добавьте IP <InlineCode copy>{relayIp}</InlineCode>.</Typography></li>
            <li><Typography component="span">Привяжите relay к нужной ноде и выберите его при выдаче подписки.</Typography></li>
            <li><Typography component="span">Проверьте, что в ссылках подписки адрес ноды заменился на relay адрес, а SNI остался доменом основной ноды.</Typography></li>
          </Box>
          <Alert icon={<TokenIcon fontSize="inherit" />} severity="info" sx={{ mt: 2 }}>
            После изменений пересоздайте или обновите подписку, чтобы клиенты получили новые ссылки.
          </Alert>
        </Box>
      </Box>
    </>
  );
}
