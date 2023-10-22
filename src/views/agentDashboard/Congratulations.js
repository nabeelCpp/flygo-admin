// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { airports } from '../pages/agent/bookingForm/airports'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: 298,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 250,
    position: 'static'
  }
}))

const AnalyticsCongratulations = ({ flight }) => {
  console.log(flight)
  const { destination, origin, total_time, flight_stops, flightSchedules, basePrice } = flight
  // ** Hook
  const theme = useTheme()

  const convertGmtTimeToBasic = time => {
    let a = time.split('+')[0]
    let b = a.split(':')
    b.pop()
    return b.join(':')
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={4}>
            <Typography variant='h5' sx={{ mb: 1 }}>
              {/* Airline Name <small style={{ fontSize: 'xx-small' }}>XY 645</small> */}
              {/* <small style={{ fontSize: 'xx-small' }}>XY 645 / XY456</small> */}
              <b>Airline Flights</b>
              <ul>
                {flightSchedules.map(sch => (
                  <li style={{ fontSize: 'xx-small' }}>
                    {sch.carrier.marketing + ' ' + sch.carrier.marketingFlightNumber}{' '}
                    <b>
                      [{airports.filter(ap => ap.VENDOR_CODE === sch.departure.airport)[0].CITY_NAME} (
                      {convertGmtTimeToBasic(sch.departure.time)}) -{' '}
                      {airports.filter(ap => ap.VENDOR_CODE === sch.arrival.airport)[0].CITY_NAME} (
                      {convertGmtTimeToBasic(sch.arrival.time)}) ]
                    </b>
                  </li>
                ))}
              </ul>
            </Typography>
            {/* <Typography variant='p' sx={{ mb: 1, fontSize: 'small' }}>
              Air Bus
            </Typography> */}
            <br />
            <Button className='btn-link'>Flight Details</Button>
          </Grid>
          <StyledGrid item xs={12} sm={8}>
            <Grid container spacing={6}>
              <Grid item xs={3} sm={3}>
                {origin[0].CITY_NAME}
                <Typography variant='h6' sx={{ fontWeight: 'bolder' }}>
                  {convertGmtTimeToBasic(flightSchedules[0].departure.time)}
                  {flightSchedules[0]?.day_adjustment && `(+${flightSchedules[0]?.day_adjustment})`}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4}>
                <Typography variant='p' sx={{ fontSize: 'small' }}>
                  {total_time}
                </Typography>
                <br />
                <Typography variant='p'>
                  <img
                    src='https://icon2.cleanpng.com/20180423/phe/kisspng-airplane-aircraft-icon-a5-computer-icons-clip-art-take-5adea9052056d3.3476649315245417011325.jpg'
                    style={{ width: '20px', height: '20px' }}
                  />
                </Typography>
                <br />
                <Typography variant='p' sx={{ fontSize: 'xx-small' }}>
                  {flight_stops == 0
                    ? 'Non Stop'
                    : `${flight_stops} ${flight_stops == 1 ? 'Stop' : 'Stops'} Change Aircraft`}
                </Typography>
              </Grid>
              <Grid item xs={3} sm={3}>
                {destination[0].CITY_NAME}
                <Typography variant='h6' sx={{ fontWeight: 'bolder' }}>
                  {convertGmtTimeToBasic(flightSchedules[flightSchedules.length - 1].arrival.time)}
                  {flightSchedules[flightSchedules.length - 1]?.day_adjustment &&
                    `(+${flightSchedules[flightSchedules.length - 1]?.day_adjustment})`}
                </Typography>
              </Grid>

              <Grid item xs={2} sm={2}>
                <Button variant='contained'>Starting From {basePrice}</Button>
              </Grid>
            </Grid>
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsCongratulations
