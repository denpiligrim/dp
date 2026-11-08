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
    title: 'OpenFlux: инструкция по установке и настройке',
    description: 'Пошаговый гайд OpenFlux для Ubuntu и Debian: установка сервера, клиент SOCKS5, автозапуск и решение ошибок.',
    to: '/guides/openflux',
  },
  {
    title: 'CDN Selectel: инструкция по настройке VLESS XHTTP',
    description: 'Пошаговый гайд CDN Selectel: DNS, SSL, Nginx, создание CDN-ресурса и настройка VLESS XHTTP в 3x-ui.',
    to: '/guides/cdn-selectel',
  },
  {
    title: 'Host-front: инструкция по установке и настройке VPN',
    description: 'Пошаговый гайд по ручной настройке HOST-фронта: shared-хостинг, .htaccess, Nginx и VLESS XHTTP в 3x-ui или Remnawave.',
    to: '/guides/host-front',
  },
  {
    title: '3x-ui: инструкция по настройке подключений на одном порту',
    description: 'Пошаговый гайд 3x-ui: установка панели, VLESS TCP TLS и fallback на одном порту, Hysteria2 и подписки Happ или Incy.',
    to: '/guides/3x-ui-one-port',
  },
  {
    title: 'CDN для VLESS XHTTP: инструкция по настройке',
    description: 'Пошаговый гайд на примере Beget: SSL, Nginx reverse proxy, установка 3x-ui, создание CDN-ресурса и VLESS XHTTP-инбаунда.',
    to: '/guides/cdn-setup',
  },
  {
    title: 'MieruProxy: инструкция по установке и настройке Mieru',
    description: 'Пошаговый гайд Mieru: сервер mita, пользователи и квоты, подключение через Karing, ссылки, QR-коды и конфигурация Clash.',
    to: '/guides/mieru-proxy',
  },
  {
    title: 'Установка и настройка 3x-ui: пошаговая инструкция',
    description: 'Гайд 3x-ui для Ubuntu и Debian: VLESS, Hysteria2, сертификаты, ноды, relay-серверы и подписки через 3DP-MANAGER.',
    to: '/guides/3x-ui-install',
  },
  {
    title: 'OlcRTC Proxy: инструкция по установке и настройке',
    description: 'Пошаговый гайд OlcRTC: сервер и клиент, WebRTC через Jitsi, WB Stream или Телемост, автозапуск и обновление.',
    to: '/guides/olcrtc-proxy',
  },
  {
    title: 'VK TURN Proxy: инструкция по установке и настройке',
    description: 'Пошаговый гайд VK TURN Proxy: WireGuard в 3x-ui, установка сервера, настройка клиента и подключение через Happ.',
    to: '/guides/vk-turn-proxy',
  },
  {
    title: 'NaiveProxy: инструкция по установке и настройке',
    description: 'Пошаговый гайд NaiveProxy: домен, установка Caddy, настройка прокси, клиент HTTPS или QUIC и промежуточный relay-сервер.',
    to: '/guides/naive-proxy',
  },
  {
    title: 'Каскадный Amnezia VPN: инструкция по установке и настройке',
    description: 'Пошаговый гайд Amnezia VPN: свой сервер, каскад через relay, раздельное туннелирование и конфигурации AmneziaWG или Xray.',
    to: '/guides/amnezia-cascade',
  },
  {
    title: 'Yandex Cloud: инструкция по созданию виртуальной машины',
    description: 'Пошаговый гайд по Яндекс Облаку: регистрация, создание ВМ, SSH-подключение, статический IP и автоматический запуск.',
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
