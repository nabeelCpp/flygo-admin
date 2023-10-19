import { useEffect } from 'react'
import authConfig from 'src/configs/auth'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

import useBgColor from 'src/@core/hooks/useBgColor'
import { Icon } from '@iconify/react'

const RoleSelect = ({ role, setRole }) => {
  const bgColors = useBgColor()

  // useEffect(() => {
  //   setRole(authConfig.roles[0].role)
  // }, [])

  return (
    <Box sx={{ my: 5 }}>
      <Typography sx={{ my: 1 }}>Select Role</Typography>
      <Grid container spacing={2}>
        {authConfig?.roles?.map(r => {
          return (
            <Grid item xs={6}>
              <Box
                sx={{
                  py: 3,
                  px: 4,
                  borderRadius: 1,
                  cursor: 'pointer',
                  ...bgColors.primaryLight,
                  border: theme =>
                    role === r.role ? `3px solid ${theme.palette.primary.main}` : '1px solid transparent'
                }}
                onClick={() => setRole(r.role)}
              >
                <Box sx={{ p: 0, mb: 1, display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
                  <Icon icon={r.role === 'admin' ? 'mdi:home-outline' : 'mdi:account-outline'} fontSize='large' />
                  <Typography variant='p' sx={{ color: 'primary.main' }}>
                    {r.displayName}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default RoleSelect
