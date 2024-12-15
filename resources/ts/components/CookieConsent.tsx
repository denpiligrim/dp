import { useState, useEffect } from 'react';
import { Button, Typography, Unstable_TrapFocus, Fade, Paper, Grid2 as Grid } from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const allowCookies = localStorage.getItem('allow');
    if (allowCookies !== 'true') {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('allow', 'true');
    setOpen(false);
  };

  return (
    <Unstable_TrapFocus open disableAutoFocus disableEnforceFocus>
      <Fade appear={false} in={open}>
        <Paper
          role="dialog"
          square
          variant="outlined"
          tabIndex={-1}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            m: 0,
            p: 2,
            borderWidth: 0,
            borderTopWidth: 1,
          }}
        >
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 'auto' }} display="flex" justifyContent={{ xs: 'center', sm: 'flex-start' }} alignItems="center">
              <CookieIcon fontSize='large' />
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }} textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {t('cookieConsent1')}
              </Typography>
              <Typography variant="body2">
                {t('cookieConsent2')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }} ml={{ xs: 0, sm: 'auto' }} display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }} alignItems="center">
              <Button size="small" onClick={handleClose} variant="contained">
                {t('cookieConsentBtn')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Unstable_TrapFocus>
  );
};

export default CookieConsent;