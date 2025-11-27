import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthActions } from '@/API/user/UserActions'

const TOKEN_KEY = 'auth_token'
const USER_VERIFIED_KEY = 'user_verified'

export function useAuth() {
  const { loginUser, verifyCode } = AuthActions()
  const router = useRouter()

  const isAuthenticated = ref(!!localStorage.getItem(TOKEN_KEY))
  const isVerified = ref(localStorage.getItem(USER_VERIFIED_KEY) === 'true')

  const isLoading = ref(false)
  const error = ref('')

  const login = async (email: any, password: any) => {
    try {
      const user = await loginUser(email, password)

      localStorage.setItem(TOKEN_KEY, 'temp-logged-in')
      isAuthenticated.value = true
      localStorage.removeItem(USER_VERIFIED_KEY)
      isVerified.value = false

      router.push('/autenticacion')
    } catch {
      //
    } finally {
      isLoading.value = false
    }
  }

  const verify = async (inputCode) => {
    try {
      await verifyCode(inputCode, sessionStorage.getItem('auth_temp_code'))

      localStorage.setItem(USER_VERIFIED_KEY, 'true')
      isVerified.value = true
      sessionStorage.removeItem('auth_temp_code')

      router.push('/home')
    } catch {
      //
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_VERIFIED_KEY)
    isAuthenticated.value = false
    isVerified.value = false
    router.push('/')
  }

  return {
    isAuthenticated,
    isVerified,
    login,
    verify,
    logout,
  }
}
