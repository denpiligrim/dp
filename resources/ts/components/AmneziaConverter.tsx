import React, { useState, useMemo, useRef } from 'react';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import QrCodeIcon from '@mui/icons-material/QrCode';
// Импортируем компонент для генерации QR кода
import { QRCodeSVG } from 'qrcode.react';
import CodeBlock from './CodeBlock';

export const AmneziaConverter = ({ relayIp }) => {
  const [rawConfig, setRawConfig] = useState<any>('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Автоматически заменяем IP адрес в Endpoint при изменении текста или relayIp
  const processedConfig = useMemo(() => {
    if (!rawConfig) return '';
    if (!relayIp) return rawConfig; // Если relayIp пустой, возвращаем как есть

    // Регулярное выражение ищет "Endpoint = ", захватывает хост/IP и отдельно порт (если есть)
    // $1 = "Endpoint = ", $2 = старый хост, $3 = порт ":48443"
    return rawConfig.replace(/(Endpoint\s*=\s*)([^:\n]+)(:\d+)?/gi, `$1${relayIp}$3`);
  }, [rawConfig, relayIp]);

  // Обработчик загрузки файла
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setRawConfig(e.target.result);
    };
    reader.readAsText(file);

    // Сбрасываем input, чтобы можно было загрузить тот же файл заново
    event.target.value = null;
  };

  // Обработчик скачивания готового файла
  const handleDownloadFile = () => {
    const blob = new Blob([processedConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'AWG-RELAY.conf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Блок ввода: Кнопка загрузки файла ИЛИ текстовое поле */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileUploadIcon />}
          onClick={() => fileInputRef.current.click()}
          sx={{ width: 'fit-content' }}
        >
          Загрузить файл .conf
          <input
            type="file"
            accept=".conf,.txt"
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </Button>

        <Typography variant="body2" color="text.secondary">
          или вставьте содержимое конфигурации ниже:
        </Typography>

        <TextField
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          placeholder="[Interface]&#10;Address = 10.8.1.2/32&#10;DNS = 1.1.1.1, 1.0.0.1&#10;..."
          value={rawConfig}
          onChange={(e) => setRawConfig(e.target.value)}
        />
      </Box>

      {/* Блок вывода (показываем только если есть конфигурация) */}
      {processedConfig && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Результат:
          </Typography>

          {/* Имитация CodeBlock */}
          <CodeBlock code={processedConfig} language='ini' />

          {/* Кнопки действий */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadFile}
            >
              Скачать .conf
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<QrCodeIcon />}
              onClick={() => setIsQrModalOpen(true)}
            >
              Показать QR код
            </Button>
          </Box>
        </Box>
      )}

      {/* Модальное окно с QR кодом */}
      <Dialog
        open={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle align="center">QR-код конфигурации</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <QRCodeSVG
            value={processedConfig}
            size={512}
            level="M" // Уровень коррекции ошибок (Medium) оптимален для конфигов WG
            includeMargin
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsQrModalOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};