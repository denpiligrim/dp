import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';

const AltcoinSeason = () => {

  const [altSeasonIndex, setAltSeasonIndex] = useState<number>(0);

  useEffect(() => {
    axios.get('/api/cryptocurrency/listings/latest')
      .then(res => {
        const data = res.data.result.data;

        const bitcoin = data.find((coin: any) => coin.symbol === "BTC");
        if (!bitcoin) {
          console.log("Bitcoin not found in the data.");
        }

        const bitcoinChange90d = bitcoin.quote.USD.percent_change_90d;

        const altcoins = data.filter((coin: any) => coin.symbol !== "BTC");

        const betterThanBitcoin = altcoins.filter((coin: any) => coin.quote.USD.percent_change_90d > bitcoinChange90d);

        const altseasonIndex = Math.round((betterThanBitcoin.length / altcoins.length) * 100);
        setAltSeasonIndex(altseasonIndex);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <>
      <Box sx={{
        width: '100%',
        display: 'flex',
        my: 3,
        alignItems: 'center'
      }}>
        <Typography variant='h6' component='span'>{altSeasonIndex} <span style={{ fontSize: '0.75rem' }}>/ 100</span></Typography>
        <Typography variant='caption' component='span' sx={{
          ml: 'auto',
          backgroundColor: altSeasonIndex < 25 ? '#F7931A' : altSeasonIndex < 50 ? '#fcdbb9' : altSeasonIndex < 75 ? '#c1ccfd' : '#6c24e0',
          padding: '2px 6px',
          borderRadius: '30px'
        }}>{altSeasonIndex < 50 ? 'Биткоин-сезон' : 'Альтсезон'}</Typography>
      </Box>
      <Box sx={{
        width: '100%',
        display: 'flex',
        mb: '2px'
      }}>
        <Typography variant='caption' component='span'>Биткоин-сезон</Typography>
        <Typography variant='caption' component='span' sx={{ ml: 'auto' }}>Альтсезон</Typography>
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
          color: altSeasonIndex < 25 ? '#F7931A' : altSeasonIndex < 50 ? '#fcdbb9' : altSeasonIndex < 75 ? '#c1ccfd' : '#6c24e0'
        }} />
      </Box>
    </>
  );
};

export default AltcoinSeason;