import { createPlaceholderHtml } from './cdn-setup/templates';
import 'flag-icons/css/flag-icons.min.css';
import ComputerIcon from '@mui/icons-material/Computer';
import { useServerAddress } from './self-steal/useServerAddress';
import { useEffect, useRef, useState } from 'react';
import { Checkbox, Switch, FormControlLabel, Grid2 as Grid, Tab, Tabs, Typography } from '@mui/material';
import seo from '../../data/self-steal-seo.json';
import {
  GuideArticle, GuideBackLink, GuideCodeBlock as Code, GuideFaq, GuideField, GuideHeader,
  GuideLayout, GuidePage, GuidePrerequisites, GuideResources, GuideSection, GuideSeo, GuideSettings,
  GuideSupportFooter, GuideValues,
  GuidePartnerLinks,
  GuideAlert,
} from '../components/guides';
import { routingProfileUrl } from '../components/guides/routingProfile';
import { isDomain, isIPv4, isPort, randomSecret } from '../security/inputs';
import { generateRealityCredentials, type RealityCredentials, firewall, inboundTemplates, nginxConfig, ports, PortValues, randomInboundParameters, randomPorts, relayScript } from './self-steal/templates';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import GikIcon from '../svgIcons/GikIcon';
import InlineCode from '../components/InlineCode';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const connections = {
  xhttp: 'VLESS XHTTP', warp: 'VLESS WARP', hy2: 'Hysteria2',
};
const portKeys = Object.keys(ports) as (keyof PortValues)[];
const directSteps = seo.steps.filter(step => step.id !== 'relay');

function CountryFlag({ code, name }: { code?: string; name: string }) {
  if (!code) return null;
  return <i className={`fi fi-${code.toLowerCase()}`} role="img" aria-label={name} title={name}
    style={{ fontSize: '0.75rem', verticalAlign: 'middle', marginRight: '0.4em' }} />;
}

