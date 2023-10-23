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

const AgentDashboard = () => {
  const auth = useAuth()
  const [flights, setFlights] = useState(null)
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <di>
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
                let legs = itinerary.legs
                let basePrice = `${itinerary.pricingInformation[0].fare.totalFare.baseFareCurrency} ${itinerary.pricingInformation[0].fare.totalFare.baseFareAmount}`
                let flight_stops,
                  totalMinutes,
                  flightSchedules = []
                // for oneway trip
                legs.forEach(leg => {
                  let legRef = leg.ref
                  let legDescs = flights.legDescs.filter(l => l.id === legRef)
                  console.log(legDescs)
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
                  flightSchedules
                }
                return (
                  <Grid item xs={12} md={12}>
                    <Congratulations flight={data} handleClickOpen={handleClickOpen} />
                  </Grid>
                )
              })}
          </Card>
        </Grid>
      </Grid>
      <FlightDetail open={open} handleClose={handleClose} />
    </di>
  )
}

export default AgentDashboard
