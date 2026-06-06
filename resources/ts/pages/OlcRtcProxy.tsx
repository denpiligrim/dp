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
  Alert,
  InputAdornment,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import WindowIcon from '@mui/icons-material/Window';
import LinuxIcon from '../svgIcons/LinuxIcon';
import AppleIcon from '@mui/icons-material/Apple';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PaidIcon from '@mui/icons-material/Paid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import AndroidIcon from '@mui/icons-material/Android';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import { COUNTRIES } from '../components/countries';
import AmneziaIcon from '../svgIcons/AmneziaIcon';
import CodeBlock from '../components/CodeBlock';
import { QrCode } from '../components/QrCode';
import FutureIcon from '../svgIcons/FutureIcon';

interface HelperData {
  text: string | JSX.Element;
  error: boolean;
}

const generateHexSecret = (len: number) => {
  const array = new Uint8Array(len);
  window.crypto.getRandomValues(array);

  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
const secret = generateHexSecret(32);
const client = generateHexSecret(4);

const transportOptions = {
  vp8channel: `vp8:
  fps: 60
  batch_size: 64`,
  seichannel: `sei:
  fps: 60
  batch_size: 64
  fragment_size: 900
  ack_timeout_ms: 2000`,
  videochannel: `video:
  codec: qrcode
  width: 1080
  height: 1080
  fps: 60
  bitrate: "5000k"
  hw: none`
};

export default function OlcRtcProxy() {
  const [osPc, setOsPc] = useState('windows');
  const [useSudo, setUseSudo] = useState(false);
  const [carrier, setCarrier] = useState('jitsi');
  const [transport, setTransport] = useState('datachannel');
  const [roomId, setRoomId] = useState('');
  const [authKey, setAuthKey] = useState(secret);
  const [anyId, setAnyId] = useState(false);
  const [modalLinkOpen, setModalLinkOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

  const changeCarrier = (value: string) => {
    if (value === 'telemost') {
      if (transport === 'datachannel' || transport === 'seichannel') {
        setTransport('vp8channel');
      }
    }
    setCarrier(value);
  }

  const openModalLink = () => {
    setModalLinkOpen(true);
  }

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="OlcRTC Proxy Guide" />
        <meta name="keywords" content="VPN, guide, tutorial, OlcRTC, Proxy, WebRTC, DPI bypass" />
        <meta property="og:title" content="OlcRTC Proxy" />
        <meta property="og:description" content="Полное руководство по настройке OlcRTC Proxy" />
        <title>OlcRTC Proxy</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/olcrtc-proxy'} />
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
                  "name": "OlcRTC Proxy",
                  "item": import.meta.env.VITE_APP_URL + '/guides/olcrtc-proxy'
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
          Настройка прокси OlcRTC
        </Typography>

        <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          На текущий момент рекомендуется использовать параметры Jitsi + datachannel (лучший пинг и скорость)
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
                  href="https://youtu.be/kxv7ET2cV1U"
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

        <Typography variant="caption" color="text.secondary" component="p" gutterBottom textAlign='center'>
          Заполните данные ниже. Команды для копирования автоматически обновятся под вашу конфигурацию.
        </Typography>

        <SupportModal
          open={supportModalOpen}
          onClose={() => setSupportModalOpen(false)}
        />

        <Paper sx={{ p: 3, mb: 1, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Вводные данные</Typography>

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Провайдер"
                value={carrier}
                onChange={(e) => changeCarrier(e.target.value)}
              >
                <MenuItem value="jitsi">Jitsi</MenuItem>
                <MenuItem value="wbstream">WB Stream</MenuItem>
                <MenuItem value="telemost">Yandex Telemost</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Transport"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
              >
                {carrier !== 'telemost' && (
                  <MenuItem value="datachannel">datachannel (максимальная скорость)</MenuItem>
                )}
                <MenuItem value="vp8channel">vp8channel (высокая скорость)</MenuItem>
                {carrier !== 'telemost' && (
                  <MenuItem value="seichannel">seichannel (средняя скорость)</MenuItem>
                )}
                <MenuItem value="videochannel">videochannel (низкая скорость)</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="ID звонка"
                variant="outlined"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.trim())}
                placeholder="75587912855134"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={openModalLink}>
                          <InfoIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Ключ шифрования"
                variant="outlined"
                value={authKey}
                onChange={(e) => setAuthKey(e.target.value.trim())}
                placeholder="d823fa01cb3e06..."
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setAuthKey(generateHexSecret(32))}>
                          <AutoFixHighIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
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

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary'>Дата: {new Date('05.08.2026').toLocaleDateString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary' sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('06.06.2026').toLocaleDateString()}</Typography>
          </Grid>
        </Grid>

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
                <ListItemButton component="a" href="#prerequisites" rel="noopener">
                  <ListItemText primary="1. Подготовка сервера и установка зависимостей" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#server-setup" rel="noopener">
                  <ListItemText primary="2. Установка и запуск сервера OlcRTC" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#client-setup" rel="noopener">
                  <ListItemText primary="3. Настройка клиента и подключение" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#update-server" rel="noopener">
                  <ListItemText primary="4. Обновление сервера OlcRTC" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#uninstall" rel="noopener">
                  <ListItemText primary="5. Удаление сервера OlcRTC" />
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
                <ListItemButton component="a" href="https://ishosting.io/affiliate/MjIwOSM2" target='_blank' rel="noopener">
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
                <ListItemButton component="a" href="https://github.com/openlibrecommunity/olcrtc" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Репозиторий проекта OlcRTC" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://github.com/alananisimov/olcbox" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Репозиторий клиента Olcbox" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://habr.com/ru/articles/1020114/" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Статья на Хабре" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://t.me/bschekbot?start=ref_kscjmjyf" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Бот для проверки IP/домена" />
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
                    href="https://ishosting.io/affiliate/MjIwOSM2"
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
            mb: 1,
            borderRadius: '15px',
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'none',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))'
          }}>
            <CardContent sx={{ p: '16px !important' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <FutureIcon />
                <Link href="https://t.me/futuresbp_bot?start=DenPiligrim" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>
                  Обход Глушилок / Белых списков
                </Link>
              </Stack>
            </CardContent>
          </Card>

          <Box
            component="img"
            src="/images/scheme.png"
            alt="Описание картинки"
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: '90%' },
              borderRadius: '15px',
              display: 'block',
              mx: 'auto',
              my: 4,
              p: 2,
              bgcolor: 'white',
            }}
          />

          <Typography id="prerequisites" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Подготовка сервера и установка зависимостей
          </Typography>
          <Typography component="p" gutterBottom>
            Для сборки OlcRTC на сервере потребуется установить систему сборки, <b>Go</b> версии не ниже 1.26 и <b>git</b>.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 1: Установка Go
          </Typography>
          <Typography component="p" gutterBottom>
            Если у вас не установлен Go, выполните загрузку последней версии (1.26.3 на момент написания статьи):
          </Typography>
          <CodeBlock code={`wget https://go.dev/dl/go1.26.3.linux-amd64.tar.gz`} />

          <Typography component="p" gutterBottom>
            Удалите старую версию и распакуйте скачанный архив в директорию /usr/local. Эта директория является стандартным местом установки Go:
          </Typography>
          <CodeBlock code={`<sudo>rm -rf /usr/local/go && <sudo>tar -C /usr/local -xzf go1.26.3.linux-amd64.tar.gz`} sudo={useSudo} />

          <Typography component="p" gutterBottom>
            Чтобы система знала, где находится установленный Go, и могла выполнять его команды из любой директории, нужно добавить путь к бинарным файлам Go в переменную окружения $PATH:
          </Typography>
          <CodeBlock code={`export PATH=$PATH:/usr/local/go/bin`} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 2: Установка Git
          </Typography>
          <CodeBlock code={`<sudo>apt install git `} sudo={useSudo} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 3: Установка системы сборки Mage
          </Typography>
          <CodeBlock
            code={`go install github.com/magefile/mage@latest\necho 'export PATH="$HOME/go/bin:$PATH"' >> ~/.bashrc\nsource ~/.bashrc`}
            sudo={false}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 4: Скачивание репозитория
          </Typography>
          <CodeBlock
            code={`git clone https://github.com/openlibrecommunity/olcrtc --recurse-submodules\ncd olcrtc`}
            sudo={false}
          />
          <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
            Обратите внимание на флаг <InlineCode>--recurse-submodules</InlineCode> — без него зависимые модули видеоканала не загрузятся и сборка завершится с ошибкой.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="server-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Установка и запуск сервера OlcRTC
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 1: Создание файла подкачки
          </Typography>
          <Typography component="p" gutterBottom sx={{ mt: 1 }}>
            Чтобы сборка не зависла, необходимо создать файл подкачки (swap). Он будет использоваться как дополнительная оперативная память во время сборки и при работе сервера. Выполните следующие команды:
          </Typography>
          <CodeBlock
            code={`<sudo>fallocate -l 2G /swapfile || <sudo>dd if=/dev/zero of=/swapfile bs=1M count=2048\n<sudo>chmod 600 /swapfile\n<sudo>mkswap /swapfile\n<sudo>swapon /swapfile\necho '/swapfile none swap sw 0 0' | <sudo>tee -a /etc/fstab`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 2: Сборка бинарного файла
          </Typography>
          <CodeBlock
            code={`mage build`}
            sudo={false}
          />
          <Typography component="p" gutterBottom sx={{ mt: 1 }}>
            Вот здесь придется подождать, пока завершится сборка!
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 1 }}>
            После завершения сборки исполняемый файл появится в директории <InlineCode>build/olcrtc-linux-amd64</InlineCode>.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 3: Получение {carrier === 'jitsi' ? 'ссылки' : 'ID'}  звонка
          </Typography>
          {carrier === 'jitsi' ? (
            <>
              <Typography component="p" gutterBottom>
                Jitsi - это сервис для аудио и видео конференций с открытым исходным кодом. И действительно, многие компании используют его на своих серверах, IP адреса которых находятся в Белом списке. Например, такой сервис есть у КриптоПро. Вы можете найти любой другой такой белый сервер, на котором установлен Jitsi.
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
                      <Typography component="p" gutterBottom>
                        К слову, есть <Link href="https://github.com/denpiligrim/jitsi-scanner" target="_blank" rel="noopener" color="text.primary" sx={{ fontSize: '1.1rem' }}>сканер</Link> хостов с Jitsi и <Link href="https://github.com/denpiligrim/jitsi-scanner/blob/main/found_jitsi_domains.txt" target="_blank" rel="noopener" color="text.primary" sx={{ fontSize: '1.1rem' }}>готовый список</Link> таких серверов
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Typography component="p" gutterBottom>
                Итак, давайте создадим комнату на сайте <Link href="https://meet.cryptopro.ru/" target="_blank" rel="noopener" color="primary">https://meet.cryptopro.ru/</Link> (либо на любом другом), придумав идентификатор (например, <InlineCode copy>{generateHexSecret(4)}</InlineCode>).
              </Typography>
            </>
          ) : (
            <Typography component="p" gutterBottom>
              Найдите ссылку в поиске <InlineCode copy>{carrier === 'wbstream' ? 'https://stream.wb.ru/room/' : 'https://telemost.yandex.ru/j/'}</InlineCode> (рекомендуется в <Link href={carrier === 'telemost' ? 'https://duckduckgo.com/?q=https%3A%2F%2Ftelemost.yandex.ru%2Fj%2F' : 'https://duckduckgo.com/?q=https%3A%2F%2Fstream.wb.ru%2Froom%2F'} target="_blank" rel="noopener" color="primary">DuckDuckGo</Link>) или создайте комнату.
            </Typography>
          )}
          <Grid container spacing={1}>
            {/* <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={anyId}
                    onChange={(e) => setAnyId(e.target.checked)}
                    color="primary"
                  />
                }
                label={<Typography fontWeight="medium">Сгенерировать ID автоматически (только для WB Stream и SaluteJazz!)</Typography>}
              />
            </Grid> */}
            {anyId && (
              <Grid size={{ xs: 12 }}>
                <Typography component="p" gutterBottom>
                  Выполните команду, чтобы создать комнату (звонок):
                </Typography>
                <CodeBlock
                  code={`ROOM_ID=$(./build/olcrtc-linux-amd64 -mode gen -carrier ${carrier} -dns 1.1.1.1:53 -amount 1 -data data)\necho "Room ID: $ROOM_ID"`}
                  sudo={false}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography component="p" gutterBottom>
                И введите {carrier === 'jitsi' ? 'полученную ссылку' : 'полученный ID'} в поле:
              </Typography>
              <TextField
                sx={{ mt: 1 }}
                fullWidth
                size='small'
                label={carrier === 'jitsi' ? 'Ссылка на комнату' : 'ID звонка'}
                variant="outlined"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.trim())}
                placeholder={carrier === 'jitsi' ? 'https://meet.jit.si/myroom' : '75587912855134'}
                helperText={roomId.length === 0 ? `Обязательно укажите ${carrier === 'jitsi' ? 'ссылку на комнату' : 'ID звонка'}!` : ''}
                error={roomId.length === 0}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={openModalLink}>
                          <InfoIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 4: Создание файла конфигурации
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте файл <InlineCode>server.yaml</InlineCode>:
          </Typography>
          <CodeBlock
            code={`<sudo>nano server.yaml`}
            sudo={useSudo}
          />
          <Typography component="p" gutterBottom>
            Добавьте в него следующее содержимое:
          </Typography>
          <CodeBlock
            code={`mode: srv
auth:
  provider: ${carrier}
room:
  id: "${roomId}"
crypto:
  key: "${authKey}"
net:
  transport: ${transport}
  dns: "8.8.8.8:53"${transport !== 'datachannel' ? '\n' + transportOptions[transport] : ''}
data: data`}
            language="yaml"
          />
          <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
            При необходимости вы можете сгенерировать ключ самостоятельно командой <InlineCode copy>openssl rand -hex 32</InlineCode>.
          </Typography>
          <Typography component="p" gutterBottom>
            Сохраните изменения <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl+X</InlineCode>.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'medium' }}>
            Шаг 5: Настройка фоновой работы (systemd)
          </Typography>
          <Typography component="p" gutterBottom>
            Чтобы сервер продолжал работать после закрытия терминала, настроим его как системную службу. Для удобства скопируем исполняемый файл в папку <InlineCode>/opt/olcrtc</InlineCode>:
          </Typography>
          <CodeBlock
            code={`<sudo>mkdir -p /opt/olcrtc\n<sudo>cp ./build/olcrtc-linux-amd64 ./server.yaml /opt/olcrtc/\n<sudo>rm -f ./server.yaml`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Создайте файл конфигурации службы:
          </Typography>
          <CodeBlock
            code={`<sudo>nano /etc/systemd/system/olcrtc.service`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Вставьте в него следующий код (параметры запуска уже подстроены под ваши настройки из блока выше):
          </Typography>
          <CodeBlock
            code={`[Unit]
Description=OlcRTC Proxy Server
After=network.target network-online.target

[Service]
Type=simple
WorkingDirectory=/opt/olcrtc
ExecStart=/opt/olcrtc/olcrtc-linux-amd64 server.yaml
Restart=always
RestartSec=5
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target`}
            language="ini"
          />
          <Typography component="p" gutterBottom>
            Сохраните изменения <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl+X</InlineCode>.
          </Typography>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Перезапустите демона, добавьте OlcRTC в автозагрузку и запустите службу:
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl daemon-reload\n<sudo>systemctl enable olcrtc.service\n<sudo>systemctl start olcrtc.service`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Проверить статус работы сервера:
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl status olcrtc.service`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Посмотреть логи:
          </Typography>
          <CodeBlock
            code={`<sudo>journalctl -u olcrtc.service -e`}
            sudo={useSudo}
          />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="client-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            3. Настройка клиента и подключение
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 1: Установка клиента Olcbox
          </Typography>
          <Typography component="p" gutterBottom>
            Скачайте <Link href="https://github.com/alananisimov/olcbox/releases/latest" target="_blank" rel="noopener">файл установки</Link> для вашего устройства <span style={{ textTransform: 'capitalize' }}>{osPc}</span>, установите и запустите.
          </Typography>
          {osPc === 'ios' && (
            <Typography component="p" gutterBottom>
              Для iOS установка приложения выполняется с помощью AltStore!
            </Typography>
          )}

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 2: Настройка клиента Olcbox
          </Typography>
          <Typography component="p" gutterBottom>
            Вставьте ссылку на подключение с аналогичными параметрами как на сервере:
          </Typography>
          <CodeBlock
            code={`olcrtc://${carrier}?${transport}@${roomId}#${authKey}$OlcRTC`}
            language='http'
          />
          <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
            Данные на сервере и на клиенте должны совпадать с точностью!
          </Typography>
          <QrCode processedLink={`olcrtc://${carrier}?${transport}@${roomId}#${authKey}$OlcRTC`} />

          <Typography component="p" gutterBottom>
            Альтернативно вы можете добавить подключение вручную, указав данные:
          </Typography>
          <Typography component="p" gutterBottom sx={{ overflowX: 'auto' }}>
            <b>Имя подключения:</b> любое<br />
            <b>Провайдер:</b> <InlineCode copy>{carrier}</InlineCode><br />
            <b>Транспорт:</b> <InlineCode copy>{transport}</InlineCode><br />
            {transport === 'vp8channel' && (
              <>
                <b>FPS:</b> <InlineCode copy>60</InlineCode><br />
                <b>Batch:</b> <InlineCode copy>64</InlineCode><br />
              </>
            )}
            {transport === 'seichannel' && (
              <>
                <b>FPS:</b> <InlineCode copy>60</InlineCode><br />
                <b>Batch:</b> <InlineCode copy>64</InlineCode><br />
                <b>Fragmentation:</b> <InlineCode copy>900</InlineCode><br />
                <b>Ack timeout:</b> <InlineCode copy>2000ms</InlineCode><br />
              </>
            )}
            {transport === 'videochannel' && (
              <>
                <b>Видео кодек:</b> <InlineCode copy>qrcode</InlineCode><br />
                <b>Ширина:</b> <InlineCode copy>1080</InlineCode><br />
                <b>Высота:</b> <InlineCode copy>1080</InlineCode><br />
                <b>FPS:</b> <InlineCode copy>60</InlineCode><br />
                <b>Битрейт:</b> <InlineCode copy>5000k</InlineCode><br />
                <b>Аппаратное ускорение:</b> <InlineCode copy>none</InlineCode><br />
              </>
            )}
            <b>ID звонка:</b> <InlineCode copy>{roomId}</InlineCode><br />
            <b>Ключ шифрования:</b> <InlineCode copy>{authKey}</InlineCode><br />
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="update-server" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            4. Обновление сервера OlcRTC
          </Typography>
          <Typography component="p" gutterBottom>
            Проект активно развивается, поэтому периодически сервер необходимо обновлять до актуальной версии из репозитория GitHub.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 1: Остановка службы и загрузка изменений
          </Typography>
          <Typography component="p" gutterBottom>
            Сначала останавливаем работающий сервер. Затем переходим в директорию с исходным кодом, скачиваем обновления и обязательно обновляем зависимые сабмодули:
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl stop olcrtc.service\ncd ~/olcrtc\ngit pull\ngit submodule update --init --recursive`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 2: Сборка и замена файлов
          </Typography>
          <Typography component="p" gutterBottom>
            Собираем новую версию (это перепишет старый бинарник в папке build) и копируем свежий исполняемый файл в рабочую директорию службы:
          </Typography>
          <CodeBlock
            code={`export PATH=$PATH:/usr/local/go/bin\nmage build\n<sudo>cp ./build/olcrtc-linux-amd64 /opt/olcrtc/`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 3: Запуск обновленного сервера
          </Typography>
          <Typography component="p" gutterBottom>
            Снова запускаем службу:
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl start olcrtc.service`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Проверить статус работы сервера или посмотреть логи можно командой:
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl status olcrtc.service`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom>
            После обновления обязательно скачайте свежую версию <Link href="https://github.com/alananisimov/olcbox/releases/latest" target="_blank" rel="noopener">файла установки</Link> для вашего устройства <span style={{ textTransform: 'capitalize' }}>{osPc}</span>, установите и запустите.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="uninstall" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            5. Удаление сервера OlcRTC
          </Typography>
          <Typography component="p" gutterBottom>
            Если вам необходимо полностью очистить сервер от OlcRTC, выполните следующие шаги.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 1: Остановка и отключение службы
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl stop olcrtc.service\n<sudo>systemctl disable olcrtc.service`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 2: Удаление файлов службы и перезагрузка демона
          </Typography>
          <CodeBlock
            code={`<sudo>rm /etc/systemd/system/olcrtc.service\n<sudo>systemctl daemon-reload`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 3: Удаление исполняемых файлов и данных
          </Typography>
          <Typography component="p" gutterBottom>
            Удаляем папку с бинарным файлом и рабочими данными (data), а также исходный код (если он остался в домашней директории):
          </Typography>
          <CodeBlock
            code={`<sudo>rm -rf /opt/olcrtc\nrm -rf ~/olcrtc`}
            sudo={useSudo}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 4: Удаление зависимостей (опционально)
          </Typography>
          <Typography component="p" gutterBottom>
            Если вы больше не планируете ничего собирать на Go, можно удалить установленные пакеты:
          </Typography>
          <CodeBlock
            code={`<sudo>rm -rf /usr/local/go\nrm -rf ~/go\nrm -f go1.26.3.linux-amd64.tar.gz\n<sudo>apt purge git -y\n<sudo>apt autoremove -y`}
            sudo={useSudo}
          />

        </Box>
      </Box>
      <Dialog
        open={modalLinkOpen}
        onClose={() => setModalLinkOpen(false)}
        aria-labelledby="modal-link-title"
        aria-describedby="modal-link-description"
      >
        <DialogTitle id="modal-link-title">
          Как получить ID звонка?
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setModalLinkOpen(false)}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            ID звонка можно скопировать из ссылки на звонок:
          </Typography>
          <Typography variant="body1">
            Для <b>Jitsi</b>: Создайте комнату и скопируйте ссылку целиком <InlineCode>https://meet.jit.si/myroom</InlineCode><br />
            Для <b>WB Stream</b>: https://stream.wb.ru/room/<InlineCode>sql_ninja</InlineCode><br />
            Для <b>Yandex Telemost</b>: https://telemost.yandex.ru/j/<InlineCode>78589119554769</InlineCode>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}