export default function SelfSteal() {
  const [relay, setRelay] = useState(true);
  const [sudo, setSudo] = useState(false);
  const [p, setPorts] = useState<PortValues>(randomPorts);
  const [tab, setTab] = useState<keyof typeof connections>('xhttp');
  const [hy2Password] = useState(() => randomSecret(16));
  const [inboundParameters] = useState(randomInboundParameters);
  const [useReality, setUseReality] = useState(true);
  const [credentials, setCredentials] = useState<RealityCredentials>();
  const [keyError, setKeyError] = useState(false);
  const generation = useRef<Promise<RealityCredentials>>(null);
  useEffect(() => {
    let active = true;
    generation.current ??= generateRealityCredentials();
    generation.current.then(keys => { if (active) setCredentials(keys); }, () => { if (active) setKeyError(true); });
    return () => { active = false; };
  }, []);
  const vpn = useServerAddress('example.com', '104.20.23.154');
  const edge = useServerAddress('relay.example.com', '203.0.113.10', relay);
  const domain = vpn.domain;
  const relayDomain = edge.domain;
  const relayIp = edge.ip;
  const computer = <><ComputerIcon fontSize='small' sx={{ color: '#70baff', verticalAlign: 'middle', mr: 1 }} />Выполняется на компьютере</>;
  const vpnFlag = <CountryFlag code={vpn.countryCode} name={vpn.hint} />;
  const relayFlag = <CountryFlag code={edge.countryCode} name={edge.hint} />;
  const server = <>{vpnFlag}Выполняется на VPN-сервере</>;
  const intermediate = <> {relayFlag}Выполняется на relay-сервере</>;
  const panel = (detail: string) => <>{vpnFlag}В панели 3x-ui · {detail}</>;
  const domains = relay ? [domain, relayDomain] : [domain];
  const host = relay ? relayDomain : domain;
  const steps = relay ? seo.steps : directSteps;
  const visibleSteps = useReality ? steps.map(step => step.id === 'fallback' ? { ...step, title: 'Настройте основной инбаунд REALITY' } : step) : steps;
  const user = sudo ? 'admin' : 'root';
  const certDir = `/etc/letsencrypt/live/${host}`;
  const templates = inboundTemplates(domains, p, hy2Password, inboundParameters, useReality ? credentials : undefined);
  const portError = (key: keyof PortValues) => {
    const value = Number(p[key]);
    if (!isPort(p[key]) || String(value) !== p[key]) return 'Введите число от 1 до 65535 без ведущих нулей';
    if (value < 8443 || value > 20000) return 'Введите порт от 8443 до 20000';
    if (portKeys.some(other => other !== key && Number(p[other]) === value)) return 'Выберите отдельный порт';
    return '';
  };
  const errors = portKeys.filter(key => portError(key)).map(key => ports[key].label);
  if (!isIPv4(vpn.ip)) errors.push('IPv4 VPN-сервера');
  if (!isDomain(domain)) errors.push('Домен VPN-сервера');
  if (relay && (!isDomain(relayDomain) || domain === relayDomain)) errors.push('Домен relay-сервера');
  if (relay && !isIPv4(relayIp)) errors.push('IPv4 relay-сервера');

  return <GuidePage errors={errors}>
    <GuideSeo seo={seo} breadcrumbName="Self-Steal" />
    <GuideBackLink />
    <GuideHeader tags={['443 порт', 'Маскировка под сайт']} title={seo.heading} intro={seo.intro} stepCount={steps.length} videoUrl={seo.videoUrl} settingsHref="#guide-settings">
      <GuidePartnerLinks items={[
        { label: 'ishosting', detail: 'Зарубежные VPS для других задач', href: 'https://ishosting.io/affiliate/MjIwOSM4', icon: <IshostingIcon />, sponsored: true },
        { label: 'Beget', detail: 'Хостинг, серверы и домены', href: 'https://beget.com/p1519472', icon: <BegetIcon />, sponsored: true },
        { label: 'Gik VPN', detail: 'Готовый VPN для ваших устройств', href: 'https://t.me/Gik_VPN_Bot?start=p6q0ed5', icon: <GikIcon />, sponsored: true },
      ]} />
    </GuideHeader>
    <GuideLayout steps={visibleSteps} faqHref="#faq" settingsHref="#guide-settings">
      <GuidePrerequisites items={['Чистая Ubuntu 24.04 или Debian 12+', 'Доступ по SSH', 'Домен с управлением DNS', ...(relay ? ['Второй VPS для relay'] : [])]}>
        Инструкция рассчитана на серверы с публичным IPv4. {sudo && 'В примерах SSH замените admin на имя своей учётной записи с sudo.'}
      </GuidePrerequisites>
      <GuideSettings title="Параметры Self-Steal">
        <GuideField columns={6} label="Домен VPN-сервера" value={domain} error={!isDomain(domain)}
          onBlur={vpn.resolveDomain} onChange={e => vpn.editDomain(e.target.value)} />
        <GuideField label="IPv4 VPN-сервера" value={vpn.ip} helperText={<>{vpn.hint}</>} error={!!vpn.ip && !isIPv4(vpn.ip)} onBlur={vpn.resolveCountry} onChange={e => vpn.edit(e.target.value)} />
        {portKeys.map(key => <GuideField key={key} label={ports[key].label} value={p[key]}
          slotProps={{ input: { inputMode: 'numeric' } }} error={!!portError(key)} helperText={portError(key)}
          onChange={e => setPorts({ ...p, [key]: e.target.value.trim() })} />)}
        <Grid size={12}><FormControlLabel label="Использовать REALITY для основного VLESS (иначе TLS)" control={<Switch checked={useReality} disabled={!credentials} onChange={e => setUseReality(e.target.checked)} />} />
          {keyError && <Typography>Для генерации ключей откройте гайд по HTTPS или на localhost в браузере с поддержкой X25519.</Typography>}
        </Grid>
        <Grid size={12}><FormControlLabel label="Использовать relay-сервер" control={<Checkbox checked={relay} onChange={e => setRelay(e.target.checked)} />} /></Grid>
        {relay && <>
          <GuideField label="Домен relay-сервера" value={relayDomain} error={!isDomain(relayDomain) || domain === relayDomain}
            helperText={domain === relayDomain ? 'Укажите отдельное DNS-имя для relay' : ''}
            onBlur={edge.resolveDomain} onChange={e => edge.editDomain(e.target.value)} />
          <GuideField label="IPv4 relay-сервера" value={relayIp} helperText={<>{edge.hint}</>} error={!!relayIp && !isIPv4(relayIp)}
            onBlur={edge.resolveCountry} onChange={e => edge.edit(e.target.value)} />
        </>}
        <Grid size={12}><FormControlLabel label="Использовать sudo в командах" control={<Checkbox checked={sudo} onChange={e => setSudo(e.target.checked)} />} /></Grid>
      </GuideSettings>
      <GuideArticle>
        <GuideSection id="dns" steps={visibleSteps}>
          <Typography component="p">У регистратора или DNS-провайдера добавьте A-запись для домена.</Typography>
          <GuideValues title="Записи в DNS" rows={[[domain, `A → ${vpn.ip}`], ...(relay ? [[relayDomain, `A → ${relayIp}`]] : [])]} />
          <Typography component="p">Дождитесь, пока каждое имя вернёт адрес из таблицы. Проверьте записи на компьютере перед подключением по SSH.</Typography>
          <Code title={computer} code={domains.map(name => `nslookup -type=A ${name}`).join('\n')} />
        </GuideSection>
        {relay && <GuideSection id="relay" steps={visibleSteps}>
          <Typography component="p">Откройте SSH-сессию на промежуточном сервере.</Typography>
          <Code title={computer} code={`ssh ${user}@${relayIp}`} />
          <Typography component="p">Запустите скрипт перенаправления на IP адрес вашего ВПН сервера:</Typography>
          <Code title={intermediate} code={relayScript(vpn.ip, p.subscription)} sudo={sudo} />
          <Typography component="p">Скрипт автоматически настроит перенаправление трафика с промежуточного сервера на основной с помощью правил iptables, которые будут прописаны в фаерволе. Это лучший способ, не ограничивающий скорость соединения, исключая этапы с дешифрованием трафика. Ваш трафик будет передаваться как есть в зашифрованном виде, на relay сервере не будет никаких ВПН утилит, что дает максимальную маскировку. Даже хостинг-провайдер не сможет прочитать ваш трафик!</Typography>
        </GuideSection>}
        <GuideSection id="firewall" steps={visibleSteps}>
          <Typography component="p">Откройте отдельную SSH-сессию на основном сервере. Дальнейшие команды для сервера выполняйте в ней.</Typography>
          <Code title={computer} code={`ssh ${user}@${vpn.ip}`} />
          <Typography component="p">Обновите пакеты и установите утилиты:</Typography>
          <Code title={server} sudo={sudo} code={'<sudo>apt update && <sudo>apt upgrade -y\n<sudo>apt install -y ufw snapd curl'} />
          <Typography component="p">Первое правило сохраняет доступ на порт текущей SSH-сессии. Разрешите эти же порты в фаерволе хостинга. Порт {p.subscription} обслуживает подписки. Панель и внутренние порты остаются за фаерволом.</Typography>
          <Code title={server} code={firewall(p.subscription)} sudo={sudo} />
        </GuideSection>
        <GuideSection id="certificates" steps={visibleSteps}>
          <Typography variant="h6">Установка Certbot</Typography>
          <Typography component="p">Для проверки HTTP-01 нужен свободный порт 80 на основном сервере.{relay && ' Проверьте также, что запросы на порт 80 relay доходят до основного сервера.'}</Typography>
          <Code title={server} sudo={sudo} code={'<sudo>snap install --classic certbot\n<sudo>ln -sf /snap/bin/certbot /usr/local/bin/certbot'} />
          <Typography variant="h6">Выпуск сертификата</Typography>
          {domains.map(name => <div key={name}>
            <Typography component="p">Выпустите отдельный сертификат для {name}.</Typography>
            <Code title={server} sudo={sudo} code={`<sudo>certbot certonly --standalone --cert-name ${name} -d ${name}`} />
          </div>)}
          <ol><li>При первом выпуске введите <InlineCode>email</InlineCode> для уведомлений.</li><li>Подтвердите условия сервиса клавишей <InlineCode>Y</InlineCode> и нажмите Enter.</li><li>Если Certbot предложит рассылку, выберите <InlineCode>N</InlineCode>, чтобы отказаться.</li></ol>
          <Typography component="p">После успешного выпуска в консоли отобразятся пути к вашему сертификату и закрытому ключу. По умолчанию сертификат будет продлеваться автоматически каждые 90 дней.</Typography>
        </GuideSection>
        <GuideSection id="nginx" steps={visibleSteps}>
          <Typography component="p">Установите Nginx и создайте каталог сайта. В nano вставьте содержимое соответствующего блока, сохраните файл сочетанием Ctrl+O, нажмите Enter и выйдите через Ctrl+X.</Typography>
          <Code title={server} sudo={sudo} code={`<sudo>apt install -y nginx nano\n<sudo>mkdir -p /var/www/${domain}/html\n<sudo>chown -R $USER:$USER /var/www/${domain}/html`} />
          {domains.map((name, i) => {
            const filename = i === 0 ? 'index.html' : 'index_ru.html';
            return <div key={name}>
              <Typography component="p">Страница для {name} — {filename}.</Typography>
              <Code title={server} sudo={sudo} code={`<sudo>nano /var/www/${domain}/html/${filename}`} />
              <Code title={filename} language="html" code={createPlaceholderHtml({ originHost: name, language: i === 0 ? 'en' : 'ru', heading: i === 0 ? 'Hello World!' : 'Добро пожаловать!', randomPhrase: i === 0 ? 'This website is under development. Please visit us again soon.' : 'Сайт находится в разработке. Загляните чуть позже.' })} />
              <Typography component="p" variant="caption" gutterBottom>
                Сохраните и выйдите (<InlineCode>Ctrl + O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl + X</InlineCode>).
              </Typography>
            </div>;
          })}
          <Typography component="p">Создайте конфигурацию сайта. Порт 80 обслуживает проверку сертификатов. Сайт и XHTTP принимают запросы на внутренних адресах Nginx.{relay && ' Оба домена используют общий каталог, каждый со своей главной страницей и сертификатом.'}</Typography>
          <Code title={server} sudo={sudo} code={`<sudo>nano /etc/nginx/sites-available/${domains[0]}`} />
          <Code title="self-steal.conf" language="nginx" code={nginxConfig(domains, p, inboundParameters.xhttpPath)} />
          <Typography component="p" variant="caption" gutterBottom>
            Сохраните и выйдите (<InlineCode>Ctrl + O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl + X</InlineCode>).
          </Typography>
          <Typography component="p" gutterBottom>
              Создайте символическую ссылку, удалите дефолтный конфиг Nginx и перезапустите службу:
            </Typography>
            <Code title={server}
              code={`<sudo>ln -s /etc/nginx/sites-available/${domains[0]} /etc/nginx/sites-enabled/\n<sudo>rm /etc/nginx/sites-enabled/default\n<sudo>nginx -t\n<sudo>systemctl restart nginx`}
              sudo={sudo}
            />
          <Typography component="p">Пока что сайт не будет открываться, так как мы еще не настроили основной инбаунд на 443 порту.</Typography>
        </GuideSection>
        <GuideSection id="panel" steps={visibleSteps}>
          <Typography component="p" gutterBottom>
              Установите панель управления подключениями на сервере <b>{domains[0]}</b>.
            </Typography>
            <GuideAlert title="Нужен Xray 26.3.27 или новее" severity="info" icon={<InfoOutlinedIcon />}>В конфигурации ниже используются дополнительные параметры XHTTP. Проверьте версию ядра в панели перед настройкой инбаунда.</GuideAlert>
            <Code title={server} code='<sudo>bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)' sudo={sudo} />

            <Typography component="p" gutterBottom>
              Во время установки задайте порт панели <InlineCode copy>{p.panel}</InlineCode>. В настройках сертификата выберите пункт 3, укажите домен <InlineCode copy>{domains[0]}</InlineCode> и пути к файлам ниже.
            </Typography>
            <Typography component="p" gutterBottom sx={{ mt: 2 }}>
              Сертификат:
            </Typography>
            <Code title="fullchain.pem" code={`/etc/letsencrypt/live/${domains[0]}/fullchain.pem`} />

            <Typography component="p" gutterBottom sx={{ mt: 2 }}>
              Приватный ключ:
            </Typography>
            <Code title="privkey.pem" code={`/etc/letsencrypt/live/${domains[0]}/privkey.pem`} />

            <Typography component="p" gutterBottom>
              После установки вы увидите логин, пароль и ссылку на панель управления, сохраните их.
            </Typography>
            <Typography component="p" gutterBottom>
              Для того чтобы панель управления не была доступна публично, мы будем открывать ее через SSH туннель:
            </Typography>
            <Code title={computer} code={`ssh -p 22 -N -L 127.0.0.1:${p.panel}:127.0.0.1:${p.panel} ${user}@${vpn.ip}`} />
            <Typography component="p" gutterBottom>
              Введите пароль от сервера. После этого панель управления будет доступна по адресу <InlineCode copy>{`http://127.0.0.1:${p.panel}/panel_path`}</InlineCode> (замените на свой путь панели). Не обращайте внимание на предупреждение браузера о небезопасном соединении, так как соединение защищено SSH.
            </Typography>
        </GuideSection>
        <GuideSection id="inbounds" steps={visibleSteps}>
          <Typography component="p">В разделе «Подключения» добавьте по одному инбаунду из каждой вкладки. Вставьте объект в расширенный JSON-редактор и задайте понятное имя. XHTTP и WARP слушают loopback. Hysteria2 занимает 443/UDP. Основной VLESS на 443/TCP добавим на следующем шаге.</Typography>
          <Typography component="p">Для клиентских ссылок адрес подключения — {host}:443. В шаблонах локальных инбаундов этот адрес задан в External Proxy. Если ваша версия панели использует раздел Hosts, укажите там этот же адрес и порт.{relay && ' Домен relay указывается для всех четырёх профилей.'}</Typography>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" aria-label="Шаблоны подключений">
            {Object.entries(connections).map(([key, name]) => <Tab key={key} value={key} label={name} />)}
          </Tabs>
          <Typography component="p" sx={{ mt: 2 }}>{{

            xhttp: useReality ? 'Клиент XHTTP подключается через REALITY к основному инбаунду. После рукопожатия fallback h2 передаёт запрос в Nginx, а тот проксирует его по пути XHTTP.' : 'Транспорт XHTTP работает в режиме packet-up. Основной VLESS-инбаунд завершает TLS и передаёт запрос в Nginx, поэтому у инбаунда Security = none, а в клиентской ссылке нужен TLS.',
            warp: <>Локальный инбаунд использует VLESS TCP, Security = none. В клиентской ссылке используется {useReality ? 'REALITY' : 'TLS'} до {host}:443. Путь <InlineCode copy>{inboundParameters.warpPath}</InlineCode> ведёт на локальный VLESS WARP. Инбаунд принимает PROXY protocol.</>,
            hy2: 'Hysteria2 слушает 443/UDP и использует TLS с ALPN h3. У него собственный клиент и сертификат, а правила TCP fallback ему не нужны.',
          }[tab]}</Typography>
          <Code title={panel(connections[tab])} language="json" code={JSON.stringify(templates[tab], null, 2)} />
          <Typography component="p">В настройках Xray откройте «Исходящие подключения» и добавьте WireGuard с тегом warp. В настройках WARP зарегистрируйте аккаунт и примените полученные ключи, адрес и параметры узла к этому выходу. Поставьте Direct первым в списке выходов, а WARP вторым.</Typography>
          <Typography component="p">В разделе Маршрутизация добавьте правило inboundTag с тегом WARP-инбаунда в итоговой конфигурации Xray и аутбаунд WARP.</Typography>
        </GuideSection>
        <GuideSection id="fallback" steps={visibleSteps}>
          <Typography component="p">Добавьте основной VLESS RAW + {useReality ? 'REALITY' : 'TLS'} на 443/TCP. Вставьте JSON в расширенный редактор. {useReality ? <>Для клиента укажите SNI <InlineCode copy>{host}</InlineCode>. Основной инбаунд принимает REALITY для всех трёх VLESS-профилей. Браузерские соединения target направляет на HTTPS-порт Nginx.</> : 'Сертификат для подключения выбирается по SNI.'}</Typography>
          <Code title={panel("Основной инбаунд · 443/TCP")} language="json" code={JSON.stringify(templates.main, null, 2)} />
          <Typography component="p">В настройках основного инбаунда откройте Fallbacks и трижды нажмите «Добавить фолбэк». Заполните строки сверху вниз. Во всех трёх оставьте SNI пустым. В первых двух строках оставьте Path пустым: серый символ / в поле — подсказка панели.</Typography>
          <GuideValues title="Правила fallback" rows={[
            ['1. Сайт', <>Оставьте выбор инбаунда пустым. Введите Dest <InlineCode copy>{`127.0.0.2:${p.site}`}</InlineCode>. Установите xver 0. Все остальное по умолчанию</>],
            ['2. XHTTP', <>Выберите инбаунд XHTTP (порт {p.xhttp}). Укажите ALPN <InlineCode copy>h2</InlineCode> и вручную введите Dest <InlineCode copy>{`127.0.2.2:${p.site}`}</InlineCode>, чтобы запрос принял Nginx. Установите xver 0.</>],
            ['3. WARP', <>Выберите инбаунд WARP (порт {p.warp}). Оставьте ALPN пустым. Укажите Path <InlineCode copy>{inboundParameters.warpPath}</InlineCode> и xver <InlineCode copy>1</InlineCode>. Оставьте Dest пустым, чтобы панель взяла адрес и порт выбранного инбаунда.</>],
          ]} />
          <Typography component="p">Сохраните настройки.</Typography>
          <Typography component="p">Теперь когда сайт открывается переключите продление сертификата на webroot. После обновления сертификата Certbot перезагрузит Nginx и перезапустит панель.</Typography>
          <Code title={server} sudo={sudo} code={domains.map(name => `<sudo>certbot reconfigure --cert-name ${name} --authenticator webroot --webroot-path /var/www/${domain}/html --deploy-hook "systemctl reload nginx; systemctl restart x-ui"`).join('\n')} />
        </GuideSection>
        <GuideSection id="subscription" steps={visibleSteps}>
          <Typography component="p">В разделе «Клиенты» создайте клиента, сгенерируйте идентификатор подписки и назначьте основной VLESS, XHTTP, WARP и Hysteria2. Для основного VLESS во вкладке «Учетные данные» укажите Flow = xtls-rprx-vision. В настройках панели укажите {host} как домен для ссылок подписки, выберите сертификат и ключ этого домена. Затем включите HTTPS-подписку и заполните профиль.</Typography>
          <GuideValues copyCells title="Профиль подписки" rows={[
            ['Название профиля', 'Self-Steal'], ['Домен прослушивания', host], ['Порт подписки', p.subscription],
            ['Путь', 'Оставьте сгенерированный панелью путь'], ['Сертификат', `${certDir}/fullchain.pem`], ['Закрытый ключ', `${certDir}/privkey.pem`],
          ]} />
          <Typography component="p">Во вкладках Happ и INCY вставьте ссылки в поле маршрутизации соответствующего приложения. Данный профиль маршрутизации открывает ресурсы из белого списка напрямую, а все остальное через ВПН.</Typography>
          <Code title={panel("Маршрутизация Happ")} language="text" code={routingProfileUrl('happ')} />
          <Code title={panel("Маршрутизация INCY")} language="text" code={routingProfileUrl('incy')} />
          <Typography component="p">Сохраните настройки и скопируйте ссылку клиента. Она должна начинаться с https://{host}:{p.subscription}/. Откройте её в Happ или INCY. Проверьте все четыре профиля.</Typography>
        </GuideSection>
      </GuideArticle>
      <GuideFaq items={seo.faq} />
      <GuideResources links={[
        { label: '3x-ui', href: 'https://github.com/MHSanaei/3x-ui' },
        { label: 'Fallback в Xray', href: 'https://xtls.github.io/en/document/level-1/fallbacks-lv1.html' },
        { label: 'Транспорт RAW', href: 'https://xtls.github.io/en/config/transports/raw.html' },
        { label: 'Certbot', href: 'https://certbot.eff.org/instructions?ws=other&os=snap' },
        { label: 'Гайд CDN и XHTTP', href: '/guides/cdn-setup' },
      ]} />
      <GuideSupportFooter />
    </GuideLayout>
  </GuidePage>;
}
