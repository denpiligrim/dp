import { Button, Grid2 as Grid, Typography } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {

  const { t, i18n } = useTranslation();
  const navigator = useNavigate();

  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12 }} pt={3} pb={1}>
          <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
            {t("mainPage")}
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} p={2} height="calc(100vh - 256.5px)">
        <Grid size={{ xs: 12 }} sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Typography variant='h5' component='h1' whiteSpace="pre-line" textAlign="center" color='textDisabled'>{t('error404')}</Typography>
        </Grid>
      </Grid>
    </>
  )
}

export default Error404
