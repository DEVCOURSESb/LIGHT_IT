import { AuthStore } from '@/stores/authStore';
import axios, { type AxiosInstance } from 'axios'

interface BaseAPIOptions {
  isBase?: boolean
  prefix?: string
  isPrivate?: boolean
}

export function BaseAPI({ prefix, isPrivate = true, isBase = true }: BaseAPIOptions = {}): AxiosInstance {
  const base =  isBase ?
  import.meta.env.VITE_API_BASE :
  import.meta.env.VITE_API_BASE_8;
  const instance = axios.create({
    baseURL: `${base}${prefix ? `/${prefix}` : ''}`,
  })

  const authStore = AuthStore();

  if (isPrivate) {
    instance.interceptors.request.use(
      config => {
        const token = isBase
          ? (authStore.getTokenContratos || authStore.getToken)
          : authStore.getToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        config.headers.Accept = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        return config
      },
      error => Promise.reject(error),
    )

    instance.interceptors.response.use(
      async response => {

        if (response.status === 208) {
          const { showModalExistRow } = await import("@/utilities/catalogos/showModalExistRow");
          showModalExistRow();
        }

        return response;
      },
      async error => {
        console.log(error);        
        if (error.code === 'ERR_NETWORK') {
          const { SessionManager } = await import('@/utils/SessionManager');
          await SessionManager.handleSessionExpiration();
        }
        return Promise.reject(error);
      },
    )
  }
  return instance
}
