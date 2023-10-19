const routes = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'mdi:home-outline'
  },
  {
    title: 'Agents',
    icon: 'mdi:account-outline',
    children: [
      {
        title: 'List',
        path: '/agents/list'
      }
    ]
  },
  {
    title: 'Users',
    icon: 'material-symbols:supervisor-account-outline-rounded',
    children: [
      {
        title: 'List',
        path: '/users/list'
      }
    ]
  }
]

export default routes
