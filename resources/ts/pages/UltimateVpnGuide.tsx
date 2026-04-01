import { useState } from 'react';
import {
  Box, Typography, TextField, FormControlLabel, Checkbox,
  Paper, IconButton, Tooltip, Divider,
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
  InputAdornment
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WindowIcon from '@mui/icons-material/Window';
import LinuxIcon from '../svgIcons/LinuxIcon';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PaidIcon from '@mui/icons-material/Paid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import InlineCode from '../components/InlineCode';
import SupportModal from '../components/SupportModal';
import amneziaImg from '../../images/amnezia.png';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';

const CodeBlock = ({ code, language = 'bash' }: { code: string, language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: 'relative', mb: 4, borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
        <Tooltip title={copied ? "Скопировано!" : "Копировать код"}>
          <IconButton
            onClick={handleCopy}
            sx={{
              color: copied ? '#4caf50' : 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, padding: '24px 20px', fontSize: '14px', background: '#1e1e1e' }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

const generateHexSecret = () => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);

  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export default function UltimateVpnGuide() {
  const [vpnIp, setVpnIp] = useState('1.1.1.1');
  const [vpnDomain, setVpnDomain] = useState('example.com');
  const [email, setEmail] = useState('my@email.com');
  const [useRelay, setUseRelay] = useState(false);
  const [relayIp, setRelayIp] = useState('2.2.2.2');
  const [relayDomain, setRelayDomain] = useState('relay.example.com');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  const hy2Pass = Math.random().toString(36).slice(-10);
  const hy2ObfsPass = Math.random().toString(36).slice(-10);

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Ultimate VPN Guide" />
        <meta name="keywords" content="VPN, guide, tutorial, setup" />
        <meta property="og:title" content="Ultimate VPN Guide" />
        <meta property="og:description" content="Ultimate VPN Guide" />
        <title>Ultimate VPN Guide</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides/ultimate-vpn'} />
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
                  "name": "Ultimate VPN Guide",
                  "item": import.meta.env.VITE_APP_URL + '/guides/ultimate-vpn'
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
          Ультимативный ВПН сервер
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
                  href="https://youtu.be/-AVFKZdhmNY"
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
                label="IP ВПН сервера"
                variant="outlined"
                value={vpnIp}
                onChange={(e) => setVpnIp(e.target.value.trim().toLowerCase())}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Домен ВПН сервера"
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography component="p" variant='body2' gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>ОС на компьютере:</span> <WindowIcon /> <b>Windows</b>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                <ListItemButton component="a" href="#ssh-key" rel="noopener">
                  <ListItemText primary="1. Настройка подключения к серверу по SSH ключу" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#firewall" rel="noopener">
                  <ListItemText primary="2. Настройка файрвола и обновление пакетов" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#ssl-cert" rel="noopener">
                  <ListItemText primary="3. Установка Бесплатного SSL-сертификата" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#website" rel="noopener">
                  <ListItemText primary="4. Установка сайта-заглушки" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#3x-ui" rel="noopener">
                  <ListItemText primary="5. Установка Xray и панели управления 3x-ui" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#hysteria2" rel="noopener">
                  <ListItemText primary="6. Установка протокола Hysteria2" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#mtproto" rel="noopener">
                  <ListItemText primary="7. Прокси MTProto + Fake TLS для Телеграм" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#amnezia" rel="noopener">
                  <ListItemText primary="8. Установка AmneziaWG и SOCKS5 через приложение Amnezia VPN" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="#3dp-manager" rel="noopener">
                  <ListItemText primary="9. Установка и настройка 3DP-MANAGER" />
                </ListItemButton>
              </ListItem>
              {useRelay && (
                <>
                  <ListItem>
                    <ListItemButton component="a" href="#relay" rel="noopener">
                      <ListItemText primary="10. Настройка Relay (Промежуточного) сервера" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton component="a" href="#usage" rel="noopener">
                      <ListItemText primary="11. Как пользоваться" />
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
            aria-controls="panel1-content"
            id="panel1-header"
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
                <ListItemButton component="a" href="https://www.cloudflare.com/ru-ru/products/registrar" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Регистрация домена с встроенным прокси от Cloudflare" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://www.duckdns.org" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Бесплатный субдомен на Duck DNS" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://certbot.eff.org/instructions" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Инструкция по установке бесплатного сертификата Let's Encrypt для всех ОС" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://github.com/MHSanaei/3x-ui" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Панель управления 3x-ui" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://v2.hysteria.network/docs/getting-started/Server-Installation-Script" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Документация Hysteria 2" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://github.com/amnezia-vpn/amnezia-client/releases" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Скачать приложение Amnezia VPN" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://github.com/telemt/telemt" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Проект Telemt, прокси для Телеграм" />
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton component="a" href="https://github.com/denpiligrim/3dp-manager" target='_blank' rel="noopener">
                  <ListItemIcon>
                    <LaunchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Проект 3DP-MANAGER, генератор подключений для 3x-ui" />
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
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }} id="ssh-key">
            1. Настройка подключения к серверу по SSH ключу
          </Typography>
          <Typography component="p" gutterBottom>
            Быстрое и надежное подключение, таким способом про пароль можно напрочь забыть. Показываю на примере Windows 11 (терминал PowerShell) и Ubuntu 24 на сервере.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            На компьютере (в PowerShell)
          </Typography>
          <Typography component="p" gutterBottom>
            Сгенерируйте SSH-ключ. Нажимайте Enter, чтобы принять стандартный путь и настройки:
          </Typography>
          <CodeBlock
            code={`ssh-keygen -t ed25519 -C "${email}" -f "$env:USERPROFILE\\.ssh\\id_ed25519_vps"`}
            language="powershell"
          />

          <Typography component="p" gutterBottom>
            После генерации посмотрите содержимое публичного ключа в Блокноте (путь <code>~/.ssh/id_ed25519_vps.pub</code>). Скопируйте весь результат — это и есть ваш публичный ключ.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            На сервере (через пароль, первый раз)
          </Typography>
          <Typography component="p" gutterBottom>
            Подключитесь по SSH, используя ваш пароль:
          </Typography>
          <CodeBlock code={`ssh root@${vpnIp}`} language="bash" />

          <Typography component="p" gutterBottom>
            Создайте каталог для ключей и выставьте права:
          </Typography>
          <CodeBlock code={`mkdir -p ~/.ssh\nchmod 700 ~/.ssh`} language="bash" />

          <Typography component="p" gutterBottom>
            Создайте файл для ключей и откройте его в редакторе:
          </Typography>
          <CodeBlock code={`nano ~/.ssh/authorized_keys`} language="bash" />
          <Typography component="p" gutterBottom>
            Вставьте скопированный ранее публичный ключ, сохраните (Ctrl+O, Enter) и закройте редактор (Ctrl+X).
          </Typography>

          <Typography component="p" gutterBottom>
            Установите права на файл:
          </Typography>
          <CodeBlock code={`chmod 600 ~/.ssh/authorized_keys`} language="bash" />

          <Typography component="p" gutterBottom>
            Отредактируйте SSH-конфигурацию, чтобы запретить вход по паролю:
          </Typography>
          <CodeBlock code={`nano /etc/ssh/sshd_config`} language="bash" />

          <Typography component="p" gutterBottom>
            Найдите и измените (или добавьте) следующие строки:
          </Typography>
          <CodeBlock
            code={`PasswordAuthentication no\nPermitRootLogin prohibit-password\nPubkeyAuthentication yes\nAuthorizedKeysFile .ssh/authorized_keys`}
            language="properties"
          />

          <Typography component="p" gutterBottom>
            Сохраните изменения (Ctrl+O, Enter, Ctrl+X), затем перезапустите SSH и закройте подключение:
          </Typography>
          <CodeBlock code={`systemctl restart ssh\nexit`} language="bash" />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Снова на компьютере
          </Typography>
          <Typography component="p" gutterBottom>
            В папке <InlineCode>.ssh</InlineCode> откройте файл <InlineCode>config</InlineCode> в Блокноте (если его нет — создайте без расширения) и добавьте строки (замените <InlineCode>&lt;user_name&gt;</InlineCode> на ваше имя пользователя):
          </Typography>
          <CodeBlock
            code={`Host vps\n    HostName ${vpnIp}\n    User root\n    IdentityFile C:\\Users\\<user_name>\\.ssh\\id_ed25519_vps`}
            language="text"
          />

          <Typography component="p" gutterBottom>
            Сохраните изменения. Теперь в терминале можно мгновенно подключаться короткой командой:
          </Typography>
          <CodeBlock code={`ssh vps`} language="powershell" />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="firewall" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            2. Настройка файрвола и обновление пакетов
          </Typography>
          <Typography component="p" gutterBottom>
            Первое, что необходимо сделать - это обновить пакеты на сервере:
          </Typography>
          <CodeBlock code='apt update && apt upgrade -y' />

          <Typography component="p" gutterBottom>
            Не менее важный вопрос безопасности - это настройка файрвола. Мы будем использовать UFW для управления доступом к вашему серверу. Ниже приведены основные команды, которые откроют необходимые порты для работы VPN подключений, а также обеспечат безопасность вашего сервера. Вы также в дальнейшем сможете легко добавлять или удалять правила в зависимости от ваших потребностей.
          </Typography>
          <CodeBlock code={`ufw default deny incoming\nufw default allow outgoing\nufw allow OpenSSH\nufw allow 80/tcp\nufw allow 443/tcp\nufw allow 443/udp\nufw allow 8443/tcp\nufw allow 8443/udp\nufw allow 10000:60000/tcp\nufw allow 10000:60000/udp`} language="bash" />

          <Typography component="p" gutterBottom>
            Теперь включите файрвол:
          </Typography>
          <CodeBlock code='ufw enable' />

          <Typography component="p" gutterBottom>
            Проверьте статус:
          </Typography>
          <CodeBlock code='ufw status' />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="ssl-cert" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            3. Установка Бесплатного SSL-сертификата Let's Encrypt через Certbot
          </Typography>
          <Typography component="p" gutterBottom>
            Перед началом убедитесь, что ваш домен <InlineCode>{vpnDomain}</InlineCode> уже направлен на IP-адрес вашего сервера <InlineCode>{vpnIp}</InlineCode>. Для этого в панели управления доменом должна быть настроена A-запись.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка Certbot
          </Typography>
          <Typography component="p" gutterBottom>
            Обновите список пакетов и установите Certbot. Убедитесь, что у вас открыт и свободен 80 порт — это обязательное условие для успешного выпуска сертификата.
          </Typography>
          <CodeBlock
            code={`apt install certbot -y`}
            language="bash"
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Выпуск сертификата
          </Typography>
          <Typography component="p" gutterBottom>
            Запустите команду выпуска сертификата (мы уже подставили в команду ваш домен):
          </Typography>
          <CodeBlock
            code={`certbot certonly --standalone -d ${vpnDomain}`}
            language="bash"
          />

          <Typography component="p" gutterBottom>
            Во время установки утилита попросит вас ввести некоторые данные:
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">Введите свой <InlineCode>email</InlineCode> для получения важных уведомлений. Например, <InlineCode>{email}</InlineCode></Typography>
            </li>
            <li>
              <Typography component="span">Согласитесь с правилами сервиса: введите <InlineCode>Y</InlineCode> и нажмите Enter.</Typography>
            </li>
            <li>
              <Typography component="span">Откажитесь от рекламной email-рассылки: введите <InlineCode>N</InlineCode>.</Typography>
            </li>
          </Box>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            После успешного выпуска в консоли отобразятся пути к вашему сертификату и закрытому ключу. По умолчанию сертификат будет продлеваться автоматически каждые 90 дней.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="website" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            4. Установка сайта-заглушки
          </Typography>

          <Typography component="p" gutterBottom>
            Для того, чтобы маскировать сервер как обычный веб-сервер, установим сайт-заглушку. Начнем с установки nginx:
          </Typography>
          <CodeBlock code='apt install nginx -y' />

          <Typography component="p" gutterBottom>
            Создайте директорию для сайта и выдайте нужные права:
          </Typography>
          <CodeBlock
            code={`mkdir -p /var/www/${vpnDomain}/html\nchown -R $USER:$USER /var/www/${vpnDomain}/html`}
            language="bash"
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Создание страницы
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте файл <InlineCode>index.html</InlineCode>:
          </Typography>
          <CodeBlock code={`nano /var/www/${vpnDomain}/html/index.html`} language="bash" />
          <Typography component="p" gutterBottom>
            Вставьте базовый HTML-код, сохраните <InlineCode>Ctrl+O</InlineCode>, <InlineCode>Enter</InlineCode> и закройте редактор <InlineCode>Ctrl+X</InlineCode>:
          </Typography>
          <CodeBlock
            code={`<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${vpnDomain} | Website</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #2c2825;
            color: #e3d9c6;
            font-family: 'Georgia', 'Times New Roman', serif;
        }
        .container {
            text-align: center;
            padding: 60px 80px;
            background: #1f1b18;
            border-radius: 6px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.6);
            border-left: 4px solid #8b5a2b;
        }
        h1 {
            font-weight: normal;
            letter-spacing: 2px;
            margin-bottom: 15px;
            font-size: 2.2em;
        }
        p {
            color: #a89f91;
            font-size: 16px;
            font-style: italic;
            letter-spacing: 1px;
            margin: 0;
        }
        .icon {
            font-size: 45px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🕸</div>
        <h1>${vpnDomain}</h1>
        <p>A simple website. Coming Soon.</p>
    </div>
</body>
</html>`}
            language="html"
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Настройка конфигурации Nginx
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте конфигурационный файл для вашего домена:
          </Typography>
          <CodeBlock code={`nano /etc/nginx/sites-available/${vpnDomain}`} language="bash" />
          <Typography component="p" gutterBottom>
            Вставьте следующую конфигурацию:
          </Typography>
          <CodeBlock
            code={`server {
    listen 80;
    server_name ${vpnDomain} www.${vpnDomain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${vpnDomain} www.${vpnDomain};

    root /var/www/${vpnDomain}/html;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/${vpnDomain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${vpnDomain}/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        try_files $uri $uri/ =404;
    }
}`}
            language="nginx"
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Активация сайта
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте символическую ссылку, удалите дефолтный конфиг Nginx и перезапустите службу:
          </Typography>
          <CodeBlock
            code={`ln -s /etc/nginx/sites-available/${vpnDomain} /etc/nginx/sites-enabled/\nrm /etc/nginx/sites-enabled/default\nnginx -t\nsystemctl restart nginx`}
            language="bash"
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Теперь, если перейти по адресу <a href={`https://${vpnDomain}`} target='_blank'>https://{vpnDomain}</a>, вы увидите созданную страницу-заглушку.
          </Typography>

          <Typography component="p" gutterBottom>
            Также важно перенастроить certbot, чобы не было конфликта с nginx при обновлении сертификата:
          </Typography>
          <CodeBlock
            code={`certbot install --cert-name ${vpnDomain} --nginx`}
            language="bash"
          />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="3x-ui" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            5. Установка Xray и панели управления 3x-ui
          </Typography>
          <Typography component="p" gutterBottom>
            На основном сервере <b>{vpnIp}</b> мы установим популярную панель для управления подключениями.
          </Typography>
          <CodeBlock code='bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)' />

          <Typography component="p" gutterBottom>
            При установке выберите порт (можно рандомный) и укажите свой путь к сертификату (выбрать пункт 3) и домен <b>{vpnDomain}</b>.
          </Typography>
          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Сертификат:
          </Typography>
          <CodeBlock code={`/etc/letsencrypt/live/${vpnDomain}/fullchain.pem`} />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Приватный ключ:
          </Typography>
          <CodeBlock code={`/etc/letsencrypt/live/${vpnDomain}/privkey.pem`} />

          <Typography component="p" gutterBottom>
            После установки вы увидите логин, пароль и ссылку на панель управления, сохраните их.
          </Typography>

          <Typography component="p" gutterBottom>
            Далее войдите в панель управления и создайте подключение в разделе Подключения. Проверьте. что все работает.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="hysteria2" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            6. Установка протокола Hysteria2
          </Typography>
          <Typography component="p" gutterBottom>
            Для успешной установки и получения необходимых сертификатов автоматическому скрипту требуется свободный 80 порт. Поэтому мы временно остановим веб-сервер, установим протокол и запустим веб-сервер обратно.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Остановка Nginx
          </Typography>
          <CodeBlock code={`systemctl stop nginx`} language="bash" />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка Hysteria2
          </Typography>
          <Typography component="p" gutterBottom>
            Запустите официальный скрипт установки. Он автоматически скачает и разместит нужные бинарные файлы:
          </Typography>
          <CodeBlock code={`bash <(curl -fsSL https://get.hy2.sh/)`} language="bash" />

          <Typography component="p" gutterBottom>
            После установки основной конфигурационный файл будет доступен по пути <InlineCode>/etc/hysteria/config.yaml</InlineCode>. Отредактируем его:
          </Typography>
          <CodeBlock code={`nano /etc/hysteria/config.yaml`} language="bash" />

          <Typography component="p" gutterBottom>
            Вставьте конфиг (пароли сгенерированы только что, email напишите свой):
          </Typography>
          <CodeBlock code={`listen: :443

acme:
  domains:
    - ${vpnDomain}
  email: ${email}

auth:
  type: password
  password: ${hy2Pass}

obfs:
  type: salamander
  salamander:
    password: ${hy2ObfsPass}

masquerade:
  type: proxy
  proxy:
    url: https://ya.ru/
    rewriteHost: true
`} language="yaml" />

          <Typography component="p" gutterBottom>
            Перезапустите демона:
          </Typography>
          <CodeBlock code={`systemctl daemon-reload`} language="bash" />

          <Typography component="p" gutterBottom>
            Включите сервис для автозапуска:
          </Typography>
          <CodeBlock code={`systemctl enable --now hysteria-server.service`} language="bash" />

          <Typography component="p" gutterBottom>
            Проверьте статус сервиса:
          </Typography>
          <CodeBlock code={`systemctl status hysteria-server.service`} language="bash" />

          <Typography component="p" gutterBottom>
            Теперь вы сможете подключаться по ссылке:
          </Typography>
          <CodeBlock code={`hy2://${hy2Pass}@${vpnDomain}:443/?insecure=0&sni=${vpnDomain}&obfs=salamander&obfs-password=${hy2ObfsPass}#Hysteria2`} language="text" />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Запуск Nginx
          </Typography>
          <Typography component="p" gutterBottom>
            Обязательно включите веб-сервер обратно, чтобы ваша страница-заглушка снова стала доступна в сети:
          </Typography>
          <CodeBlock code={`systemctl start nginx`} language="bash" />

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="mtproto" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            7. Прокси MTProto + Fake TLS для Телеграм
          </Typography>
          <Typography component="p" gutterBottom>
            Отличный развивающийся репозиторий <Link href="https://github.com/telemt/telemt" target="_blank" rel="noopener" color="primary">Telemt</Link> с прокси MTProto, поддерживающим Fake TLS из коробки.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка прокси-сервера
          </Typography>
          <Typography component="p" gutterBottom>
            Скачайте и распакуйте последнюю версию утилиты:
          </Typography>
          <CodeBlock
            code={`wget -qO- "https://github.com/telemt/telemt/releases/latest/download/telemt-$(uname -m)-linux-$(ldd --version 2>&1 | grep -iq musl && echo musl || echo gnu).tar.gz" | tar -xz`}
            language="bash"
          />
          <Typography component="p" gutterBottom>
            Переместите файл в системную директорию и сделайте его исполняемым:
          </Typography>
          <CodeBlock code={`mv telemt /bin\nchmod +x /bin/telemt`} language="bash" />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Настройка конфигурации
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте папку и откройте файл конфигурации:
          </Typography>
          <CodeBlock code={`mkdir /etc/telemt\nnano /etc/telemt/telemt.toml`} language="bash" />
          <Typography component="p" gutterBottom>
            Вставьте следующий текст. Домен для маскировки (Fake TLS) уже подставлен из ваших настроек. Секретный ключ уже сгенерирован и подставлен в конфиге, однако вы можете сгенерировать его самостоятельно командой <InlineCode>openssl rand -hex 16</InlineCode>
          </Typography>
          <CodeBlock
            code={`[general]
use_middle_proxy = false

[general.modes]
classic = false
secure = false
tls = true

[server.api]
enabled = true

[censorship]
tls_domain = "${vpnDomain}"

[access.users]
hello = "${generateHexSecret()}"

[server]
port = 10443`}
            language="toml"
          />
          <Typography component="p" gutterBottom>
            Сохраните изменения: <InlineCode>Ctrl + O</InlineCode>, затем <InlineCode>Enter</InlineCode>, и закройте редактор: <InlineCode>Ctrl + X</InlineCode>.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Пользователь и права
          </Typography>
          <Typography component="p" gutterBottom>
            Для безопасности создайте отдельного пользователя и назначьте ему права на конфигурацию:
          </Typography>
          <CodeBlock code={`useradd -d /opt/telemt -m -r -U telemt\nchown -R telemt:telemt /etc/telemt`} language="bash" />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Системный сервис
          </Typography>
          <Typography component="p" gutterBottom>
            Создайте файл сервиса для фоновой работы:
          </Typography>
          <CodeBlock code={`nano /etc/systemd/system/telemt.service`} language="bash" />
          <Typography component="p" gutterBottom>
            Вставьте текст конфигурации юнита:
          </Typography>
          <CodeBlock
            code={`[Unit]
Description=Telemt
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=telemt
Group=telemt
WorkingDirectory=/opt/telemt
ExecStart=/bin/telemt /etc/telemt/telemt.toml
Restart=on-failure
LimitNOFILE=65536
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target`}
            language="ini"
          />
          <Typography component="p" gutterBottom>
            Сохраните и выйдите (<InlineCode>Ctrl + O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl + X</InlineCode>).
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Запуск и проверка
          </Typography>
          <Typography component="p" gutterBottom>
            Перезагрузите конфигурацию systemd, запустите сервис и добавьте его в автозагрузку:
          </Typography>
          <CodeBlock
            code={`systemctl daemon-reload\nsystemctl start telemt\nsystemctl enable telemt\nsystemctl status telemt`}
            language="bash"
          />

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Если все сделано верно, в статусе сервиса вы увидите строку <InlineCode sx={{ color: '#4caf50' }}>active (running)</InlineCode>, а также готовую ссылку для подключения к прокси, которая начинается с <InlineCode>tg://</InlineCode>.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="amnezia" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            8. Установка AmneziaWG и SOCKS5 через приложение Amnezia VPN
          </Typography>
          <Typography component="p" gutterBottom>
            Если вы хотите быстро развернуть дополнительные протоколы с графическим интерфейсом, можно использовать официальное приложение Amnezia VPN. Оно само подключится к серверу по SSH и установит нужные Docker-контейнеры.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Подготовка приложения
          </Typography>
          <Typography component="p" gutterBottom>
            Скачайте приложение Amnezia VPN с официального <Link href="https://amnezia.org/ru/downloads" target="_blank" rel="noopener" color="primary">сайта</Link> или <Link href="https://github.com/amnezia-vpn/amnezia-client/releases" target="_blank" rel="noopener" color="primary">репозитория</Link> GitHub и установите его на свой компьютер.
          </Typography>

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
              <Typography component="span">IP-адрес: <InlineCode>{vpnIp}</InlineCode></Typography>
            </li>
            <li>
              <Typography component="span">Имя пользователя: <InlineCode>root</InlineCode></Typography>
            </li>
            <li>
              <Typography component="span">Пароль или SSH-ключ: укажите пароль от сервера или выберите ваш приватный ключ <InlineCode>id_ed25519_vps</InlineCode>, созданный на первом этапе.</Typography>
            </li>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка AmneziaWG
          </Typography>
          <Typography component="p" gutterBottom>
            AmneziaWG — это форк WireGuard с защитой от систем глубокого анализа трафика (DPI), который отлично работает в условиях жестких блокировок.
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">Нажмите на шестеренку (настройки сервера) и перейдите на вкладку <b>Протоколы</b>.</Typography>
            </li>
            <li>
              <Typography component="span">Выберите протокол <b>AmneziaWG</b>. Ручная настройка, выберите порт в диапазоне 10000:60000.</Typography>
            </li>
            <li>
              <Typography component="span">Нажмите <InlineCode>Установить</InlineCode>. Приложение автоматически развернет всё необходимое на сервере.</Typography>
            </li>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка SOCKS5
          </Typography>
          <Typography component="p" gutterBottom>
            SOCKS5 прокси позволяет пускать через сервер трафик отдельных приложений (например, Telegram или другие приложения).
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">Снова откройте настройки сервера в приложении.</Typography>
            </li>
            <li>
              <Typography component="span">Перейдите в раздел <b>Сервисы</b> и найдите там <b>SOCKS5</b>.</Typography>
            </li>
            <li>
              <Typography component="span">Задайте желаемые имя пользователя и пароль для подключения к прокси (или оставьте сгенерированные).</Typography>
            </li>
            <li>
              <Typography component="span">Нажмите <InlineCode>Установить</InlineCode>.</Typography>
            </li>
          </Box>

          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Сразу после установки SOCKS5 вы сможете скопировать данные для подключения прямо из приложения и использовать их в нужных вам программах.
          </Typography>
          <Typography component="p" gutterBottom sx={{ mt: 2 }}>
            Кроме того вы можете в один клик установить AmneziaDNS, чтобы использовать свой DNS сервер. Однако, учтите, что данный DNS не поддерживает защищенное соединение, поэтому лучше всего настроить полноценный DNS сервер AdGuard.
          </Typography>

          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography id="3dp-manager" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            9. Установка и настройка 3DP-MANAGER
          </Typography>
          <Typography component="p" gutterBottom>
            3DP-MANAGER — это утилита для автоматизации и удобного управления вашими VPN подключениями в панели 3x-ui.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Установка менеджера
          </Typography>
          <Typography component="p" gutterBottom>
            Установка выполняется одной простой командой. В процессе скрипт попросит вас указать домен.
          </Typography>
          <CodeBlock
            code={`bash <(curl -fsSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/install.sh)`}
            language="bash"
          />
          <Typography component="p" gutterBottom>
            После успешной установки в консоли появится <b>ссылка для входа</b> в веб-интерфейс, а также сгенерированные <b>логин и пароль</b>. Сохраните их.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Настройка в веб-интерфейсе
          </Typography>
          <Typography component="p" gutterBottom>
            Авторизуйтесь в панели 3DP-MANAGER и выполните базовую настройку:
          </Typography>
          <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
            <li>
              <Typography component="span">Создайте <b>подписку</b>.</Typography>
            </li>
            <li>
              <Typography component="span">Отредактируйте список <InlineCode>SNI</InlineCode> для корректной маскировки трафика.</Typography>
            </li>
            <li>
              <Typography component="span">Укажите настройки доступа к вашей панели <b>3x-ui</b>.</Typography>
            </li>
            <li>
              <Typography component="span">Запустите <b>генерацию инбаундов</b>.</Typography>
            </li>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
            Настройка Relay (Перенаправление)
          </Typography>
          <Typography component="p" gutterBottom>
            Если вы решили использовать промежуточный сервер для дополнительной защиты, перейдите в раздел <InlineCode>Перенаправление</InlineCode>. В этом меню можно добавить ваш Relay сервер и настроить правила маршрутизации трафика через него.
          </Typography>

          {useRelay && (
            <>
              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Typography id="relay" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                10. Настройка Relay (Промежуточного) сервера
              </Typography>
              <Typography component="p" gutterBottom>
                Если вы не устанавливали перенаправление через программу 3DP-MANAGER, то вы можете это сделать с помощью скрипта на промежуточном сервере:
              </Typography>
              <CodeBlock code={`export ORIGIN_IP="${vpnIp}" && bash <(curl -fsSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)`} />

              <Typography component="p" gutterBottom>
                Скрипт перенаправляет трафик на ваш основной сервер, порты <InlineCode>443</InlineCode>, <InlineCode>8443</InlineCode>, <InlineCode>10000:60000</InlineCode>. Ненужные порты можно закрыть фаерволом.
              </Typography>

              <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

              <Typography id="usage" variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                11. Как пользоваться
              </Typography>
              <Typography component="p" gutterBottom>
                После того как вы настроили перенапраление трафика с промежуточного сервера на основной, вы можете изменить в любой ссылке на подключение IP адрес <InlineCode>{vpnIp}</InlineCode> → <InlineCode>{relayIp}</InlineCode> или домен <InlineCode>{vpnDomain}</InlineCode> → <InlineCode>{relayDomain}</InlineCode> relay сервера. Например, ссылка на подключение hysteria2 будет выглядеть так:
              </Typography>
              <CodeBlock code={`hy2://${hy2Pass}@${relayDomain.length > 0 ? relayDomain : relayIp}:443/?insecure=0&sni=${vpnDomain}&obfs=salamander&obfs-password=${hy2ObfsPass}#Hysteria2`} language="text" />

              <Typography component="p" gutterBottom>
                Подключиться можно с помощью приложений Happ, V2rayTun, Streisand, Hiddify, NekoBox, V2rayNG.
              </Typography>
              <Typography component="p" gutterBottom>
                Для утилиты 3DP-MANAGER в разделе Подписки нужно выбрать relay сервер и скопировать ссылку на подписку, в которой уже будет заменен адрес сервера.
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}