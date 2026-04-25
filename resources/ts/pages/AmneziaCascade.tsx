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
  Tab
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

interface HelperData {
  text: string | JSX.Element;
  error: boolean;
}

export default function AmneziaCascade() {
  const [vpnIp, setVpnIp] = useState('1.1.1.1');
  const [useRelay, setUseRelay] = useState(true);
  const [relayIp, setRelayIp] = useState('2.2.2.2');
  const [osPc, setOsPc] = useState('windows');
  const [activeTab, setActiveTab] = useState(0);
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

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Amnezia Cascade Guide" />
        <meta name="keywords" content="VPN, guide, tutorial, amnezia" />
        <meta property="og:title" content="Amnezia Cascade" />
        <meta property="og:description" content="Amnezia Cascade Guide" />
        <title>Amnezia Cascade</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/amnezia-cascade'} />
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
                  "name": "Amnezia Cascade",
                  "item": import.meta.env.VITE_APP_URL + '/guides/amnezia-cascade'
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
          Каскадный Amnezia VPN
        </Typography>
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
                  href="https://youtu.be/di0evl7-Q-A"
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
                label="IP зарубежного сервера"
                variant="outlined"
                value={vpnIp}
                onChange={(e) => setVpnIp(e.target.value.trim().toLowerCase())}
                onBlur={handleBlur}
                helperText={helperData.text}
                error={helperData.error}
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
                label={<Typography fontWeight="medium">Использовать RU сервер</Typography>}
              />
            </Grid>

            {useRelay && (
              <>
                <Grid size={{ xs: 12, md: 12 }}>
                  <TextField
                    sx={{ width: { xs: '100%', md: 'calc(50% - 1rem)' } }}
                    label="IP RU сервера"
                    variant="outlined"
                    value={relayIp}
                    onChange={(e) => setRelayIp(e.target.value.trim().toLowerCase())}
                    onBlur={handleRelayBlur}
                    helperText={helperRelayData.text}
                    error={helperRelayData.error}
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
                <ListItemButton component="a" href="#amnezia" rel="noopener">
                  <ListItemText primary="1. Установка личного сервера через приложение Amnezia VPN" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#routing" rel="noopener">
                  <ListItemText primary="2. Настройка раздельного туннелирования" />
                </ListItemButton>
              </ListItem>
              {useRelay && (
                <>
                  <ListItem>
                    <ListItemButton component="a" href="#relay-setup" rel="noopener">
                      <ListItemText primary="3. Настройка промежуточного сервера" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton component="a" href="#usage" rel="noopener">
                      <ListItemText primary="4. Как пользоваться" />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
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
                <ListItemButton component="a" href="https://amnezia.org/ru/downloads" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Скачать приложение Amnezia VPN" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://github.com/amnezia-vpn/desktop-client/releases/latest" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Скачать приложение Amnezia VPN (зеркало)" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://t.me/amnezia_vpn" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Чат Amnezia VPN в Телеграм" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://t.me/amnezia_support_bot" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Бот техподдержки Amnezia VPN в Телеграм" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://russia.iplist.opencck.org/ru/" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Составить список маршрутизации трафика" />
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

          <Typography id="amnezia" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Установка личного сервера через приложение Amnezia VPN
          </Typography>
          <Typography component="p" gutterBottom>
            Самый простой способ сделать личный ВПН сервер на сегодня - это установить его через приложение Amnezia VPN. Оно само подключится к серверу и установит необходимые протоколы.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Подготовка приложения
          </Typography>
          {(() => {
            switch (osPc) {
              case 'windows':
                return <Typography component="p" gutterBottom>Скачайте файл <InlineCode>.exe</InlineCode> с официального <Link href="https://amnezia.org/ru/downloads" target="_blank" rel="noopener" color="primary">сайта</Link> или (если ссылка не открывается) из <Link href="https://github.com/amnezia-vpn/desktop-client/releases/latest" target="_blank" rel="noopener" color="primary">репозитория</Link> GitHub и установите программу на компьютер.</Typography>
              case 'android':
                return <Typography component="p" gutterBottom>Скачайте файл <InlineCode>.apk</InlineCode> с официального <Link href="https://amnezia.org/ru/downloads" target="_blank" rel="noopener" color="primary">сайта</Link> или (если ссылка не открывается) из <Link href="https://github.com/amnezia-vpn/desktop-client/releases/latest" target="_blank" rel="noopener" color="primary">репозитория</Link> GitHub либо установите приложение в <Link href="https://play.google.com/store/apps/details?id=org.amnezia.vpn&pcampaignid=web_share" target="_blank" rel="noopener" color="primary">Google Play</Link>.</Typography>
              case 'ios':
                return <Typography component="p" gutterBottom>Установите приложение в <Link href="https://apps.apple.com/us/app/amneziavpn/id1600529900" target="_blank" rel="noopener" color="primary">AppStore</Link>. Если недоступно, то поменяйте регион в аккаунте Apple.</Typography>
              case 'macos':
                return <Typography component="p" gutterBottom>Скачайте файл <InlineCode>.pkg</InlineCode> с официального <Link href="https://amnezia.org/ru/downloads" target="_blank" rel="noopener" color="primary">сайта</Link> или (если ссылка не открывается) из <Link href="https://github.com/amnezia-vpn/desktop-client/releases/latest" target="_blank" rel="noopener" color="primary">репозитория</Link> GitHub и установите программу на компьютер.</Typography>
              case 'linux':
                return <Typography component="p" gutterBottom>Скачайте файл <InlineCode>.tar</InlineCode> с официального <Link href="https://amnezia.org/ru/downloads" target="_blank" rel="noopener" color="primary">сайта</Link> или (если ссылка не открывается) из <Link href="https://github.com/amnezia-vpn/desktop-client/releases/latest" target="_blank" rel="noopener" color="primary">репозитория</Link> GitHub и установите программу на компьютер.</Typography>
              default:
                return <></>
            }
          })()}

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Подключение к серверу
          </Typography>
          <Box
            component="img"
            src={amneziaImg}
            alt="Описание картинки"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: '80%' },
              borderRadius: '15px',
              display: 'block',
              mx: 'auto',
              my: 4
            }}
          />
          <Typography component="p" gutterBottom>
            Откройте приложение, нажмите кнопку добавления нового сервера Self-hosted VPN и укажите данные:
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">IP-адрес: <InlineCode copy>{vpnIp}</InlineCode></Typography>
            </li>
            <li>
              <Typography component="span">Имя пользователя: <InlineCode copy>root</InlineCode></Typography>
            </li>
            <li>
              <Typography component="span">Пароль или SSH-ключ: укажите пароль от сервера или выберите ваш приватный ключ, если есть.</Typography>
            </li>
          </Box>
          <Typography component="p" gutterBottom>
            Далее выберите Ручную установку и перейдите к выбору протокола.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка AmneziaWG
          </Typography>
          <Typography component="p" gutterBottom>
            AmneziaWG — это собственный быстрый протокол от Амнезии, который хорошо подходит для обхода блокировок и стабильного подключения.
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">Выберите протокол <InlineCode>AmneziaWG</InlineCode>.</Typography>
            </li>
            <li>
              <Typography component="span">Порт можно оставить по умолчанию. Если будете использовать каскадную схему подключения, то порт должен быть из диапазона <InlineCode>10000:60000</InlineCode> либо <InlineCode>443</InlineCode> или <InlineCode>8443</InlineCode>.</Typography>
            </li>
            <li>
              <Typography component="span">Нажмите <InlineCode>Установить</InlineCode>. Приложение автоматически развернет всё необходимое на сервере.</Typography>
            </li>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка Xray
          </Typography>
          <Typography component="p" gutterBottom>
            Xray — это наиболее защищенный протокол с маскировкой трафика, который идеально подходит для обхода блокировок и стабильного подключения.
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">В списке серверов возле своего сервера нажмите на шестеренку и во вкладке Протоколы выберите протокол <InlineCode>Xray</InlineCode>.</Typography>
            </li>
            <li>
              <Typography component="span">Порт можно оставить по умолчанию. Если будете использовать каскадную схему подключения, то порт должен быть из диапазона <InlineCode>10000:60000</InlineCode> либо <InlineCode>443</InlineCode> или <InlineCode>8443</InlineCode>.</Typography>
            </li>
            <li>
              <Typography component="span">Нажмите <InlineCode>Установить</InlineCode>. Приложение автоматически установит протокол на сервер.</Typography>
            </li>
            {useRelay && (
              <li>
                <Typography component="span">После установки снова нажмите на прототокол Xray в настройках сервера и 'Xray настройки сервера'. Замените ServerName (SNI) на РУ домен, например <InlineCode copy>ya.ru</InlineCode> и сохраните.</Typography>
              </li>
            )}
          </Box>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="routing" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Настройка раздельного туннелирования
          </Typography>
          <Typography component="p" gutterBottom>
            В условиях, когда приложения и сервисы детектят наличие ВПН подключения и попросту не пускают вас, пока вы не выключите ВПН, необходимо настроить раздельное туннелирование, чтобы российские сервисы открывались без ВПН.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Скачвание файла со списком РУ доменов
          </Typography>
          <Typography component="p" gutterBottom>
            Вы можете скачать файл со списком основных доменов российских сервисов:
          </Typography>
          <DownloadRouteFileButton />
          <Typography component="p" gutterBottom>
            Либо вы можете <Link href="https://russia.iplist.opencck.org/ru/" target="_blank" rel="noopener" color="primary">составить свой список</Link>, указав тип Amnezia и выбрав нужные сервисы для обхода.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Включение раздельного туннелирования в приложении
          </Typography>
          <Typography component="p" gutterBottom>
            Перейдите в настройки приложения Amnezia VPN:
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">Выберите раздел <b>Соединение</b>.</Typography>
            </li>
            <li>
              <Typography component="span">Перейдите в <InlineCode>Раздельное туннелирование сайтов</InlineCode>.</Typography>
            </li>
            <li>
              <Typography component="span">Нажмите на (...) снизу и выберите <b>Импорт</b>.</Typography>
            </li>
            <li>
              <Typography component="span">Нажмите <b>Заменить список с сайтами</b> и выберите скачанный ранее файл.</Typography>
            </li>
            <li>
              <Typography component="span">Включите раздельное туннелирование и подключитесь к ВПН.</Typography>
            </li>
          </Box>
          <Box
            component="img"
            src={splitImg}
            alt="Описание картинки"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: '80%' },
              borderRadius: '15px',
              display: 'block',
              mx: 'auto',
              my: 4
            }}
          />

          <Typography component="p" gutterBottom>
            Проверьте, что раздельное туннелирование работает на сайте <Link href="https://2ip.io/" target="_blank" rel="noopener" color="primary">2ip.io</Link> (должны увидеть IP адрес зарубежного сервера) и на сайте <Link href="https://yandex.ru/internet" target="_blank" rel="noopener" color="primary">yandex.ru/internet</Link> (покажет IP вашего интернет-провайдера).
          </Typography>
          <Typography component="p" gutterBottom>
            Также рекомендуется использовать <b>Раздельное туннелирование приложений</b>, где вы можете выбрать какие приложения будут работать без ВПН.
          </Typography>

          {useRelay && (
            <>
              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Typography id="relay-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                3. Настройка промежуточного сервера
              </Typography>
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
                  <CodeBlock code={`sudo ORIGIN_IP="${vpnIp}" bash -c "$(curl -sSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)"`} />
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Typography id="usage" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                4. Как пользоваться
              </Typography>
              <Typography component="p" gutterBottom>
                После того как вы настроили перенапраление трафика с промежуточного сервера на основной, вы можете изменить в любой конфигурации IP адрес с <InlineCode>{vpnIp}</InlineCode> → <InlineCode>{relayIp}</InlineCode>. Например, конфиг на подключение AmneziaWG будет выглядеть так:
              </Typography>
              <CodeBlock code={`### Другие параметры\nEndpoint = ${relayIp}:48443\n### Другие параметры`} language="ini" copy={false} />

              <Typography component="p" gutterBottom>
                Итак, давайте по порядку...
              </Typography>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="AmneziaWG" />
                <Tab label="Xray/Vless" />
              </Tabs>

              {activeTab === 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
                    Получение файла конфигурации AmneziaWG
                  </Typography>
                  <Box
                    component="img"
                    src={shareAwgImg}
                    alt="Описание картинки"
                    sx={{
                      width: '100%',
                      maxWidth: { xs: '100%', md: '80%' },
                      borderRadius: '15px',
                      display: 'block',
                      mx: 'auto',
                      my: 4
                    }}
                  />
                  <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
                    <li>
                      <Typography component="span">Нажмите иконку <b>Поделиться</b> снизу</Typography>
                    </li>
                    <li>
                      <Typography component="span">Укажите любое <b>Имя пользователя</b>.</Typography>
                    </li>
                    <li>
                      <Typography component="span">Протокол <InlineCode>AmneziaWG</InlineCode>.</Typography>
                    </li>
                    <li>
                      <Typography component="span">Формат подключения <InlineCode>Оригинальный формат AmneziaWG</InlineCode> (Важно!). Нажмите <b>Поделиться</b>.</Typography>
                    </li>
                    <li>
                      <Typography component="span">Дождитесь генерации и снова нажмите <b>Поделиться</b>. Сохраните файл.</Typography>
                    </li>
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
                    Изменение файла конфигурации AmneziaWG
                  </Typography>
                  <AmneziaConverter relayIp={relayIp} />
                </>
              )}
              {activeTab === 1 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
                    Получение ссылки на подключение Xray
                  </Typography>
                  <Box
                    component="img"
                    src={shareXrayImg}
                    alt="Описание картинки"
                    sx={{
                      width: '100%',
                      maxWidth: { xs: '100%', md: '80%' },
                      borderRadius: '15px',
                      display: 'block',
                      mx: 'auto',
                      my: 4
                    }}
                  />
                  <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
                    <li>
                      <Typography component="span">Нажмите иконку <b>Поделиться</b> снизу</Typography>
                    </li>
                    <li>
                      <Typography component="span">Укажите любое <b>Имя пользователя</b>.</Typography>
                    </li>
                    <li>
                      <Typography component="span">Протокол <InlineCode>XRay</InlineCode>.</Typography>
                    </li>
                    <li>
                      <Typography component="span">Формат подключения <InlineCode>Оригинальный формат XRay</InlineCode> (Важно!). Нажмите <b>Поделиться</b>.</Typography>
                    </li>
                    <li>
                      <Typography component="span">Дождитесь генерации и нажмите <b>Скопировать строку конфигурации</b>. Вставьте ссылку ниже.</Typography>
                    </li>
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
                    Изменение ссылки Xray
                  </Typography>
                  <Typography component="p" variant='caption'>
                    Вставьте ссылку на подключение Xray/Vless в поле:
                  </Typography>
                  <XrayConverter relayIp={relayIp} />
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
}