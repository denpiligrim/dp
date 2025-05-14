import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import "../i18n";
import arrow from '../../images/arrow.svg';
import mobImgEn from '../../images/banner-en-mob.webp';
import mobImgRu from '../../images/banner-ru-mob.webp';

const BannerHosting = (props) => {
  const { t, i18n } = useTranslation();

  return (
    <Box p={2} sx={{ width: '100%', position: 'relative' }}>
      <a href="https://ishosting.com/affiliate/MjIwOSM2" target="_blank" rel="noopener noreferrer">
        <Box className={i18n.language === 'ru' ? 'ruBanner' : 'enBanner'} sx={{ backgroundImage: props.variant === 'mobile' && `url(${i18n.language === 'ru' ? mobImgRu : mobImgEn})` }}></Box>
      </a>
      {props.variant !== 'mobile' && (
        <Box sx={{ position: 'absolute', top: '10%', left: '16px', textAlign: 'center', display: { xs: 'none', lg: 'block' } }}>
          <Typography variant='h6' component='p' fontWeight={700} mb={4}>
            {t('hostingAffiliate')}
          </Typography>
          <img src={arrow} alt="Arrow" width="50" />
        </Box>
      )}
    </Box>
  )
}

export default BannerHosting;