import { Box, Typography } from '@mui/material';
import arrow from '../../images/arrow.svg';
import mobImg from '../../images/beget-mob.webp';

const BannerBeget = (props) => {

  return (
    <Box p={2} sx={{ width: '100%', position: 'relative' }}>
      <a href="https://beget.com/p1519472" target="_blank" rel="noopener noreferrer">
        <Box className='bannerBeget' sx={{ backgroundImage: props.variant === 'mobile' && `url(${mobImg})`, height: props.variant === 'mobile' ? '250px' : '90px' }}></Box>
      </a>
      {props.variant !== 'mobile' && (
        <Box sx={{ position: 'absolute', top: '10%', left: '16px', textAlign: 'center', display: { xs: 'none', lg: 'block' } }}>
          <Typography variant='h6' component='p' fontWeight={700} mb={4}>
            Мой выбор
          </Typography>
          <img src={arrow} alt="Arrow" width="50" />
        </Box>
      )}
    </Box>
  )
}

export default BannerBeget;