import { Grid2 as Grid, Card, CardContent, Typography, Button } from '@mui/material'
import LightweightChart from '../components/LightweightChart'
import AltcoinSeason from '../components/AltcoinSeason'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../i18n";

const Crypto = () => {

  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Смена языка
  };

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }} py={3}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
          {t("mainPage")}
          </Button>
        </Grid>
      </Grid>
      <Grid container sx={{ my: 'auto' }} spacing={2} p={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant='h6' component='p'>Индекс альт-сезона</Typography>
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
              <LightweightChart ticker="sol" currency="solana" color='#9945ff' />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Crypto