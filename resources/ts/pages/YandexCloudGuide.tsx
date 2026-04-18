import { useState } from 'react';
import {
  Box, Typography, TextField,
  Paper, IconButton, Divider,
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
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Alert,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import WindowIcon from '@mui/icons-material/Window';
import LinuxIcon from '../svgIcons/LinuxIcon';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PaidIcon from '@mui/icons-material/Paid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import AppleIcon from '@mui/icons-material/Apple';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import IshostingIcon from '../svgIcons/IshostingIcon';
import YaCloudIcon from '../svgIcons/YaCloudIcon';
import CodeBlock from '../components/CodeBlock';

const CLEAN_CIDR_RANGES = [
  "31.44.8.0/21",
  "51.250.0.0/17",
  "62.84.112.0/20",
  "84.201.128.0/18",
  "84.252.128.0/20",
  "89.169.128.0/18",
  "130.193.32.0/19",
  "158.160.0.0/16",
  "178.154.192.0/18",
  "217.28.224.0/20"
];

function ipToInt(ip: string) {
  return ip.split('.').reduce((res, octet) => (res << 8) + parseInt(octet, 10), 0) >>> 0;
}

function isIpInCidr(ip: string, cidr: string) {
  const [range, bits] = cidr.split('/');
  const mask = ~((1 << (32 - parseInt(bits, 10))) - 1);
  return (ipToInt(ip) & mask) === (ipToInt(range) & mask);
}

export default function YandexCloudGuide() {
  const [relayIp, setRelayIp] = useState('193.32.216.0');
  const [vpnIp, setVpnIp] = useState('37.230.172.0');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState(0);
  const [osPc, setOsPc] = useState('windows');
  const [userServer, setUserServer] = useState('grass');
  const [userPc, setUserPc] = useState('user');
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Yandex Cloud virtual machine guide" />
        <meta name="keywords" content="Yandex Cloud, VPN, guide, tutorial, setup" />
        <meta property="og:title" content="Yandex Cloud virtual machine guide" />
        <meta property="og:description" content="Yandex Cloud virtual machine guide" />
        <title>Yandex Cloud virtual machine guide</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/yandex-cloud-vm'} />
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
                  "name": "Yandex Cloud virtual machine guide",
                  "item": import.meta.env.VITE_APP_URL + '/guides/yandex-cloud-vm'
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
          Создание Виртуальной Машины на Яндекс Облако
        </Typography>
        <Alert icon={<InfoIcon fontSize="inherit" />} severity="warning" sx={{ mb: 2 }}>
          Друзья! Сервис Яндекс Облако приостановил реферальную программу, а это значит, что единственный способ поддержать автора - <Link
            component="button"
            onClick={() => setSupportModalOpen(true)}
            underline="hover"
            color="text.primary"
          >
            отправить донат
          </Link>
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
                <YouTubeIcon sx={{ color: '#2a9fff', fontSize: '2rem' }} />
                <Link
                  component="button"
                  onClick={() => setVideoModalOpen(true)}
                  underline="hover"
                  color="text.primary"
                  sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  Смотреть видео гайд
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

        <Dialog
          open={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            Видео гайд по Яндекс Облаку
            <IconButton onClick={() => setVideoModalOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, bgcolor: 'background.default' }}>
            <Tabs
              value={activeVideoTab}
              onChange={(e, newValue) => setActiveVideoTab(newValue)}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Часть 1: Теория по подсетям Яндекса" />
              <Tab label="Часть 2: Виртуальная машина" />
            </Tabs>

            <Box sx={{ p: 2, bgcolor: '#000', display: 'flex', justifyContent: 'center' }}>
              {activeVideoTab === 0 && (
                <video
                  controls
                  width="100%"
                  style={{ borderRadius: '8px', maxHeight: '70vh' }}
                  src="/video/yandex-cloud-part1.mp4"
                />
              )}
              {activeVideoTab === 1 && (
                <video
                  controls
                  width="100%"
                  style={{ borderRadius: '8px', maxHeight: '70vh' }}
                  src="/video/yandex-cloud-part2.mp4"
                />
              )}
            </Box>
          </DialogContent>
        </Dialog>

        <Paper sx={{ p: 3, mb: 5, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Вводные данные</Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="IP виртуальной машины YC"
                helperText={CLEAN_CIDR_RANGES.some(cidr => isIpInCidr(relayIp, cidr)) ? "✓ IP чистый" : "✕ IP не чистый"}
                variant="outlined"
                value={relayIp}
                onChange={(e) => setRelayIp(e.target.value.trim().toLowerCase())}
                placeholder='193.32.216.0'
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="IP адрес основного сервера"
                variant="outlined"
                value={vpnIp}
                onChange={(e) => setVpnIp(e.target.value.trim().toLowerCase())}
                placeholder="37.230.172.0"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Имя пользователя на компьютере"
                variant="outlined"
                value={userPc}
                onChange={(e) => setUserPc(e.target.value.trim())}
                placeholder="user"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Имя пользователя на сервере"
                variant="outlined"
                value={userServer}
                onChange={(e) => setUserServer(e.target.value.trim())}
                placeholder="grass"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography component="p" variant='body2' gutterBottom sx={{ display: 'inline-flex' }}>
                <span>ОС на компьютере:</span>
              </Typography>
              <FormControl size='small' variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={osPc}
                  onChange={(e) => setOsPc(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value={'windows'}><WindowIcon /> <b>Windows</b></MenuItem>
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
                <ListItemButton component="a" href="#theory" rel="noopener">
                  <ListItemText primary="1. Теория: зоны доступности и трафик" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#registration" rel="noopener">
                  <ListItemText primary="2. Регистрация на Yandex Cloud и получение гранта" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#create-vm" rel="noopener">
                  <ListItemText primary="3. Создание виртуальной машины" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#ssh-connection" rel="noopener">
                  <ListItemText primary="4. Подключение к ВМ и настройка перенаправления" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#static-ip" rel="noopener">
                  <ListItemText primary="5. Делаем IP-адрес статическим и защищаем от удаления" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#auto-restart" rel="noopener">
                  <ListItemText primary="6. Автоматический запуск прерываемой ВМ" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#troubleshooting" rel="noopener">
                  <ListItemText primary="7. Что делать, если IP-адрес перестал работать?" />
                </ListItemButton>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Полезные ссылки</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Аренда Виртуальной машины на Яндекс Облако" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://ishosting.com/affiliate/MjIwOSM2" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Аренда зарубежного сервера" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/docs/overview/concepts/geo-scope" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Зоны доступности Yandex Cloud" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/docs/troubleshooting/legal/how-to/data-centers-physical-addresses" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Адреса дата-центров Yandex Cloud" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/docs/overview/concepts/public-ips#virtual-private-cloud" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Диапазоны IP-адресов Yandex Cloud" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/docs/vpc/pricing#prices-traffic" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Цены на исходящий трафик Yandex Cloud" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/docs/vpc/operations/set-static-ip" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Как сделать IP-адрес статическим" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/docs/compute/tutorials/nodejs-cron-restart-vm" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Автоматический перезапуск Виртуальной машины" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://yandex.cloud/ru/docs/iam/concepts/authorization/oauth-token" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Получение OAuth-токена" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://raw.githubusercontent.com/hxehex/russia-mobile-internet-whitelist/refs/heads/main/cidrwhitelist.txt" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="CIDR список" />
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
                  <YaCloudIcon />
                  <Link
                    href="https://yandex.cloud/ru"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Аренда Виртуальной машины на Яндекс Облако
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

          <Typography id="theory" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Теория: Зоны доступности, сети и трафик
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            <strong>Зоны доступности и ресурсы</strong>
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Зона доступности</strong> — это инфраструктура внутри дата-центра, в котором размещается платформа Yandex Cloud. Ресурсы в Yandex Cloud делятся на <strong>зональные</strong> (привязанные к зоне доступности, например виртуальная машина и диск) и <strong>глобальные</strong> (не привязанные к зоне, например облачная сеть и бакет).
          </Typography>

          <Typography component="p" gutterBottom>
            Каждая зона изолирована от аппаратных и программных сбоев в других зонах доступности. Разворачивая ваши приложения сразу в нескольких зонах, вы обеспечиваете отказоустойчивость своих приложений и значительно снижаете вероятность потери данных.
          </Typography>

          <Typography component="p" gutterBottom>
            Платформа Yandex Cloud размещается в четырех дата-центрах Яндекса. Вы можете размещать свои ресурсы в следующих зонах доступности:
          </Typography>
          <Typography component="p" gutterBottom>
            • <InlineCode>ru-central1-a</InlineCode> — не рекомендуется (мало чистых IP)
            <br />• <InlineCode sx={{ color: 'warning.main' }}>ru-central1-b</InlineCode> — хорошая зона (есть чистые IP)
            <br />• <InlineCode sx={{ color: 'success.main' }}>ru-central1-d</InlineCode> — <em>рекомендуемая зона для новых проектов</em> (много чистых IP-адресов в дипазоне 158.160.0.0/16)
            <br />• <InlineCode sx={{ color: 'info.main' }}>ru-central1-e</InlineCode> — новая зона, вероятно будет рекомендована новым проектам в будущем
            <br />• <InlineCode sx={{ color: 'error.main' }}>ru-central1-m</InlineCode> — отдельная зона сервиса Yandex BareMetal, не для виртуальных машин.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            Адреса дата-центров Yandex Cloud:
          </Typography>
          <Typography component="p" gutterBottom>
            • Владимирская область — г. Владимир, мкр. Энергетик, ул. Поисковая 1 к. 2;
            <br />• Рязанская область — г. Сасово, ул. Пушкина 21;
            <br />• Калужская область — г. Калуга, 1-й Автомобильный пр-д 8;
            <br />• Московская область — г. Мытищи, ул. Силикатная 19.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Подсети и IP-адреса (Virtual Private Cloud)</strong>
          </Typography>

          <Typography component="p" gutterBottom>
            При создании виртуальной машины выделяется публичный IPv4-адрес. Некоторые адреса могли использоваться ранее и иметь плохую репутацию. Адреса ресурсов сервисов Yandex Cloud, доступные клиентам, выдаются из следующих пулов (чистые подсети выделены цветом):
          </Typography>

          <Typography component="p" gutterBottom sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <InlineCode>31.44.8.0/21</InlineCode>, 37.230.172.0/22, 37.230.188.0/22, 45.133.96.0/22, 46.21.244.0/22, <InlineCode sx={{ color: 'success.main' }}>51.250.0.0/17</InlineCode>, <InlineCode>62.84.112.0/20</InlineCode>, <InlineCode sx={{ color: 'warning.main' }}>84.201.128.0/18</InlineCode>, <InlineCode sx={{ color: 'warning.main' }}>84.252.128.0/20</InlineCode>, <InlineCode sx={{ color: 'info.main' }}>89.169.128.0/18</InlineCode>, 89.232.188.0/22, 92.255.1.0/24, 92.255.3.0/24, 93.77.160.0/19, <InlineCode>130.193.32.0/19</InlineCode>, <InlineCode sx={{ color: 'success.main' }}>158.160.0.0/16</InlineCode>, <InlineCode sx={{ color: 'info.main' }}>178.154.192.0/18</InlineCode>, 178.170.222.0/24, 185.206.164.0/22, 193.32.216.0/22, 213.165.192.0/19, <InlineCode>217.28.224.0/20</InlineCode>
          </Typography>

          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography component="p" gutterBottom sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <InlineCode sx={{ color: 'success.main' }}>зеленый</InlineCode> - Наивысший шанс, <InlineCode sx={{ color: 'warning.main' }}>желтый</InlineCode> - Отличный шанс, <InlineCode sx={{ color: 'info.main' }}>синий</InlineCode> - Хороший шанс, <InlineCode>фиолетовый</InlineCode> - Низкий шанс
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Тарификация трафика</strong><br />
            • <em>Входящий трафик:</em> Абсолютно бесплатен и не лимитирован.<br />
            • <em>Исходящий трафик (в интернет):</em> Первые <strong>100 ГБ в месяц — бесплатно</strong>. Далее тарифицируется по стандартным условиям Облака (1,68 руб/Гб на текущий момент).
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="registration" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Регистрация на Yandex Cloud и получение гранта
          </Typography>

          <Typography component="p" gutterBottom>
            Для создания сервера нам понадобится аккаунт в Yandex Cloud. Платформа предоставляет новым пользователям приветственный грант (обычно это <strong>4000 рублей на 60 дней</strong>), которого с лихвой хватит для тестирования и настройки виртуальной машины.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            <strong>Шаг 1. Авторизация</strong><br />
            Перейдите на официальный сайт <Link href="https://cloud.yandex.ru" target="_blank" rel="noopener" color="primary">cloud.yandex.ru</Link> и нажмите кнопку «Попробовать бесплатно». Авторизуйтесь с помощью вашего обычного аккаунта Яндекс (Яндекс ID) или создайте новый, если у вас его нет.
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Шаг 2. Создание платежного аккаунта</strong><br />
            После первого входа в консоль управления система предложит вам создать платежный аккаунт. Это обязательное условие для получения гранта и создания любых ресурсов в облаке. Заполните необходимую анкету (тип аккаунта — Физическое лицо).
          </Typography>
          <Box
            component="img"
            src="/images/payment.png"
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
            <strong>Шаг 3. Привязка банковской карты</strong><br />
            Для подтверждения регистрации и активации платежного аккаунта потребуется привязать банковскую карту, у вас будет списано и возвращено 11 рублей.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Где проверить баланс гранта?</strong><br />
            После успешной привязки карты стартовый грант будет активирован автоматически. Вы сможете отслеживать остаток средств гранта и срок его действия в левом меню консоли, перейдя в раздел <strong>«Биллинг»</strong> (иконка кошелька).
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="create-vm" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            3. Создание виртуальной машины
          </Typography>

          <Typography component="p" gutterBottom>
            Теперь перейдем к самому главному — созданию сервера. Мы настроим машину с оптимальными характеристиками, которая обойдется примерно в 500 рублей в месяц. Этой мощности (в сочетании со стартовым грантом) более чем достаточно для личного пользования.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            <strong>Шаг 1. Переход в Compute Cloud</strong><br />
            В левом меню консоли Yandex Cloud выберите сервис <strong>Compute Cloud</strong> и нажмите кнопку <strong>«Создать ВМ»</strong>.
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Шаг 2. Базовые параметры и ОС</strong><br />
            • В разделе <strong>Образ загрузочного диска</strong> оставьте <strong>Ubuntu</strong> последней версии.<br />
            • В поле <strong>Зона доступности</strong> выберите рекомендуемую <strong>ru-central1-d</strong>, именно в ней чаще всего выпадают чистые IP адреса.
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Шаг 3. Диски и файловые хранилища</strong><br />
            • <strong>Размер диска:</strong> установите 10 ГБ (тип диска HDD — самый дешевый, для работы прокси обычного жесткого диска хватит с запасом).<br />
          </Typography>

          <Typography component="p">
            <strong>Шаг 4. Вычислительные ресурсы</strong><br />
            <Box
              component="img"
              src="/images/resources.png"
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
            Чтобы уложиться в минимальную стоимость, установите следующие параметры в блоке характеристик "Своя конфигурация":<br />
            • Платформа: <strong>Intel Ice Lake</strong><br />
            • vCPU: <strong>2</strong><br />
            • Гарантированная доля vCPU: <strong>20%</strong><br />
            • RAM (Оперативная память): <strong>1 ГБ</strong><br />
            • Дополнительно: <strong>прерываемая</strong>
          </Typography>

          <Typography component="p" variant='caption' gutterBottom>
            Учтите, что минимальные характеристики подойдут на 15-20 устройств, если вам нужны большие мощности, то выберите характеристики под свои потребности.
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Шаг 5. Сетевые настройки</strong><br />
            Настройки сетевого интерфейса оставьте по умолчанию, но обязательно убедитесь, что Публичный IP-адрес выбран Автоматически.
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Шаг 5. Доступ к серверу</strong><br />
            Яндекс Облако требует использовать SSH-ключи для безопасного подключения (вход по паролю по умолчанию отключен).<br />
            • В поле <strong>Логин</strong> введите любой, кроме root.<br />
            • В поле <strong>SSH-ключ</strong> выберите <strong>«Добавить ключ»</strong>. Введите имя ключа и нажмите Сгенерировать ключ. Сохраните архив и откройте его, распакуйте ключи в папку:
          </Typography>
          <CodeBlock code={osPc === 'windows' ? `C:\\Users\\${userPc}\\.ssh` : `/home/${userPc}/.ssh`} />

          <Typography component="p" gutterBottom>
            Все остальное можно оставить по умолчанию. Нажмите кнопку <strong>Создать ВМ</strong> и дождитесь завершения процесса развертывания виртуальной машины, это может занять пару минут.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="ssh-connection" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            4. Подключение к ВМ и настройка перенаправления
          </Typography>
          <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
            Важно! На виртуальную машину устанавливается только скрипт перенаправления трафика. Таким образом, ВМ будет работать как зеркало.
          </Alert>

          <Typography component="p" gutterBottom>
            Теперь, когда виртуальная машина создана и у вас есть ее публичный IP-адрес, необходимо подключиться к ней и настроить перенаправление трафика на ваш основной сервер.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            <strong>Шаг 1. Подключение по SSH</strong><br />
            Откройте терминал ({osPc === 'windows' ? 'PowerShell' : 'Terminal'}). Для подключения используйте скачанный на предыдущем этапе SSH-ключ. Введите команду ниже, указав реальный путь к файлу ключа и IP-адрес сервера:
          </Typography>

          <CodeBlock code={`ssh -i ${osPc === 'windows' ? `C:\\Users\\${userPc}\\.ssh\\ssh-key-${userServer}` : `/home/${userPc}/.ssh/ssh-key-${userServer}`} ${userServer}@${relayIp}`} language="bash" />

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Шаг 2. Скачивание и запуск скрипта перенаправления</strong><br />
            Чтобы не прописывать правила маршрутизации (iptables) вручную, мы воспользуемся готовым автоматическим скриптом. Он сам включит форвардинг в ядре системы и настроит правила. По умолчанию перенаправляются порты <InlineCode>443</InlineCode>, <InlineCode>8443</InlineCode> и диапазон <InlineCode>10000:60000</InlineCode> для TCP и UDP.
          </Typography>

          <Typography component="p" gutterBottom>
            Скачайте скрипт командой:
          </Typography>
          <CodeBlock code='curl -O https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh' language="bash" />

          <Typography component="p" gutterBottom>
            При необходимости отредактируйте скрипт, указав нужные порты и диапазоны портов для TCP и UDP:
          </Typography>
          <CodeBlock code='sudo nano forwarding_install.sh' language="bash" />

          <Typography component="p" gutterBottom>
            Вы можете отредактировать данный участок кода, изменив порты или диапазоны портов::
          </Typography>
          <CodeBlock mb={1} code={'-A PREROUTING -p tcp -m multiport --dports 443,8443,10000:60000 -j DNAT --to-destination $ORIGIN_IP\n-A PREROUTING -p udp -m multiport --dports 443,8443,10000:60000 -j DNAT --to-destination $ORIGIN_IP'} copy={false} language="shell" />
          <Typography component="p">
            Выйти без сохранения: <InlineCode>Ctrl+X</InlineCode>
          </Typography>
          <Typography component="p" mb={4}>
            Выйти и сохранить изменения: <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl+X</InlineCode>
          </Typography>

          <Typography component="p" gutterBottom>
            Запустите скрипт, указав IP адрес основного сервера:
          </Typography>
          <CodeBlock mb={1} code={`export ORIGIN_IP="${vpnIp}"\nsudo -E bash forwarding_install.sh`} language="bash" />
          <Typography component="p">
            Если меняли скрипт то добавьте/удалите порты как в примере:
          </Typography>
          <Typography component="p">
            Добавить порт: <InlineCode copy={true}>sudo ufw allow 2443/tcp</InlineCode>
          </Typography>
          <Typography component="p" mb={4}>
            Удалить порт: <InlineCode copy={true}>sudo ufw delete allow 2443/tcp</InlineCode>
          </Typography>

          <Typography component="p" gutterBottom>
            Проверить, что правила применились, можно командой:
          </Typography>
          <CodeBlock code='sudo iptables -t nat -L -n -v' language="bash" />

          <Typography component="p" gutterBottom>
            После этого вы можете подключиться к мобильному интернету и проверить ваше подключение, заменив в ссылке IP адрес <InlineCode>{vpnIp}</InlineCode> → <InlineCode>{relayIp}</InlineCode>:
          </Typography>
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
                  <Typography component="span" variant='body2'>
                    vless://12e4ee6026f5-6ad6-4a8d-8036-22f4g9@<InlineCode>{relayIp}</InlineCode>:443?остальные_параметры_подключения
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Typography component="p" variant='caption' gutterBottom>
            Ссылку вы должны взять с вашего основного сервера, менять нужно только IP адрес, все остальное остается без изменений.
          </Typography>

          <Typography component="p" gutterBottom mt={2}>
            Если подключение на мобильном интернете успешно, то это значит, что вам удалось получить чистый IP адрес.
          </Typography>

          <Typography component="p" gutterBottom>
            Если подключение не выполняется, то вам необходимо снова перейти в Консоль управления Yandex Cloud и возле вашей ВМ нажать Остановить, а после остановки Запустить. Поскольку у вас динамический IP, то после перезапуска у вас будет новый IP адрес. Теперь проверьте подключение с новым IP адресом. Выполните эту процедуру пока не получите чистый IP.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="static-ip" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            5. Делаем IP-адрес статическим и защищаем от удаления
          </Typography>

          <Typography component="p" gutterBottom>
            Как только вы получили нужный IP адрес, важно сделать его статическим, чтобы после перезапуска он снова не изменился.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            <strong>Шаг 1. Переход в настройки сети</strong><br />
            В левом главном меню консоли Yandex Cloud найдите и выберите сервис <strong>Virtual Private Cloud</strong> (VPC), затем в левом подменю перейдите в раздел <strong>Публичные IP-адреса</strong>.
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Шаг 2. Делаем адрес статическим</strong><br />
            В списке вы увидите публичный IP-адрес, привязанный к вашей виртуальной машине. Нажмите на значок с тремя точками (<code>...</code>) справа от него и выберите пункт <strong>«Сделать статическим»</strong>.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Шаг 3. Включение защиты от удаления</strong><br />
            При удалении ВМ, также удаляется закрепленный за ней IP-адрес. Поэтому если вы хотите сохранить IP-адрес, то вам необходимо включить защиту от удаления.
          </Typography>

          <Typography component="p" gutterBottom>
            Снова нажмите на три точки справа от вашего IP-адреса и нажмите Включить защиту от удаления.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="auto-restart" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            6. Автоматический запуск прерываемой ВМ
          </Typography>

          <Typography component="p" gutterBottom>
            Если вы создали <strong>прерываемую</strong> виртуальную машину (для максимальной экономии), она будет принудительно останавливаться платформой минимум раз в 24 часа. Ниже описана настройка облачной функции, которая будет автоматически запускать ваш сервер после такой остановки.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            <strong>Шаг 1. Подготовка окружения</strong><br />
            В консоли управления перейдите в <strong>Service Accounts</strong> (Сервисные аккаунты) и создайте новый аккаунт, от имени которого будет вызываться функция. Имя напишите <InlineCode copy={true}>service-account</InlineCode>. Назначьте ему две роли: <InlineCode copy={true}>functions.functionInvoker</InlineCode> и <InlineCode copy={true}>lockbox.payloadViewer</InlineCode>.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Шаг 2. Создание секрета Yandex Lockbox</strong><br />
            Для безопасного хранения токена мы будем использовать сервис Lockbox.<br />
            1. Получите ваш OAuth-токен по <a href="https://yandex.cloud/ru/docs/iam/concepts/authorization/oauth-token" target="_blank" rel="noopener noreferrer" style={{ color: '#2a9fff', textDecoration: 'none' }}>этой ссылке</a>.<br />
            <Box
              component="img"
              src="/images/oauth.png"
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
            2. В консоли управления перейдите в сервис <strong>Lockbox</strong> и нажмите <strong>«Создать секрет»</strong>.<br />
            3. В поле <strong>Имя</strong> введите <InlineCode copy={true}>oauth-token</InlineCode>.<br />
            4. В поле <strong>Тип секрета</strong> выберите <strong>Пользовательский</strong>.<br />
            5. В блоке <strong>Версия</strong>:<br />
            &nbsp;&nbsp;&nbsp;• В поле <strong>Ключ</strong> введите <InlineCode copy={true}>key_token</InlineCode>.<br />
            &nbsp;&nbsp;&nbsp;• В поле <strong>Значение</strong> вставьте полученный ранее OAuth-токен.<br />
            6. Нажмите <strong>«Создать»</strong>.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Шаг 3. Создание функции</strong><br />
            Перейдите в сервис <strong>Cloud Functions</strong> и нажмите <strong>«Создать функцию»</strong>. Задайте имя <InlineCode copy={true}>function-restart-vms</InlineCode> и нажмите «Создать». В открывшемся окне настройте версию функции:
          </Typography>

          <Typography component="p" gutterBottom>
            • <strong>Среда выполнения:</strong> выберите <code>Node.js</code>, отключите опцию «Добавить файлы с примерами кода» и нажмите «Продолжить».<br />
            Скачайте архив со скриптом:
          </Typography>
          <Card sx={{
            mt: 1,
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
                  <FolderZipIcon />
                  <Link
                    href="/docs/function-js.zip"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="text.primary"
                    sx={{ fontSize: '1.1rem' }}
                  >
                    Скачать архив со скриптом
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Typography component="p" gutterBottom>
            • <strong>Источник кода:</strong> выберите <strong>ZIP-архив</strong>, нажмите «Прикрепить файл» и загрузите скачанный архив <InlineCode copy={true}>function-js.zip</InlineCode> <em>(архив со скриптом от Yandex)</em>.<br />
            • <strong>Точка входа:</strong> укажите <InlineCode copy={true}>index.handler</InlineCode>.
          </Typography>

          <Typography component="p" gutterBottom>
            В блоке <strong>Параметры</strong> укажите:<br />
            • Таймаут — <code>3</code>.<br />
            • Память — <code>128 МБ</code>.<br />
            • Сервисный аккаунт — выберите созданный на первом шаге аккаунт.<br />
            • <strong>Переменные окружения:</strong><br />
            &nbsp;&nbsp;&nbsp;1. <InlineCode copy={true}>FOLDER_ID</InlineCode> — идентификатор вашего каталога (можно найти на главной странице консоли).<br />
            &nbsp;&nbsp;&nbsp;2. <InlineCode copy={true}>INSTANCE_ID</InlineCode> — идентификатор вашей ВМ (длинная строка из букв и цифр в свойствах ВM).
          </Typography>

          <Typography component="p" gutterBottom>
            В блоке <strong>Секреты Lockbox</strong> добавьте секрет:<br />
            • Переменная окружения: <InlineCode copy={true}>OAUTHTOKEN</InlineCode><br />
            • Идентификатор секрета: выберите oauth-token<br />
            • Идентификатор версии: выберите текущую версию секрета<br />
            • Ключ секрета: выберите <code>key_token</code>
          </Typography>

          <Alert icon={<InfoIcon fontSize="inherit" />} severity="warning" sx={{ mb: 2 }}>
            <strong>Логирование:</strong> Если вы не хотите сохранять логи и платить за использование сервиса Cloud Logging, в блоке «Логирование» (в поле «Назначение») выберите <strong>«Не задано»</strong>. После этого нажмите <strong>«Сохранить изменения»</strong>.
          </Alert>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Шаг 4. Создание триггера</strong><br />
            Чтобы функция запускалась автоматически, перейдите в левом меню сервиса Cloud Functions в раздел <strong>Триггеры</strong> и нажмите «Создать триггер»:
          </Typography>

          <Typography component="p" gutterBottom>
            • Имя: <InlineCode copy={true}>timer</InlineCode><br />
            • Тип: <strong>Таймер</strong><br />
            • Запускаемый ресурс: <strong>Функция</strong><br />
            • Настройки таймера: введите <InlineCode copy={true}>* * ? * * *</InlineCode> (или выберите «Каждую минуту»).<br />
            • В блоке «Настройки функции» выберите вашу функцию <InlineCode copy={true}>function-restart-vms</InlineCode>, тег версии <InlineCode copy={true}>$latest</InlineCode> и укажите ваш сервисный аккаунт.<br />
            Нажмите <strong>«Создать триггер»</strong> (он начнет работать в течение 5 минут).
          </Typography>

          <Typography component="p" gutterBottom>
            <strong>Шаг 5. Проверьте работу функции</strong><br />
            Перейдите в Compute Cloud к списку ваших виртуальных машин. Напротив вашей ВМ нажмите на значок действий и выберите <strong>«Остановить»</strong>. Статус изменится на <em>Stopped</em>. Подождите 1-2 минуты и обновите страницу — статус должен автоматически измениться на <em>Running</em>.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="troubleshooting" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            7. Что делать, если IP-адрес перестал работать?
          </Typography>

          <Typography component="p" gutterBottom>
            Иногда случается, что ваш настроенный IP-адрес перестает работать. В этом случае не нужно переустанавливать всё с нуля — достаточно «переродить» сетевой адрес вашей машины.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            <strong>Способ 1. Циклическая смена IP</strong><br />
            1. Перейдите в раздел <strong>Virtual Private Cloud</strong> ➔ <strong>IP-адреса</strong>.<br />
            2. Найдите ваш адрес. Если он статический — нажмите на три точки и выберите <strong>«Сделать динамическим»</strong>. Если включена защита от удаления — сначала отключите её.<br />
            3. Остановите вашу виртуальную машину в разделе Compute Cloud и запустите её снова. При каждом таком перезапуске Яндекс будет выдавать вам новый случайный IP из пула.<br />
            4. Проверяйте доступность. Как только найдете «чистый» адрес, снова сделайте его статическим.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 3 }}>
            <strong>Способ 2. Смена зоны доступности</strong><br />
            Если вы перепробовали несколько адресов в текущей зоне (например, <InlineCode copy>ru-central1-d</InlineCode>) и все они оказываются недоступны, возможно, стоит попробовать другую зону.
          </Typography>

          <Typography component="p" gutterBottom>
            Для этого придется создать новую ВМ (см. Пункт 3), выбрав при создании другую зону доступности, например <InlineCode copy>ru-central1-b</InlineCode> или <InlineCode copy>ru-central1-e</InlineCode>.
          </Typography>

          <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
            После смены IP-адреса на стороне Яндекса, не забудьте обновить его в ваших ссылках подключения.
          </Alert>
        </Box>
      </Box>
    </>
  );
}