import { BaseAPI } from "../BaseAPI";
import type { AxiosError, AxiosResponse } from "axios";
import type { dataCredentials, loginSuccess } from "./Auth.interfaces";

export function AuthActions() {
  const baseAPI = BaseAPI({
    prefix: "api_gateway_reaseguro/api/v1/AuthRest",
    isPrivate: false,
    isBase: true,
  });

  const sendEmail = async (correoElectronico: string): Promise<AxiosResponse | AxiosError> => {
    try {
      const response = await baseAPI.post(`/sendMail/${correoElectronico}`);
      return response;
    } catch (error: Error | AxiosError | any) {
      throw error;
    }
  };

  const sendCredentials = async (body: dataCredentials) => {
    try {
      return await baseAPI.post<loginSuccess>(`/login/catReaseg`, body);
    } catch (error: any) {
      throw error;
    }
  };


  const logout = async (email: string) => {
    try {
      return await baseAPI.post(`/logout/${email}`);
    } catch (error: any) {
      throw error;
    }
  };

  return {
    sendEmail,
    sendCredentials,
    logout,
  };
}
