import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react'
import RainAnimation from '../components/RainAnimation';
import layer1 from '../../images/layer-1.webp';
import { useTranslation } from 'react-i18next';

const Main = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const { t, i18n } = useTranslation();

  const mouseMove = (e) => {
    Object.assign(document.documentElement, {
      style: `
      --move-x: ${(e.clientX - window.innerWidth / 2) * -.005}deg;
      --move-y: ${(e.clientY - window.innerHeight / 2) * .01}deg;
      `
    })
  }

  return (
    <>
      {visible ? (
        <>
          <Box className="layers" onMouseMove={mouseMove}>
            <Box className="layers__container">
              <Box
                className="layers__item layer-1"
                style={{ backgroundImage: `url(${layer1})` }}
              />
              <Box
                className="layers__item layer-2"
                style={{ backgroundImage: "url(img/layer-22.png)" }}
              />
              <Box className="layers__item layer-3">
                <Box className="hero-content">
                  <Typography variant='h1' component='h1' fontWeight={600}>
                    {t('mainTitle1')} <span>{t('mainTitle2')}</span>
                  </Typography>
                  <Box className="hero-content__p">
                    Сделай заказ прямо сейчас и получи скидку 20%
                  </Box>
                  <Button variant='outlined' className="Button-start">Узнать больше</Button>
                </Box>
              </Box>
              <Box className="layers__item layer-4">
                <RainAnimation />
              </Box>
              <Box
                className="layers__item layer-5"
                style={{ backgroundImage: "url(img/layer-55.png)" }}
              />
              <Box
                className="layers__item layer-6"
                style={{ backgroundImage: "url(img/layer-6.png)" }}
              />
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default Main