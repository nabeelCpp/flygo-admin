// ** MUI Imports
import { Grid, Card } from '@mui/material'
import { useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import Congratulations from 'src/views/agentDashboard/Congratulations'
import FlightDetail from 'src/views/agentDashboard/flightDetailModal'
import { airports } from 'src/views/pages/agent/bookingForm/airports'
import HorizontalForm from 'src/views/pages/agent/bookingForm/from'

const convertMinutesToHoursAndMinutes = minutes => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  const hoursText = hours > 0 ? hours + ' hr' + (hours > 1 ? 's' : '') : ''
  const minutesText = remainingMinutes > 0 ? remainingMinutes + ' min' + (remainingMinutes > 1 ? 's' : '') : ''

  if (hoursText && minutesText) {
    return hoursText + ' ' + minutesText
  } else {
    return hoursText || minutesText
  }
}

const convertGmtTimeToBasic = time => {
  let a = time.split('+')[0]
  let b = a.split(':')
  b.pop()
  return b.join(':')
}

const AgentDashboard = () => {
  const auth = useAuth()
  const [flights, setFlights] = useState(null)
  const [open, setOpen] = useState(false)
  // added by nabeel to capture flight details.
  const [flight, setFlight] = useState(null)

  const handleClickOpen = (details = null) => {
    setFlight(details)
    console.log(details)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 5 }}>
            <HorizontalForm setFlights={setFlights} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ display: flights? 'flex' : 'none', gap: 10, flexDirection: 'column', padding: 10 }}>
            {flights &&
              flights.itineraryGroups[0].itineraries.map(itinerary => {
                let legDescriptions = flights.itineraryGroups[0].groupDescription.legDescriptions
                let destination = airports.filter(a => a.VENDOR_CODE === legDescriptions[0].arrivalLocation)
                let origin = airports.filter(a => a.VENDOR_CODE === legDescriptions[0].departureLocation)
                let depart_date =legDescriptions[0].departureDate
                let legs = itinerary.legs
                let basePrice = `${itinerary.pricingInformation[0].fare.totalFare.baseFareCurrency} ${itinerary.pricingInformation[0].fare.totalFare.baseFareAmount}`
                let flight_stops,
                  totalMinutes,
                  flightSchedules = []
                // for oneway trip
                legs.forEach(leg => {
                  let legRef = leg.ref
                  let legDescs = flights.legDescs.filter(l => l.id === legRef)
                  let schedules = legDescs[0].schedules
                  schedules.forEach(sc => {
                    flights.scheduleDescs.filter(sD => {
                      if (sD.id === sc.ref) {
                        if (sc.departureDateAdjustment) {
                          sD = { ...sD, day_adjustment: sc.departureDateAdjustment }
                        }
                        flightSchedules.push(sD)
                      }
                    })
                  })
                  totalMinutes = legDescs[0].elapsedTime
                  flight_stops = schedules.length - 1
                })
                let data = {
                  basePrice,
                  destination,
                  origin,
                  total_time: convertMinutesToHoursAndMinutes(totalMinutes),
                  flight_stops,
                  flightSchedules,
                  depart_date
                }
                return (
                  <Grid item xs={12} md={12}>
                    <Congratulations flight={data} handleClickOpen={handleClickOpen} convertGmtTimeToBasic={convertGmtTimeToBasic} />
                  </Grid>
                )
              })}
          </Card>
        </Grid>
      </Grid>
      <FlightDetail open={open} handleClose={handleClose} flight={flight} convertMinutesToHoursAndMinutes={convertMinutesToHoursAndMinutes} convertGmtTimeToBasic={convertGmtTimeToBasic} />
    </div>
  )
}

export default AgentDashboard
