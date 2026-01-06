// API/siniestros/siniestros.actions.ts
import { BaseAPI } from "@/API/BaseAPI";
import type { SiniestroResponse } from "@/API/generic/carga-archivos";

interface TransformacionResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra?: any;
}

export const SiniestrosActions = () => {
  const baseAPI = BaseAPI({
    isBase: false,
    prefix: "ws_insumos_latino/api/v1/",
    isPrivate: false,
  });

  const fetch = async (): Promise<SiniestroResponse> => {
    try {
      const response = await baseAPI.post<SiniestroResponse>(
        "getSiniestrosCount"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching siniestros:", error);
      throw error;
    }
  };

  const upload = async (formData: FormData): Promise<SiniestroResponse> => {
    try {
      const response = await baseAPI.post<SiniestroResponse>(
        "uploadSiniestros",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading siniestros:", error);
      throw error;
    }
  };

  const transform = async (anio: number, mes: number): Promise<TransformacionResponse> => {
    try {
      const response = await baseAPI.post<TransformacionResponse>(
        "transformSiniestrosToContable",
        { anio, mes },
        {
          timeout: 300000,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error transforming siniestros:", error);
      throw error;
    }
  };

  return {
    fetch,
    upload,
    transform,
  };
};
