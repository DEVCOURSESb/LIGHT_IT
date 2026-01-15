import { AuthStore } from '@/stores/authStore';
import { DialogType, useDialog } from '@/stores/dialogStore';
import axios, { type AxiosInstance } from 'axios'
import router from '@/router';

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
  const dialog = useDialog();

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
      response => response,
      async error => {
        console.log(error)
        if (error.code === 'ERR_NETWORK') {

            const { useAuth } = await import('@/composables/auth/useAuth');

            const auth = useAuth();

            await auth.logout();

            dialog.show({
              title: 'Sesión expirada',
              message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
              type: DialogType.ERROR,
            });

            setTimeout(() => {
              dialog.cerrar();
              router.replace({ path: "/" });
            }, 800);

        }
        return Promise.reject(error)
      },
    )
  }
  return instance
}
