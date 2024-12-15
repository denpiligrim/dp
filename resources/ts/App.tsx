import { Button, CssBaseline, Grid2 as Grid, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import style from '../sass/app.scss?inline';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Dev from './pages/Dev';
import Crypto from './pages/Crypto';
import Blog from './pages/Blog';
import { md5 } from '@mui/x-license-pro/encoding/md5';
import { LicenseInfo } from '@mui/x-license-pro';
import { LICENSE_SCOPES } from '@mui/x-license-pro/utils/licenseScope';
import { LICENSING_MODELS } from '@mui/x-license-pro/utils/licensingModel';
import Error404 from './pages/Error404';

let orderNumber = '';
let expiryTimestamp = Date.now(); // Expiry is based on when the package was created, ignored if perpetual license
let scope = LICENSE_SCOPES[1]; // 'pro' or 'premium'
let licensingModel = LICENSING_MODELS[0]; // 'perpetual', 'subscription'
let licenseInfo = `O=${orderNumber},E=${expiryTimestamp},S=${scope},LM=${licensingModel},KV=2`;
LicenseInfo.setLicenseKey(md5(btoa(licenseInfo)) + btoa(licenseInfo));

declare module '@mui/material/styles' {
  interface PaletteColor {
    primaryLight?: string;
  }
  interface SimplePaletteColorOptions {
    primaryLight?: string;
  }
  interface BreakpointOverrides {
    xxl: true;
  }
}

function App() {

  const newTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ffffff',
        light: '#8a93ca',
        primaryLight: '#535fab'
      }
    },
    typography: {
      fontFamily: [
        "Lato",
        'sans-serif'
      ].join(',')
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1800
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: style,
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '15px',
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: '#fff'
            },
            "& input::placeholder": {
              verticalAlign: 'middle'
            }
          }
        }
      },
      MuiPopper: {
        styleOverrides: {
          root: {
            "& .MuiPaper-root": {
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }
          }
        }
      },
      MuiPopover: {
        styleOverrides: {
          root: {
            "& .MuiMenu-paper": {
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.092), rgba(255, 255, 255, 0.092))',
            borderRadius: '15px'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '40px',
            padding: '6px 26px'
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paperWidthMd: {
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          },
          paperFullScreen: {
            borderRadius: '0'
          }
        }
      }
    }
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={newTheme}>
        <style>{`
            :root {
                --primary-main: ${newTheme.palette.primary.main};
            }
        `}</style>
        <CssBaseline />
        <Header />
        <Grid container sx={{ my: 'auto' }}>
          <Grid size={{ xs: 12 }} minHeight={300}>
            <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/blog' element={<Blog />} />
              <Route path='/dev' element={<Dev />} />
              <Route path='/crypto' element={<Crypto />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Grid>
        </Grid>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App