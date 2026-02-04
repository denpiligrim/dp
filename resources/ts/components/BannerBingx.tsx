import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import "../i18n";
import arrow from '../../images/arrow.svg';

const BannerBingx = () => {
  const { t, i18n } = useTranslation();

  return (
    <Box p={2} sx={{ width: '100%', position: 'relative' }}>
      <a href="https://bingx.com/invite/A5KD4U/" target="_blank" rel="noopener noreferrer">
        <Box className={i18n.language === 'ru' ? 'ruBannerBingx' : 'enBannerBingx'}></Box>
      </a>
      <Box sx={{ position: 'absolute', top: '10%', left: '16px', textAlign: 'center', display: { xs: 'none', lg: 'block' } }}>
        <Typography variant='h6' component='p' fontWeight={700} mb={4}>
          {t('bybitAffiliate')}
        </Typography>
        <img src={arrow} alt="Arrow" width="50" />
      </Box>
    </Box>
  )
}
export default BannerBingx;