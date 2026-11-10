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
} from '../components/guides';
import { useMemo, useState } from 'react';
import seo from '../../data/naive-proxy-seo.json';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import WindowIcon from '@mui/icons-material/Window';
import LinuxIcon from '../svgIcons/LinuxIcon';
import AppleIcon from '@mui/icons-material/Apple';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AndroidIcon from '@mui/icons-material/Android';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';

import InlineCode from '../components/InlineCode';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import { COUNTRIES } from '../components/countries';
import AmneziaIcon from '../svgIcons/AmneziaIcon';
import AutoForwardingInstall from '../components/AutoForwardingInstall';
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

  const guideSteps = useMemo(() => [
    { id: "naive-setup", title: "Установка и настройка сервера NaiveProxy" },
    ...(useRelay ? [{ id: "relay-setup", title: "Настройка промежуточного сервера" }] : []),
    { id: "client-setup", title: [useRelay ? '3. ' : '2. ', "Настройка клиента "].join('').replace(/^\s*\d+\.\s*/, '').trim() },
  ], [useRelay]);

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="NaiveProxy" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={guideSteps.length} settingsHref="#guide-settings" videoUrl="https://youtu.be/vm1Rmq218bU">
        <GuidePartnerLinks items={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", icon: <IshostingIcon />, sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", icon: <BegetIcon />, sponsored: true },
          { label: "Подписка Amnezia Premium с 15% скидкой", href: "https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM", icon: <AmneziaIcon />, sponsored: true }
        ]} />
      </GuideHeader>
      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#guide-settings">
        <Box className="guide-notes"><Alert icon={<InfoIcon fontSize="inherit" />} severity="warning" sx={{ mb: 2 }}>
          Для работы <b>NaiveProxy</b> необходим домен!
        </Alert>
          <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
            Заполните данные ваших серверов ниже. Команды для копирования автоматически обновятся под вашу конфигурацию.
          </Typography></Box>
        <GuideSettings title={"Параметры настройки NaiveProxy"} layout="custom">
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
        </GuideSettings>

        <GuideArticle>

          <GuideSection steps={guideSteps} id="naive-setup">
            <Typography component="p" gutterBottom>
              В качестве сервера NaiveProxy использует веб-сервер Caddy со специальным форком плагина <b>forwardproxy</b> либо HAProxy. Мы будем использовать первый вариант.
            </Typography>
            <Typography component="p" gutterBottom>
              Подключитесь к серверу командой <InlineCode copy>{`ssh root@${vpnIp}`}</InlineCode>.
            </Typography>

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

          </GuideSection>
          {useRelay && (
            <>
              <GuideSection steps={guideSteps} id="relay-setup">
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

              </GuideSection>
            </>
          )}

          <GuideSection steps={guideSteps} id="client-setup">
            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

          </GuideSection>
          <GuideFaq items={seo.faq} title={"Вопросы об установке и настройке NaiveProxy"} />

        </GuideArticle>
        <GuideResources links={[]} moreLinks={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", sponsored: true },
          { label: "Подписка Amnezia Premium с 15% скидкой", href: "https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM", sponsored: true },
          { label: "Репозиторий проекта NaiveProxy на GitHub", href: "https://github.com/klzgrad/naiveproxy", sponsored: false },
          { label: "Документация CaddyServer", href: "https://caddyserver.com/docs/caddyfile/directives/tls", sponsored: false }
        ]} />
        <GuideSupportFooter />
      </GuideLayout>

    </GuidePage>
  );
}
