import { API, WS } from "@/plugins/axios";
import { BaseAPI } from "../BaseAPI";
import type { AxiosError } from "axios";
import axios from "axios";

export function AuthActions() {
  const baseAPI = BaseAPI({
    prefix: "api_gateway_reaseguro/api/v1/AuthRest",
    isPrivate: false,
  });

  const sendEmail = async (
    correoElectronico: string
  ): Promise<{ success: boolean; message: string; code: number }> => {
    try {
      const correo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        correoElectronico.trim()
      );

      if (!correo) {
        return {
          success: false,
          message: "El formato del correo electrónico es inválido",
          code: 0o0,
        };
      }

      const response = await baseAPI.post(`/sendMail/${correoElectronico}`);

      return {
        success: true,
        message:
          "Correo de verificación enviado correctamente a su correo electrónico, por favor revise su bandeja de entrada.",
        code: response.status,
      };
    } catch (error: Error | AxiosError | any) {
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

  const validarUsuario = async (
    usuario: string,
    password: string,
    codigo: string
  ) => {
    try {
      const body = { username: usuario, password, codigoVerificacion: codigo };
      console.log("ENVIANDO:", body);
      const response = await WS.post(`/auth/login`, body);

      return {
        success: response.data.success,
        message: response.data.message,
        usuario,
        correoElectronico: response.data.correoElectronico,
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

  const verificarCodigo = async (correoElectronico: string, codigo: string) => {
    try {
      const body = { correoElectronico, codigoVerificacion: codigo };
      const response = await API.post(`/auth/login`, body);

      return {
        success: response.data.success,
        token: response.data.token,
        expiresIn: response.data.expiresIn,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Código inválido",
      };
    }
  };

  const logoutUsuario = async (correoElectronico: string) => {
    try {
      const response = await API.post(`/AuthRest/logout/${correoElectronico}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Error en logout",
      };
    }
  };

  return {
    validarCorreo: sendEmail,
    validarUsuario,
    verificarCodigo,
    logoutUsuario,
  };
}
