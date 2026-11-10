import {
  GuideSeo,
  GuidePage,
  GuideBackLink,
  GuideHeader,
  GuideLayout,
  GuideSection,
  GuideArticle,
  GuidePartnerLinks,
  GuideResources,
  GuideSupportFooter,
  GuideFaq,
  GuidePanel,
  GuideCodeBlock as CodeBlock,
  GuideAlert as Alert,
} from '../components/guides';
import { useMemo, useState } from 'react';
import seo from '../../data/mieru-proxy-seo.json';
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Link, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoIcon from '@mui/icons-material/Info';
import LaunchIcon from '@mui/icons-material/Launch';

import DownloadIcon from '@mui/icons-material/Download';

import InlineCode from '../components/InlineCode';
import { QrCode } from '../components/QrCode';
import BegetIcon from '../svgIcons/BegetIcon';
import IshostingIcon from '../svgIcons/IshostingIcon';
import FutureIcon from '../svgIcons/FutureIcon';

const randomValue = (length: number) => {
  const alphabet = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);
  return Array.from(values, value => alphabet[value % alphabet.length]).join('');
};

const linkHost = (host: string) => {
  const value = host.trim();
  return value.includes(':') && !value.startsWith('[') ? `[${value}]` : value;
};

const writeInt32LE = (value: number) => [
  value & 0xff,
  (value >>> 8) & 0xff,
  (value >>> 16) & 0xff,
  (value >>> 24) & 0xff,
];

const writeKryoAscii = (value: string) => {
  const bytes = Array.from(new TextEncoder().encode(value || ' '));
  bytes[bytes.length - 1] |= 0x80;
  return bytes;
};

const adler32 = (bytes: number[]) => {
  let a = 1;
  let b = 0;
  bytes.forEach(byte => {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  });
  return ((b << 16) | a) >>> 0;
};

const deflateStored = (bytes: number[]) => {
  const result = [0x78, 0x01];

  for (let offset = 0; offset < bytes.length; offset += 65535) {
    const block = bytes.slice(offset, offset + 65535);
    const final = offset + block.length >= bytes.length ? 1 : 0;
    const length = block.length;
    result.push(final, length & 0xff, (length >>> 8) & 0xff, (~length) & 0xff, ((~length) >>> 8) & 0xff, ...block);
  }

  const checksum = adler32(bytes);
  result.push((checksum >>> 24) & 0xff, (checksum >>> 16) & 0xff, (checksum >>> 8) & 0xff, checksum & 0xff);
  return result;
};

const base64Url = (bytes: number[]) => {
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
};

interface MieruUser {
  id: string;
  username: string;
  password: string;
  useQuota: boolean;
  quotaDays: string;
  quotaGb: string;
}

const createUser = (): MieruUser => ({
  id: randomValue(12),
  username: `user-${randomValue(6).toLowerCase()}`,
  password: randomValue(20),
  useQuota: true,
  quotaDays: '30',
  quotaGb: '100',
});

