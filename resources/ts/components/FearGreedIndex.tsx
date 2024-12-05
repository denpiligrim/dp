import { Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useTranslation } from 'react-i18next';

type FearGreedRange = {
  min: number;
  max: number;
  color: string;
};

const fearGreedColors: FearGreedRange[] = [
  { min: 1, max: 19, color: "rgb(234, 57, 67)" },  // Extreme Fear
  { min: 20, max: 39, color: "rgb(234, 140, 0)" }, // Fear
  { min: 40, max: 59, color: "rgb(243, 212, 47)" }, // Neutral
  { min: 60, max: 79, color: "rgb(147, 217, 0)" }, // Greed
  { min: 80, max: 100, color: "rgb(22, 199, 132)" }, // Extreme Greed
];

const FearGreedIndex = () => {

  const [fearGreedIndex, setFearGreedIndex] = useState<number>(0);
  const [fearGreedClass, setFearGreedClass] = useState<string>('extremefear');
  const { t, i18n } = useTranslation();

  const getColorForIndex = (index: number): string | null => {
    const range = fearGreedColors.find(({ min, max }) => index >= min && index <= max);
    return range ? range.color : null;
  };

  useEffect(() => {
    axios.get('/api/fear-and-greed/latest')
      .then(res => {
        const data = res.data.result.data;

        let fgClass = data.value_classification.split(' ').join('');
        fgClass = fgClass.charAt(0).toLowerCase() + fgClass.slice(1);
        setFearGreedClass(fgClass);
        setFearGreedIndex(data.value);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <>
      <Stack direction="column" spacing={0} sx={{
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Gauge width={100} height={87} value={fearGreedIndex} startAngle={-100} endAngle={100} sx={(theme) => ({
          [`& .${gaugeClasses.valueArc}`]: {
            fill: getColorForIndex(fearGreedIndex),
          }
        })} />
        <Typography variant='caption' component='p'>{t(fearGreedClass)}</Typography>
      </Stack>
    </>
  );
};

export default FearGreedIndex;