import { Grid2 as Grid } from '@mui/material'
import LightweightChart from '../components/LightweightChart'

const Crypto = () => {
  return (
    <Grid container sx={{ my: 'auto' }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <LightweightChart ticker="btc" currency="bitcoin" color='#F7931A' />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LightweightChart ticker="eth" currency="ethereum" color='#6c24e0' />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LightweightChart ticker="xrp" currency="ripple" color='#ffffff' />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <LightweightChart ticker="sol" currency="solana" color='#9945ff' />
      </Grid>
    </Grid>
  )
}

export default Crypto