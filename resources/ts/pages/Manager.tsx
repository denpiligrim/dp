import { Avatar, Box, Button, Chip, Container, Grid2 as Grid, Paper, Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TelegramIcon from '@mui/icons-material/Telegram';
import StarIcon from '@mui/icons-material/Star';
import GitHubIcon from '@mui/icons-material/GitHub';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';

const CircularTextAvatar = ({ src, text, size = 200 }) => {
  const theme = useTheme();
  const viewBoxSize = size + 60;
  const center = viewBoxSize / 2;
  const textRadius = (size / 2) + 15;

  const circlePathD = `
    M ${center}, ${center - textRadius}
    A ${textRadius},${textRadius} 0 1,1 ${center},${center + textRadius}
    A ${textRadius},${textRadius} 0 1,1 ${center},${center - textRadius}
  `;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, ml: 'auto', mr: {xs: 'auto', md: 0 } }}>
      <Avatar
        src={src}
        sx={{
          width: size,
          height: size,
          border: `4px solid ${theme.palette.divider}`,
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}
        alt="Avatar"
      />

      <Box
        component="svg"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(0deg)',
          width: viewBoxSize,
          height: viewBoxSize,
          pointerEvents: 'none',
          animation: 'spin 60s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
          }
        }}
      >
        <defs>
          <path id="textCirclePath" d={circlePathD} />
        </defs>
        <text
          fill={theme.palette.primary.main}
          fontSize="15px"
          fontWeight="bold"
          letterSpacing="3px"
          style={{ textTransform: 'uppercase' }}
        >
          <textPath href="#textCirclePath" startOffset="50%" textAnchor="middle">
            {text} • CREATOR •
          </textPath>
        </text>
      </Box>
    </Box>
  );
};

const Manager = () => {

  const navigator = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/manager-info');
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить данные о репозитории');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(i18n.language === 'en' ? 'en-EN' : 'ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="A utility for auto-generating inbound connections for the 3x-ui panel, creating a single subscription URL, and configuring traffic forwarding from an intermediate server to the main server." />
        <meta name="keywords" content="3x-ui, vpn, tunnel, xray, vless, shadowsocks, trojan, vmess, inbound" />
        <meta property="og:title" content="3DP-MANAGER - Inbound generator for 3x-ui" />
        <meta property="og:description" content="A utility for auto-generating inbound connections for the 3x-ui panel, creating a single subscription URL, and configuring traffic forwarding from an intermediate server to the main server." />
        <title>3DP-MANAGER - Inbound generator for 3x-ui</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/3dp-manager'} />
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
                  "name": "3DP-MANAGER",
                  "item": import.meta.env.VITE_APP_URL + '/3dp-manager'
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
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 8,
              pb: 6,
              borderRadius: '15px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://denpiligrim.ru/storage/images/3dp-manager.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Container maxWidth="lg">
              {loading ? (
                <Skeleton variant="rectangular" width={210} height={118} />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Grid container spacing={4} alignItems="center">
                  <Grid size={{ xs: 12, md: 8 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
                    <Typography component="h1" variant={isMobile ? "h4" : "h2"} color="white" gutterBottom fontWeight="bold" textTransform="uppercase">
                      {data.name}
                    </Typography>
                    <Typography variant="h5" color="grey.300">
                      {data.description || "Описание отсутствует"}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                      <Button
                        variant="contained"
                        startIcon={<GitHubIcon />}
                        href={data.url}
                        target="_blank"
                        size="large"
                      >
                        {"GitHub" + (isMobile ? "" : " " + t('ghRepo'))}
                      </Button>
                      <Chip
                        icon={<StarIcon sx={{ color: '#e3b341 !important' }} />}
                        label={`${data.stars} ` + t('ghStars')}
                        variant="outlined"
                        sx={{ color: 'white', borderColor: '#30363d', fontSize: '1rem', height: '42px' }}
                      />
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                    <CircularTextAvatar
                      src={data.avatar}
                      text="@denpiligrim"
                      size={220}
                    />
                  </Grid>
                </Grid>
              )}
            </Container>
          </Box>
        </Grid>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{
                p: 3,
                height: '100%',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.092), rgba(255, 255, 255, 0.092))'
              }}
                elevation={0}>
                <Box display="flex" alignItems="center" mb={2}>
                  <NewReleasesIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    {t('ghLastRelease')}
                  </Typography>
                </Box>

                {loading ? (
                  <Skeleton height={200} />
                ) : data && data.latest_release ? (
                  <>
                    <Box display="flex" alignItems="baseline" gap={2} mb={1}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {data.latest_release.tag}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(data.latest_release.published_at)}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                      {data.latest_release.body
                        ? data.latest_release.body
                        : 'Описание релиза отсутствует.'}
                    </Typography>

                    <Button
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      href={data.latest_release.url}
                      target="_blank"
                    >
                      Смотреть релиз
                    </Button>
                  </>
                ) : (
                  <Typography color="text.secondary">Релизы не найдены.</Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{
                p: 3,
                height: '100%',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.092), rgba(255, 255, 255, 0.092))'
              }}
                elevation={0}>
                <Typography variant="h6" gutterBottom>
                  {t('ghLinks')}
                </Typography>
                <Stack spacing={2} mt={2}>
                  {loading ? <Skeleton /> : (
                    <>
                      <Button
                        variant="text"
                        startIcon={<GitHubIcon />}
                        href={data?.url}
                        target="_blank"
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Source Code
                      </Button>
                      <Button
                        variant="text"
                        startIcon={<TelegramIcon />}
                        href="https://t.me/denpiligrim_web"
                        target="_blank"
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        Telegram
                      </Button>
                      <Button
                        variant="text"
                        startIcon={<YouTubeIcon />}
                        href="https://www.youtube.com/@denpiligrim"
                        target="_blank"
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        YouTube
                      </Button>
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </>
  )
}

export default Manager