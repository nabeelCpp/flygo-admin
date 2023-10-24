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
import { airports } from '../pages/agent/bookingForm/airports'
import { airlines } from '../pages/agent/bookingForm/airlines'




function FlightDetail({ open, handleClose, flight, convertMinutesToHoursAndMinutes, convertGmtTimeToBasic }) {
  if(!flight) {
    return null
  }
  const { destination, origin, total_time, flight_stops, flightSchedules, basePrice, depart_date } = flight
  const [activeStep, setActiveStep] = React.useState(0)


  return (
    <Dialog scroll='body' maxWidth='md' open={open} onClose={handleClose}>
      <Box sx={{ position: 'relative' }}>
        <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <DialogContent>
        {
          flightSchedules.map( ( fs, index, array ) => {
            let departs = new Date(depart_date)
            let arrives = new Date(depart_date)
            departs.setDate(departs.getDate() + (fs?.day_adjustment ? fs.day_adjustment : 0));
            arrives.setDate(arrives.getDate() + (fs?.day_adjustment ? fs.day_adjustment : 0));
            const steps = [
              {
                label: `${airports.filter(a => a.VENDOR_CODE === fs.departure.airport)[0].CITY_NAME} ${fs.departure?.terminal ? (fs.departure.terminal == 'M' ? 'Main' : fs.departure.terminal+' Terminal'):''}`,
                description: `${airlines.filter( a => a.id === fs.carrier.marketing)[0].name} [${fs.carrier.marketing + ' ' + fs.carrier.marketingFlightNumber}]`
              },
              {
                label: `${airports.filter(a => a.VENDOR_CODE === fs.arrival.airport)[0].CITY_NAME} ${fs.arrival?.terminal ? (fs.arrival.terminal == 'M' ? 'Main' : fs.arrival.terminal+' Terminal'):''}`,
                description: ``
              }
            ]
            let cityDeparture = airports.filter(ap => ap.VENDOR_CODE === fs.departure.airport)[0].CITY_NAME
            let cityArrival = airports.filter(ap => ap.VENDOR_CODE === fs.arrival.airport)[0].CITY_NAME
            return <>
              <Box>
                <Typography variant='h5'>{cityDeparture} - {cityArrival}</Typography>
                <Box sx={{ mt: 5, width: '550px' }}>
                  <Typography variant='body1' sx={{ mb: '10px' }} gutterBottom>
                    <strong>Departs:</strong> {departs.toDateString()}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: '10px' }} gutterBottom>
                    <strong>Arrives:</strong> {arrives.toDateString()}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Flight duration:</strong> {convertMinutesToHoursAndMinutes(fs.elapsedTime)}
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 5 }}>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', my: '14px' }}
                  >
                    <Typography variant='body1' sx={{ mb: '12px' }} gutterBottom>
                      <strong>{convertGmtTimeToBasic(fs.departure.time)}</strong>
                    </Typography>
                    <Typography variant='body1' sx={{ mb: '12px' }} gutterBottom>
                      <strong>{convertMinutesToHoursAndMinutes(fs.elapsedTime)}</strong>
                    </Typography>
                    <Typography variant='body1'>
                      <strong>{convertGmtTimeToBasic(fs.arrival.time)}</strong>
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
              {index !== array.length - 1 &&
              <Box sx={{ backgroundColor: '#F2F4F7', textAlign: 'center', mt: '14px', py: '5px' }}>
                <Typography>{`Transit in ${cityArrival} for ${convertMinutesToHoursAndMinutes((new Date(new Date(`${depart_date} ${array[index + 1].departure.time}`).setDate(new Date(`${depart_date} ${array[index + 1].departure.time}`).getDate() + (array[index + 1]?.day_adjustment ? array[index + 1].day_adjustment : 0 ))) - new Date(new Date(`${depart_date} ${fs.arrival.time}`).setDate(new Date(`${depart_date} ${fs.arrival.time}`).getDate() + (fs?.day_adjustment ? fs.day_adjustment : 0))))/(1000 * 60))}.`}</Typography>
              </Box> }
            </>
          })
        }


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
