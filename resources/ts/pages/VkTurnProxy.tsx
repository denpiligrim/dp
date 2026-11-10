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
import seo from '../../data/vk-turn-proxy-seo.json';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Link, FormControl, Select, MenuItem } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import WindowIcon from '@mui/icons-material/Window';
import LinuxIcon from '../svgIcons/LinuxIcon';
import AppleIcon from '@mui/icons-material/Apple';

import AndroidIcon from '@mui/icons-material/Android';
import InfoIcon from '@mui/icons-material/Info';

import InlineCode from '../components/InlineCode';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import { COUNTRIES } from '../components/countries';
import AmneziaIcon from '../svgIcons/AmneziaIcon';
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

  const guideSteps = useMemo(() => [
    { id: "add-wireguard", title: "Добавление протокола Wireguard в 3x-ui" },
    { id: "server-setup", title: "Настройка vk turn proxy на сервере" },
    { id: "client-setup", title: "Настройка клиента и подключение" },
  ], []);

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="VK TURN Proxy" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={guideSteps.length} settingsHref="#guide-settings" >
        <GuidePartnerLinks items={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", icon: <IshostingIcon />, sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", icon: <BegetIcon />, sponsored: true },
          { label: "Подписка Amnezia Premium с 15% скидкой", href: "https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM", icon: <AmneziaIcon />, sponsored: true }
        ]} />
      </GuideHeader>
      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#guide-settings">
        <Box className="guide-notes"><Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Для работы необходима установленная <Link href='/guides/ultimate-vpn#3x-ui' target="_blank" rel="noopener" color="primary">панель 3x-ui</Link>!
        </Alert>
          <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
            Заполните данные вашего сервера ниже. Команды для копирования автоматически обновятся под вашу конфигурацию.
          </Typography></Box>
        <GuideSettings title={"Параметры настройки VK TURN Proxy"} layout="custom">
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
        </GuideSettings>

        <GuideArticle>

          <GuideSection steps={guideSteps} id="add-wireguard">
            <Typography component="p" gutterBottom>
              Показываю на примере панели 3x-ui (см. <Link href='/guides/ultimate-vpn#3x-ui' target="_blank" rel="noopener" color="primary">Установка панели 3x-ui</Link>), однако вы можете использовать любую утилиту на сервере с протоколом <b>Wireguard</b>.
            </Typography>
            <Typography component="p" gutterBottom>
              Откройте панель 3x-ui, перейдите в раздел подключений и создайте новое. Выберите протокол <b>Wireguard</b>.
            </Typography>
            <Box
              component="img"
              src={wgConfig}
              alt="Настройка подключения WireGuard в панели 3x-ui для VK TURN Proxy"
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="server-setup">
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
              Перезагрузите демона и запустите сервис:
            </Typography>
            <CodeBlock
              code={`<sudo>systemctl daemon-reload\n<sudo>systemctl enable vk-turn-proxy.service\n<sudo>systemctl start vk-turn-proxy.service`}
              sudo={useSudo}
            />

          </GuideSection>
          <GuideSection steps={guideSteps} id="client-setup">

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Шаг 1: Получение ссылки на VK звонок
            </Typography>
            <Typography component="p" gutterBottom>
              С аккаунта ВКонтакте создайте ссылку на звонок вида <InlineCode copy>https://vk.com/call/join/</InlineCode> либо загуглите эту ссылку (рекомендуется в <Link href="https://duckduckgo.com/?q=https%3A%2F%2Fvk.com%2Fcall%2Fjoin%2F" target="_blank" rel="noopener" color="primary">DuckDuckGo</Link>).
            </Typography>
            <Alert icon={<InfoIcon fontSize="inherit" />} severity="warning" sx={{ mb: 2, mt: 1 }}>
              Эта ссылка будет действовать бесконечно, главное — <b>никогда не нажимать кнопку «Завершить звонок для всех»</b> в интерфейсе звонка.
            </Alert>

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
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

          </GuideSection>
          <GuideFaq items={seo.faq} title={"Вопросы об установке и настройке VK TURN Proxy"} />

        </GuideArticle>
        <GuideResources links={[]} moreLinks={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", sponsored: true },
          { label: "Подписка Amnezia Premium с 15% скидкой", href: "https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM", sponsored: true },
          { label: "Репозиторий проекта", href: "https://github.com/cacggghp/vk-turn-proxy", sponsored: false }
        ]} />
        <GuideSupportFooter />
      </GuideLayout>

    </GuidePage>
  );
}
