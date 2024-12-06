import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation';
import RainAnimation from '../components/RainAnimation';
import layer1 from '../../images/layer-1.webp';
import { useTranslation } from 'react-i18next';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const stringToArray = (str: string) => {
  let arr = str.split('|');
  arr.map((el, i) => {
    arr[i] = el.trim();
    arr[i] = insertLineBreak(arr[i]);
  });
  console.log(arr);

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
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const mouseMove = (e) => {
    Object.assign(document.documentElement, {
      style: `
      --move-x: ${(e.clientX - window.innerWidth / 2) * -.005}deg;
      --move-y: ${(e.clientY - window.innerHeight / 2) * .01}deg;
      `
    })
  }

  useEffect(() => {
    const onLanguageChange = () => {
      setMainTitles(stringToArray(t('mainTitle')));
    };

    i18n.on('languageChanged', onLanguageChange);

    onLanguageChange();

  }, []);

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
                  {mainTitles.length > 0 && (
                    <Box sx={{ width: '100%', minHeight: isMobile ? '150px' : '330px', textAlign: 'center' }}>
                      <FormatQuoteIcon sx={{
                        fontSize: isMobile ? '16px' : '60px',
                        display: 'block',
                        mx: 'auto'
                      }} />
                      <TypeAnimation
                        key={mainTitles.join()}
                        sequence={mainTitles}
                        wrapper="h1"
                        cursor={true}
                        repeat={Infinity}
                        style={{ whiteSpace: 'pre-line', fontSize: isMobile ? '1rem' : '3.75rem', letterSpacing: '1px', display: 'inline-block' }}
                      />
                    </Box>
                  )}
                  <Box className="hero-content__p">
                    {t('subTitle')}
                  </Box>
                  <Button variant='outlined' className="Button-start">{t('learnMore')}</Button>
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