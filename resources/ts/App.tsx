import { Button, CssBaseline, Grid2 as Grid, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import style from '../sass/app.scss?inline';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Dev from './pages/Dev';
import Crypto from './pages/Crypto';

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
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: '#293896'
            },
            "& input::placeholder": {
              verticalAlign: 'middle'
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
            borderRadius: 40
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
              <Route path='/dev' element={<Dev />} />
              <Route path='/crypto' element={<Crypto />} />
            </Routes>
          </Grid>
        </Grid>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App