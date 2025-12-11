import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
export const WS = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

WS.interceptors.request.use(config => {
  const auth = useAuthStore()

  if (auth.token && !auth.isExpired) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

WS.interceptors.response.use(
  response => response,
  error => {
    const auth = useAuthStore()

    if (error.response?.status === 401) {
      auth.clearSession()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
