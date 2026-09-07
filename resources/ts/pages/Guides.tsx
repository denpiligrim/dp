import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

type Guide = {
  title: string;
  description: string;
  to: string;
};

const guides: Guide[] = [
  {
    title: 'Настройка CDN на Selectel',
    description: 'Настройка CDN на Selectel: инбаунд в 3x-ui, nginx reverse proxy на 443 порту и создание CDN-ресурса.',
    to: '/guides/cdn-selectel',
  },
  {
    title: 'VPN через HOST-фронт',
    description: 'Настройка HOST-фронта на shared-хостинге и установка ноды с помощью автоматического скрипта.',
    to: '/guides/host-front',
  },
  {
    title: 'Подключения на одном порту в 3x-ui',
    description: 'Установка 3x-ui, подключение VLESS или Hysteria2, все на одном порту.',
    to: '/guides/3x-ui-one-port',
  },
  {
    title: 'Настройка CDN',
    description: 'Настройка CDN для VLESS XHTTP: инбаунд в 3x-ui, nginx reverse proxy на 443 порту и создание CDN-ресурса.',
    to: '/guides/cdn-setup',
  },
  {
    title: 'Настройка MieruProxy',
    description: 'Установка сервера Mieru, создание пользователей с квотами и подключение по ссылке или QR-коду.',
    to: '/guides/mieru-proxy',
  },
  {
    title: 'Установка панели 3x-ui',
    description: 'Установка 3x-ui, подключение VLESS или Hysteria2, ноды и менеджер подписок 3DP-MANAGER.',
    to: '/guides/3x-ui-install',
  },
  {
    title: 'Настройка прокси OlcRTC',
    description: 'Связка WebRTC в реализации OlcRTC + свой сервер.',
    to: '/guides/olcrtc-proxy',
  },
  {
    title: 'VK TURN Proxy',
    description: 'Настройка собственного прокси сервера vk turn proxy.',
    to: '/guides/vk-turn-proxy',
  },
  {
    title: 'NaiveProxy',
    description: 'Настройка собственного прокси сервера NaiveProxy с маскировкой под обычный веб серфинг в браузере.',
    to: '/guides/naive-proxy',
  },
  {
    title: 'Каскадный Amnezia VPN',
    description: 'Как сделать Amnezia VPN self-hosted через РУ сервер без единой команды. Самое простое решение.',
    to: '/guides/amnezia-cascade',
  },
  {
    title: 'Создание ВМ на Яндекс Облако',
    description: 'Руководство по аренде и настройке виртуальной машины.',
    to: '/guides/yandex-cloud-vm',
  },
  {
    title: 'Ультимативный ВПН сервер',
    description: 'Интерактивное руководство по настройке собственного VPN-сервера с поддержкой Relay-сервера для маскировки трафика.',
    to: '/guides/ultimate-vpn',
  },
];

export default function Guides() {
  const navigator = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Guides" />
        <meta name="keywords" content="guides" />
        <meta property="og:title" content="Guides" />
        <meta property="og:description" content="Guides" />
        <title>Guides</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/guides'} />
        <script type="application/ld+json">
          {JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Homepage",
                  "item": "https://denpiligrim.ru/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Guides",
                  "item": import.meta.env.VITE_APP_URL + '/guides'
                }
              ]
            }
          )}
        </script>
      </Helmet>
      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
            {t('mainPage')}
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Гайды и инструкции
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Полезные материалы по настройке серверов, обходу блокировок и веб-разработке.
        </Typography>

        <Grid container spacing={3}>
          {guides.map((guide) => (
            <Grid key={guide.to} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {guide.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {guide.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    to={guide.to}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Читать гайд
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
