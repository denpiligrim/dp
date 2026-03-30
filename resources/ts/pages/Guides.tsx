import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Guides() {
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Ультимативный ВПН сервер
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Интерактивное руководство по настройке собственного VPN-сервера с поддержкой Relay-сервера для маскировки трафика.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to="/guides/ultimate-vpn"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Читать гайд
                </Button>
              </CardActions>
            </Card>
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Создание ВМ на Яндекс Облако
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Руководство по аренде и настройке виртуальной машины.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to="/guides/yandex-cloud-vm"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Читать гайд
                </Button>
              </CardActions>
            </Card>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
}