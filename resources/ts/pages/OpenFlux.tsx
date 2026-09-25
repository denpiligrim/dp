import { useState } from 'react';
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Checkbox,
  FormControlLabel,
  Link,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import PaidIcon from '@mui/icons-material/Paid';
import LinuxIcon from '../svgIcons/LinuxIcon';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import InlineCode from '../components/InlineCode';
import CodeBlock from '../components/CodeBlock';
import SupportModal from '../components/SupportModal';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import FutureIcon from '../svgIcons/FutureIcon';

const transports = [
  { value: 'yandex', label: 'Yandex.Docs', hint: 'Публичная ссылка на документ Яндекса' },
  { value: 'mailru', label: 'Mail.ru Docs', hint: 'Публичная ссылка на документ Mail.ru' },
  { value: 'vyandex', label: 'Yandex Volga', hint: 'Публичная ссылка на документ Яндекса в новом редакторе' },
  { value: 'boards', label: 'Yandex Board', hint: 'Публичная ссылка на доску Яндекса' },
  { value: 'cupsonline', label: 'Cups.online', hint: 'На сервере URL не требуется' },
  { value: 'oneme', label: 'MAX / OneMe', hint: 'Потребуются токен и UID' },
];

export default function OpenFlux() {
  const [useSudo, setUseSudo] = useState(false);
  const [transport, setTransport] = useState('yandex');
  const [mode, setMode] = useState('l3');
  const [url, setUrl] = useState('https://example.com/zoibcuP5mBYUA');
  const [maxToken, setMaxToken] = useState('YOUR_MAX_TOKEN');
  const [maxUid, setMaxUid] = useState('YOUR_MAX_UID');
  const [useEncryption, setUseEncryption] = useState(false);
  const [useNegotiation, setUseNegotiation] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();
  const ytUrl = 'https://youtu.be/tmDn3ooAYhY';

  const transportArgs = transport === 'oneme'
    ? `--transport=oneme --maxToken=\"${maxToken}\" --maxUid=\"${maxUid}\"`
    : transport === 'cupsonline'
      ? '--transport=cupsonline'
      : `--transport=${transport} --url=\"${url}\"`;
  const encryptionArg = useEncryption ? ' --encryption-key-file=/opt/openflux/secret.txt' : '';
  const negotiationArg = useEncryption && useNegotiation ? ' --negotiate' : '';
  const exitCommand = `/opt/openflux/openflux --role=exit --mode=${mode} ${transportArgs}${encryptionArg}${negotiationArg}`;
  const clientCommand = `./openflux --role=client --inbound=socks5 ${transportArgs} --socks5=:1080${encryptionArg}${negotiationArg}`;

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Установка и настройка OpenFlux на Ubuntu и Debian" />
        <meta name="keywords" content="OpenFlux, Ubuntu, Debian, Linux, SOCKS5, proxy, guide" />
        <meta property="og:title" content="Установка OpenFlux" />
        <meta property="og:description" content="Полное руководство по установке OpenFlux на Ubuntu и Debian" />
        <title>Установка OpenFlux</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/openflux'} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Homepage', item: 'https://denpiligrim.ru/' },
              { '@type': 'ListItem', position: 2, name: 'Guides', item: import.meta.env.VITE_APP_URL + '/guides' },
              { '@type': 'ListItem', position: 3, name: 'OpenFlux', item: import.meta.env.VITE_APP_URL + '/guides/openflux' },
            ],
          })}
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
          Установка OpenFlux
        </Typography>

        <Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Руководство рассчитано на сервер и клиент с Ubuntu/Debian. Для exit-ноды на Linux рекомендуется режим <InlineCode>L3</InlineCode>.
        </Alert>

        <Card sx={{
          mb: 4,
          borderRadius: '15px',
          bgcolor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'none',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))',
        }}>
          <CardContent sx={{ p: '16px !important' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center">
                <YouTubeIcon sx={{ color: '#FF0000', fontSize: '2rem' }} />
                <Link
                  href={ytUrl}
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

        <Typography variant="caption" color="text.secondary" component="p" gutterBottom textAlign="center">
          Заполните параметры — команды запуска и systemd-служба обновятся автоматически.
        </Typography>

        <SupportModal open={supportModalOpen} onClose={() => setSupportModalOpen(false)} />

        <Paper sx={{ p: 3, mb: 1, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Вводные данные</Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField select fullWidth label="Транспорт" value={transport} onChange={(event) => setTransport(event.target.value)}>
                {transports.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField select fullWidth label="Режим exit-ноды" value={mode} onChange={(event) => setMode(event.target.value)}>
                <MenuItem value="l3">L3 — быстрее, нужен root</MenuItem>
                <MenuItem value="l4">L4 — без root, медленнее</MenuItem>
              </TextField>
            </Grid>
            {transport !== 'cupsonline' && transport !== 'oneme' && (
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Публичная ссылка / URL" value={url} onChange={(event) => setUrl(event.target.value)} helperText={transports.find((item) => item.value === transport)?.hint} />
              </Grid>
            )}
            {transport === 'oneme' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="MAX Token" value={maxToken} onChange={(event) => setMaxToken(event.target.value)} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="MAX UID" value={maxUid} onChange={(event) => setMaxUid(event.target.value)} /></Grid>
              </>
            )}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel control={<Checkbox checked={useSudo} onChange={(event) => setUseSudo(event.target.checked)} color="primary" />} label={<Typography fontWeight="medium">Использовать <b>sudo</b> в командах</Typography>} />
              <FormControlLabel control={<Checkbox checked={useEncryption} onChange={(event) => { setUseEncryption(event.target.checked); if (!event.target.checked) setUseNegotiation(false); }} color="primary" />} label={<Typography fontWeight="medium">Использовать шифрование AES-256-GCM</Typography>} />
              <FormControlLabel
                control={<Checkbox checked={useNegotiation} disabled={!useEncryption} onChange={(event) => setUseNegotiation(event.target.checked)} color="primary" />}
                label={<Typography fontWeight="medium">Защищённое согласование сессии (<InlineCode>--negotiate</InlineCode>)</Typography>}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography component="p" variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>ОС на сервере:</span> <LinuxIcon /> <b>Ubuntu, Debian</b>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}><Typography variant="body1" color="textSecondary">Дата: {new Date('09.25.2026').toLocaleDateString()}</Typography></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Typography variant="body1" color="textSecondary" sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('09.25.2026').toLocaleDateString()}</Typography></Grid>
        </Grid>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="openflux-content" id="openflux-header"><Typography component="span">Содержание</Typography></AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              <ListItem><ListItemButton component="a" href="#prerequisites" rel="noopener"><ListItemText primary="1. Подготовка сервера и установка зависимостей" /></ListItemButton></ListItem>
              <ListItem><ListItemButton component="a" href="#server-setup" rel="noopener"><ListItemText primary="2. Установка и запуск сервера OpenFlux" /></ListItemButton></ListItem>
              <ListItem><ListItemButton component="a" href="#client-setup" rel="noopener"><ListItemText primary="3. Настройка клиента и подключение" /></ListItemButton></ListItem>
              <ListItem><ListItemButton component="a" href="#captchas" rel="noopener"><ListItemText primary="4. CAPTCHA и ошибки запуска транспорта" /></ListItemButton></ListItem>
              <ListItem><ListItemButton component="a" href="#update-server" rel="noopener"><ListItemText primary="5. Обновление сервера OpenFlux" /></ListItemButton></ListItem>
              <ListItem><ListItemButton component="a" href="#uninstall" rel="noopener"><ListItemText primary="6. Удаление сервера OpenFlux" /></ListItemButton></ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="openflux-links-content" id="openflux-links-header"><Typography component="span">Полезные ссылки</Typography></AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              <ListItem><ListItemButton component="a" href="https://ishosting.io/affiliate/MjIwOSM4" target="_blank" rel="noopener"><ListItemIcon><LaunchIcon /></ListItemIcon><ListItemText primary="Аренда зарубежного сервера" /></ListItemButton></ListItem>
              <ListItem><ListItemButton component="a" href="https://beget.com/p1519472" target="_blank" rel="noopener"><ListItemIcon><LaunchIcon /></ListItemIcon><ListItemText primary="Аренда РУ сервера и домен" /></ListItemButton></ListItem>
              <ListItem><ListItemButton component="a" href="https://github.com/p1neappleXpress/OpenFlux" target="_blank" rel="noopener"><ListItemIcon><LaunchIcon /></ListItemIcon><ListItemText primary="Репозиторий проекта OpenFlux" /></ListItemButton></ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Box component="article">
          <Card sx={{ mt: 2, mb: 1, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))' }}>
            <CardContent sx={{ p: '16px !important' }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center"><Stack direction="row" spacing={1.5} alignItems="center"><IshostingIcon /><Link href="https://ishosting.io/affiliate/MjIwOSM4" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>Аренда зарубежного сервера</Link></Stack></Stack></CardContent>
          </Card>
          <Card sx={{ mb: 1, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))' }}>
            <CardContent sx={{ p: '16px !important' }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center"><Stack direction="row" spacing={1.5} alignItems="center"><BegetIcon /><Link href="https://beget.com/p1519472" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>Аренда РУ сервера и домен</Link></Stack></Stack></CardContent>
          </Card>
          <Card sx={{ mb: 1, borderRadius: '15px', bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: 'none', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))' }}>
            <CardContent sx={{ p: '16px !important' }}><Stack direction="row" spacing={1.5} alignItems="center"><FutureIcon /><Link href="https://t.me/futuresbp_bot?start=DenPiligrim" target="_blank" rel="noopener" underline="hover" color="text.primary" sx={{ fontSize: '1.1rem' }}>Обход Глушилок / Белых списков</Link></Stack></CardContent>
          </Card>

          <Typography component="p" gutterBottom sx={{ mt: 4 }}>
            Клиент принимает подключения через локальный SOCKS5-прокси и передаёт пакеты exit-ноде через выбранный транспорт. Exit-нода отправляет трафик в интернет в режиме L3 или L4. Транспорт, URL, кодек и ключ шифрования на обеих сторонах должны совпадать.
          </Typography>
          <CodeBlock code={`Клиент (SOCKS5 :1080)\n            │\n            ▼\n${transports.find((item) => item.value === transport)?.label}\n            │\n            ▼\nLinux exit-нода (${mode.toUpperCase()}) ──► Интернет`} copy={false} />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography id="prerequisites" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>1. Подготовка сервера и установка зависимостей</Typography>

          <Typography component="p" gutterBottom>Для сборки OpenFlux потребуется установить <b>Go</b> версии, указанной в <InlineCode>go.mod</InlineCode>, и <b>git</b>.</Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Шаг 1: Установка Go</Typography>
          <Typography component="p" gutterBottom>Загрузите актуальную для проекта версию Go (1.27.1 на момент написания статьи):</Typography>
          <CodeBlock code={`wget https://go.dev/dl/go1.27.1.linux-amd64.tar.gz`} />
          <Typography component="p" gutterBottom>Удалите старую версию и распакуйте архив в стандартную директорию <InlineCode>/usr/local</InlineCode>:</Typography>
          <CodeBlock code={`<sudo>rm -rf /usr/local/go && <sudo>tar -C /usr/local -xzf go1.27.1.linux-amd64.tar.gz`} sudo={useSudo} />
          <Typography component="p" gutterBottom>Добавьте путь к бинарным файлам Go в переменную окружения:</Typography>
          <CodeBlock code={`export PATH=$PATH:/usr/local/go/bin`} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Шаг 2: Установка Git</Typography>
          <CodeBlock code={`<sudo>apt update\n<sudo>apt install git -y`} sudo={useSudo} />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Шаг 3: Скачивание репозитория</Typography>
          <CodeBlock code={`git clone https://github.com/p1neappleXpress/OpenFlux.git\ncd OpenFlux`} />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography id="server-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>2. Установка и запуск сервера OpenFlux</Typography>

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
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Шаг 2: Сборка OpenFlux</Typography>
          <CodeBlock code={`go mod tidy\ngo build -o openflux .\n./openflux --help`} />
          <Typography component="p" gutterBottom>
            Перенесите бинарный файл в отдельную директорию. Команда запуска ниже уже учитывает выбранную конфигурацию.
          </Typography>
          <CodeBlock code={`<sudo>mkdir -p /opt/openflux\n<sudo>install -m 755 ./openflux /opt/openflux/openflux`} sudo={useSudo} />

          {useEncryption && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Создание общего ключа шифрования</Typography>
              <Typography component="p" gutterBottom>Скопируйте один и тот же файл <InlineCode>secret.txt</InlineCode> на сервер и клиент по защищённому каналу.</Typography>
              <CodeBlock code={`openssl rand -hex 32 | <sudo>tee /opt/openflux/secret.txt > /dev/null\n<sudo>chmod 600 /opt/openflux/secret.txt`} sudo={useSudo} />
            </>
          )}

          {mode === 'l3' && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Правило для режима L3</Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Ядро Linux генерирует RST для соединений, которые оно не открывало. Предпочтителен вариант с отдельным исходящим IP и параметром <InlineCode>--local-ip</InlineCode>. Команда ниже — общий запасной вариант для хоста.
              </Alert>
              <Typography component="p" gutterBottom>
                Сохраним правило через UFW, чтобы оно автоматически применялось после перезагрузки. Если UFW ещё не установлен, первая команда установит его. До включения файрвола текущий SSH-порт будет разрешён, поэтому доступ к консоли сохранится. Уже существующие правила UFW не удаляются. Правило блокировки RST добавляется перед <InlineCode>RELATED,ESTABLISHED</InlineCode>: иначе UFW примет эти пакеты раньше, чем они попадут под блокировку.
              </Typography>
              <CodeBlock code={`<sudo>apt install -y ufw
SSH_PORT=$(<sudo>sshd -T | awk '/^port / { print $2; exit }')
SSH_PORT=\${SSH_PORT:-22}
<sudo>ufw allow "$SSH_PORT/tcp"
<sudo>cp /etc/ufw/before.rules /etc/ufw/before.rules.openflux.bak
<sudo>sed -i '/^-A ufw-before-output -p tcp --tcp-flags RST RST -j DROP$/d' /etc/ufw/before.rules
<sudo>sed -i '/^-A ufw-before-output .*RELATED,ESTABLISHED.*-j ACCEPT$/i -A ufw-before-output -p tcp --tcp-flags RST RST -j DROP' /etc/ufw/before.rules
<sudo>ufw --force enable
<sudo>ufw reload
<sudo>ufw status verbose
<sudo>iptables -L ufw-before-output -n -v --line-numbers`} sudo={useSudo} />
              <Typography component="p" gutterBottom>
                В выводе последней команды правило <InlineCode>DROP ... tcp flags:0x04/0x04</InlineCode> должно находиться выше <InlineCode>RELATED,ESTABLISHED</InlineCode>. Во время подключения через OpenFlux счётчик <InlineCode>pkts</InlineCode> у правила DROP должен увеличиваться.
              </Typography>
            </>
          )}

          {transport === 'cupsonline' && <Typography component="p" gutterBottom>Сервер выведет список комнат в Base64. Скопируйте его и укажите клиенту через <InlineCode>--url</InlineCode>.</Typography>}

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Запуск через systemd</Typography>
          <CodeBlock code={`<sudo>nano /etc/systemd/system/openflux.service`} sudo={useSudo} />
          <CodeBlock language="ini" code={`[Unit]
Description=OpenFlux exit node
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/opt/openflux
ExecStart=${exitCommand}
Restart=always
RestartSec=5
${mode === 'l3' ? 'User=root\n' : ''}LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target`} />
          <Typography component="p" gutterBottom>Сохраните файл: <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl+X</InlineCode>.</Typography>
          <CodeBlock code={`<sudo>systemctl daemon-reload\n<sudo>systemctl enable --now openflux.service\n<sudo>systemctl status openflux.service`} sudo={useSudo} />
          <Typography component="p" gutterBottom>Журнал службы:</Typography>
          <CodeBlock code={`<sudo>journalctl -u openflux.service -e -f`} sudo={useSudo} />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography id="client-setup" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>3. Настройка клиента и подключение</Typography>
          <Typography component="p" gutterBottom>
            Повторите раздел сборки на клиентском компьютере. Затем запустите локальный SOCKS5-прокси:
          </Typography>
          <CodeBlock code={clientCommand} />
          <Typography component="p" gutterBottom>
            Укажите в браузере или приложении SOCKS5-прокси <InlineCode copy>127.0.0.1:1080</InlineCode>. Если приложение поддерживает удалённое разрешение DNS через SOCKS5, включите его.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Кодек по умолчанию — batched + zstd. Параметр <InlineCode>--codec=legacy</InlineCode> добавляйте одновременно на клиенте и сервере только для совместимости со старыми версиями.
          </Alert>
          {useNegotiation && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <InlineCode>--negotiate</InlineCode> должен быть включён на обеих обновлённых сторонах вместе с одинаковым ключом шифрования и кодеком. Режим не подключается к незашифрованным или старым узлам; клиент прекращает попытку примерно через 20 секунд при неверном ключе или несовместимых настройках.
            </Alert>
          )}

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography id="captchas" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>4. CAPTCHA и ошибки запуска транспорта</Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            CAPTCHA вида <InlineCode>showcaptchafast</InlineCode> — это proof-of-work проверка Яндекса. В актуальном OpenFlux транспорт решает её автоматически; открывать ссылку из журнала вручную не нужно.
          </Alert>
          <Typography component="p" gutterBottom>
            Сообщение <InlineCode>Failed to start transport: auth: client-config not found</InlineCode> со ссылкой на <InlineCode>showcaptchafast</InlineCode> означает, что вместо документа Яндекс временно вернул проверку. Это ошибка запуска конкретного транспорта, а не падение всего клиента. После автоматического решения транспорт переподключается; в сессии с несколькими транспортами не запустившийся транспорт повторяет попытки в фоне с увеличивающейся задержкой.
          </Typography>
          <Typography component="p" gutterBottom>
            SmartCaptcha и страница входа требуют участия приложения. Ядро запускают с <InlineCode>--ipc-socket=PATH</InlineCode>: приложение получает запрос, открывает страницу во встроенном браузере и возвращает cookies. Если проверку получила exit-нода, запрос и cookies могут быть переданы через другой работающий транспорт, а локальный прокси приложения откроет страницу с IP exit-ноды. Обычный CLI без приложения не сможет показать такую проверку пользователю.
          </Typography>
          <Typography component="p" gutterBottom>
            Cookies сохраняются в <InlineCode>./cookies-&lt;transport&gt;.json</InlineCode> и используются после перезапуска. Для службы из этого гайда файл окажется в <InlineCode>/opt/openflux</InlineCode>, потому что эта директория задана как <InlineCode>WorkingDirectory</InlineCode>. У пользователя службы должны быть права на запись в неё.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Если транспорт не восстановился</Typography>
          <CodeBlock code={`<sudo>journalctl -u openflux.service -e --no-pager\n<sudo>systemctl restart openflux.service\n<sudo>journalctl -u openflux.service -e -f`} sudo={useSudo} />
          <Typography component="p" gutterBottom>
            Убедитесь, что клиент и exit-нода обновлены вместе, используют один транспорт, URL, кодек и — если включены — одинаковый ключ и параметр <InlineCode>--negotiate</InlineCode>. Для SmartCaptcha используйте клиентское приложение с поддержкой IPC либо временно выберите другой транспорт.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography id="update-server" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>5. Обновление сервера OpenFlux</Typography>
          <CodeBlock code={`cd ~/OpenFlux\ngit pull\ngo mod download\ngo build -trimpath -ldflags=\"-s -w\" -o openflux .\n<sudo>systemctl stop openflux.service\n<sudo>install -m 755 ./openflux /opt/openflux/openflux\n<sudo>systemctl start openflux.service\n<sudo>systemctl status openflux.service`} sudo={useSudo} />
          <Typography component="p" gutterBottom>После изменения формата протокола обновляйте клиент и exit-ноду вместе.</Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />
          <Typography id="uninstall" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>6. Удаление сервера OpenFlux</Typography>
          <CodeBlock code={`<sudo>systemctl disable --now openflux.service\n<sudo>rm /etc/systemd/system/openflux.service\n<sudo>systemctl daemon-reload\n<sudo>rm -rf /opt/openflux`} sudo={useSudo} />
          {mode === 'l3' && (
            <>
              <Typography component="p" gutterBottom>
                Удалите правило OpenFlux из UFW и перезагрузите файрвол. Остальные правила, включая разрешение SSH, останутся без изменений:
              </Typography>
              <CodeBlock code={`<sudo>sed -i '/^-A ufw-before-output -p tcp --tcp-flags RST RST -j DROP$/d' /etc/ufw/before.rules
<sudo>ufw reload`} sudo={useSudo} />
            </>
          )}
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>Шаг 4: Удаление зависимостей (опционально)</Typography>
          <Typography component="p" gutterBottom>Если Go и Git больше не нужны, удалите их:</Typography>
          <CodeBlock code={`<sudo>rm -rf /usr/local/go\nrm -rf ~/go\nrm -f go1.27.1.linux-amd64.tar.gz\n<sudo>apt purge git -y\n<sudo>apt autoremove -y`} sudo={useSudo} />
        </Box>
      </Box>
    </>
  );
}
