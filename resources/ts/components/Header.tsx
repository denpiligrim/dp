import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Link, IconButton, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../i18n";
import RuIcon from '../svgIcons.ts/RuIcon';
import UkIcon from '../svgIcons.ts/UkIcon';
import axios from 'axios';

const Header: React.FC = () => {
  const navigator = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLButtonElement>(null);
  const open2 = Boolean(anchorEl2);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Смена языка
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem("lng");
    if (savedLocale) {
      changeLanguage(savedLocale);
    }

    try {
      axios.get('/get-user-info')
        .then(res => {
          const data = res.data;
          console.log(data);

          const userLocale = data.country === "RU" ? "ru" : "en"; // Проверка региона
          localStorage.setItem("lng", userLocale); // Сохраняем локаль в localStorage
          changeLanguage(userLocale);
        })
        .catch(err => console.log(err))
    } catch (error) {
      console.error("Ошибка определения локали:", error);
      changeLanguage('en');
    }
  }, []);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Логотип слева */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, userSelect: 'none' }}>
          <CodeIcon fontSize='large' sx={{ verticalAlign: 'bottom' }} /> DenPiligrim
        </Typography>

        {/* Ссылки справа */}
        <Box>
          <IconButton
            onClick={(e) => setAnchorEl(e.target as HTMLButtonElement)}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={(e) => setAnchorEl(null)}
          >
            <MenuItem selected={i18n.language === 'en'} onClick={() => {
              changeLanguage("en");
              localStorage.setItem("lng", 'en');
              setAnchorEl(null);
            }}>
              <UkIcon sx={{ mr: '1.25rem' }} />
              EN
            </MenuItem>
            <MenuItem selected={i18n.language === 'ru'} onClick={() => {
              changeLanguage("ru");
              localStorage.setItem("lng", 'ru');
              setAnchorEl(null);
            }}>
              <RuIcon sx={{ mr: '1.25rem' }} />
              RU
            </MenuItem>
          </Menu>
          {isMobile ? (
            <>
              <IconButton
                onClick={(e) => setAnchorEl2(e.target as HTMLButtonElement)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl2}
                open={open2}
                onClose={(e) => setAnchorEl2(null)}
              >
                <MenuItem onClick={() => {
                  navigator('/blog');
                  setAnchorEl2(null);
                }}>
                  {t("headerBlog")}
                </MenuItem>
                <MenuItem onClick={() => {
                  navigator('/dev');
                  setAnchorEl2(null);
                }}>
                  {t("headerDev")}
                </MenuItem>
                <MenuItem onClick={() => {
                  navigator('/crypto');
                  setAnchorEl2(null);
                }}>
                  {t("headerCrypto")}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link href="/blog" color="inherit" underline="hover" sx={{ mx: 2, verticalAlign: 'middle' }} onClick={(e) => {
                e.preventDefault();
                navigator('/blog');
              }}>
                {t("headerBlog")}
              </Link>
              <Link href="/dev" color="inherit" underline="hover" sx={{ mr: 2, verticalAlign: 'middle' }} onClick={(e) => {
                e.preventDefault();
                navigator('/dev');
              }}>
                {t("headerDev")}
              </Link>
              <Link href="/crypto" color="inherit" underline="hover" sx={{ verticalAlign: 'middle' }} onClick={(e) => {
                e.preventDefault();
                navigator('/crypto');
              }}>
                {t("headerCrypto")}
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;