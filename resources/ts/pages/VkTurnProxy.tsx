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
  Alert
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
import wgConfig from '../../images/wg-config.png';

interface HelperData {
  text: string | JSX.Element;
  error: boolean;
}

export default function VkTurnProxy() {
  const [vpnIp, setVpnIp] = useState('1.1.1.1');
  const [vpnDomain, setVpnDomain] = useState('');
  const [osPc, setOsPc] = useState('windows');
  const [useSudo, setUseSudo] = useState(false);
  const [wgPort, setWgPort] = useState('2026');
  const [vkPort, setVkPort] = useState('56000');
  const [helperData, setHelperData] = useState<HelperData>({ text: '', error: false });
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

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

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="VK TURN Proxy Guide" />
        <meta name="keywords" content="VPN, guide, tutorial, VK TURN, Proxy" />
        <meta property="og:title" content="VK TURN Proxy" />
        <meta property="og:description" content="VK TURN Proxy Guide" />
        <title>VK TURN Proxy</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/vk-turn-proxy'} />
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
                  "name": "VK TURN Proxy",
                  "item": import.meta.env.VITE_APP_URL + '/guides/vk-turn-proxy'
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
          VK TURN Proxy
        </Typography>

        <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Для работы необходима установленная <Link href='/guides/ultimate-vpn#3x-ui' target="_blank" rel="noopener" color="primary">панель 3x-ui</Link>!
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
              justifyContent="center"
              alignItems="center"
            >

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
          Заполните данные вашего сервера ниже. Команды для копирования автоматически обновятся под вашу конфигурацию.
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
                label="Домен (опционально)"
                variant="outlined"
                value={vpnDomain}
                onChange={(e) => setVpnDomain(e.target.value.trim().toLowerCase())}
                placeholder="mydomain.com"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
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
                <ListItemButton component="a" href="#add-wireguard" rel="noopener">
                  <ListItemText primary="1. Добавление протокола Wireguard в 3x-ui" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#server-setup" rel="noopener">
                  <ListItemText primary="2. Настройка vk turn proxy на сервере" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#client-setup" rel="noopener">
                  <ListItemText primary="3. Настройка клиента и подключение" />
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
                <ListItemButton component="a" href="https://github.com/cacggghp/vk-turn-proxy" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Репозиторий проекта" />
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

          <Typography id="add-wireguard" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            1. Добавление протокола Wireguard в 3x-ui
          </Typography>
          <Typography component="p" gutterBottom>
            Показываю на примере панели 3x-ui (см. <Link href='/guides/ultimate-vpn#3x-ui' target="_blank" rel="noopener" color="primary">Установка панели 3x-ui</Link>), однако вы можете использовать любую утилиту на сервере с протоколом <b>Wireguard</b>.
          </Typography>
          <Typography component="p" gutterBottom>
            Откройте панель 3x-ui, перейдите в раздел подключений и создайте новое. Выберите протокол <b>Wireguard</b>.
          </Typography>
          <Box
            component="img"
            src={wgConfig}
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
            Порт выберите любой свободный, например <InlineCode copy>{wgPort}</InlineCode>.
          </Typography>
          <Typography component="p" gutterBottom>
            В настройках протокола установите значение <b>MTU</b> равным <InlineCode copy>1280</InlineCode>.
          </Typography>
          <Typography component="p" gutterBottom>
            Поле <b>Общий ключ (Pre-shared key)</b> оставьте пустым — указывать его не нужно. Все остальное оставьте по умолчанию.
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте подключение и откройте информацию о нем. Скопируйте ссылку вида <InlineCode>wireguard://</InlineCode> и сохраните ее, она понадобится вам в дальнейшем.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="server-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Настройка vk turn proxy на сервере
          </Typography>
          <Typography component="p" gutterBottom>
            Серверную часть необходимо установить и настроить на перенаправление трафика на ваш порт WireGuard <InlineCode>{wgPort}</InlineCode>.
          </Typography>

          <Typography component="p" gutterBottom>
            Создайте директорию для утилиты и скачайте бинарный файл:
          </Typography>
          <CodeBlock
            code={`<sudo>mkdir -p /opt/vk-turn-proxy\n<sudo>curl -L -o /opt/vk-turn-proxy/server-linux-amd64 https://github.com/cacggghp/vk-turn-proxy/releases/latest/download/server-linux-amd64\n<sudo>chmod +x /opt/vk-turn-proxy/server-linux-amd64`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom>
            Создайте файл службы systemd для фоновой работы:
          </Typography>
          <CodeBlock code={`<sudo>nano /etc/systemd/system/vk-turn-proxy.service`} sudo={useSudo} />

          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size='small'
                label="Порт WireGuard"
                variant="outlined"
                value={wgPort}
                onChange={(e) => setWgPort(e.target.value.trim())}
                placeholder='2026'
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                size='small'
                label="Порт VK TURN Proxy"
                variant="outlined"
                value={vkPort}
                onChange={(e) => setVkPort(e.target.value.trim())}
                placeholder='56000'
                fullWidth
              />
            </Grid>
          </Grid>

          <Typography component="p" gutterBottom>
            Вставьте следующий конфиг, в котором уже прописана команда для запуска сервера:
          </Typography>
          <CodeBlock
            code={`[Unit]
Description=VK Turn Proxy Service
After=network.target

[Service]
Type=simple
ExecStart=/opt/vk-turn-proxy/server-linux-amd64 -listen 0.0.0.0:${vkPort} -connect 127.0.0.1:${wgPort}
KillMode=process
Restart=always
RestartSec=5
User=nobody
Group=nogroup
StandardOutput=append:/var/log/vk-turn-proxy/vk-turn-proxy.log
StandardError=append:/var/log/vk-turn-proxy/vk-turn-proxy_error.log
SyslogIdentifier=vk-turn-proxy

[Install]
WantedBy=multi-user.target`}
            language="ini"
          />

          <Typography component="p" gutterBottom>
            Создайте папку для логов:
          </Typography>
          <CodeBlock
            code={`<sudo>mkdir -p /var/log/vk-turn-proxy\n<sudo>chown nobody:nogroup /var/log/vk-turn-proxy`}
            sudo={useSudo}
          />

          <Typography component="p" gutterBottom>
            Перезагрузите демоны и запустите сервис:
          </Typography>
          <CodeBlock
            code={`<sudo>systemctl daemon-reload\n<sudo>systemctl enable vk-turn-proxy.service\n<sudo>systemctl start vk-turn-proxy.service`}
            sudo={useSudo}
          />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="client-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            3. Настройка клиента и подключение
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 1: Получение ссылки на VK звонок
          </Typography>
          <Typography component="p" gutterBottom>
            С аккаунта ВКонтакте создайте ссылку на звонок вида <InlineCode copy>https://vk.com/call/join/</InlineCode> либо загуглите эту ссылку (рекомендуется в <Link href="https://duckduckgo.com/?q=https%3A%2F%2Fvk.com%2Fcall%2Fjoin%2F" target="_blank" rel="noopener" color="primary">DuckDuckGo</Link>).
          </Typography>
          <Alert icon={<InfoIcon fontSize="inherit" />} severity="warning" sx={{ mb: 2, mt: 1 }}>
            Эта ссылка будет действовать бесконечно, главное — <b>никогда не нажимать кнопку «Завершить звонок для всех»</b> в интерфейсе звонка.
          </Alert>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 2: Настройка клиента
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            {osPc === 'android' && (
              <li>
                <Typography component="span" gutterBottom>
                  Для Android рекомендуется ипользовать приложение <Link href="https://github.com/samosvalishe/turn-proxy-android/releases/latest" target="_blank" rel="noopener">turn-proxy-android</Link>.
                </Typography>
              </li>
            )}
            <li>
              <Typography component="span" gutterBottom>
                Скачайте и установите приложение для вашей ОС по ссылке <Link href="https://github.com/cacggghp/vk-turn-proxy#android" target="_blank" rel="noopener">vk-turn-proxy</Link> либо <Link href="https://github.com/cacggghp/vk-turn-proxy/releases/latest" target="_blank" rel="noopener">оригинальный клиент</Link>.
              </Typography>
            </li>
            <li>
              <Typography component="span" gutterBottom>
                Откройте приложение и создайте новое подключение.
              </Typography>
            </li>
            <li>
              <Typography component="span" gutterBottom>
                Введите IP-адрес/домен вашего сервера <InlineCode copy>{vpnDomain.length > 0 ? vpnDomain : vpnIp}</InlineCode> и порт <InlineCode copy>{vkPort}</InlineCode>.
              </Typography>
            </li>
            <li>
              <Typography component="span" gutterBottom>
                Вставьте ранее скопированную ссылку на VK звонок.
              </Typography>
            </li>
            <li>
              <Typography component="span" gutterBottom>
                Запустите проксирование в приложении. Локально на устройстве поднимется сервер (по умолчанию на порту <InlineCode>9000</InlineCode>).
              </Typography>
            </li>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Шаг 3: Настройка подключения в приложении Happ
          </Typography>
          <Typography component="p" gutterBottom>
            Теперь вам нужно изменить конфигурацию WireGuard из панели 3x-ui, чтобы трафик шел не напрямую на сервер, а через локальный клиент turn-proxy.
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span" gutterBottom>
                Вставьте ссылку <InlineCode>wireguard://</InlineCode> из вашей панели 3x-ui в клиент <b>Happ</b>.
              </Typography>
            </li>
            <li>
              <Typography component="span" gutterBottom>
                Измените адрес сервера (Endpoint) на локальный: <InlineCode copy>127.0.0.1:9000</InlineCode>. Подключитесь.
              </Typography>
            </li>
          </Box>

        </Box>
      </Box>
    </>
  );
}