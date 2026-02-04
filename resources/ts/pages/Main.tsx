import { Box, Button, Card, CardContent, Grid2 as Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation';
import RainAnimation from '../components/RainAnimation';
import layer1 from '../../images/layer-1.webp';
import { useTranslation } from 'react-i18next';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TsIcon from '../svgIcons/TsIcon';
import { i18n, TFunction } from 'i18next';
import { Helmet } from 'react-helmet';
import BannerHosting from '../components/BannerHosting';
import BannerBeget from '../components/BannerBeget';

const stringToArray = (str: string) => {
  let arr = str.split('|');
  arr.map((el, i) => {
    arr[i] = el.trim();
    arr[i] = insertLineBreak(arr[i]);
  });

  return addAfterEachElement(arr);
}

function addAfterEachElement(arr: string[]): number[] {
  const result: any[] = [];
  for (const element of arr) {
    result.push(element, 5000); // Добавляем текущий элемент и 10000
  }
  return result;
}

function insertLineBreak(input: string, maxLength: number = 30): string {
  if (input.length <= maxLength) {
    return input; // Если длина строки меньше или равна maxLength, возвращаем как есть
  }

  // Находим ближайший пробел до maxLength
  const breakPoint = input.lastIndexOf(' ', maxLength);

  if (breakPoint === -1) {
    // Если пробелов нет в пределах maxLength, возвращаем строку без изменений
    return input;
  }

  // Вставляем перенос строки в найденной точке
  return input.slice(0, breakPoint) + '\n' + input.slice(breakPoint + 1);
}

const Main = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [mainTitles, setMainTitles] = useState<any[]>([]);
  const { t, i18n }: { t: TFunction; i18n: i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const targetRef = useRef<HTMLDivElement>(null);
  const codeString = `import { SxProps, Box, Button, Card, CardContent, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
            key={'aboutMe' + index}
            variant='body1'
            component='p'
            gutterBottom={index !== 4}>
            {t(\`aboutMe\${index + 1}\`)}
          </Typography>
        ))}
        <Box sx={{ width: '100%' }} pt={2}>
          <Button variant="outlined" sx={btnStyle}
            startIcon={<PictureAsPdfIcon />}>
            {t('resumeFile')}
          </Button>
          <Button variant="text" size="small" sx={{ ...btnStyle, mt: 1 }}>
            {t('resumeFileAlt')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}`;

  const mouseMove = (e) => {
    Object.assign(document.documentElement, {
      style: `
      --move-x: ${(e.clientX - window.innerWidth / 2) * -.005}deg;
      --move-y: ${(e.clientY - window.innerHeight / 2) * .01}deg;
      `
    })
  }

  const scrollToTarget = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const onLanguageChange = () => {
      setMainTitles(stringToArray(t('mainTitle')));
    };

    i18n.on('languageChanged', onLanguageChange);

    onLanguageChange();

  }, []);

  return (
    <>
      <Helmet defer={false}>
        <meta name="description" content="Web development services and websites from a private developer with over 15 years of experience." />
        <meta name="keywords" content="site, development, service, programmer, frontend, backend, react" />
        <meta property="og:title" content={t('titleMain')} />
        <meta property="og:description" content="Web development services and websites from a private developer with over 15 years of experience." />
        <title>{t('titleMain')}</title>
        <link rel="canonical" href={import.meta.env.VITE_APP_URL} />
      </Helmet>
      {visible ? (
        <>
          <Box className="layers" onMouseMove={mouseMove} mb={4}>
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
                  {mainTitles.length > 0 && (
                    <Box sx={{ width: '100%', minHeight: isMobile ? '150px' : '390px', textAlign: 'center' }}>
                      <FormatQuoteIcon sx={{
                        fontSize: isMobile ? '16px' : '60px',
                        display: 'block',
                        mx: 'auto'
                      }} />
                      <TypeAnimation
                        key={mainTitles.join()}
                        sequence={mainTitles}
                        wrapper="p"
                        cursor={true}
                        repeat={Infinity}
                        style={{ whiteSpace: 'pre-line', fontWeight: 'bold', fontSize: isMobile ? '1rem' : '3.75rem', letterSpacing: '1px', display: 'inline-block' }}
                      />
                    </Box>
                  )}
                  <Box className="hero-content__p" component="h1">
                    {t('subTitle')}
                  </Box>
                  <Button variant='outlined' className="Button-start" onClick={scrollToTarget}>{t('learnMore')}</Button>
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
          {i18n.language === 'ru' ? [<BannerHosting />, <BannerBeget />][Math.floor(Math.random() * 2)] : <BannerHosting />}
          <Grid container spacing={2} p={2} pt={4} ref={targetRef}>
            <Grid size={{ xs: 12, md: 6 }} position='relative' height='fit-content' order={{ xs: 2, md: 1 }}>
              <SyntaxHighlighter
                language="tsx"
                showLineNumbers={true}
                style={okaidia}
                customStyle={{
                  borderRadius: '15px',
                  margin: 0,
                  fontSize: isMobile ? '0.75em' : '1em',
                  backgroundColor: '#121212',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.092), rgba(255, 255, 255, 0.092))'
                }}>
                {codeString}
              </SyntaxHighlighter>
              <Box sx={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                textAlign: 'right'
              }}>
                <TsIcon sx={{ verticalAlign: 'middle' }} />
                <Typography variant='caption' component='span' color='textSecondary'> TypeScript</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2 }}>
                  {Array.from({ length: 3 }, (_, index) => (
                    <Typography
                      key={'aboutMe' + index}
                      variant='body1'
                      component='p'
                      gutterBottom={index !== 2}>
                      {t(`aboutMe${index + 1}`)}
                    </Typography>
                  ))}
                  <Typography
                    variant='h6'
                    component='h2'
                    gutterBottom>
                    {t('aboutCrypto')}
                  </Typography>
                  <Typography
                    variant='body1'
                    component='p'
                    gutterBottom>
                    {t('aboutMe4')}
                  </Typography>
                  <Typography
                    variant='body1'
                    component='p'>
                    {t('aboutMe5')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default Main