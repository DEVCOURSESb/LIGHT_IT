import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface AuthState {
  token: string | null;
  tokenContratos: string | null;
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
  const token = ref<string | null>(localStorage.getItem("token"));
  const tokenContratos = ref<string | null>(
  localStorage.getItem("tokenContratos")
  );
  const email = ref<string | null>(localStorage.getItem("email"));
  const password = ref<string | null>(null);
  const isAuthenticated = ref<boolean>(!!localStorage.getItem("token"));

  const getToken = computed<string | null>(() => token.value);
  const getTokenContratos = computed<string | null>(() => tokenContratos.value);
  const getEmail = computed<string | null>(() => email.value);
  const isLoggedIn = computed<boolean>(() => isAuthenticated.value);

  const login = (credentials: LoginCredentials): void => {
    token.value = credentials.token;
    email.value = credentials.email;
    password.value = credentials.password;
    isAuthenticated.value = true;

    localStorage.setItem("token", credentials.token);
    localStorage.setItem("email", credentials.email);
  };
  const loginContratos = (newToken: string): void => {
    tokenContratos.value = newToken;
    localStorage.setItem("tokenContratos", newToken);
  };


  const logout = (): void => {
    token.value = null;
    tokenContratos.value = null;
    email.value = null;
    password.value = null;
    isAuthenticated.value = false;

    localStorage.removeItem("token");
    localStorage.removeItem("tokenContratos");
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
    token,
    tokenContratos,
    email,
    password,
    isAuthenticated,
    getToken,
    getTokenContratos,
    getEmail,
    isLoggedIn,
    login,
    loginContratos,
    logout,
    updateToken,
    checkAuth,
  };
});
