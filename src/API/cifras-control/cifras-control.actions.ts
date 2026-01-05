// API/cifras-control/cifras-control.actions.ts
import { BaseAPI } from "@/API/BaseAPI";
import type {
  CifrasControlEmisionResponse,
  CifrasControlSiniestroResponse,
} from "@/API/generic/cifras-control";

export const CifrasControlActions = () => {
  const baseAPI = BaseAPI({
    isBase: true,
    prefix: "ws_insumos_latino/api/v1/",
    isPrivate: false,
  });

  const fetchCifrasEmision = async (): Promise<CifrasControlEmisionResponse> => {
    try {
      const response = await baseAPI.post<CifrasControlEmisionResponse>(
        "getCifrasControlEmision"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cifras control emision:", error);
      throw error;
    }
  };

  const fetchCifrasSiniestros = async (): Promise<CifrasControlSiniestroResponse> => {
    try {
      const response = await baseAPI.post<CifrasControlSiniestroResponse>(
        "getCifrasControlSiniestros"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cifras control siniestros:", error);
      throw error;
    }
  };

  return {
    fetchCifrasEmision,
    fetchCifrasSiniestros,
  };
};