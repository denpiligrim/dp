import { Button, Grid2 as Grid } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Dev = () => {

  const navigator = useNavigate();

  return (
    <Grid container>
      <Grid size={{ xs: 12 }} pt={3} pb={1}>
        <Button variant="text" startIcon={<ArrowBackIosIcon />} onClick={() => navigator('/')}>
          Main
        </Button>
      </Grid>
    </Grid>
  )
}

export default Dev
