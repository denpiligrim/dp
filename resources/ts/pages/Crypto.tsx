import { Grid2 as Grid, Card, CardContent } from '@mui/material'
import LightweightChart from '../components/LightweightChart'

const Crypto = () => {
  return (
    <Grid container sx={{ my: 'auto' }} spacing={2} p={2}>
      <Grid size={{ xs: 12, md: 6 }} p={0}>
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <LightweightChart ticker="btc" currency="bitcoin" color='#F7931A' />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} p={0}>
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <LightweightChart ticker="eth" currency="ethereum" color='#6c24e0' />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} p={0}>
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <LightweightChart ticker="xrp" currency="ripple" color='#ffffff' />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} p={0}>
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <LightweightChart ticker="sol" currency="solana" color='#9945ff' />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Crypto