export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/admin/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  admin: {
    meEndpoint: '/auth/me',
    loginEndpoint: '/admin/login',
    homeRoute: '/dashboard',
    registerEndpoint: '/jwt/register',
    storageTokenKeyName: 'accessToken',
    onTokenExpiration: 'refreshToken' // logout | refreshToken
  },
  agent: {
    meEndpoint: '/auth/me',
    loginEndpoint: '/agent/login',
    homeRoute: '/agent-dashboard',
    registerEndpoint: '/jwt/register',
    storageTokenKeyName: 'accessToken',
    onTokenExpiration: 'refreshToken' // logout | refreshToken
  },
  roles: [
    { role: 'admin', displayName: 'Admin' },
    {
      role: 'agent',
      displayName: 'Agent'
    }
  ]
}
