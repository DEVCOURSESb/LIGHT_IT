import { AuthActions } from "@/API/auth/Auth.actions";
import type { dataCredentials, ResponseInterinal, } from "@/API/auth/Auth.interfaces";
import { useRegex } from "@/utilities/validations/useRegex";
import { AuthStore } from "@/stores/authStore";
import axios from "axios";

export const useAuth = () => {
  const regex = useRegex();
  const authActions = AuthActions();
  const authStore = AuthStore();

  const sendEmail = async (email: string): Promise<ResponseInterinal> => {
    if (!regex.isValidEmail(email.trim())) {
      return {
        success: false,
        message: "El formato del correo electrónico es inválido",
        code: 0o0,
      };
    }

    try {
      authStore.email = email;

      const response = await authActions.sendEmail(email);

      return {
        success: true,
        message:
          "Correo de verificación enviado correctamente a su correo electrónico, por favor revise su bandeja de entrada.",
        code: response.status!,
      };
    } catch (error: any) {
      let code = 0;
      if (axios.isAxiosError(error)) {
        let message: string = "";

        switch (error?.status) {
          case 400:
          case 404:
            message =
              "Solicitud inválida. Por favor, verifique los datos proporcionados.";
            code = 404;
            break;
          case 500:
            message =
              "Error del servidor. Por favor, intente nuevamente más tarde.";
            code = 500;
            break;
          case 423:
            message =
              "Ya tiene una sesión activa. Por favor, cierre sesión antes de iniciar una nueva.";
            code = 423;
            break;
          default:
            message = "Error al enviar el correo de verificación.";
        }

        return {
          success: false,
          message,
          code,
        };
      } else if (error.request) {
        // Error de red (no hubo respuesta)
        return {
          success: false,
          message: "Error de red. Por favor, verifique su conexión a internet.",
          code: 0,
        };
      }

      return {
        success: false,
        message: "Error inesperado. Por favor, intente nuevamente.",
        code: 0,
      };
    }
  };

  const sendCredentials = async (
    body: dataCredentials
  ): Promise<Partial<ResponseInterinal>> => {
    try {
      const response = await authActions.sendCredentials(body);

      authStore.login({
        email: authStore.email as string,
        password: body.password,
        token: response.data.token,
      });

      return {
        success: true,
        message: "Usuario validado correctamente",
      };
    } catch (error: any) {
      console.error("Error en el servicio:", error.response?.data);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al validar datos de usuario",
      };
    }
  };


  const logout = async (): Promise<Partial<ResponseInterinal>> => {
    try {
      const email = authStore.getEmail;
      const response = await authActions.logout(email!);

      authStore.logout();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error en logout",
      };
    }
  };

  return {
    sendEmail,
    sendCredentials,
    logout,
  };
};
