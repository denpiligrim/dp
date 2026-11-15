import { Box, Link, Typography } from '@mui/material';
import {
  GuideAlert, GuideCodeBlock, GuidePrerequisites, GuideSection,
} from '../../components/guides';
import InlineCode from '../../components/InlineCode';
import { buildOpenWrtCommands, OpenWrtSettings } from './commands';
import seo from '../../../data/zapret2-seo.json';

export default function OpenWrtGuide({ settings }: { settings: OpenWrtSettings; }) {
  const commands = buildOpenWrtCommands(settings);
  const steps = seo.openwrtSteps;
  const code = (value: string, title = 'SSH · на роутере от root') => <GuideCodeBlock language="bash" code={value} title={title} />;

  return <>
    <GuidePrerequisites items={['OpenWrt 22.03+ с firewall4/nftables', 'Доступ по SSH от root', 'Место во flash и /tmp', 'Доступ к GitHub и пакетам OpenWrt']}>
      Речь об установке на роутер с уже работающей OpenWrt. Перепрошивка роутера в этот гайд не входит. Профиль ниже рассчитан на HTTPS по IPv4; IPv6 и UDP требуют отдельного подбора параметров.
    </GuidePrerequisites>
    <GuideAlert title="Перед началом">
      Сохраните резервную копию настроек через LuCI: «Система → Резервная копия / Обновление прошивки» и скачайте её на компьютер.
      Подключайтесь к роутеру из домашней сети, по возможности кабелем. Установщик меняет правила firewall и flow offloading; SSH может кратковременно отключиться. Не меняйте настройки удалённого роутера, к которому нельзя восстановить доступ.
    </GuideAlert>
    {!commands.valid && <GuideAlert severity="warning">Исправьте выделенные поля параметров: после этого появятся команды под ваш роутер.</GuideAlert>}

    <GuideSection steps={steps} id="download">
      <Typography>Откройте PowerShell или терминал на компьютере и подключитесь к роутеру:</Typography>
      {commands.ssh && code(commands.ssh, 'На компьютере · подключение по SSH')}
      <Typography>При первом подключении проверьте, что адрес принадлежит вашему роутеру, подтвердите ключ словом yes и введите пароль root. При вводе пароля символы не отображаются. Все дальнейшие команды выполняйте уже в окне SSH.</Typography>
      <Typography>Проверьте свободное место в первой строке вывода. Для распаковки архива в /tmp и установки зависимостей нужен запас памяти; при ошибке «No space left on device» остановитесь. Установщик определит архитектуру автоматически.</Typography>
      {commands.valid && code(commands.prepare)}
      <Typography>Здесь используется официальный архив <InlineCode>openwrt-embedded.tar.gz</InlineCode> с готовыми бинарными файлами. Архив «Source code» и git clone для этой инструкции не подходят: в них нет готовых программ для роутера.</Typography>
      <Typography>Теперь установите зависимости через скрипт автора:</Typography>
      {commands.valid && code(commands.prerequisites)}
      <Typography>Выбирайте nftables, если задан вопрос о firewall. На вопрос об IPv6 для этого начального профиля ответьте N. Подтвердите установку недостающих пакетов. Ошибки модулей ядра или несовпадение версии kernel нельзя исправлять принудительной установкой: сначала приведите прошивку и её репозитории в соответствие.</Typography>
      <GuideAlert>Скачанный комплект хранится в /tmp и исчезает после перезагрузки. Не перезагружайте роутер до завершения установки. Если перезагрузили — повторите загрузку и установку зависимостей.</GuideAlert>
    </GuideSection>

    <GuideSection steps={steps} id="strategy">
      <Typography>Остановите другие средства обхода на роутере и VPN на компьютере. Тестировать нужно через того же провайдера, для которого настраиваете Zapret. Команда остановит установленную службу zapret2, если она уже есть.</Typography>
      {commands.valid && code(commands.check)}
      <Typography>Домен, IPv4, HTTPS и быстрый режим уже заданы вашими параметрами. На оставшиеся вопросы можно выбрать предлагаемые значения. Дождитесь раздела SUMMARY и скопируйте параметры успешной стратегии HTTPS в поле в начале страницы: <InlineCode>--lua-desync=…</InlineCode>, при наличии — <InlineCode>--payload=…</InlineCode>, <InlineCode>--out-range=…</InlineCode> и <InlineCode>--in-range=…</InlineCode>.</Typography>
      <Typography>Не переносите стратегию с Windows без проверки: на роутере её результат может отличаться. Если удачных тестов нет, замените в команде <InlineCode>SCANLEVEL=quick</InlineCode> на <InlineCode>SCANLEVEL=standard</InlineCode>. Успех для одного домена не гарантирует работу остальных — проверяйте каждый проблемный сервис.</Typography>
    </GuideSection>

    <GuideSection steps={steps} id="run">
      <Typography>После заполнения стратегии сохраните параметры. Команда задаст HTTPS на TCP 443, фильтрацию по вашему списку доменов и LAN-сеть <InlineCode>{settings.lan}</InlineCode>. Вместо сторонних списков используется ваш файл zapret-hosts-user.txt.</Typography>
      {commands.ready ? <>
        {code(commands.configure)}
        <Typography>При первой установке запустите установщик автора отдельной командой:</Typography>
        {code(commands.install)}
        <Box component="ol">
          <li>На предложение скопировать файлы в <InlineCode>/opt/zapret2</InlineCode> ответьте Y.</li>
          <li>Выберите фильтрацию <InlineCode>hostlist</InlineCode>. Включение nfqws2 — Y, редактирование уже заполненных параметров — N.</li>
          <li>Оставьте заданную LAN-сеть. Это имя сети OpenWrt, например lan, а не имя устройства br-lan.</li>
          <li>Автоматическая загрузка сторонних списков — N; flow offloading — none. IPv6 для этого профиля — N, firewall — nftables.</li>
        </Box>
      </> : <GuideAlert>Заполните параметры и стратегию по результату шага 2, чтобы появились команды настройки и установки.</GuideAlert>}
      <Typography>Установщик запустит службу и включит автозапуск. Откройте нужные сайты на устройстве, подключённом к этому роутеру, и проверьте видео и картинки. Если у клиента есть IPv6-подключение, оно не обрабатывается этим профилем — для него нужна отдельная проверка по документации автора.</Typography>
      {code(commands.status)}
      <Typography>Для временного отключения или при проблемах с доступом:</Typography>
      {code(commands.stop)}
      <Typography>Для изменения списка сайтов или стратегии повторите команду сохранения параметров выше, затем выполните <InlineCode>/etc/init.d/zapret2 restart</InlineCode>. Уже установленную программу переустанавливать не нужно. Прежний config сохраняется в config.guide-backup; команда формирует новый простой профиль из настроек гайда.</Typography>
    </GuideSection>

    <GuideSection steps={steps} id="autostart">
      <Typography>Автозапуск на OpenWrt настраивает официальный установщик. Чтобы явно включить его и перезапустить службу:</Typography>
      {code(commands.enable)}
      <Typography>Чтобы отключить запуск после перезагрузки и сразу остановить обработку:</Typography>
      {code(commands.disable)}
      <Typography>Для разового запуска без включения автозагрузки:</Typography>
      {code(commands.start)}
    </GuideSection>

    <GuideSection steps={steps} id="update">
      <Typography>Выберите нужную версию в параметрах по списку <Link href="https://github.com/bol-van/zapret2/releases" target="_blank" rel="noopener noreferrer">официальных релизов</Link>. Команда создаст архив настроек и списков в /root, загрузит новый комплект во временную папку и остановит службу.</Typography>
      {commands.valid && code(commands.update)}
      <Typography>Скачайте созданный архив резервной копии на компьютер и сохраните его до проверки обновления. Затем отдельно запустите официальный установщик:</Typography>
      {commands.valid && code(commands.install)}
      <Typography>Подтвердите копирование в /opt/zapret2 и замену файлов, а на вопрос <InlineCode>keep config, custom scripts and user lists</InlineCode> ответьте Y. Сохраните прежние параметры без редактирования. После завершения проверьте сайты и состояние службы:</Typography>
      {code(commands.status)}
      <Typography>Если прежняя стратегия перестала работать, повторите подбор на шаге 2 и сохранение параметров на шаге 3. Для отката можно установить прежнюю версию таким же способом и восстановить сохранённые настройки.</Typography>
    </GuideSection>

    <GuideSection steps={steps} id="uninstall">
      <Typography>Сначала выполните официальный скрипт удаления. Он остановит службу, уберёт автозапуск и интеграцию с firewall:</Typography>
      {code(commands.remove)}
      <Typography>Если скрипт предложит удалить зависимости, по умолчанию ответьте N: эти пакеты могут быть нужны другим программам. После успешного завершения отдельно удалите папку программы:</Typography>
      {code(commands.removeFiles)}
      <Typography>Резервные архивы в /root остаются. Проверьте интернет на устройствах. Если до установки вы использовали flow offloading, верните его настройки вручную в LuCI после удаления.</Typography>
    </GuideSection>
  </>;
}