export default function MieruProxy() {
  const [server, setServer] = useState('');
  const [port, setPort] = useState('443');
  const [users, setUsers] = useState<MieruUser[]>(() => [createUser()]);
  const [clientApp, setClientApp] = useState('clash');

  const updateUser = (id: string, values: Partial<MieruUser>) => {
    setUsers(current => current.map(user => user.id === id ? { ...user, ...values } : user));
  };

  const configUsers = users.map(user => {
    const result: {
      name: string;
      password: string;
      quotas?: { days: number; megabytes: number; }[];
    } = {
      name: user.username.trim() || 'user',
      password: user.password.trim() || 'password',
    };

    if (user.useQuota) {
      result.quotas = [{
        days: Math.max(1, Number.parseInt(user.quotaDays, 10) || 1),
        megabytes: Math.max(1, Math.round((Number.parseFloat(user.quotaGb) || 1) * 1024)),
      }];
    }

    return result;
  });
  const userConfig = JSON.stringify({ portBindings: [{ port: +port, protocol: 'TCP' }], users: configUsers }, null, 2);
  const configFile = 'mieru-users.json';
  const addUserCommand = `cat > ${configFile} <<'EOF'
${userConfig}
EOF
mita apply config ${configFile}
mita start
mita describe config`;
  const snConnectionLink = (user: MieruUser) => {
    const bytes = [
      ...writeInt32LE(0),
      ...writeKryoAscii(server.trim() || 'SERVER_IP'),
      ...writeInt32LE(Number.parseInt(port, 10) || 443),
      ...writeKryoAscii('TCP'),
      ...writeKryoAscii(user.username.trim() || 'user'),
      ...writeKryoAscii(user.password.trim() || 'password'),
      ...writeInt32LE(1),
      ...writeKryoAscii('mieru'),
      0x81,
      0x81,
    ];
    return `sn://mieru?${base64Url(deflateStored(bytes))}`;
  };
  const clashConfig = (user: MieruUser) => `proxies:
  - name: ${user.username.trim() || 'mieru'}
    type: mieru
    server: ${linkHost(server)}
    port: ${port}
    transport: TCP
    udp: true
    username: ${user.username}
    password: ${user.password}
    multiplexing: MULTIPLEXING_HIGH`;
  const downloadClashConfig = (user: MieruUser) => {
    const username = (user.username.trim() || 'user').replace(/[^a-zA-Z0-9_-]/g, '-');
    const url = URL.createObjectURL(new Blob([clashConfig(user)], { type: 'application/yaml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}.yaml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const guideSteps = useMemo(() => [
    { id: "install", title: "Установка сервера" },
    { id: "add-user", title: "Добавление пользователя" },
    { id: "client", title: "Подключение клиента" },
    { id: "forwarding", title: "Установка перенаправления" },
  ], []);

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="MieruProxy" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={guideSteps.length} settingsHref="#add-user" videoUrl="https://youtu.be/nvUWw9Btg2w">
        <GuidePartnerLinks items={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", icon: <IshostingIcon />, sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", icon: <BegetIcon />, sponsored: true },
          { label: "Обход Глушилок / Белых списков", href: "https://t.me/futuresbp_bot?start=DenPiligrim", icon: <FutureIcon />, sponsored: true }
        ]} />
      </GuideHeader>
      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#add-user">
        <Box className="guide-notes"><Alert icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 4 }}>
          Серверная часть работает на Linux. Перед началом откройте выбранный порт в файрволе и панели хостинга.
        </Alert></Box>

        <Box className="guide-dates"><Grid container spacing={2} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary'>Дата: {new Date('06.07.2026').toLocaleDateString()}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color='textSecondary' sx={{ textAlign: { xs: 'left', md: 'right' } }}>Изменено: {new Date('06.07.2026').toLocaleDateString()}</Typography>
          </Grid>
        </Grid></Box>
        <GuideArticle>
          <GuideSection steps={guideSteps} id="install">
            <Typography component="p" gutterBottom>
              Подключитесь к серверу по SSH и запустите официальный интерактивный скрипт установки. В процессе укажите
              порт и протокол <InlineCode>TCP</InlineCode>.
            </Typography>
            <CodeBlock code={`curl -fSsLO https://raw.githubusercontent.com/enfein/mieru/refs/heads/main/tools/setup.py
chmod +x setup.py
sudo python3 setup.py`} />
            <Typography component="p" color="text.secondary" gutterBottom>
              В процессе согласитесь с установкой сервера mita, а вот на второй вопрос откажитесь от настройки конфигурации, поскольку мы будем настраивать конфиг далее.
            </Typography>
            <Typography component="p" gutterBottom>
              После установки проверьте состояние сервиса:
            </Typography>
            <CodeBlock code={`systemctl status mita
mita status`} />

          </GuideSection>
          <GuideSection steps={guideSteps} id="add-user">
            <Typography component="p" color="text.secondary" gutterBottom>
              Добавьте одного или нескольких пользователей. Команда ниже создаст JSON-конфигурацию, применит весь список и перезагрузит настройки
              без разрыва активных подключений.
            </Typography>

            <GuidePanel sx={{ p: 3, my: 3, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Stack spacing={3}>
                {users.map((user, index) => (
                  <Card key={user.id} variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography component="h3" variant="h6">Пользователь {index + 1}</Typography>
                        {users.length > 1 && (
                          <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setUsers(current => current.filter(item => item.id !== user.id))}>
                            Удалить
                          </Button>
                        )}
                      </Stack>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Логин"
                            value={user.username}
                            onChange={event => updateUser(user.id, { username: event.target.value })}
                            slotProps={{ input: { endAdornment: <Button onClick={() => updateUser(user.id, { username: `user-${randomValue(6).toLowerCase()}` })}><AutoFixHighIcon /></Button> } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Пароль"
                            value={user.password}
                            onChange={event => updateUser(user.id, { password: event.target.value })}
                            slotProps={{ input: { endAdornment: <Button onClick={() => updateUser(user.id, { password: randomValue(20) })}><AutoFixHighIcon /></Button> } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormControlLabel control={<Checkbox checked={user.useQuota} onChange={event => updateUser(user.id, { useQuota: event.target.checked })} />} label="Ограничить трафик пользователя" />
                        </Grid>
                        {user.useQuota && (
                          <>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextField fullWidth type="number" label="Период квоты, дней" value={user.quotaDays} onChange={event => updateUser(user.id, { quotaDays: event.target.value })} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <TextField fullWidth type="number" label="Объём трафика, ГБ" value={user.quotaGb} onChange={event => updateUser(user.id, { quotaGb: event.target.value })} />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setUsers(current => [...current, createUser()])}>
                  Добавить пользователя
                </Button>
              </Stack>
            </GuidePanel>
            <GuidePanel sx={{ p: 3, my: 3, borderRadius: '15px', bgcolor: '#00060c', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField fullWidth label="IP-адрес или домен сервера" value={server} onChange={event => setServer(event.target.value.trim())} placeholder="1.2.3.4" />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField fullWidth label="TCP-порт" type="number" value={port} onChange={event => setPort(event.target.value)} />
                </Grid>
              </Grid>
            </GuidePanel>

            <Typography component="h3" variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>Команда применения списка пользователей</Typography>
            <CodeBlock code={addUserCommand} />
            <Typography variant="caption" color="text.secondary" component="p" gutterBottom>
              При необходимости вы можете открыть диапазон портов задав вместо port <InlineCode copy>"portRange": "2012-2022"</InlineCode>.
            </Typography>
            <Alert severity="warning" sx={{ mb: 4 }}>
              Используйте уникальные логины. Повторное применение пользователя с тем же логином обновит его параметры.
            </Alert>

          </GuideSection>
          <GuideSection steps={guideSteps} id="client">
            <Card sx={{ my: 3 }}>
              <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
                  <Box>
                    <Typography component="h3" variant="h6" fontWeight="bold">Рекомендуемый клиент: Karing</Typography>
                    <Typography color="text.secondary">Также протокол Mieru поддерживается в NekoBox, Exclave, Clash Verge и др.</Typography>
                  </Box>
                  <Button component="a" href="https://karing.app/ru/download" target="_blank" rel="noopener" variant="contained" startIcon={<LaunchIcon />}>
                    Скачать Karing
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Typography component="p" gutterBottom>
              Посмотреть все поддерживаемые приложения можно в репозитории <Link href="https://github.com/enfein/mieru#third-party-client-software" target="_blank" rel="noopener">Mieru</Link>.
            </Typography>

            <Typography component="p" gutterBottom>
              Выберите приложение, чтобы получить подходящий формат конфигурации:
            </Typography>

            <TextField
              select
              fullWidth
              label="Приложение"
              value={clientApp}
              onChange={event => setClientApp(event.target.value)}
              sx={{ my: 3 }}
            >
              <MenuItem value="clash">Clash / Karing</MenuItem>
              <MenuItem value="nekobox">NekoBox / SagerNet format</MenuItem>
              <MenuItem value="sn">Exclave / simple link</MenuItem>
            </TextField>

            {clientApp === 'clash' ? (
              <Stack spacing={3}>
                {users.map((user, index) => (
                  <Card key={user.id} variant="outlined">
                    <CardContent>
                      <Typography component="h3" variant="h6" gutterBottom>
                        Конфиг для пользователя {index + 1}: {user.username.trim() || 'user'}
                      </Typography>
                      <CodeBlock code={clashConfig(user)} language="yaml" mb={0} />
                      <QrCode
                        processedLink={clashConfig(user)}
                        actions={(
                          <Button variant="contained" color="secondary" startIcon={<DownloadIcon />} onClick={() => downloadClashConfig(user)}>
                            Скачать файл YAML
                          </Button>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : clientApp === 'nekobox' ? (
              <Stack spacing={3}>
                {users.map((user, index) => (
                  <Card key={user.id} variant="outlined">
                    <CardContent>
                      <Typography component="h3" variant="h6" gutterBottom>
                        Подключение пользователя {index + 1}: {user.username.trim() || 'user'}
                      </Typography>
                      <CodeBlock code={snConnectionLink(user)} language="http" mb={0} />
                      <QrCode processedLink={snConnectionLink(user)} />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Stack spacing={3}>
                {users.map((user, index) => (
                  <Card key={user.id} variant="outlined">
                    <CardContent>
                      <Typography component="h3" variant="h6" gutterBottom>
                        Подключение пользователя {index + 1}: {user.username.trim() || 'user'}
                      </Typography>
                      <CodeBlock code={`mierus://${user.username}:${user.password}@${server || 'SERVER_IP'}?profile=mieru&multiplexing=MULTIPLEXING_HIGH&port=${port}&protocol=TCP`} language="http" mb={0} />
                      <QrCode processedLink={`mierus://${user.username}:${user.password}@${server || 'SERVER_IP'}?profile=mieru&multiplexing=MULTIPLEXING_HIGH&port=${port}&protocol=TCP`} />
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}

          </GuideSection>
          <GuideSection steps={guideSteps} id="forwarding">
            <Alert severity="warning" sx={{ mb: 4 }}>
              Выполняется на промежуточном сервере!
            </Alert>
            <Typography component="p" color="text.secondary" gutterBottom>
              Если вы хотите использовать каскадную схему подключения, то вы можете установить перенаправление с промежуточного сервера на основной. Выполните команду, указав IP основного сервера:
            </Typography>
            <CodeBlock code={`sudo ORIGIN_IP="${server || 'SERVER_IP'}" bash -c "$(curl -sSL https://raw.githubusercontent.com/denpiligrim/3dp-manager/main/forwarding_install.sh)"`} />

            <Typography component="p" color="text.secondary" gutterBottom>
              По умолчанию скрипт перенаправляет 443, 8443 порты и диапазон 10000-60000, поэтому вы можете отредактировать файл и оставить только нужные порты командой <InlineCode copy>sudo nano /etc/ufw/before.rules</InlineCode> там вы увидите две строки для TCP и UDP транспорта (сохранить и выйти: Ctrl + O, Enter, Ctrl + X). После установки перезапустите файрвол <InlineCode copy>ufw reload</InlineCode> и перезагрузите сервер <InlineCode copy>reboot</InlineCode>.
            </Typography>
            <Typography component="p" color="text.secondary" gutterBottom>
              Теперь вы можете использовать те же самые конфигурации для подключения, изменив только IP адрес основного сервера на IP промежуточного сервера.
            </Typography>

          </GuideSection>
          <GuideFaq items={seo.faq} title={"Вопросы об установке и настройке MieruProxy"} />

        </GuideArticle>
        <GuideResources links={[]} moreLinks={[
          { label: "Аренда зарубежного сервера", href: "https://ishosting.io/affiliate/MjIwOSM4", sponsored: true },
          { label: "Аренда РУ сервера и домен", href: "https://beget.com/p1519472", sponsored: true },
          { label: "Подписка Amnezia Premium с 15% скидкой", href: "https://storage.googleapis.com/amnezia/amnezia.org?m-path=premium&arf=PDREDMECND8VNTBJ&coupon=DENPILIGRIM", sponsored: true },
          { label: "Репозиторий проекта Mieru", href: "https://github.com/enfein/mieru", sponsored: false },
          { label: "Приложение Karing", href: "https://karing.app/ru/download", sponsored: false },
          { label: "Приложение Exclave", href: "https://github.com/dyhkwong/Exclave/releases/latest", sponsored: false },
          { label: "Приложение NekoBox", href: "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/latest", sponsored: false },
          { label: "Приложение Clash Verge", href: "https://github.com/clash-verge-rev/clash-verge-rev/releases/latest", sponsored: false }
        ]} />
        <GuideSupportFooter />
      </GuideLayout>

    </GuidePage>
  );
}
