import { Grid2 as Grid, Card, CardContent, Typography, Button } from '@mui/material'
import LightweightChart from '../components/LightweightChart'
import AltcoinSeason from '../components/AltcoinSeason'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../i18n";
import BtcDominance from '../components/BtcDominance';
import FearGreedIndex from '../components/FearGreedIndex';
import MarketCap from '../components/MarketCap';

const Crypto = () => {

  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
          {t("mainPage")}
          </Button>
        </Grid>
      </Grid>
      <Grid container sx={{ my: 'auto' }} spacing={2} p={2}>
      <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='p'>{t('marketCap')}</Typography>
              <MarketCap />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='p'>{t('fearGreedIndex')}</Typography>
              <FearGreedIndex />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='p'>{t('BtcDominance')}</Typography>
              <BtcDominance />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='p'>{t('altSeasonIndex')}</Typography>
              <AltcoinSeason />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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