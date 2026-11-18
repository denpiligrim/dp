import { useState } from 'react';
import { Box, Link, MenuItem, Typography } from '@mui/material';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import {
  GuideAlert, GuideArticle, GuideBackLink, GuideCodeBlock, GuideFaq, GuideField, GuideFlow,
  GuideHeader, GuideLayout, GuidePage, GuidePanel, GuidePartnerLinks, GuidePrerequisites,
  GuideResources, GuideSection, GuideSeo, GuideSettings, GuideSupportFooter,
} from '../components/guides';
import InlineCode from '../components/InlineCode';
import BegetIcon from '../svgIcons/BegetIcon';
import IshostingIcon from '../svgIcons/IshostingIcon';
import GikIcon from '../svgIcons/GikIcon';
import seo from '../../data/zapret2-seo.json';
import { buildOpenWrtCommands, buildZapretCommands, defaultOpenWrtSettings, defaultZapretSettings, OpenWrtSettings, ZapretSettings } from './zapret2/commands';
import OpenWrtGuide from './zapret2/OpenWrtGuide';

const officialRepo = 'https://github.com/bol-van/zapret2';
const bundleRepo = 'https://github.com/bol-van/zapret-win-bundle';
const manual = `${officialRepo}/blob/master/docs/manual.md`;

