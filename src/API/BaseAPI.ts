import { AuthStore } from '@/stores/authStore';
import { DialogType, useDialog } from '@/stores/dialogStore';
import axios, { type AxiosInstance } from 'axios'
import router from '@/router';

interface BaseAPIOptions {
  isBase?: boolean
  prefix?: string
  isPrivate?: boolean
}

export function BaseAPI({ prefix, isPrivate = true, isBase = false }: BaseAPIOptions = {}): AxiosInstance {
  const base =  isBase ? import.meta.env.VITE_API_BASE : import.meta.env.VITE_API_BASE_CATALOGOS;
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
        return config
      },
      error => Promise.reject(error),
    )

     // Interceptor de Response - Manejo de errores
    instance.interceptors.response.use(
      response => response,
      async error => {
        
        // Verificar si hay una respuesta del servidor
        if (error.response) {
          const status = error.response.status;
          
          // Manejar error 403 (Forbidden) - Sin permisos o sesión bloqueada
          if (status === 403) {
            const { useAuth } = await import('@/composables/auth/useAuth');
            
            const auth = useAuth();
            
            auth.logout();
            
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
