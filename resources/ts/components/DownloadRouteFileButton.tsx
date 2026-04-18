import { useState } from 'react';
import { Card, CardContent, Link, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export const DownloadRouteFileButton = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    const primaryUrl = 'https://russia.iplist.opencck.org/?format=amnezia&data=domains';
    const fallbackUrl = '/docs/ip-list.json';
    const fileName = 'ip-list.json';

    try {
      const response = await fetch(primaryUrl);

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.warn('Не удалось загрузить основной файл, используем запасной:', error);

      const fallbackLink = document.createElement('a');
      fallbackLink.href = fallbackUrl;
      fallbackLink.download = fileName;
      fallbackLink.target = '_blank';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card sx={{
      mt: 1,
      mb: 1,
      borderRadius: '15px',
      bgcolor: 'background.paper',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: 'none',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02))'
    }}>
      <CardContent sx={{ p: '16px !important' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <DownloadIcon />
            <Link
              component="button"
              onClick={handleDownload}
              disabled={isDownloading}
              color="text.primary"
              sx={{ fontSize: '1.1rem' }}
            >
              {isDownloading ? 'Загрузка...' : 'Скачать список доменов'}
            </Link>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};