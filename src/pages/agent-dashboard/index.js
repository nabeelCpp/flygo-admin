// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import Congratulations from 'src/views/agentDashboard/Congratulations'
import HorizontalForm from 'src/views/pages/agent/bookingForm'

const AgentDashboard = () => {
  const auth = useAuth()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12}>
        <HorizontalForm />
      </Grid>
      <Grid item xs={12} md={6}>
        <Congratulations user={auth?.user} />
      </Grid>
    </Grid>
  )
}

export default AgentDashboard
