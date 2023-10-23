import React, { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Grid, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import toast from 'react-hot-toast'
import { airports } from './airports'
import axios from 'axios'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

const BookingForm = ({ setFlights }) => {
  const today = new Date()
  const defaultDate = today.toISOString().split('T')[0]
  const [formData, setFormData] = useState({
    trip_type: 'oneway', //oneway, round
    origin: 'AHB',
    destination: 'ADB',
    depart_date: defaultDate,
    return_date: defaultDate,
    passengers: {
      adults: 0,
      children: 0,
      infants: 0
    }
  })
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [flightType, setFlightType] = useState('oneway') // Default value

  const handleFlightTypeChange = event => {
    setFlightType(event.target.value)
  }

  const handleChange = e => {
    const { name, value } = e.target
    if (name === 'passengerType') {
      const passengerType = value
      setFormData({
        ...formData,
        passengerType
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handlePassengerChange = (name, increment) => {
    setFormData(prevData => ({
      ...prevData,
      passengers: {
        ...prevData.passengers,
        [name]: Math.max(prevData.passengers[name] + increment, 0)
      }
    }))
  }

  const toggleDropdown = () => {
    setDropdownVisible(prevVisible => !prevVisible)
  }

  const handleSwapLocations = () => {
    setFormData({
      ...formData,
      origin: formData.destination,
      destination: formData.origin
    })
  }

  const isFormValid = data => {
    return (
      data.origin.trim() !== '' &&
      data.destination.trim() !== '' &&
      Object.values(data.passengers).reduce((acc, count) => acc + count, 0) > 0
    )
  }

  const handleSubmit = async data => {
    if (isFormValid(data)) {
      console.log('Form is valid, submitting data:', data)
      toast.success('Form is valid, submitting data')
      setDropdownVisible(false)
      // call to api.
      const formData = {
        ...data,
        trip_type: flightType
      }

      try {
        let response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/sabre/flights`, formData)
        let responseData = response.data
        toast.success(responseData.message)
        if (responseData.data.groupedItineraryResponse.statistics.itineraryCount === 0) {
          console.log('not found')
          toast.error('No flights Found')
        } else {
          setFlights(responseData.data.groupedItineraryResponse)
          setDropdownVisible(false)
        }
        console.log(responseData.data.groupedItineraryResponse.statistics.itineraryCount)
      } catch (error) {
        console.log(error)
        toast.error(error.response ? error.response.data.errors.map(err => <li>{err.msg}</li>) : error)
      }

      //call api end here
    } else {
      console.log('Form is not valid. Please fill in all required fields.')
      toast.error('Form is not valid. Please fill in all required fields.')
      if (data.origin.trim() !== '' && data.destination.trim() !== '') {
        setDropdownVisible(true)
      }
    }
  }

  const hasPassengers = Object.values(formData.passengers).some(count => count > 0)

  return (
    <form>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <RadioGroup
            aria-label='flight-type'
            name='flight-type'
            value={flightType}
            onChange={handleFlightTypeChange}
            row // Display radio buttons horizontally
          >
            <FormControlLabel
              value='oneway'
              control={<Radio color='primary' />} // You can change the color
              label='One Way'
            />
            <FormControlLabel
              value='round'
              control={<Radio color='primary' />} // You can change the color
              label='Round Trip'
            />
          </RadioGroup>
        </Grid>
        <Grid sx={{ display: 'flex', gap: 2 }} item xs={6} md={6}>
          <FormControl fullWidth>
            <InputLabel for='from-label'>From</InputLabel>
            <Select labelId='from-label' label='From' name='origin' value={formData.origin} onChange={handleChange}>
              {airports.slice(0, 200).map(airport => (
                <MenuItem value={airport.VENDOR_CODE}>
                  {airport.POI_NAME}, {airport.COUNTRY_CODE} ({airport.VENDOR_CODE})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={handleSwapLocations}>
            <Icon icon='material-symbols:swap-horiz' />
          </IconButton>
          <FormControl fullWidth>
            <InputLabel for='to-label'>To</InputLabel>
            <Select
              labelId='to-label'
              label='To'
              name='destination'
              value={formData.destination}
              onChange={handleChange}
            >
              {airports.slice(0, 200).map(airport => (
                <MenuItem value={airport.VENDOR_CODE}>
                  {airport.POI_NAME}, {airport.COUNTRY_CODE} ({airport.VENDOR_CODE})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            name='depart_date'
            label='Depart At'
            type='date'
            fullWidth
            value={formData.depart_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
        {flightType === 'round' && (
          <Grid item xs={6} md={3}>
            <TextField
              name='return_date'
              label='Return'
              type='date'
              fullWidth
              value={formData.return_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
        )}
        <Grid item xs={6} md={4}>
          <Button style={{ marginTop: '10px', width: 200 }} variant='outlined' onClick={toggleDropdown}>
            Select Passengers
          </Button>
          {dropdownVisible && (
            <div
              style={{
                borderRadius: '15px',
                marginTop: 20,
                paddingTop: 30,
                padding: '30px',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                position: 'relative'
              }}
            >
              <IconButton
                size='small'
                onClick={toggleDropdown}
                sx={{ color: 'text.primary', position: 'absolute', right: 2, top: 2 }}
              >
                <Icon icon='mdi:close' fontSize={20} />
              </IconButton>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Adults</p>
                <div>
                  <IconButton color='warning' onClick={() => handlePassengerChange('adults', 1)}>
                    <AddIcon />
                  </IconButton>
                  {formData.passengers.adults}
                  <IconButton color='warning' onClick={() => handlePassengerChange('adults', -1)}>
                    <RemoveIcon />
                  </IconButton>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Children</span>
                <div>
                  <IconButton color='warning' onClick={() => handlePassengerChange('children', 1)}>
                    <AddIcon />
                  </IconButton>
                  {formData.passengers.children}
                  <IconButton color='warning' onClick={() => handlePassengerChange('children', -1)}>
                    <RemoveIcon />
                  </IconButton>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Infants</span>
                <div>
                  <IconButton color='warning' onClick={() => handlePassengerChange('infants', 1)}>
                    <AddIcon />
                  </IconButton>
                  {formData.passengers.infants}
                  <IconButton color='warning' onClick={() => handlePassengerChange('infants', -1)}>
                    <RemoveIcon />
                  </IconButton>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button onClick={toggleDropdown} variant='contained' color='primary'>
                  Ok
                </Button>
              </div>
            </div>
          )}
        </Grid>
        <Grid item xs={6} md={4}>
          {hasPassengers && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 20 }}>
                <strong>Adults:</strong> {formData.passengers?.adults}
              </p>
              <p style={{ fontSize: 20 }}>
                <strong>Childrens:</strong> {formData.passengers?.children}
              </p>
              <p style={{ fontSize: 20 }}>
                <strong>Infants:</strong> {formData.passengers?.infants}
              </p>
            </div>
          )}
        </Grid>
        <Grid item xs={6} md={4}>
          <Button
            variant='contained'
            color='primary'
            style={{ marginTop: '10px', float: 'right', width: 180 }}
            onClick={() => handleSubmit(formData)} // Replace with your submit logic
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default BookingForm
