// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FileCopyIcon from '@mui/icons-material/FileCopy'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CircularProgress from '@mui/material/CircularProgress'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { InputAdornment, OutlinedInput } from '@mui/material'
import { FadeLoader } from 'react-spinners'

// ** Icon Imports
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
import CloseIcon from '@mui/icons-material/Close'
import { addDocument, create, getByID, removeDocument, update, updateLogo } from 'src/services/agent.service'
import { toast } from 'react-hot-toast'
import { Divider } from '@mui/material'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const defaultValues = {
  representativeName: '',
  email: '',
  mobile: '',
  landline: '',
  country: '',
  city: '',
  companyName: '',
  akama: '',
  creditLimit: '',
  password: '',
  travelAgentId: '',
  serviceCharges: '',
  serviceChargesType: ''
}

const SidebarAddUser = props => {
  // ** Props
  const { open, toggle, fetchData, agentId } = props

  // ** State
  const [companyLogo, setLogo] = useState(null)
  const [image, setImage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [error, setError] = useState([])
  const [logoError, setLogoError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const fetchAgentById = async id => {
    setLoading(true)
    const res = await getByID(id)
    if (res?.success) {
      setLoading(false)
      reset(res?.data)
      setImage(res?.data?.logo)
      setSelectedFiles(res?.data?.AgentDocuments)
    } else {
      setLoading(false)
      reset(defaultValues)
    }
  }
  useEffect(() => {
    if (agentId) {
      fetchAgentById(agentId)
    } else {
      reset(defaultValues)
    }
  }, [agentId])

  const schema = yup.object().shape({
    companyName: yup.string().required(),
    akama: yup.string().required(),
    country: yup.string().required(),
    city: yup.string().required(),
    email: yup.string().email().required(),
    travelAgentId: yup.string().required(),
    serviceCharges: yup.number().required(),
    serviceChargesType: yup.string().required(),
    creditLimit: yup.string().required(),
    mobile: yup
      .string()
      .typeError('Phone Number field is required')
      .min(11, 'Phone Number must be at least 11 digits long')
      .required(),
    landline: yup
      .number()
      .typeError('Phone Number field is required')
      .min(10, obj => showErrors('Landline Number', obj.value.length, obj.min))
      .required(),
    representativeName: yup
      .string()
      .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
      .required(),
    password:
      !agentId &&
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
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const resetForm = () => {
    reset()
    setImage('')
    setLogo(null)
    setError([])
    setLoading(false)
    setSelectedFiles([])
  }

  const onSubmit = async data => {
    if (agentId) {
      delete data?.AgentDocuments
      delete data?.id

      setError([])
      setLoading(true)
      const res = await update(data, agentId)
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
      if (companyLogo) {
        const formData = new FormData()

        for (const key in data) {
          formData.append(key, data[key])
        }

        formData.append('logo', companyLogo)
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('documents', selectedFiles[i])
        }
        formData.append('status', 1)
        setError([])
        setLoading(true)
        const res = await create(formData)
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
        setLogoError('Please upload a Logo of Company')
      }
    }
  }

  const handleClose = () => {
    toggle()
    resetForm()
  }
  const classes = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    avatar: {
      width: 150,
      height: 150
    },
    input: {
      display: 'none'
    }
  }

  const handleImageChange = async event => {
    const file = event.target.files[0]
    if (agentId) {
      const formData = new FormData()
      formData.append('logo', file)
      setLoading(true)
      const res = await updateLogo(formData, agentId)
      if (res?.success) {
        setLoading(false)
        setImage(res?.data?.logo)
        toast.success('Logo updated Successfull')
      } else {
        setLoading(false)
        toast.error('Server Error: Try again')
      }
    } else {
      if (file) {
        setLogo(file)
        setLogoError('')
        const reader = new FileReader()
        reader.onload = () => {
          setImage(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
  }
  const handleFileChange = async e => {
    if (agentId) {
      const formData = new FormData()
      formData.append('documents', e.target.files['0'])
      setLoading(true)
      const res = await addDocument(agentId, formData)
      if (res?.success) {
        setLoading(false)
        const files = Array.from(e.target.files)
        setSelectedFiles([...selectedFiles, ...files])
      }
    } else {
      const files = Array.from(e.target.files)
      setSelectedFiles([...selectedFiles, ...files])
    }
  }
  const handleRemoveFile = index => {
    const updatedFiles = [...selectedFiles]
    updatedFiles.splice(index, 1)
    setSelectedFiles(updatedFiles)
  }
  const handleDeleteDocument = async (index, documentId) => {
    if (agentId) {
      setLoading(true)
      const res = await removeDocument(agentId, documentId)
      if (res?.success) {
        setLoading(false)
        const updatedFiles = [...selectedFiles]
        updatedFiles.splice(index, 1)
        setSelectedFiles(updatedFiles)
      }
    }
  }
  return (
    <Drawer
      open={open}
      anchor='left'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400, md: '70%' }, position: 'relative' } }}
    >
      <Header>
        <Typography variant='h6'>{agentId ? 'Edit Agent' : 'Add Agent'}</Typography>
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
                  name='representativeName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Full Name'
                      onChange={onChange}
                      placeholder='John Doe'
                      error={Boolean(errors.representativeName)}
                    />
                  )}
                />
                {errors.representativeName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.representativeName.message}</FormHelperText>
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
                  name='landline'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      value={value}
                      label='Landline'
                      onChange={onChange}
                      placeholder='Landline Number'
                      error={Boolean(errors.landline)}
                    />
                  )}
                />
                {errors.landline && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.landline.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='country'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Country'
                      onChange={onChange}
                      placeholder='Country Name'
                      error={Boolean(errors.country)}
                    />
                  )}
                />
                {errors.country && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='city'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='City'
                      onChange={onChange}
                      placeholder='Enter your city name'
                      error={Boolean(errors.city)}
                    />
                  )}
                />
                {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid container spacing={10}>
              <Grid item xs={12} md={6}>
                <Paper>
                  <div className={classes.root}>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      {image ? (
                        <>
                          <IconButton
                            sx={{ position: 'absolute', right: 0, top: 0, width: 50, height: 50 }}
                            onClick={handleRemoveImage}
                            color='secondary'
                          >
                            <DeleteIcon sx={{ color: 'red', fontSize: 30 }} />
                          </IconButton>
                          <Avatar
                            src={image}
                            alt='Uploaded'
                            style={{
                              width: '200px',
                              height: '200px',
                              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                            }}
                          />
                          <Typography>{companyLogo?.name}</Typography>
                        </>
                      ) : (
                        <Box sx={{ mt: 10 }}>
                          <label>
                            <input
                              accept='image/*'
                              // className={classes.input}
                              id='image-upload'
                              type='file'
                              onChange={handleImageChange}
                              hidden
                            />
                            <p style={{ textAlign: 'center' }}>Upload Logo</p>
                            <Avatar
                              alt='Uploaded'
                              style={{ width: '175px', height: '175px', cursor: 'pointer' }}
                              src='https://dieselpunkcore.com/wp-content/uploads/2014/06/logo-placeholder.png'
                            />
                          </label>
                          {logoError && (
                            <Alert severity='error'>
                              {/* <AlertTitle>Error</AlertTitle> */}
                              {logoError}
                            </Alert>
                          )}
                        </Box>
                      )}
                    </Box>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='companyName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Company Name'
                        onChange={onChange}
                        placeholder='Enter your Company Name'
                        error={Boolean(errors.companyName)}
                      />
                    )}
                  />
                  {errors.companyName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.companyName.message}</FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='akama'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Akam / NIC'
                        onChange={onChange}
                        placeholder='Akama / NIC'
                        error={Boolean(errors.akama)}
                      />
                    )}
                  />
                  {errors.akama && <FormHelperText sx={{ color: 'error.main' }}>{errors.akama.message}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='creditLimit'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Credit Limit'
                        onChange={onChange}
                        placeholder='Credit Limit'
                        error={Boolean(errors.creditLimit)}
                      />
                    )}
                  />
                  {errors.creditLimit && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.creditLimit.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='password'
                  control={control}
                  // rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type={showPassword ? 'text' : 'password'}
                      value={value}
                      onChange={onChange}
                      label='Password'
                      placeholder='Password'
                      error={Boolean(errors.password)}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='travelAgentId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Travel AgentId'
                      onChange={onChange}
                      placeholder='Enter Travel AgentId'
                      error={Boolean(errors.travelAgentId)}
                    />
                  )}
                />
                {errors.travelAgentId && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.travelAgentId.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='serviceCharges'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='number'
                      value={value}
                      label='Service Charges'
                      onChange={onChange}
                      placeholder='Service Charges'
                      error={Boolean(errors.serviceCharges)}
                    />
                  )}
                />
                {errors.serviceCharges && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.serviceCharges.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <InputLabel htmlFor='travel-agent-select'>Service Charges Type</InputLabel>
                <Controller
                  name='serviceChargesType'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='Travel AgentId'
                      onChange={onChange}
                      placeholder='Select Travel AgentId'
                      error={Boolean(errors.serviceChargesType)}
                      id='travel-agent-select'
                    >
                      <MenuItem value='F'>Flat</MenuItem>
                      <MenuItem value='P'>Percentage</MenuItem>
                    </Select>
                  )}
                />
                {errors.serviceChargesType && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.serviceChargesType.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography>Upload Documents</Typography>
              <Divider />
            </Grid>
            <Grid container spacing={5}>
              {!agentId
                ? selectedFiles.map((file, index) => (
                    <Grid key={index} item xs={6} md={3} sx={{ position: 'relative' }}>
                      <Card
                        style={{
                          width: '100%',
                          height: 130,
                          margin: '8px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <CardContent>
                          {file.type.startsWith('image/') ? (
                            <img
                              alt={file.name}
                              style={{ height: 60, width: '100%' }}
                              src={URL.createObjectURL(file)}
                            />
                          ) : (
                            <FileCopyIcon style={{ fontSize: 80 }} />
                          )}
                          <Typography variant='body2' color='textSecondary'>
                            <Box
                              component='div'
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                '-webkit-line-clamp': 2, // Number of lines to display
                                '-webkit-box-orient': 'vertical',
                                display: '-webkit-box',
                                maxHeight: '2.4em' // Adjust based on your font size and line height
                              }}
                            >
                              {file.name}
                            </Box>
                          </Typography>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: -30,
                              color: 'red',
                              cursor: 'pointer',
                              fontSize: 30
                            }}
                            color='secondary'
                            onClick={() => handleRemoveFile(index)}
                          >
                            <DeleteIcon sx={{ color: 'red', fontSize: 25, cursor: 'pointer' }} />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                : selectedFiles.map((file, index) => (
                    <Grid key={index} item xs={6} md={3} sx={{ position: 'relative' }}>
                      <Card
                        style={{
                          width: '100%',
                          height: 130,
                          margin: '8px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <CardContent>
                          <img alt={file.name} style={{ height: 60, width: '100%' }} src={file?.url} />

                          <Typography variant='body2' color='textSecondary'>
                            <Box
                              component='div'
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                '-webkit-line-clamp': 2, // Number of lines to display
                                '-webkit-box-orient': 'vertical',
                                display: '-webkit-box',
                                maxHeight: '2.4em' // Adjust based on your font size and line height
                              }}
                            >
                              {file.name}
                            </Box>
                          </Typography>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: -30,
                              color: 'red',
                              cursor: 'pointer',
                              fontSize: 30
                            }}
                            color='secondary'
                            onClick={() => handleDeleteDocument(index, file?.id)}
                          >
                            <DeleteIcon sx={{ color: 'red', fontSize: 25, cursor: 'pointer' }} />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <input type='file' id='file-input' multiple onChange={handleFileChange} style={{ display: 'none' }} />
              <label htmlFor='file-input'>
                <Button variant='contained' color='primary' component='span' startIcon={<CloudUploadIcon />}>
                  Upload Files
                </Button>
              </label>
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
                {agentId ? 'Save' : 'Submit'}
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
