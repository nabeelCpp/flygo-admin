// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { airports } from '../pages/agent/bookingForm/airports'

const AnalyticsCongratulations = ({ flight, handleClickOpen }) => {
  const { destination, origin, total_time, flight_stops, flightSchedules, basePrice } = flight
  const convertGmtTimeToBasic = time => {
    let a = time.split('+')[0]
    let b = a.split(':')
    b.pop()
    return b.join(':')
  }

  return (
    <>
      <Card className='custom-card' sx={{ position: 'relative', backgroundColor: '#F2F4F7' }}>
        <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
          <Grid container spacing={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item xs={12} sm={4}>
              <Typography variant='h6'>
                <b>Airline Flights</b>
                <ul style={{ marginTop: 10 }}>
                  {flightSchedules.map(sch => (
                    <li style={{ fontSize: '14px' }}>
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
              <br />
              <Button variant='outlined' color='primary' onClick={handleClickOpen}>
                Flight Details
              </Button>
            </Grid>

            <Grid item xs={3} sm={2}>
              {origin[0].CITY_NAME}
              <Typography variant='h6' sx={{ fontWeight: 'bolder' }}>
                {convertGmtTimeToBasic(flightSchedules[0].departure.time)}
                {flightSchedules[0]?.day_adjustment && `(+${flightSchedules[0]?.day_adjustment})`}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='p' sx={{ fontSize: '14px' }}>
                {total_time}
              </Typography>
              <br />
              <Typography variant='p' sx={{ paddingX: '10px' }}>
                <img
                  src='https://cdn-icons-png.flaticon.com/512/7893/7893979.png'
                  style={{ width: '50px', height: '50px' }}
                />
              </Typography>
              <br />
              <Typography variant='p' sx={{ fontSize: '14px' }}>
                {flight_stops == 0
                  ? 'Non Stop'
                  : `${flight_stops} ${flight_stops == 1 ? 'Stop' : 'Stops'} Change Aircraft`}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
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
        </CardContent>
      </Card>
    </>
  )
}

export default AnalyticsCongratulations
