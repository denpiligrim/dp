import { Box, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslation } from 'react-i18next';

const AltcoinSeason = ({ data }) => {

  const [altSeasonIndex, setAltSeasonIndex] = useState<number>(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const bitcoin = data.find((coin: any) => coin.symbol === "BTC");
    if (!bitcoin) {
      console.log("Bitcoin not found in the data.");
    }

    const bitcoinChange90d = bitcoin.quote.USD.percent_change_90d;
    const altcoins = data.filter((coin: any) => coin.symbol !== "BTC");
    const betterThanBitcoin = altcoins.filter((coin: any) => coin.quote.USD.percent_change_90d > bitcoinChange90d);
    const altseasonIndex = Math.round((betterThanBitcoin.length / altcoins.length) * 100);
    setAltSeasonIndex(altseasonIndex);
  }, []);

  return (
    <>
      <Box sx={{
        width: '100%',
        display: 'flex',
        my: 3,
        alignItems: 'center'
      }}>
        <Typography variant='h5' component='span'>{altSeasonIndex} <span style={{ fontSize: '0.75rem' }}>/ 100</span></Typography>
        {(altSeasonIndex > 75 || altSeasonIndex < 25) && (
          <Chip size='small' label={altSeasonIndex < 50 ? t('BtcSeason') : t('altSeason')} sx={{
            ml: 'auto',
            backgroundColor: altSeasonIndex < 25 ? '#F7931A' : altSeasonIndex < 50 ? '#fcdbb9' : altSeasonIndex < 75 ? '#c1ccfd' : '#6c24e0',
          }} />
        )}
      </Box>
      <Box sx={{
        width: '100%',
        display: 'flex',
        mb: '2px'
      }}>
        <Typography variant='caption' component='span'>{t('BtcSeason')}</Typography>
        <Typography variant='caption' component='span' sx={{ ml: 'auto' }}>{t('altSeason')}</Typography>
      </Box>
      <Box sx={{
        width: '100%',
        height: 6,
        position: 'relative'
      }}>
        <Box sx={{
          width: '25%',
          height: 6,
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#F7931A'
        }}></Box>
        <Box sx={{
          width: '25%',
          height: 6,
          position: 'absolute',
          top: 0,
          left: '25%',
          backgroundColor: '#fcdbb9'
        }}></Box>
        <Box sx={{
          width: '25%',
          height: 6,
          position: 'absolute',
          top: 0,
          left: '50%',
          backgroundColor: '#c1ccfd'
        }}></Box>
        <Box sx={{
          width: '25%',
          height: 6,
          position: 'absolute',
          top: 0,
          left: '75%',
          backgroundColor: '#6c24e0'
        }}></Box>
        <CircleIcon fontSize='small' sx={{
          position: 'absolute',
          top: -7,
          left: altSeasonIndex + '%',
          color: altSeasonIndex < 25 ? '#F7931A' : altSeasonIndex < 50 ? '#fcdbb9' : altSeasonIndex < 75 ? '#c1ccfd' : '#6c24e0',
          transition: 'all 1s ease'
        }} />
      </Box>
    </>
  );
};

export default AltcoinSeason;