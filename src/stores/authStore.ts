import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface AuthState {
  token: string | null;
  email: string | null;
  password: string | null;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  token: string;
}

export const AuthStore = defineStore("auth", () => {
  // Estado
  const token = ref<string | null>(localStorage.getItem("token"));
  const email = ref<string | null>(localStorage.getItem("email"));
  const password = ref<string | null>(null);
  const isAuthenticated = ref<boolean>(!!localStorage.getItem("token"));

  // Getters
  const getToken = computed<string | null>(() => token.value);
  const getEmail = computed<string | null>(() => email.value);
  const isLoggedIn = computed<boolean>(() => isAuthenticated.value);

  // Actions
  const login = (credentials: LoginCredentials): void => {
    token.value = credentials.token;
    email.value = credentials.email;
    password.value = credentials.password;
    isAuthenticated.value = true;

    // Guardar en localStorage (excepto password)
    localStorage.setItem("token", credentials.token);
    localStorage.setItem("email", credentials.email);
  };

  const logout = (): void => {
    token.value = null;
    email.value = null;
    password.value = null;
    isAuthenticated.value = false;

    // Limpiar localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  const updateToken = (newToken: string): void => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  const checkAuth = (): boolean => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      token.value = storedToken;
      email.value = localStorage.getItem("email");
      isAuthenticated.value = true;
      return true;
    }
    return false;
  };

  return {
    // Estado
    token,
    email,
    password,
    isAuthenticated,
    // Getters
    getToken,
    getEmail,
    isLoggedIn,
    // Actions
    login,
    logout,
    updateToken,
    checkAuth,
  };
});
