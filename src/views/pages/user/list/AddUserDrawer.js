// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CircularProgress from '@mui/material/CircularProgress'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { InputAdornment } from '@mui/material'
import { FadeLoader } from 'react-spinners'
import Icon from 'src/@core/components/icon'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}
import { create, getByID, update } from 'src/services/user.service'
import { toast } from 'react-hot-toast'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const defaultValues = {
  firstName: '',
  email: '',
  mobile: '',
  lastName: '',
  password: ''
}

const SidebarAddUser = props => {
  // ** Props
  const { open, toggle, fetchData, userId } = props

  // ** State
  const [error, setError] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const fetchAgentById = async id => {
    setLoading(true)
    const res = await getByID(id)
    if (res?.success) {
      setLoading(false)
      reset(res?.data)
    } else {
      setLoading(false)
      reset(defaultValues)
    }
  }
  useEffect(() => {
    if (userId) {
      fetchAgentById(userId)
    } else {
      reset(defaultValues)
    }
  }, [userId])

  const schema = yup.object().shape({
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    mobile: yup
      .string()
      .typeError('Phone Number field is required')
      .min(11, 'Phone Number must be at least 11 digits long')
      .required(),
    firstName: yup
      .string()
      .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
      .required(),
    password:
      !userId &&
      yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/,
          'Password must include at least one lowercase letter, one uppercase letter, one special character, and one number'
        )
  })

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const resetForm = () => {
    reset()
    setLoading(false)
    setError([])
  }
  function mergeSelectedKeys(...objects) {
    const mergedObject = {}

    const selectedKeys = ['firstName', 'lastName', 'email', 'mobile', 'password']

    for (const obj of objects) {
      for (const key of selectedKeys) {
        if (obj[key] && obj[key].trim() !== '') {
          mergedObject[key] = obj[key]
        }
      }
    }

    return mergedObject
  }

  const onSubmit = async data => {
    if (userId) {
      const formData = mergeSelectedKeys(data)
      setError([])
      setLoading(true)
      const res = await update(formData, userId)
      if (res?.success) {
        setLoading(false)
        toggle()
        fetchData()
        resetForm()
        toast.success(res?.message)
      } else {
        setLoading(false)
        toast.error(res?.message)
        setError(res?.response?.data?.errors)
      }
    } else {
      setError([])
      setLoading(true)
      const res = await create(data)
      if (res?.success) {
        setLoading(false)
        toggle()
        fetchData()
        resetForm()
        toast.success(res?.message)
      } else {
        setLoading(false)
        toast.error(res?.message)
        setError(res?.response?.data?.errors)
      }
    }
  }

  const handleClose = () => {
    toggle()
    resetForm()
  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '40%', md: '50%' },
          height: { sn: '100vh', md: '75vh' },
          position: 'absolute',
          left: { sm: '0%', md: '25%' }
        }
      }}
    >
      <Header>
        <Typography variant='h6'>{userId ? 'Edit User' : 'Add User'}</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      {loading && (
        <div
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 10
          }}
        >
          <FadeLoader color='#36d7b7' />
        </div>
      )}
      <Box sx={{ p: 10, position: 'relative', filter: loading ? 'blur(5px)' : 'none' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='John Doe'
                      error={Boolean(errors.firstName)}
                    />
                  )}
                />
                {errors.firstName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='lastName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Enter your lastName name'
                      error={Boolean(errors.lastName)}
                    />
                  )}
                />
                {errors.lastName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='email'
                      value={value}
                      label='Email'
                      onChange={onChange}
                      placeholder='johndoe@email.com'
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='mobile'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='text'
                      value={value}
                      label='Phone Number'
                      onChange={onChange}
                      placeholder='Phone Number'
                      error={Boolean(errors.mobile)}
                    />
                  )}
                />
                {errors.mobile && <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={showPassword ? 'text' : 'password'}
                      value={value}
                      onChange={onChange}
                      label='Password'
                      placeholder='Password'
                      error={Boolean(errors.password)}
                      autoComplete='off'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge='end'>
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <div>
            {error?.length > 0 &&
              error?.map((item, i) => {
                return (
                  <Alert severity='error' key={i}>
                    <AlertTitle style={{ textTransform: 'capitalize' }}>{item?.path}</AlertTitle>
                    {item?.msg}
                  </Alert>
                )
              })}
          </div>
          <Grid container spacing={5} sx={{ mt: 5 }}>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled={loading}
                size='large'
                onClick={handleSubmit(onSubmit)}
                variant='contained'
                sx={{ mr: 3 }}
              >
                {loading && <CircularProgress color='secondary' />}
                {userId ? 'Save' : 'Submit'}
              </Button>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
