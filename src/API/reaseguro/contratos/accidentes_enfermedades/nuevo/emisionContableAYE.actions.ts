import { BaseAPI } from "@/API/BaseAPI";
import type { EmisionContableAYE } from "./emision_contable_AYE.interface";

export const emisionCobtableAYEActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_reaseguro_contratos_aye/api/v1/EmisionContableAyERest/getPolizasByFecContrato",
  });

  const fetch = async (f_inicio: Date, f_fin: Date): Promise<EmisionContableAYE[]> => {
    try {
      const response = await baseAPI.post<number[]>("", {
        fechaInicioContrato: f_inicio,
        fechaFinContrato: f_fin,
      });
      return response.data.map((item: number) => ({
        NUM_POLIZA: item,
      }));
    } catch (error) {
      console.error("Error fetching emision contable AYE:", error);
      throw error;
    }
  };

  return {
    fetch,
  };
};
