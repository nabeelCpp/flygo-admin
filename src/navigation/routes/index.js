import adminRoutes from './admin.routes'
import agentRoutes from './agent.routes'

const getRoutes = (role = '') => {
  switch (role.toLowerCase()) {
    case 'admin':
      return adminRoutes
    case 'agent':
      return agentRoutes
    default:
      return []
  }
}

export default getRoutes
