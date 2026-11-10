import { useState } from 'react';
import { Box, Link, TextField, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import { useSearchParams } from 'react-router-dom';
import InlineCode from '../components/InlineCode';
import {
  GuideAlert, GuideArticle, GuideBackLink, GuideCodeBlock, GuideFaq, GuideField,
  GuideFlow, GuideHeader, GuideLayout, GuidePage, GuidePartnerLinks, GuidePrerequisites,
  GuideResources, GuideSection, GuideSeo, GuideSettings, GuideSudoToggle,
  GuideSupportFooter, GuideValues,
} from '../components/guides';
import { guideSteps, partners, resourceLinks, moreLinks } from './cdn-setup/data';
import { createPlaceholderHtml, createNginxConfig, createXhttpConfig, generateRandomString, getRandomPlaceholderPhrase } from './cdn-setup/templates';
import seo from '../../data/cdn-setup-seo.json';

export default function CdnSetup() {
  const [searchParams] = useSearchParams();
  const [originHost, setOriginHost] = useState(
    () => searchParams.get('originHost')?.trim().toLowerCase() || 'example.com'
  );
  const [cdnDomain, setCdnDomain] = useState(
    () => searchParams.get('cdnDomain')?.trim().toLowerCase() || 'example.begetcdn.cloud'
  );
  const [inboundPort, setInboundPort] = useState('2053');
  const [xhttpPath, setXhttpPath] = useState('/static/media/live/');
  const [xuiPort, setXuiPort] = useState('2222');
  const [useSudo, setUseSudo] = useState(false);
  const [randomPhrase] = useState(() => getRandomPlaceholderPhrase());
  const [randomString] = useState(() => generateRandomString(8));
  const [digit] = useState(() => Math.floor(Math.random() * 10));

  const normalizedPath = xhttpPath.startsWith('/') ? xhttpPath : `/${xhttpPath}`;

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="CDN для VLESS XHTTP" />
      <GuideBackLink />
      <GuideHeader
        title={<>CDN для <span>VLESS XHTTP</span></>}
        intro="От чистого сервера до подключения через CDN. Настроим HTTPS, Nginx и 3x-ui — с командами, в которые уже подставлены ваши параметры."
        tags={['3x-ui', 'Xray 26.3.27+', '5 шагов']}
        updatedLabel="Обновлено 26 октября 2026"
        settingsHref="#guide-settings"
        videoUrl="https://youtu.be/-9UJ_Bz03_s"
      >
        <GuideFlow label="Схема подключения: клиент, CDN, VPN-сервер" nodes={[
          { id: 'client', label: 'ПОДКЛЮЧЕНИЕ', title: 'Ваш клиент', detail: 'VLESS · XHTTP' },
          { id: 'cdn', label: 'ДОСТАВКА', title: 'CDN', detail: cdnDomain, icon: <CloudQueueIcon fontSize="small" /> },
          { id: 'origin', label: 'ИСТОЧНИК', title: 'VPN-сервер', detail: originHost, icon: <DnsOutlinedIcon fontSize="small" /> },
        ]} />
        <GuidePartnerLinks items={partners} />
      </GuideHeader>

      <GuideLayout steps={guideSteps} faqHref="#faq" settingsHref="#guide-settings">
        <GuideSettings footer={<GuideSudoToggle checked={useSudo} onChange={setUseSudo} />}>
          <GuideField
            label="IP или домен VPN-сервера"
            value={originHost}
            onChange={e => setOriginHost(e.target.value.trim().toLowerCase())}
            placeholder="vpn.example.com"
            helperText="Адрес источника для CDN"
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { spellCheck: false, autoCapitalize: 'none' } }}
          />
          <GuideField
            label="Домен CDN"
            value={cdnDomain}
            onChange={e => setCdnDomain(e.target.value.trim().toLowerCase())}
            placeholder="example.begetcdn.cloud"
            helperText="Выдаётся при создании CDN-ресурса"
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { spellCheck: false, autoCapitalize: 'none' } }}
          />
          <GuideField
            label="Порт XHTTP"
            value={inboundPort}
            onChange={e => setInboundPort(e.target.value.trim())}
            helperText="Одинаковый в Nginx и инбаунде"
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          />
          <GuideField
            label="Путь XHTTP"
            value={xhttpPath}
            onChange={e => setXhttpPath(e.target.value.trim())}
            helperText="Путь для передачи запросов"
            slotProps={{ htmlInput: { spellCheck: false, autoCapitalize: 'none' } }}
          />
        </GuideSettings>
        <GuidePrerequisites items={['Доступ к серверу по SSH', 'Домен для HTTPS', 'CDN с поддержкой GET']}>
          Пример показан на панели 3x-ui. Параметры CDN подойдут для провайдеров, которые поддерживают HTTP-метод GET.
        </GuidePrerequisites>

        <GuideArticle>
          <GuideSection step={guideSteps[0]} number={1}>
            <Typography component="p" gutterBottom>
              Подключитесь к серверу по SSH и обновите пакеты:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code='<sudo>apt update && apt upgrade -y' sudo={useSudo} />
            <GuideAlert title="Проверьте DNS перед выпуском" severity="info" icon={<InfoOutlinedIcon />} className="guide-note">
              Убедитесь, что ваш домен <InlineCode>{originHost}</InlineCode> уже направлен на IP-адрес вашего сервера. Для этого в панели управления доменом должна быть настроена A-запись в DNS.
            </GuideAlert>

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Установка Certbot
            </Typography>
            <Typography component="p" gutterBottom>
              Установите Certbot. Для выпуска сертификата порт 80 должен быть открыт и свободен.
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`<sudo>apt install snapd\n<sudo>snap install --classic certbot\n<sudo>ln -s /snap/bin/certbot /usr/local/bin/certbot`} sudo={useSudo} />

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Выпуск сертификата
            </Typography>
            <Typography component="p" gutterBottom>
              Запустите команду выпуска сертификата:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`<sudo>certbot certonly --standalone -d ${originHost}`} sudo={useSudo} />

            <Typography component="p" gutterBottom>
              Во время установки утилита попросит вас ввести некоторые данные:
            </Typography>
            <Box component="ul" sx={{ pl: 3, my: 1, color: 'text.primary' }}>
              <li>
                <Typography component="span">Введите свой <InlineCode>email</InlineCode> для получения важных уведомлений.</Typography>
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
          </GuideSection>

          <GuideSection step={guideSteps[1]} number={2}>

            <Typography component="p" gutterBottom>
              Установите Nginx: он будет показывать обычную веб-страницу и передавать XHTTP-запросы в Xray.
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code='<sudo>apt install nginx -y' sudo={useSudo} />

            <Typography component="p" gutterBottom>
              Создайте директорию для сайта и выдайте нужные права:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер"
              code={`<sudo>mkdir -p /var/www/${originHost}/html\n<sudo>chown -R $USER:$USER /var/www/${originHost}/html`}
              sudo={useSudo}
            />

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Создание страницы
            </Typography>
            <Typography component="p" gutterBottom>
              Создайте файл <InlineCode>index.html</InlineCode>:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`nano /var/www/${originHost}/html/index.html`} sudo={useSudo} />
            <Typography component="p" gutterBottom>
              Вставьте базовый HTML-код:
            </Typography>
            <GuideCodeBlock title="Страница-заглушка"
              customStyle={{ maxHeight: '500px', overflowY: 'auto' }}
              code={createPlaceholderHtml({ originHost, randomPhrase })}
              language="html"
            />
            <Typography component="p" gutterBottom>
              Сохраните и выйдите (<InlineCode>Ctrl + O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl + X</InlineCode>).
            </Typography>

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Настройка конфигурации Nginx
            </Typography>
            <Typography component="p" gutterBottom>
              Создайте конфигурационный файл для вашего домена:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`<sudo>nano /etc/nginx/sites-available/${originHost}`} sudo={useSudo} />
            <Typography component="p" gutterBottom>
              Вставьте следующую конфигурацию, в котором будет указано проксирование к порту <InlineCode>{inboundPort}</InlineCode> инбаунда, который мы создадим на следующем шаге:
            </Typography>
            <GuideCodeBlock title="Конфигурация Nginx"
              code={createNginxConfig({ inboundPort, originHost, xhttpPath, digit })}
              language="nginx"
            />
            <Typography component="p" gutterBottom>
              Сохраните и выйдите (<InlineCode>Ctrl + O</InlineCode>, <InlineCode>Enter</InlineCode>, <InlineCode>Ctrl + X</InlineCode>).
            </Typography>

            <Typography component="h3" variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
              Активация сайта
            </Typography>
            <Typography component="p" gutterBottom>
              Создайте символическую ссылку, удалите дефолтный конфиг Nginx и перезапустите службу:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер"
              code={`<sudo>ln -s /etc/nginx/sites-available/${originHost} /etc/nginx/sites-enabled/\n<sudo>rm /etc/nginx/sites-enabled/default\n<sudo>nginx -t\n<sudo>systemctl restart nginx`}
              sudo={useSudo}
            />

            <Typography component="p" gutterBottom sx={{ mt: 2 }}>
              Теперь, если перейти по адресу <Link href={`https://${originHost}`} target='_blank' rel="noopener noreferrer">https://{originHost}</Link>, вы увидите созданную страницу-заглушку.
            </Typography>

            <Typography component="p" gutterBottom>
              Переключите Certbot на проверку через webroot, чтобы продление сертификата не конфликтовало с Nginx:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер"
              code={`<sudo>certbot reconfigure --cert-name ${originHost} --authenticator webroot --webroot-path /var/www/${originHost}/html --deploy-hook "systemctl reload nginx"`}
              sudo={useSudo}
            />
            <Typography component="p" gutterBottom>
              При выполнении введите <InlineCode>R</InlineCode> и дождитесь успешного завершения.
            </Typography>
          </GuideSection>

          <GuideSection step={guideSteps[2]} number={3}>
            <Typography component="p" gutterBottom>
              Установите панель управления подключениями на сервере <b>{originHost}</b>.
            </Typography>
            <GuideAlert title="Нужен Xray 26.3.27 или новее" severity="info" icon={<InfoOutlinedIcon />}>В конфигурации ниже используются дополнительные параметры XHTTP. Проверьте версию ядра в панели перед настройкой инбаунда.</GuideAlert>
            <GuideCodeBlock title="Терминал · VPN-сервер" code='<sudo>bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)' sudo={useSudo} />

            <Typography component="p" gutterBottom>
              Во время установки задайте порт панели. В настройках сертификата выберите пункт 3, укажите домен <InlineCode copy>{originHost}</InlineCode> и пути к файлам ниже.
            </Typography>
            <Typography component="p" gutterBottom sx={{ mt: 2 }}>
              Сертификат:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`/etc/letsencrypt/live/${originHost}/fullchain.pem`} />

            <Typography component="p" gutterBottom sx={{ mt: 2 }}>
              Приватный ключ:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`/etc/letsencrypt/live/${originHost}/privkey.pem`} />

            <Typography component="p" gutterBottom>
              После установки вы увидите логин, пароль и ссылку на панель управления, сохраните их.
            </Typography>

            <Typography component="p" gutterBottom>
              Также включите порт панели в фаерволе (если он у вас есть):
            </Typography>
            <TextField
              label="Порт панели"
              size='small'
              variant="outlined"
              value={xuiPort}
              onChange={(e) => setXuiPort(e.target.value.trim().toLowerCase())}
              placeholder='2222'
              helperText="Укажите порт, выбранный при установке"
              slotProps={{ htmlInput: { inputMode: 'numeric' } }}
              sx={{ mb: 2, width: { xs: '100%', sm: 300 } }}
            />
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`<sudo>ufw allow ${xuiPort}/tcp`} sudo={useSudo} />

            <Typography component="p" gutterBottom>
              Далее войдите в панель управления и перейдите в раздел Подключения.
            </Typography>
          </GuideSection>

          <GuideSection step={guideSteps[3]} number={4}>
            <Typography component="p" gutterBottom>
              В <Link href="https://beget.com/p1519472" target="_blank" rel="noopener noreferrer">панели управления</Link> откройте раздел CDN и создайте новый CDN-ресурс. Логика примерно одинаковая для разных CDN-провайдеров.
            </Typography>
            <GuideValues
              title="Параметры CDN"
              rows={[
                ['Источник', originHost],
                ['Домен CDN', cdnDomain],
                ['Протокол к источнику', 'HTTPS'],
                ['Кеширование', 'Отключить'],
                ['Всегда онлайн', 'Отключить'],
                ['Игнорировать параметры запроса', 'Отключить'],
              ]}
            />
            <Box component="ul" sx={{ pl: 3, my: 1 }}>
              <li><Typography component="span">В поле источника укажите домен VPN сервера или IP: <InlineCode copy>{originHost}</InlineCode>.</Typography></li>
              <li><Typography component="span">Выберите или создайте поддомен CDN: <InlineCode copy>{cdnDomain}</InlineCode>.</Typography></li>
              <li><Typography component="span">Выберите тип HTTPS, отключите кеширование и выберите HTTP метод GET в качестве разрешенных.</Typography></li>
            </Box>
            <GuideAlert title="Кеширование на Бегет" icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>
            Если кеширование нельзя отключить, установите минимальное время: 1 секунду.
          </GuideAlert>

            <Typography component="p" gutterBottom>
              Сохраните полученный домен. Он сразу подставится в конфигурацию следующего шага:
            </Typography>
            <TextField
              label="Домен CDN"
              size='small'
              variant="outlined"
              value={cdnDomain}
              onChange={(e) => setCdnDomain(e.target.value.trim().toLowerCase())}
              placeholder='example.begetcdn.cloud'
              helperText="То же значение, что в параметрах в начале гайда"
              slotProps={{ htmlInput: { spellCheck: false, autoCapitalize: 'none' } }}
              sx={{ mb: 2, width: '100%' }}
            />

            <GuideAlert title="Собственный домен для CDN" icon={<InfoIcon fontSize="inherit" />} severity="info" sx={{ mb: 2 }}>

              Если CDN требует ваш собственный домен, добавьте CNAME-запись в DNS:
              <InlineCode>cdn.example.com</InlineCode> CNAME <InlineCode>{cdnDomain}</InlineCode> <br />
              Для одного имени нельзя одновременно задавать A- и CNAME-записи.
            </GuideAlert>
          </GuideSection>

          <GuideSection step={guideSteps[4]} number={5}>
            <Typography component="p" gutterBottom>
              На VPN сервере откройте панель 3x-ui и создайте новый инбаунд. В качестве протокола выберите <InlineCode>vless</InlineCode>, транспорт <InlineCode>xhttp</InlineCode>, а порт выберите такой, который указан в правилах прокси nginx. В данном примере используется порт <InlineCode copy>{inboundPort}</InlineCode>.
            </Typography>
            <GuideValues
              title="Основные параметры инбаунда"
              rows={[
                ['Протокол', 'vless'],
                ['Транспорт', 'xhttp'],
                ['Порт', inboundPort],
                ['Путь к ресурсу', normalizedPath + 'segment' + digit + '.ts']
              ]}
            />
            <Typography component="p" gutterBottom>
              Во вкладке <InlineCode>Расширенный шаблон</InlineCode> вставьте следующие параметры:
            </Typography>
            <GuideCodeBlock title="Конфигурация инбаунда" code={createXhttpConfig({ inboundPort, xhttpPath, digit, randomString, cdnDomain })} language='json' />
            <Typography component="p" gutterBottom>
              На первой вкладке задайте название подключения в поле «Примечание». Если нужен флаг в клиенте, добавьте эмодзи флага в начало названия.
            </Typography>
            <Typography component="p" gutterBottom>
              Создайте подключение и добавьте клиента.
            </Typography>

            <Typography component="p" gutterBottom>
              При большом количестве клиентов увеличьте лимит таблицы <InlineCode>nf_conntrack</InlineCode>:
            </Typography>
            <GuideCodeBlock title="Терминал · VPN-сервер" code={`<sudo>sysctl -w net.netfilter.nf_conntrack_max=131072`} sudo={useSudo} />

          </GuideSection>
        </GuideArticle>
        <GuideFaq items={seo.faq} />
        <GuideResources links={resourceLinks} moreLinks={moreLinks} />
        <GuideSupportFooter />
      </GuideLayout>
    </GuidePage>
  );
}
