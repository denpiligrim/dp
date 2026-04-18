import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, TextField, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, Paper 
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { QRCodeSVG } from 'qrcode.react'; 
import CodeBlock from './CodeBlock';

export const XrayConverter = ({ relayIp }) => {
  const [rawLink, setRawLink] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Обработка ссылки
  const processedLink = useMemo(() => {
    if (!rawLink.trim()) return '';
    if (!relayIp) return rawLink;

    // Регулярное выражение разбирает ссылку на 3 части:
    // $1 = vless://идентификатор@
    // $2 = старый_IP_или_домен
    // $3 = :порт?параметры#название
    const regex = /^(vless:\/\/[^@]+@)([^:\/?#]+)(.*)$/i;
    
    // Если ссылка совпадает с форматом, заменяем IP
    if (regex.test(rawLink)) {
      return rawLink.replace(regex, `$1${relayIp}$3`);
    }

    // Если это не стандартная ссылка vless, возвращаем как есть
    return rawLink;
  }, [rawLink, relayIp]);

  // Функция копирования в буфер обмена
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Возвращаем текст кнопки через 2 сек
    } catch (err) {
      console.error('Ошибка копирования!', err);
    }
  };

  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Поле ввода */}
      <TextField
        fullWidth
        variant="outlined"
        label="vless://"
        placeholder="vless://"
        value={rawLink}
        onChange={(e) => setRawLink(e.target.value)}
      />

      {/* Блок вывода (показываем только если есть ссылка) */}
      {processedLink && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Результат:
          </Typography>

          <CodeBlock code={processedLink} language='plaintext' />

          {/* Кнопки действий */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            
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
        <DialogTitle align="center">QR-код Xray/Vless</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <QRCodeSVG 
            value={processedLink} 
            size={512}
            level="L" // Для vless ссылок достаточно низкого уровня коррекции (Low)
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