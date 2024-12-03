import React from 'react';
import { AppBar, Toolbar, Typography, Box, Link } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigator = useNavigate();

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                {/* Логотип слева */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <CodeIcon fontSize='large' sx={{ verticalAlign: 'bottom' }} /> DenPiligrim
                </Typography>

                {/* Ссылки справа */}
                <Box>
                    <Link href="/dev" color="inherit" underline="hover" sx={{ mx: 2 }} onClick={(e) => {
                      e.preventDefault();
                      navigator('/dev');
                    }}>
                        Dev
                    </Link>
                    <Link href="/crypto" color="inherit" underline="hover" onClick={(e) => {
                      e.preventDefault();
                      navigator('/crypto');
                    }}>
                        Crypto
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;