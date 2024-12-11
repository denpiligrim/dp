import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTranslation } from 'react-i18next';

const formatCurrency = (value: number): string => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`; // Триллионы
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;   // Миллиарды
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;   // Миллионы
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;   // Тысячи
  return `$${value}`; // Меньше тысячи
};

const MarketCap = ({ data }) => {

  const [cap, setCap] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [capСhange, setCapChange] = useState<string>('');
  const [volumeChange, setVolumeChange] = useState<string>('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const totalMarketCap = data.quote.USD.total_market_cap;
    const totalVolume24h = data.quote.USD.total_volume_24h;

    setCap(formatCurrency(totalMarketCap));
    setVolume(formatCurrency(totalVolume24h));
    setCapChange(data.quote.USD.total_market_cap_yesterday_percentage_change < 0 ? 'down' : 'up');
    setVolumeChange(data.quote.USD.total_volume_24h_yesterday_percentage_change < 0 ? 'down' : 'up');
  }, []);

  return (
    <>
      <Box sx={{
        width: '100%',
        display: 'flex',
        mt: 3,
        mb: '30px',
        alignItems: 'center'
      }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography variant='caption' component='p'>{t("shortMarketCap")}</Typography>
            <Typography variant='h5' component='p' fontWeight={700} color={capСhange === 'up' ? 'success' : 'error'}>{capСhange === 'up' ? <ArrowDropUpIcon sx={{ verticalAlign: 'text-bottom', ml: '-8px' }} /> : <ArrowDropDownIcon sx={{ verticalAlign: 'text-bottom', ml: '-8px' }} />} {cap}</Typography>
          </Box>
          <Box>
            <Typography variant='caption' component='p'>{t("volume")}</Typography>
            <Typography variant='h5' component='p' fontWeight={700} color={volumeChange === 'up' ? 'success' : 'error'}>{volumeChange === 'up' ? <ArrowDropUpIcon sx={{ verticalAlign: 'text-bottom', ml: '-8px' }} /> : <ArrowDropDownIcon sx={{ verticalAlign: 'text-bottom', ml: '-8px' }} />} {volume}</Typography>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default MarketCap;