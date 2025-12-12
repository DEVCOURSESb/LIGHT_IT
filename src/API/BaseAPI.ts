import { AuthStore } from '@/stores/authStore';
import { DialogType, useDialog } from '@/stores/dialogStore';
import axios, { type AxiosInstance } from 'axios'
import router from '@/router';

interface BaseAPIOptions {
  prefix?: string
  isPrivate?: boolean
}
 const accessToken = window.localStorage.getItem("token");
console.log(accessToken);

export function BaseAPI({ prefix, isPrivate = true }: BaseAPIOptions = {}): AxiosInstance {
  const base = import.meta.env.VITE_API_BASE
  const instance = axios.create({
    baseURL: `${base}${prefix ? `/${prefix}` : ''}`,
  })

  const authStore = AuthStore();
  const dialog = useDialog();

  if (isPrivate) {
    instance.interceptors.request.use(
      config => {
        const token = authStore.getToken;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        config.headers.Accept = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        console.log('Request Headers:', config.headers);
        return config
      },
      error => Promise.reject(error),
    )

     // Interceptor de Response - Manejo de errores
    instance.interceptors.response.use(
      response => response,
      error => {
        
        // Verificar si hay una respuesta del servidor
        if (error.response) {
          const status = error.response.status;
          
          // Manejar error 403 (Forbidden) - Sin permisos o sesión bloqueada
          if (status === 403) {
            authStore.logout();
            
            dialog.show({
              title: 'Acceso denegado',
              message: 'Tu sesión ha sido bloqueada o no tienes permisos. Por favor, inicia sesión nuevamente.',
              type: DialogType.ERROR,
            });
            
            setTimeout(() => {
              dialog.cerrar();
              router.push('/');
            }, 2000);
          }
          
          // Manejar error 401 (Unauthorized) - Token expirado o inválido
          if (status === 401) {
            authStore.logout();
            
            dialog.show({
              title: 'Sesión expirada',
              message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
              type: DialogType.ERROR,
            });
            
            setTimeout(() => {
              dialog.cerrar();
              router.push('/');
            }, 2000);
          }
        }
        
        return Promise.reject(error)
      },
    )
  }

  return instance
}
