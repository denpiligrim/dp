import React from 'react';
import { AppBar, Toolbar, Typography, Box, Link, SpeedDial, SpeedDialAction } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "../i18n";
import RuIcon from '../svgIcons.ts/RuIcon';
import UkIcon from '../svgIcons.ts/UkIcon';

const Header: React.FC = () => {
  const navigator = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Смена языка
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Логотип слева */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => changeLanguage("ru")}>
          <CodeIcon fontSize='large' sx={{ verticalAlign: 'bottom' }} /> DenPiligrim
        </Typography>

        {/* Ссылки справа */}
        <Box onClick={() => changeLanguage("en")}>
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<LanguageIcon />}
            direction='down'
          >
              <SpeedDialAction
                icon={<RuIcon />}
                tooltipTitle="EN"
                onClick={() => changeLanguage("en")}
              />
              <SpeedDialAction
                icon={<UkIcon />}
                tooltipTitle="RU"
                onClick={() => changeLanguage("ru")}
              />
          </SpeedDial>
          <Link href="/dev" color="inherit" underline="hover" sx={{ mx: 2 }} onClick={(e) => {
            e.preventDefault();
            navigator('/dev');
          }}>
            {t("headerDev")}
          </Link>
          <Link href="/crypto" color="inherit" underline="hover" onClick={(e) => {
            e.preventDefault();
            navigator('/crypto');
          }}>
            {t("headerCrypto")}
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;