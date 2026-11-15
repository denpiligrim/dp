import { Button, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { GuideCodeBlock, GuidePanel } from '../../components/guides';

export default function WindowsScriptDownload({ action }: { action: 'install' | 'update' | 'uninstall'; }) {
  const details = {
    install: { label: 'Скачать скрипт установки', description: 'Запросит папку, домен для проверки, список сайтов и найденную стратегию. Предложит запуск blockcheck2, проверку в браузере и настройку автозапуска. Выполняет установку и настройку целиком: после него повторять команды шагов 1–4 не нужно.' },
    update: { label: 'Скачать скрипт обновления', description: 'Запросит папку установки, сохранит полную резервную копию и обновит файлы из репозитория автора. Настройки и список доменов сохранятся; запуск службы выбирается отдельно.' },
    uninstall: { label: 'Скачать скрипт удаления', description: 'Запросит папку установки, выбор удаления файлов и подтверждение. Удалит службу этой установки. Очистка общего драйвера WinDivert предлагается отдельно.' },
  }[action];
  const file = `zapret2-${action}.ps1`;
  return <GuidePanel>
    <Typography component="h3" variant="h6">Готовый скрипт для Windows</Typography>
    <Typography>{details.description} Параметры вводятся в окне скрипта.</Typography>
    <Button component="a" href={`/scripts/zapret2/${file}`} download variant="outlined" startIcon={<DownloadOutlinedIcon />} sx={{ my: 2 }}>
      {details.label} (.ps1)
    </Button>
    <Typography>Сохраните файл, откройте Windows PowerShell от администратора и выполните команду ниже. Она рассчитана на папку «Загрузки» по умолчанию; если сохранили файл в другом месте, замените путь.</Typography>
    <GuideCodeBlock language="powershell" title="PowerShell от администратора · запуск скачанного скрипта"
      code={`powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\\Downloads\\${file}"`} />
    <Typography variant="body2">Это скрипт DenPiligrim для команд из гайда. Сам Zapret загружается из официального репозитория bol-van. Вместо скрипта можно выполнить команды ниже вручную.</Typography>
  </GuidePanel>;
}
