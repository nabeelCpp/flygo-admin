import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { Typography, Box, Grid, IconButton } from '@mui/material'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Icon from 'src/@core/components/icon'

const steps = [
  {
    label: 'Islamabad Main Terminal',
    description: 'XY 316 Airbus 320'
  },
  {
    label: 'Riyadh Terminal 3',
    description: ``
  }
]

function FlightDetail({ open, handleClose }) {
  const [activeStep, setActiveStep] = React.useState(0)

  return (
    <Dialog scroll='body' maxWidth='md' open={open} onClose={handleClose}>
      <Box sx={{ position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <DialogContent>
        <Box>
          <Typography variant='h5'>{'Islamabad - Riyadh'}</Typography>
          <Box sx={{ mt: 5, width: '550px' }}>
            <Typography variant='body1' sx={{ mb: '10px' }} gutterBottom>
              <strong>Departs:</strong> Tuesday 24 Oct 2023
            </Typography>
            <Typography variant='body1' sx={{ mb: '10px' }} gutterBottom>
              <strong>Arrives:</strong> Tuesday 24 Oct 2023
            </Typography>
            <Typography variant='body1'>
              <strong>Flight duration:</strong> 4 hr 15 min
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid
              item
              xs={4}
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', my: '14px' }}
            >
              <Typography variant='body1' sx={{ mb: '12px' }} gutterBottom>
                <strong>04:15</strong>
              </Typography>
              <Typography variant='body1' sx={{ mb: '12px' }} gutterBottom>
                <strong>4 hr 15 min</strong>
              </Typography>
              <Typography variant='body1'>
                <strong>06:30</strong>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}></Grid>
          </Grid>
        </Box>
        <Box sx={{ backgroundColor: '#F2F4F7', textAlign: 'center', mt: '14px', py: '5px' }}>
          <Typography>{'Transit in Riyadh for 10 hr 10 min.'}</Typography>
        </Box>
        <Box sx={{ mt: 5 }}>
          <Typography variant='h5'>{'Riyadh - Abu Dhabi'}</Typography>
          <Box sx={{ mt: 5, width: '500px' }}>
            <Typography variant='body1' sx={{ mb: '10px' }} gutterBottom>
              <strong>Departs:</strong> Tuesday 24 Oct 2023
            </Typography>
            <Typography variant='body1' sx={{ mb: '10px' }} gutterBottom>
              <strong>Arrives:</strong> Tuesday 24 Oct 2023
            </Typography>
            <Typography variant='body1'>
              <strong>Flight duration:</strong> 4 hr 15 min
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ mt: 5 }}>
            <Grid
              item
              xs={4}
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', my: '14px' }}
            >
              <Typography variant='body1' sx={{ mb: '12px' }} gutterBottom>
                <strong>04:15</strong>
              </Typography>
              <Typography variant='body1' sx={{ mb: '12px' }} gutterBottom>
                <strong>4 hr 15 min</strong>
              </Typography>
              <Typography variant='body1'>
                <strong>06:30</strong>
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}></Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FlightDetail
