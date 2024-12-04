import { Grid2 as Grid, IconButton } from '@mui/material';
import XIcon from '@mui/icons-material/X';

const Footer = () => {
  return (
    <Grid container>
      <Grid size={{ xs: 12 }} p={2} textAlign="center">
        <IconButton
          onClick={(e) => window.open('https://x.com')}
        >
          <XIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default Footer
