// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import Congratulations from 'src/views/dashboards/Congratulations'

const Dashboard = () => {
  const auth = useAuth()
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <Congratulations user={auth?.user} />
      </Grid>
    </Grid>
  )
}

export default Dashboard
