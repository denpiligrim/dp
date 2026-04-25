import { useState } from 'react';
import {
  Box, Typography, TextField, FormControlLabel, Checkbox,
  Paper, Divider,
  Button,
  Card,
  CardContent,
  Stack,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  IconButton,
  Alert
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import WindowIcon from '@mui/icons-material/Window';
import LinuxIcon from '../svgIcons/LinuxIcon';
import AppleIcon from '@mui/icons-material/Apple';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PaidIcon from '@mui/icons-material/Paid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import AndroidIcon from '@mui/icons-material/Android';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import amneziaImg from '../../images/amnezia.png';
import splitImg from '../../images/split-tunneling.png';
import shareAwgImg from '../../images/share-awg.png';
import shareXrayImg from '../../images/share-xray.png';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import CodeBlock from '../components/CodeBlock';
import { COUNTRIES } from '../components/countries';
import AmneziaIcon from '../svgIcons/AmneziaIcon';
import { DownloadRouteFileButton } from '../components/DownloadRouteFileButton';
import AutoForwardingInstall from '../components/AutoForwardingInstall';
import { AmneziaConverter } from '../components/AmneziaConverter';
import { XrayConverter } from '../components/XrayConverter';
import { NaiveConverter } from '../components/NaiveConverter';

const userName = Math.random().toString(36).slice(-10);
const userPass = Math.random().toString(36).slice(-10);

interface HelperData {
  text: string | JSX.Element;
  error: boolean;
}

export default function NaiveProxy() {
  const [vpnIp, setVpnIp] = useState('1.1.1.1');
  const [vpnDomain, setVpnDomain] = useState('example.com');
  const [email, setEmail] = useState('my@email.com');
  const [useRelay, setUseRelay] = useState(false);
  const [relayIp, setRelayIp] = useState('2.2.2.2');
  const [relayDomain, setRelayDomain] = useState('relay.example.com');
  const [osPc, setOsPc] = useState('windows');
  const [naivePort, setNaivePort] = useState('443');
  const [httpPort, setHttpPort] = useState('80');
  const [site, setSite] = useState('yastatic.net');
  const [path, setPath] = useState('/var/www/' + vpnDomain + '/html');
  const [useSudo, setUseSudo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeProtoTab, setActiveProtoTab] = useState(0);
  const [customSsl, setCustomSsl] = useState(false);
  const [certPath, setCertPath] = useState(`/etc/letsencrypt/live/${vpnDomain}/fullchain.pem`);
  const [keyPath, setKeyPath] = useState(`/etc/letsencrypt/live/${vpnDomain}/privkey.pem`);
  const [proto, setProto] = useState('awg');
  const [helperData, setHelperData] = useState<HelperData>({ text: '', error: false });
  const [helperRelayData, setHelperRelayData] = useState<HelperData>({ text: '', error: false });
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  const isValidIP = (ip: string) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleBlur = async () => {
    if (!vpnIp) {
      setHelperData({ text: '', error: false });
      return;
    }

    if (!isValidIP(vpnIp)) {
      setHelperData({ text: 'Неверный формат IP-адреса', error: true });
      return;
    }

    setHelperData({ text: 'Определение локации...', error: false });

    try {
      const response = await fetch(`/api/ip-info/${vpnIp}`);
      const data = await response.json();

      if (data.error) {
        setHelperData({ text: 'Не удалось определить IP', error: true });
        return;
      }

      const countryCode = data.countryCode;

      const countryInfo = COUNTRIES.find((c) => c.code === countryCode);

      if (countryInfo) {
        const countryName = countryInfo ? countryInfo.name : (data.country || 'Локация не найдена');

        const flagUrl = `/images/flags/16x12/${countryCode.toLowerCase()}.webp`;

        setHelperData({
          text: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img
                src={flagUrl}
                alt={countryCode}
                width="16"
                height="12"
                style={{ borderRadius: '2px' }}
              />
              {countryName}
            </span>
          ),
          error: false
        });
      }

    } catch (error) {
      console.error('Ошибка запроса:', error);
      setHelperData({ text: 'Ошибка соединения с сервером', error: true });
    }
  };
  const handleRelayBlur = async () => {
    if (!relayIp) {
      setHelperRelayData({ text: '', error: false });
      return;
    }

    if (!isValidIP(relayIp)) {
      setHelperRelayData({ text: 'Неверный формат IP-адреса', error: true });
      return;
    }

    setHelperRelayData({ text: 'Определение локации...', error: false });

    try {
      const response = await fetch(`/api/ip-info/${relayIp}`);
      const data = await response.json();

      if (data.error) {
        setHelperRelayData({ text: 'Не удалось определить IP', error: true });
        return;
      }

      const countryCode = data.countryCode;

      const countryInfo = COUNTRIES.find((c) => c.code === countryCode);

      if (countryInfo) {
        const countryName = countryInfo ? countryInfo.name : (data.country || 'Локация не найдена');

        const flagUrl = `/images/flags/16x12/${countryCode.toLowerCase()}.webp`;

        setHelperRelayData({
          text: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img
                src={flagUrl}
                alt={countryCode}
                width="16"
                height="12"
                style={{ borderRadius: '2px' }}
              />
              {countryName}
            </span>
          ),
          error: false
        });
      }

    } catch (error) {
      console.error('Ошибка запроса:', error);
      setHelperRelayData({ text: 'Ошибка соединения с сервером', error: true });
    }
  };

  const extractHostname = (inputStr) => {
    if (!inputStr) return '';

    try {
      // Проверяем, есть ли протокол. Если нет — добавляем 'https://', 
      // чтобы конструктор URL не выдал ошибку.
      const urlString = inputStr.startsWith('http://') || inputStr.startsWith('https://')
        ? inputStr
        : `https://${inputStr}`;

      const url = new URL(urlString);
      return url.hostname;
    } catch (error) {
      // Если пользователь ввел совсем невалидную строку
      return 'Некорректный URL';
    }
  };

  const handleChangeSite = (e) => {
    const newValue = e.target.value.trim().toLowerCase();

    const extractedInfo = extractHostname(newValue);
    setSite(extractedInfo);
  };

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="NaiveProxy Guide" />
        <meta name="keywords" content="VPN, guide, tutorial, NaiveProxy" />
        <meta property="og:title" content="NaiveProxy" />
        <meta property="og:description" content="NaiveProxy Guide" />
        <title>NaiveProxy</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/naive-proxy'} />
        <script type="application/ld+json">
          {JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Homepage",
                  "item": "https://denpiligrim.ru/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Guides",
                  "item": import.meta.env.VITE_APP_URL + '/guides'
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "NaiveProxy",
                  "item": import.meta.env.VITE_APP_URL + '/guides/naive-proxy'
                }
              ]
            }
          )}
        </script>
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
          NaïveProxy
        </Typography>
        <Alert icon={<InfoIcon fontSize="inherit" />} severity="warning" sx={{ mb: 2 }}>
          Для работы <b>NaiveProxy</b> необходим домен!
        </Alert>
        <Card sx={{
          mb: 4,
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

              <Button
                variant="contained"
                color="secondary"
                startIcon={<PaidIcon />}
                onClick={() => setSupportModalOpen(true)}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3
                }}
              >
                Поддержать автора
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
          Заполните данные ваших серверов ниже. Команды для копирования автоматически обновятся под вашу конфигурацию.
        </Typography>

        <SupportModal
          open={supportModalOpen}
          onClose={() => setSupportModalOpen(false)}
        />

        <Paper sx={{ p: 3, mb: 5, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Вводные данные</Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="IP основного сервера"
                variant="outlined"
                value={vpnIp}
                onChange={(e) => setVpnIp(e.target.value.trim().toLowerCase())}
                onBlur={handleBlur}
                helperText={helperData.text}
                error={helperData.error}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Домен основного сервера"
                variant="outlined"
                value={vpnDomain}
                onChange={(e) => setVpnDomain(e.target.value.trim().toLowerCase())}
                placeholder="mydomain.com"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email адрес"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                placeholder="my@email.com"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Ваши данные никуда не отправляются" placement='top'>
                          <IconButton>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useSudo}
                    onChange={(e) => setUseSudo(e.target.checked)}
                    color="primary"
                  />
                }
                label={<Typography fontWeight="medium">Использовать <b>sudo</b> в командах</Typography>}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useRelay}
                    onChange={(e) => setUseRelay(e.target.checked)}
                    color="primary"
                  />
                }
                label={<Typography fontWeight="medium">Использовать Relay сервер</Typography>}
              />
            </Grid>

            {useRelay && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="IP Relay сервера"
                    variant="outlined"
                    value={relayIp}
                    onChange={(e) => setRelayIp(e.target.value.trim().toLowerCase())}
                    onBlur={handleRelayBlur}
                    helperText={helperRelayData.text}
                    error={helperRelayData.error}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Домен Relay сервера"
                    variant="outlined"
                    value={relayDomain}
                    onChange={(e) => setRelayDomain(e.target.value.trim().toLowerCase())}
                    placeholder="relay.mydomain.com"
                  />
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography component="p" variant='body2' gutterBottom sx={{ display: 'inline-flex' }}>
                <span>ОС на устройстве:</span>
              </Typography>
              <FormControl size='small' variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={osPc}
                  onChange={(e) => setOsPc(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value={'windows'}><WindowIcon /> <b>Windows</b></MenuItem>
                  <MenuItem value={'android'}><AndroidIcon /> <b>Android</b></MenuItem>
                  <MenuItem value={'ios'}><AppleIcon /> <b>iOS</b></MenuItem>
                  <MenuItem value={'macos'}><AppleIcon /> <b>MacOS</b></MenuItem>
                  <MenuItem value={'linux'}><LinuxIcon /> <b>Linux</b></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography component="p" variant='body2' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>ОС на сервере:</span> <LinuxIcon /> <b>Ubuntu, Debian</b>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Содержание</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              <ListItem>
                <ListItemButton component="a" href="#naive-setup" rel="noopener">
                  <ListItemText primary="1. Установка и настройка сервера NaiveProxy" />
                </ListItemButton>
              </ListItem>
              {useRelay && (
                <>
                  <ListItem>
                    <ListItemButton component="a" href="#relay-setup" rel="noopener">
                      <ListItemText primary="2. Настройка промежуточного сервера" />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
              <ListItem>
                <ListItemButton component="a" href="#client-setup" rel="noopener">
                  <ListItemText primary={`${useRelay ? '3' : '2'}. Настройка клиента`} />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">Полезные ссылки</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              <ListItem>
                <ListItemButton component="a" href="https://ishosting.com/affiliate/MjIwOSM2" target='_blank' rel="noopener">
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
                <ListItemButton component="a" href="https://github.com/klzgrad/naiveproxy" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Репозиторий проекта NaiveProxy на GitHub" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://caddyserver.com/docs/caddyfile/directives/tls" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Документация CaddyServer" />
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
                    href="https://ishosting.com/affiliate/MjIwOSM2"
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
            mb: 4,
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
                  <AmneziaIcon />
                  <Link
                    href="https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Подписка Amnezia Premium с 15% скидкой
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Typography id="naive-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Установка и настройка сервера NaiveProxy
          </Typography>
          <Typography component="p" gutterBottom>
            В качестве сервера NaiveProxy использует веб-сервер Caddy со специальным форком плагина <b>forwardproxy</b> либо HAProxy. Мы будем использовать первый вариант.
          </Typography>
          <Typography component="p" gutterBottom>
            Подключитесь к серверу командой <InlineCode copy>{`ssh root@${vpnIp}`}</InlineCode>.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка Go
          </Typography>
          <Typography component="p" gutterBottom>
            Если у вас не установлен Go, выполните загрузку последней версии (1.26.2 на момент написания статьи):
          </Typography>
          <CodeBlock code={`wget https://go.dev/dl/go1.26.2.linux-amd64.tar.gz`} />

          <Typography component="p" gutterBottom>
            Удалите старую версию и распакуйте скачанный архив в директорию /usr/local. Эта директория является стандартным местом установки Go:
          </Typography>
          <CodeBlock code={`rm -rf /usr/local/go && tar -C /usr/local -xzf go1.26.2.linux-amd64.tar.gz`} />

          <Typography component="p" gutterBottom>
            Чтобы система знала, где находится установленный Go, и могла выполнять его команды из любой директории, нужно добавить путь к бинарным файлам Go в переменную окружения $PATH:
          </Typography>
          <CodeBlock code={`export PATH=$PATH:/usr/local/go/bin`} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Сборка сервера и настройка конфигурации
          </Typography>
          <Typography component="p" gutterBottom>
            Выполните следующие команды, чтобы загрузить утилиту xcaddy и собрать Caddy с нужным плагином:
          </Typography>
          <CodeBlock code={`go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest\n~/go/bin/xcaddy build --with github.com/caddyserver/forwardproxy=github.com/klzgrad/forwardproxy@naive`} />

          <Typography component="p" gutterBottom>
            Создайте папку:
          </Typography>
          <CodeBlock code={`<sudo>mkdir /etc/caddy`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Откройте файл конфигурации:
          </Typography>
          <CodeBlock code={`<sudo>nano /etc/caddy/Caddyfile`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Выберите конфигурацию в зависимости от того, хотите ли вы маскировать трафик под сторонний сайт или использовать свой.
          </Typography>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Сторонний сайт" />
            <Tab label="Свой сайт" />
          </Tabs>
          <Typography component="p" gutterBottom mt={2}>
            Обратите внимание, что по умолчанию сервер Caddy работает на <InlineCode>80</InlineCode> и <InlineCode>443</InlineCode> портах, поэтому если у вас уже запущен nginx и порты заняты, вам нужно изменить настройки. Также если у вас уже есть сертификаты и они обновляются, то вы можете указать пути к ним.
          </Typography>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size='small'
                label="Порт HTTP"
                variant="outlined"
                value={httpPort}
                onChange={(e) => setHttpPort(e.target.value.trim())}
                placeholder='80'
                fullWidth
                disabled={!customSsl}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size='small'
                label="Порт HTTPS"
                variant="outlined"
                value={naivePort}
                onChange={(e) => setNaivePort(e.target.value.trim())}
                placeholder='443'
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={customSsl}
                    onChange={(e) => setCustomSsl(e.target.checked)}
                    color="primary"
                  />
                }
                label={<Typography fontWeight="medium">Сертификаты уже есть</Typography>}
              />
            </Grid>
            {customSsl && (
              <>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    size='small'
                    label="Путь к сертификату"
                    variant="outlined"
                    value={certPath}
                    onChange={(e) => setCertPath(e.target.value.trim())}
                    placeholder={`/etc/letsencrypt/live/${vpnDomain}/fullchain.pem`}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    size='small'
                    label="Путь к ключу"
                    variant="outlined"
                    value={keyPath}
                    onChange={(e) => setKeyPath(e.target.value.trim())}
                    placeholder={`/etc/letsencrypt/live/${vpnDomain}/privkey.pem`}
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>

          {activeTab === 0 && (
            <>
              <Typography component="p" sx={{ my: 1 }} gutterBottom>
                Введите адрес сайта для маскировки.
              </Typography>
              <TextField
                size='small'
                variant="outlined"
                value={site}
                onChange={handleChangeSite}
                placeholder='example.com'
                sx={{ mb: 1, width: '50%' }}
              />
              <Typography component="p" variant='caption'>
                Вставьте следующий конфиг:
              </Typography>
              <CodeBlock code={`{
  http_port ${httpPort}
  https_port ${naivePort}            
  order forward_proxy before reverse_proxy
}

:${naivePort}, ${vpnDomain} {

  tls ${customSsl ? certPath + ' ' + keyPath : email}
  forward_proxy {
    basic_auth ${userName} ${userPass}
    hide_ip
    hide_via
    probe_resistance
  }

  reverse_proxy https://${site} {
    header_up Host {upstream_hostport}
    header_up X-Forwarded-Host {host}
  }
}`} language='nginx' />
            </>
          )}
          {activeTab === 1 && (
            <>
              <Typography component="p" sx={{ my: 1 }} gutterBottom>
                Введите путь к корневой директории сайта.
              </Typography>
              <TextField
                size='small'
                variant="outlined"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder={'/var/www/' + vpnDomain + '/html'}
                sx={{ mb: 1, width: '50%' }}
              />
              <Typography component="p" variant='caption'>
                Вставьте следующий конфиг:
              </Typography>
              <CodeBlock code={`{
  http_port ${httpPort}
  https_port ${naivePort}   
  order forward_proxy before file_server
}

:${naivePort}, ${vpnDomain} {

  tls ${customSsl ? certPath + ' ' + keyPath : email}
  forward_proxy {
    basic_auth ${userName} ${userPass}
    hide_ip
    hide_via
    probe_resistance
  }

  file_server {
    root ${path}
  }
}`} language='nginx' />
            </>
          )}

          <Typography component="p" gutterBottom>
            Сохраните изменения <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl+X</InlineCode>.
          </Typography>

          <Typography component="p" gutterBottom>
            Переместите собранный Caddy в системный каталог и сделайте его исполняемым:
          </Typography>
          <CodeBlock
            code={`<sudo>chmod +x caddy\n<sudo>mv caddy /usr/bin/`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Создание системного сервиса
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте сервис для автоматического запуска. Откройте файл в редакторе:
          </Typography>
          <CodeBlock code={`<sudo>nano /etc/systemd/system/caddy.service`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Вставьте следующую конфигурацию:
          </Typography>
          <CodeBlock
            code={`[Unit]
Description=Caddy
Documentation=https://caddyserver.com/docs/
After=network.target network-online.target
Requires=network-online.target

[Service]
User=root
Group=root
ExecStart=/usr/bin/caddy run --environ --config /etc/caddy/Caddyfile
ExecReload=/usr/bin/caddy reload --config /etc/caddy/Caddyfile
TimeoutStopSec=5s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE
Restart=always
RestartSec=5s

[Install]
WantedBy=multi-user.target`}
            language="ini"
          />

          <Typography component="p" gutterBottom>
            Сохраните изменения <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl+X</InlineCode>.
          </Typography>

          <Typography component="p" gutterBottom>
            Перезагрузите демона и добавьте сервис в автозагрузку:
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl daemon-reload\n<sudo>systemctl enable --now caddy`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Запуск Caddy
          </Typography>
          <Typography component="p" gutterBottom>
            Запустите Caddy в фоновом режиме. Он автоматически получит TLS-сертификат на указанную ранее почту:
          </Typography>
          <CodeBlock code={`<sudo>systemctl start caddy`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Проверьте статус:
          </Typography>
          <CodeBlock code={`<sudo>systemctl status caddy`} sudo={useSudo} />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          {useRelay && (
            <>
              <Typography id="relay-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                2. Настройка промежуточного сервера
              </Typography>
              <Alert icon={<InfoIcon fontSize="inherit" />} severity="warning" sx={{ mb: 2 }}>
                Если вы уже устанавливали перенаправление с помощью <b>3DP-MANAGER</b>, то пропустите этот шаг! Нельзя устанавливать перенаправление более 1 раза, это ломает работу сервера.
              </Alert>
              <Typography component="p" gutterBottom>
                Для того, чтобы ваш трафик шел через российский сервер и не выглядел для провайдера как зарубежный, рекомендуется использовать промежуточный сервер.
              </Typography>
              <AutoForwardingInstall originIp={vpnIp} setOriginIp={setVpnIp} intermediateIp={relayIp} setIntermediateIp={setRelayIp} />

              <Typography component="p" gutterBottom>
                Скрипт перенаправляет трафик на ваш основной сервер, порты <InlineCode>443</InlineCode>, <InlineCode>8443</InlineCode>, <InlineCode>10000:60000</InlineCode>. Ненужные порты можно закрыть фаерволом.
              </Typography>

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Typography component="span">Ручная установка</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  <Typography component="p" gutterBottom>
                    При необходимости вы можете установить скрипт на промежуточном сервере вручную:
                  </Typography>
                  <CodeBlock code={`<sudo>ORIGIN_IP="${vpnIp}" bash -c "$(curl -sSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)"`} sudo={useSudo} />
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
            </>
          )}

          <Typography id="client-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {useRelay ? '3. ' : '2. '}Настройка клиента
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка клиента
          </Typography>
          <Typography component="p" gutterBottom>
            Установите клиент с поддержкой NaiveProxy в зависимости от вашей ОС:
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            {[
              { id: 'windows', label: <><WindowIcon /> Windows</>, app: <><Link href='https://github.com/MatsuriDayo/nekoray/releases/latest' target="_blank" rel="noopener" color="primary">Nekoray</Link> + <Link href='https://github.com/klzgrad/naiveproxy/releases/latest' target="_blank">Ядро Naive</Link></> },
              { id: 'android', label: <><AndroidIcon /> Android</>, app: <><Link href='https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/latest' target="_blank" rel="noopener" color="primary">NekoBox</Link> + <Link href='https://github.com/MatsuriDayo/plugins/releases?q=naive' target="_blank">Плагин Naive</Link></> },
              { id: 'ios', label: <><AppleIcon /> iOS</>, app: <Link href='https://github.com/MatsuriDayo/nekoray/releases/latest' target="_blank" rel="noopener" color="primary">Karing</Link> },
              { id: 'macos', label: <><AppleIcon /> MacOS</>, app: <><Link href='https://github.com/2dust/v2rayN/releases/latest' target="_blank" rel="noopener" color="primary">v2rayN</Link> + <Link href='https://github.com/klzgrad/naiveproxy/releases/latest' target="_blank">Ядро Naive</Link></> },
              { id: 'linux', label: <><LinuxIcon /> Linux</>, app: <><Link href='https://github.com/2dust/v2rayN/releases/latest' target="_blank" rel="noopener" color="primary">v2rayN</Link> + <Link href='https://github.com/klzgrad/naiveproxy/releases/latest' target="_blank">Ядро Naive</Link></> },
            ]
              .sort((a, b) => (a.id === osPc ? -1 : b.id === osPc ? 1 : 0))
              .map((os) => (
                <li key={os.id}>
                  <Typography component="span">
                    {os.label}:{' '}
                    {os.app}
                  </Typography>
                </li>
              ))}
          </Box>

          <Typography component="p" gutterBottom>
            Добавьте подключение с типом Naive, указав данные:
          </Typography>
          <Typography component="p" gutterBottom>
            <b>Домен:</b> <InlineCode copy>{useRelay ? relayDomain : vpnDomain}</InlineCode>
          </Typography>
          <Typography component="p" gutterBottom>
            <b>Порт:</b> <InlineCode copy>{naivePort}</InlineCode>
          </Typography>
          <Typography component="p" gutterBottom>
            <b>Логин:</b> <InlineCode copy>{userName}</InlineCode>
          </Typography>
          <Typography component="p" gutterBottom>
            <b>Пароль:</b> <InlineCode copy>{userPass}</InlineCode>
          </Typography>
          <Typography component="p" gutterBottom>
            Проще всего добавить подключение в приложение с помощью ссылки:
          </Typography>
          <Tabs
            value={activeProtoTab}
            onChange={(e, newValue) => setActiveProtoTab(newValue)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="HTTPS" />
            <Tab label="QUIC" />
          </Tabs>

          <CodeBlock
            code={`naive+${activeProtoTab === 0 ? 'https' : 'quic'}://${userName}:${userPass}@${useRelay ? relayDomain : vpnDomain}:${naivePort}${useRelay ? '?sni=' + vpnDomain : ''}#Naive`}
            language="json"
          />
          <NaiveConverter processedLink={`naive+${activeProtoTab === 0 ? 'https' : 'quic'}://${userName}:${userPass}@${useRelay ? relayDomain : vpnDomain}:${naivePort}${useRelay ? '?sni=' + vpnDomain : ''}#Naive`} />
        </Box>
      </Box>
    </>
  );
}