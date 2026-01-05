// API/emision/emision.actions.ts
import { BaseAPI } from "@/API/BaseAPI";
import type { EmisionResponse } from "@/API/generic/carga-archivos";


interface TransformacionResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra?: any;
}

export const EmisionActions = () => {
  const baseAPI = BaseAPI({
    isBase: true,
    prefix: "ws_insumos_latino/loads/v1/",
    isPrivate: false,
  });

  const fetch = async (): Promise<EmisionResponse[]> => {
    try {
      const response = await baseAPI.post<EmisionResponse[]>("getEmisionCount");
      return response.data;
    } catch (error) {
      console.error("Error fetching emisiones:", error);
      throw error;
    }
  };

  const upload = async (formData: FormData): Promise<EmisionResponse> => {
    try {
      const response = await baseAPI.post<EmisionResponse>("uploadEmision", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000, // 5 minutos para archivos grandes
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading emision:", error);
      throw error;
    }
  };

   const transform = async (anio: number, mes: number): Promise<TransformacionResponse> => {
    try {
      const response = await baseAPI.post<TransformacionResponse>(
        "transformEmisionToContable",
        { anio, mes },
        {
          timeout: 300000, // 5 minutos para transformaciones grandes
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error transforming emision:", error);
      throw error;
    }
  };

  return {
    fetch,
    upload,
    transform,
  };
};