export default function Zapret2() {
  const [os, setOs] = useState('windows11');
  const [settings, setSettings] = useState(defaultZapretSettings);
  const [openWrtSettings, setOpenWrtSettings] = useState(defaultOpenWrtSettings);
  const commands = buildZapretCommands(settings);
  const openWrtCommands = buildOpenWrtCommands(openWrtSettings);
  const isOpenWrt = os === 'openwrt';
  const inputs = isOpenWrt ? openWrtSettings : settings;
  const inputErrors = isOpenWrt ? openWrtCommands.errors : commands.errors;
  const steps = isOpenWrt ? seo.openwrtSteps : seo.steps;
  const updateOpenWrt = (key: keyof OpenWrtSettings, value: string) => setOpenWrtSettings(current => ({ ...current, [key]: value }));
  const update = (key: keyof ZapretSettings, value: string) => {
    if (isOpenWrt && key !== 'directory' && key !== 'quicStrategy') updateOpenWrt(key, value);
    else setSettings(current => ({ ...current, [key]: value }));
  };
  const code = (value: string, title: string) => <GuideCodeBlock language="powershell" title={title} code={value} />;

  return (
    <GuidePage>
      <GuideSeo seo={seo} breadcrumbName="Установка Zapret 2" />
      <GuideBackLink />
      <GuideHeader title={seo.heading} intro={seo.intro} stepCount={steps.length}
        tags={['Windows 10/11', 'OpenWrt', 'Официальный репозиторий']} settingsHref="#guide-settings" videoUrl={seo.videoUrl}>
        <GuidePartnerLinks items={[
          { label: 'ishosting', detail: 'Зарубежные VPS для других задач', href: 'https://ishosting.io/affiliate/MjIwOSM4', icon: <IshostingIcon />, sponsored: true },
          { label: 'Beget', detail: 'Хостинг, серверы и домены', href: 'https://beget.com/p1519472', icon: <BegetIcon />, sponsored: true },
          { label: 'Gik VPN', detail: 'Готовый VPN для ваших устройств', href: 'https://t.me/Gik_VPN_Bot?start=ref9I0EryhK', icon: <GikIcon />, sponsored: true },
        ]} />
      </GuideHeader>

      <GuideLayout steps={steps} settingsHref="#guide-settings" faqHref="#faq">
        <GuideSettings description="Выберите систему, заполните её параметры, а после проверки добавьте найденную стратегию. Команды ниже обновятся автоматически. Параметры обрабатываются только в этой вкладке.">
          <GuideField select label="Ваша операционная система" value={os} onChange={event => setOs(event.target.value)} columns={12}>
            <MenuItem value="windows11">Windows 11</MenuItem>
            <MenuItem value="windows10">Windows 10</MenuItem>
            <MenuItem value="openwrt">OpenWrt (роутер)</MenuItem>
          </GuideField>
          {isOpenWrt ? <>
            <GuideField label="IPv4-адрес роутера" value={openWrtSettings.routerAddress} onChange={event => updateOpenWrt('routerAddress', event.target.value)}
              error={openWrtCommands.errors.routerAddress} helperText="Адрес роутера в вашей домашней сети, обычно 192.168.1.1." />
            <GuideField label="Порт SSH" value={openWrtSettings.sshPort} onChange={event => updateOpenWrt('sshPort', event.target.value)}
              error={openWrtCommands.errors.sshPort} helperText="Обычно 22. Допустимо число от 1 до 65535." />
            <GuideField label="Версия Zapret 2" value={openWrtSettings.version} onChange={event => updateOpenWrt('version', event.target.value)}
              error={openWrtCommands.errors.version} helperText={<>Тег вида v1.0.7 из <Link href={`${officialRepo}/releases`} target="_blank" rel="noopener noreferrer">официальных релизов</Link>.</>} />
            <GuideField label="LAN-сеть OpenWrt" value={openWrtSettings.lan} onChange={event => updateOpenWrt('lan', event.target.value)}
              error={openWrtCommands.errors.lan} helperText="Имя сети в LuCI → Сеть → Интерфейсы. Обычно lan, не br-lan." />
          </> : <GuideField label="Папка установки" value={settings.directory} onChange={event => update('directory', event.target.value)}
              error={commands.errors.directory} helperText="Например C:\zapret2 или D:\Tools\zapret2. Последняя папка — zapret2, без пробелов и кириллицы." />}
            <GuideField label={isOpenWrt ? 'Домен для проверки' : 'Домены для проверки'} value={inputs.testDomain} onChange={event => update('testDomain', event.target.value)}
              error={inputErrors.testDomain} helperText={isOpenWrt ? 'Один домен без https:// и пути к странице.' : 'Введите один домен или несколько через запятую, например youtube.com, discord.com. Указывайте только имена доменов.'} />
            <GuideField columns={12} multiline minRows={4} label="Сайты, для которых включить обработку" value={inputs.domains}
              onChange={event => update('domains', event.target.value)} error={inputErrors.domains}
              helperText="По одному домену на строку, до 100 доменов. Поддомены учитываются автоматически. У сервисов могут быть отдельные домены для видео и картинок." />
            <GuideField columns={12} multiline minRows={2} label="Стратегия HTTPS (TLS) из blockcheck2"
              placeholder="Например: --lua-desync=multisplit:pos=1,midsld" value={inputs.strategy}
              onChange={event => update('strategy', event.target.value)} error={Boolean(inputs.strategy.trim()) && inputErrors.strategy}
              helperText={isOpenWrt ? 'Вставьте параметры успешного теста HTTPS, начиная с --lua-desync или --payload.' : 'На шаге 2 скопируйте одну успешную стратегию HTTPS, начиная с параметров, например с --wf-l3=ipv4.'} />
            {!isOpenWrt && <GuideField columns={12} multiline minRows={2} label="Стратегия HTTP/3 (QUIC), необязательно"
              value={settings.quicStrategy} onChange={event => update('quicStrategy', event.target.value)}
              error={commands.errors.quicStrategy}
              helperText="Вставьте параметры одного успешного теста QUIC для UDP 443. Если проверяли только HTTPS по TCP, оставьте поле пустым." />}
        </GuideSettings>

        <GuideArticle>
          <GuidePanel>
            <Typography component="h2" variant="h5">Как работает Zapret 2</Typography>
            <Typography>Обычно провайдер анализирует начало соединения с помощью DPI. Zapret меняет отправку пакетов так, чтобы DPI мог ошибиться при распознавании, а сайт по-прежнему получил корректный запрос.</Typography>
            <GuideFlow label="Схема работы Zapret 2: устройство, обработка пакетов, DPI провайдера, сайт" nodes={[
              { id: 'device', label: 'Устройство', title: 'Ваш браузер', detail: isOpenWrt ? 'Устройство в сети роутера' : 'Компьютер с Windows', icon: <ComputerOutlinedIcon /> },
              { id: 'zapret', label: 'Обработка', title: 'Zapret 2', detail: isOpenWrt ? 'На роутере OpenWrt: nfqws2' : 'WinDivert + winws2 + Lua-стратегия', icon: <TuneIcon /> },
              { id: 'dpi', label: 'Провайдер', title: 'DPI', detail: 'Пытается распознать соединение', icon: <ShieldOutlinedIcon /> },
              { id: 'site', label: 'Результат', title: 'Нужный сайт', detail: 'Соединение напрямую, если стратегия сработала', icon: <PublicOutlinedIcon /> },
            ]} />
            <GuideAlert>Zapret 2 не меняет ваш IP и не создаёт VPN-туннель. Результат зависит от провайдера и способа блокировки. При блокировке IP целиком или доступе только к разрешённым адресам он может не помочь.</GuideAlert>
          </GuidePanel>

          {isOpenWrt ? <OpenWrtGuide settings={openWrtSettings} /> : <>
            <GuidePrerequisites items={['Windows 10/11 x64 (Intel или AMD)', 'Права администратора', 'Доступ к GitHub']}>
              Отключите другие запущенные средства обхода и VPN на время подбора стратегии. Нужен доступ к той сети, в которой вы будете пользоваться Zapret.
            </GuidePrerequisites>
            <GuideAlert title="Откуда скачиваем">
              Исходный проект — <Link href={officialRepo} target="_blank" rel="noopener noreferrer">bol-van/zapret2</Link>.
              Для Windows автор выпускает <Link href={bundleRepo} target="_blank" rel="noopener noreferrer">zapret-win-bundle</Link>: в нём уже есть winws2, драйвер и blockcheck2. Git, Python и сторонние установщики не нужны. Встроенный в комплект Cygwin нужен только для официального теста.
            </GuideAlert>
            {!commands.valid && <GuideAlert severity="warning" title="Проверьте параметры">Исправьте выделенные поля в начале страницы. После этого появятся команды с вашими значениями.</GuideAlert>}

            <GuideSection steps={seo.steps} id="download">
              <Typography>Нажмите «Пуск», введите <strong>Windows PowerShell</strong>, выберите «Запуск от имени администратора» и подтвердите запрос. В Windows 11 можно открыть «Терминал (Администратор)» и выбрать вкладку PowerShell.</Typography>
              <Typography>Скопируйте блок целиком и нажмите Enter. Он скачает ZIP из репозитория автора, распакует комплект в выбранную папку и проверит основные файлы. Ничего не запускается автоматически.</Typography>
              {commands.valid && code(commands.install, 'PowerShell от администратора · загрузка')}
              <GuideAlert>Если папка уже существует, используйте раздел «Обновление». Если GitHub недоступен, откройте <Link href={bundleRepo} target="_blank" rel="noopener noreferrer">репозиторий автора</Link> через доступное подключение, выберите Code → Download ZIP и распакуйте содержимое папки zapret-win-bundle-master в указанную выше папку. В ней должны лежать blockcheck, cygwin и zapret-winws.</GuideAlert>
              <Typography>При срабатывании защиты сначала проверьте источник и предупреждение: драйвер WinDivert перехватывает трафик. Не отключайте антивирус целиком ради установки.</Typography>
            </GuideSection>

            <GuideSection steps={seo.steps} id="strategy">
              <Typography>Стратегия — набор параметров, который помогает обойти DPI именно в вашей сети. Запустите официальный тест, пока Zapret и другие средства обхода остановлены.</Typography>
              <GuideAlert severity="warning">Даже в режиме <InlineCode>quick</InlineCode> проверка может занять несколько часов. Каждый указанный домен проверяется по очереди.</GuideAlert>
              {commands.valid && code(commands.check, 'PowerShell от администратора · подбор стратегии')}
              <Typography>Тест запустится в текущем терминале. Команда уже передаёт список доменов из формы. Если программа снова запросит домены, введите их через пробел.</Typography>
              <Box component="ol">
                <li>Выберите IPv4 и тест HTTPS (TLS 1.2/1.3). Чтобы подобрать стратегию QUIC, включите также тест HTTP/3.</li>
                <li>На вопрос об уровне проверки выберите <InlineCode>{"quick"}</InlineCode>. Остальные параметры можно оставить предложенными программой.</li>
                <li>Оставьте терминал открытым до появления итогового раздела <InlineCode>{"SUMMARY"}</InlineCode>.</li>
                <li>В поле HTTPS вставьте одну успешную строку для TCP 443, начиная с параметров. Если тест HTTP/3 тоже прошёл, скопируйте его строку для UDP 443 в поле QUIC. Сохраняйте порядок всех параметров внутри каждой стратегии.</li>
              </Box>
              <Typography>Если успешных тестов нет, повторите проверку с уровнем standard. Если подходящих вариантов всё равно нет, смотрите <Link href={`${manual}#почему-не-открывается`} target="_blank" rel="noopener noreferrer">разбор причин у автора</Link>.</Typography>
            </GuideSection>

            <GuideSection steps={seo.steps} id="run">
              <Typography>После заполнения поля стратегии здесь появится команда сохранения настроек. Она создаст отдельные файлы guide.conf и guide-hosts.txt, сохранив примеры автора.</Typography>
              {commands.ready ? <>
                {code(commands.configure, 'PowerShell от администратора · сохранение настроек')}
                <Typography>Теперь выполните команду запуска в PowerShell от администратора. Оставьте окно открытым и проверьте нужный сайт в браузере, включая видео и картинки.</Typography>
                {code(commands.run, 'PowerShell от администратора · пробный запуск')}
              </> : <GuideAlert>Заполните корректные параметры и поле стратегии после шага 2. Команды сохранения и первого запуска появятся автоматически.</GuideAlert>}
              <Typography>Для остановки нажмите <InlineCode>{"Ctrl+C"}</InlineCode> в окне winws2. Если после запуска появились проблемы с интернетом, сначала остановите программу. Попробуйте другую успешную стратегию, снова сохраните настройки и повторите запуск.</Typography>
              <GuideAlert title="Что обрабатывает этот профиль">Для доменов из списка включён HTTPS по TCP 443. Если вы добавили стратегию QUIC, для этих же доменов включён HTTP/3 по UDP 443.</GuideAlert>
              <Typography>Вы можете самостоятельно редактировать конфиг <InlineCode>guide.conf</InlineCode> и список доменов <InlineCode>guide-hosts.txt</InlineCode> в папке <InlineCode>{`${settings.directory}\\zapret-winws`}</InlineCode>. Указывайте по одному домену на строку. После правок перезапустите winws2 или службу Zapret2Guide. Повторное выполнение команды сохранения перезапишет оба файла значениями из формы.</Typography>
              <Typography>Список доменов включает их поддомены, но не связанные домены других зон. Если добавляете сайты, измените список в начале страницы, остановите Zapret, повторите сохранение настроек и запустите снова.</Typography>
            </GuideSection>

            <GuideSection steps={seo.steps} id="autostart">
              <Typography>Этот шаг необязателен. Выполняйте его только после успешного ручного запуска. Сначала остановите ручной запуск сочетанием Ctrl+C. Затем создайте службу Windows — она будет запускать ту же конфигурацию без открытого окна.</Typography>
              {commands.ready && code(commands.autostart, 'PowerShell от администратора · установка службы')}
              {!commands.ready && <GuideAlert>Команда появится после заполнения стратегии и параметров.</GuideAlert>}
              <Typography>В результате должно быть состояние <InlineCode>{"Running"}</InlineCode>. После перезагрузки снова проверьте сайты. Команду создания службы достаточно выполнить один раз.</Typography>
              <Typography>Чтобы временно отключить обработку или перед повторным тестом, используйте:</Typography>
              {commands.valid && code(commands.stop, 'PowerShell от администратора · остановка')}
              <Typography>Для повторного включения установленной службы:</Typography>
              {code(commands.restart, 'PowerShell от администратора · включение службы')}
            </GuideSection>

            <GuideSection steps={seo.steps} id="update">
              <Typography>Укажите в параметрах ту же папку, в которую устанавливали Zapret. Закройте окно blockcheck2. Следующая команда загрузит свежий комплект автора, остановит службу и ручной процесс из этой папки, создаст резервную копию рядом и обновит файлы. Ваши guide.conf и guide-hosts.txt сохранятся.</Typography>
              {commands.valid && code(commands.update, 'PowerShell от администратора · обновление')}
              <Typography>После обновления служба остаётся остановленной. Для проверки существующей конфигурации выполните:</Typography>
              {commands.valid && code(commands.run, 'PowerShell от администратора · проверка после обновления')}
              <Typography>Если всё работает, нажмите Ctrl+C и включите установленную ранее службу командой из шага «Автозапуск». Если нет, повторите подбор стратегии на шаге 2. При изменении параметров в полях нужно снова выполнить команду сохранения настроек.</Typography>
              <Typography>Для отката остановите Zapret, переименуйте текущую папку через Проводник и верните резервной копии исходное имя папки установки. Не удаляйте резервную копию, пока не проверили обновление.</Typography>
            </GuideSection>

            <GuideSection steps={seo.steps} id="uninstall">
              <Typography>Закройте blockcheck2 и выполните блок ниже в PowerShell от администратора. Он остановит процесс из выбранной папки и удалит службу Zapret2Guide, созданную этим гайдом.</Typography>
              {commands.valid && code(commands.remove, 'PowerShell от администратора · удаление автозапуска')}
              <Typography>После этого удалите папку <InlineCode>{settings.directory}</InlineCode> в открывшемся Проводнике. При необходимости отдельно удалите созданные рядом резервные копии. Если Windows сообщает, что файлы заняты, перезагрузитесь и повторите удаление папки.</Typography>
              <Typography>Для полной очистки драйвера в комплекте есть <InlineCode>{"zapret-winws\\windivert_delete.cmd"}</InlineCode>. До удаления папки запускайте его только если другими программами WinDivert больше не используется, и подтвердите запрос. Для прекращения работы Zapret достаточно остановки процесса и удаления автозапуска.</Typography>
            </GuideSection>
          </>}

          <GuideFaq items={seo.faq} />
          <GuideResources title="Официальные материалы" description="Репозитории и документация автора, на которых основана инструкция." links={[
            { label: 'Исходники Zapret 2', href: officialRepo },
            { label: 'Комплект для Windows', href: bundleRepo },
            { label: 'Документация и blockcheck2', href: manual },
            { label: 'Видеообзор', href: seo.videoUrl },
          ]} />
          <GuideSupportFooter />
        </GuideArticle>
      </GuideLayout>
    </GuidePage>
  );
}
