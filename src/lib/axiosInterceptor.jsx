import axios from 'axios'

const axiosHandler = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API
})

axiosHandler.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export default axiosHandler
