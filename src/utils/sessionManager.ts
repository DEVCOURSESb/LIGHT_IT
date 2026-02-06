let isHandlingSessionExpiration = false;
let sessionExpirationPromise: Promise<void> | null = null;

export const SessionManager = {
  async handleSessionExpiration(): Promise<void> {
    // Si ya se está manejando, retornar la promesa existente
    if (isHandlingSessionExpiration && sessionExpirationPromise) {
      return sessionExpirationPromise;
    }

    isHandlingSessionExpiration = true;

    sessionExpirationPromise = (async () => {
      try {
        const { useAuth } = await import('@/composables/auth/useAuth');
        const { AuthStore } = await import('@/stores/authStore');
        const { queryClient } = await import('@/main'); // 👈 Importar directamente
        const { DialogType, useDialog } = await import('@/stores/dialogStore');
        const router = (await import('@/router')).default;

        const auth = useAuth();
        const authStore = AuthStore();
        const dialog = useDialog();

        // Verificar autenticación antes de proceder
        if (!authStore.checkAuth()) {
          return;
        }

        // Cerrar sesión
        await auth.logout();

        // Limpiar queries usando la instancia directa
        queryClient.clear();

        // Mostrar diálogo
        dialog.show({
          title: 'Sesión expirada',
          message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          type: DialogType.ERROR,
        });

        // Redireccionar
        setTimeout(() => {
          dialog.cerrar();
          router.replace({ path: "/" });
        }, 800);
      } finally {
        // Resetear después de 2 segundos
        setTimeout(() => {
          isHandlingSessionExpiration = false;
          sessionExpirationPromise = null;
        }, 2000);
      }
    })();

    return sessionExpirationPromise;
  },

  reset() {
    isHandlingSessionExpiration = false;
    sessionExpirationPromise = null;
  }
};