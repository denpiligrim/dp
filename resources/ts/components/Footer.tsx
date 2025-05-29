import { Grid2 as Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

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
            href='https://x.com/denpiligrim'
            target='_blank'
          >
            <XIcon />
          </IconButton>
          <IconButton
            href='https://t.me/denpiligrim_web'
            target='_blank'
          >
            <TelegramIcon />
          </IconButton>
          <IconButton
            href='https://github.com/denpiligrim'
            target='_blank'
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            href='https://www.linkedin.com/in/denpiligrim'
            target='_blank'
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            href='https://www.youtube.com/@denpiligrim'
            target='_blank'
          >
            <YouTubeIcon />
          </IconButton>
        </Stack>
        <Typography variant='caption' component='p' sx={{ color: theme.palette.text.secondary }}>© DenPiligrim</Typography>
      </Grid>
    </Grid>
  )
}

export default Footer
