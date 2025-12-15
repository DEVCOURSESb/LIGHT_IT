export interface ResponseInterinal {
  success: boolean;
  message: string;
  code: number;
}

export interface dataCredentials {
  username: string;
  password: string;
  codigoVerificacion: string;
}

export interface loginSuccess {
  token: string;
}
