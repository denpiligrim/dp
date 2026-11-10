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
  GuideValues as PreviewPanel,
} from '../components/guides';
import { useMemo, useState } from 'react';
import seo from '../../data/3x-ui-install-seo.json';
import { Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';

import InlineCode from '../components/InlineCode';
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

export default function ThreeXUiInstall() {
  const [useSudo, setUseSudo] = useState(false);
  const [installVersion, setInstallVersion] = useState('latest');
  const [customVersion, setCustomVersion] = useState('2.9.4');
  const [activeConnectionTab, setActiveConnectionTab] = useState(0);
  const [vpnDomain, setVpnDomain] = useState('vpn.example.com');
  const [serverIp, setServerIp] = useState('1.1.1.1');
  const [xuiPort, setXuiPort] = useState('2222');

  const inboundRows = {
    vless: [
      ['Примечание', 'my-inbound'],
      ['Протокол', 'vless'],
      ['Порт', '443'],
      ['Flow', 'xtls-rprx-vision'],
      ['Транспорт', 'TCP (RAW)'],
      ['Безопасность', 'reality'],
      ['uTLS', 'firefox'],
      ['Target', 'yastatic.net:443'],
      ['SNI', 'yastatic.net'],
    ],
    hysteria: [
      ['Протокол', 'hysteria2'],
      ['Порт', '8443'],
      ['Masquerade (Proxy)', 'https://google.com'],
      ['Insecure', 'включен'],
      ['UDP Mask (salamander)', generateHexSecret(4)],
      ['SNI', vpnDomain],
      ['uTLS', 'firefox'],
      ['Путь к сертификату (SSL)', 'Установить сертификат панели'],
    ]
  };

  const versionCommand = installVersion === 'latest'
    ? 'bash <(curl -Ls https://raw.githubusercontent.com/MHSanaei/3x-ui/master/install.sh)'
    : `VERSION=v${customVersion} && bash <(curl -Ls "https://raw.githubusercontent.com/MHSanaei/3x-ui/$VERSION/install.sh") $VERSION`;

  const inboundType = activeConnectionTab === 0 ? 'vless' : 'hysteria';

  const guideSteps = useMemo(() => [
    { id: "install-panel", title: "Установка панели 3x-ui на сервер" },
    { id: "create-inbound", title: "Создание подключения" },
    { id: "manager", title: "Менеджер подписок 3DP-MANAGER" },
  ], []);

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="Установка 3x-ui" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={guideSteps.length} settingsHref="#guide-settings" videoUrl="https://youtu.be/7XLTCYYbYm8">
        <GuidePartnerLinks items={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", icon: <IshostingIcon />, sponsored: true },
          { label: "Аренда RU сервера и домен", href: "https://beget.com/p1519472", icon: <BegetIcon />, sponsored: true },
          { label: "Обход Глушилок / Белых списков", href: "https://t.me/futuresbp_bot?start=DenPiligrim", icon: <FutureIcon />, sponsored: true }
        ]} />
      </GuideHeader>
      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#guide-settings">
        <Box className="guide-notes"><Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
          Гайд предполагает, что у вас уже есть сервер Ubuntu или Debian. Если у вас есть домен, заранее направьте домен на IP сервера.
        </Alert></Box>
        <GuideSettings title={"Параметры установки 3x-ui"} layout="custom">
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
        </GuideSettings>

        <GuideArticle>

          <GuideSection steps={guideSteps} id="install-panel">
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

          </GuideSection>
          <GuideSection steps={guideSteps} id="create-inbound">
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
                  Hysteria2 выдает бо<span>&#769;</span>льшую скорость соединения.
                </Typography>
                <Box component="ul" sx={{ pl: 3, my: 1 }}>
                  <li><Typography component="span">В SNI укажите ваш домен.</Typography></li>
                  <li><Typography component="span">Используйте сертификат и приватный ключ панели, который уже выпущен для вашего домена.</Typography></li>
                </Box>
              </>
            )}

          </GuideSection>
          <GuideSection steps={guideSteps} id="manager">
            <Typography component="p" gutterBottom>
              Установите менеджер на сервер, где будет храниться подписка и список ваших серверов.
            </Typography>
            <CodeBlock code={`<sudo>bash <(curl -fsSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/install.sh)`} sudo={useSudo} />
            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Добавление ноды по токену
            </Typography>
            <Box
              component="img"
              src='/images/node.png'
              alt="Добавление ноды 3x-ui по токену в 3DP-MANAGER"
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
              В 3DP-MANAGER откройте раздел <InlineCode>Ноды</InlineCode>, нажмите Добавить, вставьте ссылку на вашу панель 3x-ui (например,  <InlineCode>https://85.198.84.27:35366/2vIsDA5HanQ3R7JyIH</InlineCode>), токен и проверьте соединение. После успешного добавления нода станет доступна при генерации подписки.
            </Typography>
            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Добавление relay сервера
            </Typography>
            <Box
              component="img"
              src='/images/relay.png'
              alt="Добавление промежуточного relay-сервера в 3DP-MANAGER"
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
              Relay сервер нужен, когда пользователь должен подключаться к промежуточному серверу, а трафик дальше перенаправляется на ноду.
            </Typography>
            <Box component="ul" sx={{ pl: 3, my: 1 }}>
              <li><Typography component="span">В разделе <InlineCode>Relay серверы</InlineCode> нажмите Добавить, укажите IP промежуточного сервера, пароль или SSH ключ.</Typography></li>
              <li><Typography component="span">Привяжите relay к нужной ноде.</Typography></li>
              <li><Typography component="span">После добавления нажмите Установить, чтобы выполнить установку перенаправления.</Typography></li>
            </Box>
            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Добавление подписки
            </Typography>
            <Box
              component="img"
              src='/images/sub.png'
              alt="Создание подписки на подключения нод в 3DP-MANAGER"
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
              В разделе <InlineCode>Подписки</InlineCode> нажмите Создать, укажите название, выберите ноды и при необходимости добавьте relay сервер. Выберите подключения. Сгенерируйте конфиги, после чего добавьте ссылку на подписку в приложение (например Happ).
            </Typography>

          </GuideSection>
          <GuideFaq items={seo.faq} title={"Вопросы об установке и настройке 3x-ui"} />

        </GuideArticle>
        <GuideResources links={[]} moreLinks={[
          { label: "Репозиторий 3x-ui", href: "https://github.com/MHSanaei/3x-ui", sponsored: false },
          { label: "Репозиторий 3DP-MANAGER", href: "https://github.com/denpiligrim/3dp-manager", sponsored: false }
        ]} />
        <GuideSupportFooter />
      </GuideLayout>

    </GuidePage>
  );
}
