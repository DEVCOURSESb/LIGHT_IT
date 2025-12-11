import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    correoElectronico: null as string | null,
    expiresAt: null as number | null,
  }),

  actions: {
    setSession (token: string, correo: string, durationMin: number) {
      this.token = token
      this.correoElectronico = correo
      this.expiresAt = Date.now() + durationMin * 60 * 1000

      sessionStorage.setItem('session', JSON.stringify(this.$state))
    },

    loadSession () {
      const saved = sessionStorage.getItem('session')
      if (saved) {
        Object.assign(this, JSON.parse(saved))

        if (this.expiresAt && Date.now() > this.expiresAt) {
          this.clearSession()
        }
      }
    },

    clearSession () {
      this.token = null
      this.correoElectronico = null
      this.expiresAt = null
      sessionStorage.removeItem('session')
    },
  },

  getters: {
    isExpired (state) {
      return state.expiresAt !== null && Date.now() > state.expiresAt
    },
    isAuthenticated (): boolean {
      return this.token !== null && !this.isExpired
    },
  },
})
