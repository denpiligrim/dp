import { Box, Chip, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslation } from 'react-i18next';

const BtcDominance = () => {

  const [btcDominance, setBtcDominance] = useState<string>('');
  const [ethDominance, setEthDominance] = useState<string>('');
  const [otherDominance, setOtherDominance] = useState<string>('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    axios.get('/api/global-metrics/quotes/latest')
      .then(res => {
        const data = res.data.result.data;

        const bitcoinDominance = data.btc_dominance.toFixed(1);
        const ethereumDominance = data.eth_dominance.toFixed(1);
        const othersDominance = (100 - (+bitcoinDominance + +ethereumDominance)).toFixed(1);
        setBtcDominance(bitcoinDominance);
        setEthDominance(ethereumDominance);
        setOtherDominance(othersDominance);
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
        mt: 3,
        mb: '26px',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={2}>
          <Box>
            <Typography variant='caption' component='p'><CircleIcon sx={{ fontSize: '8px', color: '#F7931A' }} /> Bitcoin</Typography>
            <Typography variant='h5' component='p' fontWeight={700}>{btcDominance}%</Typography>
          </Box>
          <Box>
            <Typography variant='caption' component='p'><CircleIcon sx={{ fontSize: '8px', color: '#6c24e0' }} /> Ethereum</Typography>
            <Typography variant='h5' component='p' fontWeight={700}>{ethDominance}%</Typography>
          </Box>
          <Box>
            <Typography variant='caption' component='p'><CircleIcon sx={{ fontSize: '8px', color: '#c1ccfd' }} /> {t('others')}</Typography>
            <Typography variant='h5' component='p' fontWeight={700}>{otherDominance}%</Typography>
          </Box>
        </Stack>
      </Box>
      <Box sx={{
        width: '100%',
        height: 6,
        position: 'relative',
        backgroundColor: '#c1ccfd',
        transition: 'all 1s ease'
      }}>
        <Box sx={{
          width: btcDominance + '%',
          height: 6,
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#F7931A',
          transition: 'all 1s ease'
        }}></Box>
        <Box sx={{
          width: ethDominance + '%',
          height: 6,
          position: 'absolute',
          top: 0,
          left: btcDominance + '%',
          backgroundColor: '#6c24e0',
          transition: 'all 1s ease'
        }}></Box>
      </Box>
    </>
  );
};

export default BtcDominance;