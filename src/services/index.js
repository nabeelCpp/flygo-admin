import axios from 'axios'

// Create an instance of Axios with custom configuration
const axiosWithAuth = axios.create({
  // Define your base URL here
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
})

// Add a request interceptor to set the access token from local storage
axiosWithAuth.interceptors.request.use(
  config => {
    // Retrieve the access token from local storage
    const accessToken = localStorage.getItem('accessToken')

    // Set the access token as an Authorization header if it exists
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosWithAuth
