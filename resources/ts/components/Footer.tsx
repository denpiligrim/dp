import { Grid2 as Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {

  const theme = useTheme();

  return (
    <Grid container>
      <Grid size={{ xs: 12 }} py={4} px={2} textAlign="center">
        <Stack direction="row" spacing={1} sx={{
          justifyContent: "center",
          alignItems: "center",
        }}>
          <IconButton
            onClick={() => window.open('https://x.com/denpiligrim')}
          >
            <XIcon />
          </IconButton>
          <IconButton
            onClick={() => window.open('https://t.me/denpiligrim_web')}
          >
            <TelegramIcon />
          </IconButton>
          <IconButton
            onClick={() => window.open('https://github.com/vasiljevdenis')}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            onClick={() => window.open('https://www.linkedin.com/in/vasiljevdenis')}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
        <Typography variant='caption' component='p' sx={{ color: theme.palette.text.secondary }}>© DenPiligrim</Typography>
      </Grid>
    </Grid>
  )
}

export default Footer
