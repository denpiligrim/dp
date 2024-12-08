import { SxProps, Box, Button, Card, CardContent, Typography } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { useTranslation } from 'react-i18next';
import { i18n, TFunction } from 'i18next';

export default function AboutMe(): JSX.Element {

  const { t, i18n }: { t: TFunction; i18n: i18n } = useTranslation();
  const btnStyle: SxProps = {
    display: 'flex',
    mx: 'auto',
    textTransform: 'capitalize'
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2 }}>
        {Array.from({ length: 5 }, (_, index) => (
          <Typography
            variant='body1'
            component='p'
            gutterBottom={index !== 4}>
            {t(`aboutMe${index + 1}`)}
          </Typography>
        ))}
        <Box sx={{ width: '100%' }} pt={2}>
          <Button variant="outlined" sx={btnStyle}
            startIcon={<PictureAsPdfIcon />}>
            {t('resumeFile')}
          </Button>
          <Button variant="text" sx={{ ...btnStyle, mt: 1 }}>
            {t('resumeFileAlt')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}