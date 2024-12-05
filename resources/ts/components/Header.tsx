import React from 'react';
import { AppBar, Toolbar, Typography, Box, Link, IconButton, Menu, MenuItem } from '@mui/material';
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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null);
  const open = Boolean(anchorEl);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Смена языка
  };

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
              setAnchorEl(null);
            }}>
              <UkIcon sx={{ mr: '1.25rem' }} />
              EN
            </MenuItem>
            <MenuItem selected={i18n.language === 'ru'} onClick={() => {
              changeLanguage("ru");
              setAnchorEl(null);
            }}>
              <RuIcon sx={{ mr: '1.25rem' }} />
              RU
            </MenuItem>
          </Menu>
          <Link href="/dev" color="inherit" underline="hover" sx={{ mx: 2, verticalAlign: 'middle' }} onClick={(e) => {
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;