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
import { firewall, inboundTemplates, nginxConfig, ports, PortValues, relayScript } from './self-steal/templates';
import IshostingIcon from '../svgIcons/IshostingIcon';
import BegetIcon from '../svgIcons/BegetIcon';
import GikIcon from '../svgIcons/GikIcon';

const connections = {
  reality: 'VLESS REALITY', xhttp: 'VLESS XHTTP', warp: 'VLESS REALITY WARP', hy2: 'Hysteria2',
};
const portKeys = Object.keys(ports) as (keyof PortValues)[];
const directSteps = seo.steps.filter(step => step.id !== 'relay');

export default function SelfSteal() {
  const [domain, setDomain] = useState('example.com');
  const [relay, setRelay] = useState(false);
  const [relayOverride, setRelayOverride] = useState<string | null>(null);
  const [relayIp, setRelayIp] = useState('203.0.113.10');
  const [sudo, setSudo] = useState(false);
  const [p, setPorts] = useState<PortValues>(() => ({
    site: ports.site.initial, reality: ports.reality.initial, xhttp: ports.xhttp.initial, warp: ports.warp.initial,
  }));
  const [tab, setTab] = useState<keyof typeof connections>('reality');
  const [shortId] = useState(() => randomSecret(8));
  const relayDomain = relayOverride ?? `relay.${domain}`;
  const domains = relay ? [domain, relayDomain] : [domain];
  const host = relay ? relayDomain : domain;
  const steps = relay ? seo.steps : directSteps;
  const user = sudo ? 'admin' : 'root';
  const certDir = `/etc/letsencrypt/live/${host}`;
  const templates = inboundTemplates(domains, p, shortId);
  const portError = (key: keyof PortValues) => {
    const value = Number(p[key]);
    if (!isPort(p[key]) || String(value) !== p[key]) return 'Введите число от 1 до 65535 без ведущих нулей';
    if ([22, 80, 443, 2013, 2053].includes(value)) return 'Этот порт занят в схеме гайда';
    if (portKeys.some(other => other !== key && Number(p[other]) === value)) return 'Выберите отдельный порт';
    return '';
  };
  const errors = portKeys.filter(key => portError(key)).map(key => ports[key].label);
  if (!isDomain(domain)) errors.push('Домен VPN-сервера');
  if (relay && (!isDomain(relayDomain) || domain === relayDomain)) errors.push('Домен relay-сервера');
  if (relay && !isIPv4(relayIp)) errors.push('IPv4 relay-сервера');

  return <GuidePage errors={errors}>
    <GuideSeo seo={seo} breadcrumbName="Self-Steal" />
    <GuideBackLink />
    <GuideHeader title={seo.heading} intro={seo.intro} stepCount={steps.length} videoUrl={seo.videoUrl} settingsHref="#guide-settings">
      <GuidePartnerLinks items={[
        { label: 'ishosting', detail: 'Зарубежные VPS для других задач', href: 'https://ishosting.io/affiliate/MjIwOSM4', icon: <IshostingIcon />, sponsored: true },
        { label: 'Beget', detail: 'Хостинг, серверы и домены', href: 'https://beget.com/p1519472', icon: <BegetIcon />, sponsored: true },
        { label: 'Gik VPN', detail: 'Готовый VPN для ваших устройств', href: 'https://t.me/Gik_VPN_Bot?start=ref9I0EryhK', icon: <GikIcon />, sponsored: true },
      ]} />
    </GuideHeader>
    <GuideLayout steps={steps} faqHref="#faq" settingsHref="#guide-settings">
      <GuidePrerequisites items={['Чистая Ubuntu 24.04 или Debian 12+', 'Доступ по SSH', 'Домен с управлением DNS', ...(relay ? ['Второй VPS для relay'] : [])]}>
        Инструкция рассчитана на серверы с публичным IPv4. {sudo && 'В примерах SSH замените admin на имя своей учётной записи с sudo.'}
      </GuidePrerequisites>
      <GuideSettings title="Параметры Self-Steal">
        <GuideField columns={12} label="Домен VPN-сервера" value={domain} error={!isDomain(domain)}
          onChange={e => setDomain(e.target.value.trim().toLowerCase())} />
        {portKeys.map(key => <GuideField key={key} label={ports[key].label} value={p[key]}
          inputProps={{ inputMode: 'numeric' }} error={!!portError(key)} helperText={portError(key)}
          onChange={e => setPorts({ ...p, [key]: e.target.value.trim() })} />)}
        <Grid size={12}><FormControlLabel label="Использовать relay-сервер" control={<Checkbox checked={relay} onChange={e => setRelay(e.target.checked)} />} /></Grid>
        {relay && <>
          <GuideField label="Домен relay-сервера" value={relayDomain} error={!isDomain(relayDomain) || domain === relayDomain}
            helperText={domain === relayDomain ? 'Укажите отдельное DNS-имя для relay' : ''}
            onChange={e => setRelayOverride(e.target.value.trim().toLowerCase())} />
          <GuideField label="IPv4 relay-сервера" value={relayIp} error={!isIPv4(relayIp)}
            onChange={e => setRelayIp(e.target.value.trim())} />
        </>}
        <Grid size={12}><FormControlLabel label="Использовать sudo в командах" control={<Checkbox checked={sudo} onChange={e => setSudo(e.target.checked)} />} /></Grid>
      </GuideSettings>
      <GuideArticle>
        <GuideSection id="dns" steps={steps}>
          <Typography component="p">У регистратора или DNS-провайдера добавьте A-запись. Возьмите публичный IPv4 основного сервера в панели хостинга. Для этих имён отключите CDN-проксирование и удалите устаревшие AAAA-записи, если IPv6 не настроен.</Typography>
          <GuideValues title="Записи в DNS" rows={[[domain, 'A → публичный IPv4 VPN-сервера'], ...(relay ? [[relayDomain, `A → ${relayIp}`]] : [])]} />
          <Typography component="p">Дождитесь, пока каждое имя вернёт адрес из таблицы. Проверьте записи на компьютере перед подключением по SSH.</Typography>
          <Code code={domains.map(name => `nslookup -type=A ${name}`).join('\n')} />
        </GuideSection>
        {relay && <GuideSection id="relay" steps={steps}>
          <Typography component="p">Откройте SSH-сессию на промежуточном сервере. Скрипт настроит rinetd на выделенном для relay VPS. Он создаст правила для проверки сертификатов, VPN и подписки. Входящий TLS целиком дойдёт до основного сервера.</Typography>
          <Code title="На компьютере" code={`ssh ${user}@${relayIp}`} />
          <Code title="На relay-сервере" code={relayScript(domain)} sudo={sudo} />
          <Typography component="p">В сетевом фаерволе хостинга разрешите тот же набор портов. Проверьте, что rinetd слушает 80, 443 и 2013 по TCP, а также 443 по UDP.</Typography>
          <Code code="<sudo>ss -lntup | grep rinetd" sudo={sudo} />
        </GuideSection>}
        <GuideSection id="firewall" steps={steps}>
          <Typography component="p">Откройте отдельную SSH-сессию на основном сервере. Дальнейшие команды для сервера выполняйте в ней.</Typography>
          <Code title="На компьютере" code={`ssh ${user}@${domain}`} />
          <Code sudo={sudo} code={'<sudo>apt update && <sudo>apt upgrade -y\n<sudo>apt install -y ufw snapd curl'} />
          <Typography component="p">Первое правило сохраняет доступ на порт текущей SSH-сессии. Разрешите эти же порты в фаерволе хостинга. Порт 2013 обслуживает подписки. Панель и внутренние порты остаются за фаерволом.</Typography>
          <Code code={firewall} sudo={sudo} />
        </GuideSection>
        <GuideSection id="certificates" steps={steps}>
          <Typography component="p">Установите Certbot через snap. На время проверки HTTP-01 Certbot сам займёт свободный порт 80.{relay && ` Запрос к ${relayDomain} уже проходит через rinetd на этот сервер. Для каждого имени выпустите отдельный сертификат.`}</Typography>
          <Code sudo={sudo} code={`<sudo>systemctl enable --now snapd.socket
<sudo>snap install core
<sudo>snap refresh core
<sudo>snap install --classic certbot
${domains.map(name => `<sudo>/snap/bin/certbot certonly --standalone --cert-name ${name} -d ${name}`).join('\n')}
<sudo>/snap/bin/certbot certificates`} />
        </GuideSection>
        <GuideSection id="nginx" steps={steps}>
          <Typography component="p">Создайте страницу, которая откроется при обычном посещении домена. На чистом сервере отключите стандартный сайт Nginx, чтобы порт 80 оставался доступен для продления сертификата.</Typography>
          <Code sudo={sudo} code={`<sudo>apt install -y nginx
test ! -L /etc/nginx/sites-enabled/default || <sudo>unlink /etc/nginx/sites-enabled/default
<sudo>install -d /var/www/self-steal
<sudo>tee /var/www/self-steal/index.html >/dev/null <<'HTML'
<!doctype html>
<html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${domain}</title><main><h1>${domain}</h1><p>Сайт готовится к открытию.</p></main></html>
HTML`} />
          <Typography component="p">На 127.0.0.1 Nginx принимает TLS от REALITY и выбирает сертификат по SNI. На 127.0.0.2 он принимает HTTP после fallback. Оба адреса используют порт {p.site} только внутри сервера. Путь /xhttp/ передаёт запросы в Xray без буферизации.{relay && ` При открытии https://${relayDomain}/ браузер отправит SNI ${relayDomain}, и Nginx выберет второй сертификат.`}</Typography>
          <Code sudo={sudo} code={`<sudo>tee /etc/nginx/conf.d/self-steal.conf >/dev/null <<'NGINX'
${nginxConfig(domains, p)}
NGINX
<sudo>nginx -t && <sudo>systemctl reload nginx`} />
          <Typography component="p">Проверьте заглушку и доверие к сертификату локально. Каждый запрос должен вернуть HTTP 200.</Typography>
          <Code code={domains.map(name => `curl -I --resolve ${name}:${p.site}:127.0.0.1 https://${name}:${p.site}/`).join('\n')} />
        </GuideSection>
        <GuideSection id="panel" steps={steps}>
          <Typography component="p">Запустите официальный установщик 3x-ui в SSH-сессии. Задайте порт панели 2053, выберите Skip SSL для доступа через туннель и привязку к 127.0.0.1. Запишите логин, пароль и выданный путь панели.</Typography>
          <Code sudo={sudo} code={'curl -fsSL https://raw.githubusercontent.com/MHSanaei/3x-ui/main/install.sh -o install-3x-ui.sh && <sudo>bash install-3x-ui.sh\n<sudo>/usr/local/x-ui/x-ui setting -listenIP 127.0.0.1 -port 2053\n<sudo>systemctl restart x-ui'} />
          <Typography component="p">На компьютере откройте второе окно терминала и оставьте команду запущенной. В браузере откройте http://127.0.0.1:2053 и допишите путь панели из установщика.</Typography>
          <Code title="На компьютере · SSH-туннель" code={`ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:2053:127.0.0.1:2053 ${user}@${domain}`} />
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
          <Code title={connections[tab]} language="json" code={JSON.stringify(templates[tab], null, 2)} />
          <Typography component="p">В настройках Xray откройте «Исходящие подключения» и добавьте WireGuard с тегом warp. В настройках WARP зарегистрируйте аккаунт и примените полученные ключи, адрес и параметры узла к этому выходу. Оставьте direct первым выходом по умолчанию.</Typography>
          <Typography component="p">В routing.rules добавьте правило после защитных блокировок и перед общим правилом выхода. Сверьте inboundTag с тегом WARP-инбаунда в итоговой конфигурации Xray.</Typography>
          <Code language="json" title="Правило для VLESS REALITY WARP" code={JSON.stringify({ type: 'field', inboundTag: [templates.warp.tag], outboundTag: 'warp' }, null, 2)} />
        </GuideSection>
        <GuideSection id="fallback" steps={steps}>
          <Typography component="p">Добавьте основной инбаунд VLESS RAW + REALITY на 443/TCP. В панели сгенерируйте пару ключей X25519 и подставьте их вместо PRIVATE_KEY и PUBLIC_KEY. Закрытый ключ храните на сервере. Браузеры и XHTTP с обычным TLS попадут на локальный HTTPS-сайт через Target.</Typography>
          <Code title="Основной инбаунд · 443/TCP" language="json" code={JSON.stringify(templates.main, null, 2)} />
          <Typography component="p">В редакторе Fallbacks привяжите /reality и /warp к соответствующим дочерним инбаундам через список подключений. Так панель добавит порт и ключи основного REALITY в клиентские ссылки. Для двух строк сайта укажите Dest вручную. Значение Xver во всех строках — 0.</Typography>
          <GuideValues title="Правила fallback" rows={[
            ['Без пути (в том числе /)', `127.0.0.2:${p.site} · сайт`],
            ['/xhttp/', `127.0.0.2:${p.site} · Nginx → 127.0.0.1:${p.xhttp}`],
            ['/reality', `127.0.0.1:${p.reality} · VLESS REALITY`],
            ['/warp', `127.0.0.1:${p.warp} · VLESS REALITY WARP`],
          ]} />
          <Typography component="p">Сохраните настройки и перезапустите Xray из панели. С компьютера проверьте сайт по публичному адресу. Для каждого домена ожидается HTTP 200 с действительным сертификатом.</Typography>
          <Code code={domains.map(name => `curl -I https://${name}/`).join('\n')} />
        </GuideSection>
        <GuideSection id="subscription" steps={steps}>
          <Typography component="p">В разделе «Клиенты» создайте клиента, сгенерируйте идентификатор подписки и назначьте четыре подключения из вкладок. Основной инбаунд оставьте служебным. В «Настройки панели → Подписка» включите HTTPS-подписку и заполните профиль.</Typography>
          <GuideValues title="Профиль подписки" rows={[
            ['Название профиля', 'Self-Steal'], ['Домен подписки', host], ['Порт подписки', '2013'],
            ['Путь', 'Оставьте сгенерированный панелью путь'], ['Сертификат', `${certDir}/fullchain.pem`], ['Закрытый ключ', `${certDir}/privkey.pem`],
          ]} />
          <Typography component="p">Во вкладках Happ и INCY вставьте ссылки в поле маршрутизации соответствующего приложения. Профиль RU отправляет локальные сети, российские IP и домены категории RU напрямую. Остальной трафик идёт через выбранное подключение.</Typography>
          <Code title="Маршрутизация Happ" language="text" code={routingProfileUrl('happ')} />
          <Code title="Маршрутизация INCY" language="text" code={routingProfileUrl('incy')} />
          <Typography component="p">Сохраните настройки и скопируйте ссылку клиента. Она должна начинаться с https://{host}:2013/. Откройте её в Happ или INCY. Проверьте все четыре профиля. У обоих профилей REALITY должны совпадать публичный ключ, SNI и Short ID основного инбаунда, а пути — различаться.</Typography>
          <Typography component="p">Для проверки WARP откройте https://www.cloudflare.com/cdn-cgi/trace через профиль /warp. Строка warp=on или warp=plus подтверждает выход через Cloudflare. Переключитесь на обычный REALITY и повторите проверку.</Typography>
          <Typography component="p">Настройте перечитывание сертификатов после продления. Хук выполнится после успешного обновления и кратковременно перезапустит панель. Проверьте продление в тестовой среде Let’s Encrypt.</Typography>
          <Code sudo={sudo} code={`<sudo>tee /etc/letsencrypt/renewal-hooks/deploy/self-steal >/dev/null <<'HOOK'
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
