import { Grid2 as Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material'
import LightweightChart from '../components/LightweightChart'
import AltcoinSeason from '../components/AltcoinSeason'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../i18n";
import BtcDominance from '../components/BtcDominance';
import FearGreedIndex from '../components/FearGreedIndex';
import MarketCap from '../components/MarketCap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import BannerBybit from '../components/BannerBybit';
import BannerBingx from '../components/BannerBingx';

const Crypto = () => {

  const navigator = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [fearGreed, setFearGreed] = useState(null);
  const [cryptoList, setCryptoList] = useState(null);

  useEffect(() => {
    axios.get('/api/global-metrics/quotes/latest')
      .then(res => {
        const data = res.data.result.data;
        setGlobalMetrics(data);

        axios.get('/api/fear-and-greed/latest')
          .then(res => {
            const data = res.data.result.data;
            setFearGreed(data);

            axios.get('/api/cryptocurrency/listings/latest')
              .then(res => {
                const data = res.data.result.data;
                setCryptoList(data);
                setLoading(false);
              })
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Basic metrics and charts of cryptocurrencies on the website of private developer and crypto-enthusiast DenPiligrim." />
        <meta name="keywords" content="site, development, service, programmer, frontend, backend, react, cryptocurrencies, charts, metrics" />
        <meta property="og:title" content={t('titleCrypto')} />
        <meta property="og:description" content="Basic metrics and charts of cryptocurrencies on the website of private developer and crypto-enthusiast DenPiligrim." />
        <title>{t('titleCrypto')}</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL + '/crypto'} />
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
                  "item": "https://paycot.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Crypto",
                  "item": import.meta.env.VITE_APP_URL + '/crypto'
                }
              ]
            }
          )}
        </script>
      </Helmet>
      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
            {t("mainPage")}
          </Button>
        </Grid>
      </Grid>
      <Grid container sx={{ my: 'auto' }} spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Typography
            variant="h1"
            sx={{
              position: 'absolute',
              left: '-9999px',
              top: 'auto',
              width: '1px',
              height: '1px',
              color: '#121212',
              overflow: 'hidden'
            }}
          >
            {t('h1Crypto')}
          </Typography>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='h2'>{t('marketCap')}</Typography>
              <MarketCap data={globalMetrics} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='h2'>{t('fearGreedIndex')}</Typography>
              <FearGreedIndex data={fearGreed} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='h2'>{t('BtcDominance')}</Typography>
              <BtcDominance data={globalMetrics} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='h2'>{t('altSeasonIndex')}</Typography>
              <AltcoinSeason data={cryptoList} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {([<BannerBybit />, <BannerBingx />][Math.floor(Math.random() * 2)])}
      <Grid container sx={{ my: 'auto' }} spacing={2} p={2}>
        <Grid size={{ xs: 12, md: 6 }} p={0}>
          <Card variant="outlined">
            <CardContent sx={{ p: 0 }}>
              <LightweightChart ticker="btc" currency="bitcoin" color='#F7931A' />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} p={0}>
          <Card variant="outlined">
            <CardContent sx={{ p: 0 }}>
              <LightweightChart ticker="eth" currency="ethereum" color='#6c24e0' />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} p={0}>
          <Card variant="outlined">
            <CardContent sx={{ p: 0 }}>
              <LightweightChart ticker="xrp" currency="ripple" color='#ffffff' />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} p={0}>
          <Card variant="outlined">
            <CardContent sx={{ p: 0 }}>
              <LightweightChart ticker="sol" currency="solana" color='#14f195' />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Crypto