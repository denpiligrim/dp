import 'flag-icons/css/flag-icons.min.css';
import ComputerIcon from '@mui/icons-material/Computer';
import { useServerAddress } from './self-steal/useServerAddress';
import { useState } from 'react';
import { Checkbox, FormControlLabel, Grid2 as Grid, Tab, Tabs, Typography } from '@mui/material';
import seo from '../../data/self-steal-seo.json';
import {
  GuideArticle, GuideBackLink, GuideCodeBlock as Code, GuideFaq, GuideField, GuideHeader,
  GuideLayout, GuidePage, GuidePrerequisites, GuideResources, GuideSection, GuideSeo, GuideSettings,
  GuideSupportFooter, GuideValues,
  GuidePartnerLinks,
} from '../components/guides';
import { routingProfileUrl } from '../components/guides/routingProfile';
import { isDomain, isIPv4, isPort, randomSecret } from '../security/inputs';
import { firewall, inboundTemplates, nginxConfig, ports, PortValues, randomPorts, relayScript } from './self-steal/templates';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import GikIcon from '../svgIcons/GikIcon';

const connections = {
  reality: 'VLESS REALITY', xhttp: 'VLESS XHTTP', warp: 'VLESS REALITY WARP', hy2: 'Hysteria2',
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
  const [tab, setTab] = useState<keyof typeof connections>('reality');
  const [shortId] = useState(() => randomSecret(8));
  const vpn = useServerAddress('example.com', '192.0.2.10');
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
  const user = sudo ? 'admin' : 'root';
  const certDir = `/etc/letsencrypt/live/${host}`;
  const templates = inboundTemplates(domains, p, shortId);
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
    <GuideLayout steps={steps} faqHref="#faq" settingsHref="#guide-settings">
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
        <GuideSection id="dns" steps={steps}>
          <Typography component="p">У регистратора или DNS-провайдера добавьте A-запись для домена.</Typography>
          <GuideValues title="Записи в DNS" rows={[[domain, `A → ${vpn.ip}`], ...(relay ? [[relayDomain, `A → ${relayIp}`]] : [])]} />
          <Typography component="p">Дождитесь, пока каждое имя вернёт адрес из таблицы. Проверьте записи на компьютере перед подключением по SSH.</Typography>
          <Code title={computer} code={domains.map(name => `nslookup -type=A ${name}`).join('\n')} />
        </GuideSection>
        {relay && <GuideSection id="relay" steps={steps}>
          <Typography component="p">Откройте SSH-сессию на промежуточном сервере.</Typography>
          <Code title={computer} code={`ssh ${user}@${relayIp}`} />
          <Typography component="p">Запустите скрипт перенаправления на IP адрес вашего ВПН сервера:</Typography>
          <Code title={intermediate} code={relayScript(vpn.ip, `80,443,${p.subscription}`)} sudo={sudo} />
          <Typography component="p">Скрипт автоматически настроит перенаправление трафика с промежуточного сервера на основной с помощью правил iptables, которые будут прописаны в фаерволе. Это лучший способ, не ограничивающий скорость соединения, исключая этапы с дешифрованием трафика. Ваш трафик будет передаваться как есть в зашифрованном виде, на relay сервере не будет никаких ВПН утилит, что дает максимальную маскировку. Даже хостинг-провайдер не сможет прочитать ваш трафик!</Typography>
        </GuideSection>}
        <GuideSection id="firewall" steps={steps}>
          <Typography component="p">Откройте отдельную SSH-сессию на основном сервере. Дальнейшие команды для сервера выполняйте в ней.</Typography>
          <Code title={computer} code={`ssh ${user}@${vpn.ip}`} />
          <Code title={server} sudo={sudo} code={'<sudo>apt update && <sudo>apt upgrade -y\n<sudo>apt install -y ufw snapd curl'} />
          <Typography component="p">Первое правило сохраняет доступ на порт текущей SSH-сессии. Разрешите эти же порты в фаерволе хостинга. Порт {p.subscription} обслуживает подписки. Панель и внутренние порты остаются за фаерволом.</Typography>
          <Code title={server} code={firewall(p.subscription)} sudo={sudo} />
        </GuideSection>
        <GuideSection id="certificates" steps={steps}>
          <Typography component="p">Установите Certbot через snap. На время проверки HTTP-01 Certbot сам займёт свободный порт 80.{relay && ` Запрос к ${relayDomain} уже проходит через relay на этот сервер. Для каждого имени выпустите отдельный сертификат.`}</Typography>
          <Code title={server} sudo={sudo} code={`<sudo>systemctl enable --now snapd.socket
<sudo>snap install core
<sudo>snap refresh core
<sudo>snap install --classic certbot
${domains.map(name => `<sudo>/snap/bin/certbot certonly --standalone --cert-name ${name} -d ${name}`).join('\n')}
<sudo>/snap/bin/certbot certificates`} />
        </GuideSection>
        <GuideSection id="nginx" steps={steps}>
          <Typography component="p">Создайте страницу, которая откроется при обычном посещении домена. На чистом сервере отключите стандартный сайт Nginx, чтобы порт 80 оставался доступен для продления сертификата.</Typography>
          <Code title={server} sudo={sudo} code={`<sudo>apt install -y nginx
test ! -L /etc/nginx/sites-enabled/default || <sudo>unlink /etc/nginx/sites-enabled/default
<sudo>install -d /var/www/self-steal
<sudo>tee /var/www/self-steal/index.html >/dev/null <<'HTML'
<!doctype html>
<html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${domain}</title><main><h1>${domain}</h1><p>Сайт готовится к открытию.</p></main></html>
HTML`} />
          <Typography component="p">На 127.0.0.1 Nginx принимает TLS от REALITY и выбирает сертификат по SNI. На 127.0.0.2 он принимает HTTP после fallback. Оба адреса используют порт {p.site} только внутри сервера. Путь /xhttp/ передаёт запросы в Xray без буферизации.{relay && ` При открытии https://${relayDomain}/ браузер отправит SNI ${relayDomain}, и Nginx выберет второй сертификат.`}</Typography>
          <Code title={server} sudo={sudo} code={`<sudo>tee /etc/nginx/conf.d/self-steal.conf >/dev/null <<'NGINX'
${nginxConfig(domains, p)}
NGINX
<sudo>nginx -t && <sudo>systemctl reload nginx`} />
          <Typography component="p">Проверьте заглушку и доверие к сертификату локально. Каждый запрос должен вернуть HTTP 200.</Typography>
          <Code title={server} code={domains.map(name => `curl -I --resolve ${name}:${p.site}:127.0.0.1 https://${name}:${p.site}/`).join('\n')} />
        </GuideSection>
        <GuideSection id="panel" steps={steps}>
          <Typography component="p">Запустите официальный установщик 3x-ui в SSH-сессии. Задайте порт панели {p.panel}, выберите Skip SSL для доступа через туннель и привязку к 127.0.0.1. Запишите логин, пароль и выданный путь панели.</Typography>
          <Code title={server} sudo={sudo} code={`curl -fsSL https://raw.githubusercontent.com/MHSanaei/3x-ui/main/install.sh -o install-3x-ui.sh && <sudo>bash install-3x-ui.sh\n<sudo>/usr/local/x-ui/x-ui setting -listenIP 127.0.0.1 -port ${p.panel}\n<sudo>systemctl restart x-ui`} />
          <Typography component="p">На компьютере откройте второе окно терминала и оставьте команду запущенной. В браузере откройте http://127.0.0.1:{p.panel} и допишите путь панели из установщика.</Typography>
          <Code title={computer} code={`ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:${p.panel}:127.0.0.1:${p.panel} ${user}@${vpn.ip}`} />
        </GuideSection>
        <GuideSection id="inbounds" steps={steps}>
          <Typography component="p">В разделе «Подключения» добавьте по одному инбаунду из каждой вкладки. Вставьте объект в расширенный JSON-редактор и задайте понятное имя. Три VLESS-инбаунда слушают loopback. Общий вход REALITY создадим на следующем шаге.</Typography>
          <Typography component="p">Для клиентских ссылок адрес подключения — {host}:443. Шаблоны задают его в External Proxy. Если ваша версия панели использует раздел Hosts, укажите там этот же адрес и порт.{relay && ' Домен relay указывается для всех четырёх профилей.'}</Typography>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" aria-label="Шаблоны подключений">
            {Object.entries(connections).map(([key, name]) => <Tab key={key} value={key} label={name} />)}
          </Tabs>
          <Typography component="p" sx={{ mt: 2 }}>{{
            reality: 'Обычный профиль принимает VLESS за заголовком HTTP с путём /reality. Защиту REALITY клиент получит от основного инбаунда. Поле Flow оставьте пустым.',
            xhttp: 'Транспорт XHTTP работает в режиме packet-up. На сервере шифрование завершается в Nginx, поэтому у инбаунда Security = none, а в клиентской ссылке нужен TLS.',
            warp: 'Этот профиль использует путь /warp. Его отдельный тег позволит направить только эти подключения через Cloudflare WARP. Поле Flow оставьте пустым.',
            hy2: 'Hysteria2 слушает 443/UDP и использует TLS с ALPN h3. У него собственный клиент и сертификат, а правила TCP fallback ему не нужны.',
          }[tab]}</Typography>
          <Code title={panel(connections[tab])} language="json" code={JSON.stringify(templates[tab], null, 2)} />
          <Typography component="p">В настройках Xray откройте «Исходящие подключения» и добавьте WireGuard с тегом warp. В настройках WARP зарегистрируйте аккаунт и примените полученные ключи, адрес и параметры узла к этому выходу. Оставьте direct первым выходом по умолчанию.</Typography>
          <Typography component="p">В routing.rules добавьте правило после защитных блокировок и перед общим правилом выхода. Сверьте inboundTag с тегом WARP-инбаунда в итоговой конфигурации Xray.</Typography>
          <Code language="json" title={panel("Правило для VLESS REALITY WARP")} code={JSON.stringify({ type: 'field', inboundTag: [templates.warp.tag], outboundTag: 'warp' }, null, 2)} />
        </GuideSection>
        <GuideSection id="fallback" steps={steps}>
          <Typography component="p">Добавьте основной инбаунд VLESS RAW + REALITY на 443/TCP. В панели сгенерируйте пару ключей X25519 и подставьте их вместо PRIVATE_KEY и PUBLIC_KEY. Закрытый ключ храните на сервере. Браузеры и XHTTP с обычным TLS попадут на локальный HTTPS-сайт через Target.</Typography>
          <Code title={panel("Основной инбаунд · 443/TCP")} language="json" code={JSON.stringify(templates.main, null, 2)} />
          <Typography component="p">В редакторе Fallbacks привяжите /reality и /warp к соответствующим дочерним инбаундам через список подключений. Так панель добавит порт и ключи основного REALITY в клиентские ссылки. Для двух строк сайта укажите Dest вручную. Значение Xver во всех строках — 0.</Typography>
          <GuideValues title="Правила fallback" rows={[
            ['Без пути (в том числе /)', `127.0.0.2:${p.site} · сайт`],
            ['/xhttp/', `127.0.0.2:${p.site} · Nginx → 127.0.0.1:${p.xhttp}`],
            ['/reality', `127.0.0.1:${p.reality} · VLESS REALITY`],
            ['/warp', `127.0.0.1:${p.warp} · VLESS REALITY WARP`],
          ]} />
          <Typography component="p">Сохраните настройки и перезапустите Xray из панели. С компьютера проверьте сайт по публичному адресу. Для каждого домена ожидается HTTP 200 с действительным сертификатом.</Typography>
          <Code title={computer} code={domains.map(name => `curl -I https://${name}/`).join('\n')} />
        </GuideSection>
        <GuideSection id="subscription" steps={steps}>
          <Typography component="p">В разделе «Клиенты» создайте клиента, сгенерируйте идентификатор подписки и назначьте четыре подключения из вкладок. Основной инбаунд оставьте служебным. В «Настройки панели → Подписка» включите HTTPS-подписку и заполните профиль.</Typography>
          <GuideValues title="Профиль подписки" rows={[
            ['Название профиля', 'Self-Steal'], ['Домен подписки', host], ['Порт подписки', p.subscription],
            ['Путь', 'Оставьте сгенерированный панелью путь'], ['Сертификат', `${certDir}/fullchain.pem`], ['Закрытый ключ', `${certDir}/privkey.pem`],
          ]} />
          <Typography component="p">Во вкладках Happ и INCY вставьте ссылки в поле маршрутизации соответствующего приложения. Профиль RU отправляет локальные сети, российские IP и домены категории RU напрямую. Остальной трафик идёт через выбранное подключение.</Typography>
          <Code title={panel("Маршрутизация Happ")} language="text" code={routingProfileUrl('happ')} />
          <Code title={panel("Маршрутизация INCY")} language="text" code={routingProfileUrl('incy')} />
          <Typography component="p">Сохраните настройки и скопируйте ссылку клиента. Она должна начинаться с https://{host}:{p.subscription}/. Откройте её в Happ или INCY. Проверьте все четыре профиля. У обоих профилей REALITY должны совпадать публичный ключ, SNI и Short ID основного инбаунда, а пути — различаться.</Typography>
          <Typography component="p">Для проверки WARP откройте https://www.cloudflare.com/cdn-cgi/trace через профиль /warp. Строка warp=on или warp=plus подтверждает выход через Cloudflare. Переключитесь на обычный REALITY и повторите проверку.</Typography>
          <Typography component="p">Настройте перечитывание сертификатов после продления. Хук выполнится после успешного обновления и кратковременно перезапустит панель. Проверьте продление в тестовой среде Let’s Encrypt.</Typography>
          <Code title={server} sudo={sudo} code={`<sudo>tee /etc/letsencrypt/renewal-hooks/deploy/self-steal >/dev/null <<'HOOK'
#!/bin/sh
set -e
systemctl reload nginx
systemctl restart x-ui
HOOK
<sudo>chmod 755 /etc/letsencrypt/renewal-hooks/deploy/self-steal
<sudo>/snap/bin/certbot renew --dry-run`} />
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
