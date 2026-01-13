import { BaseAPI } from "@/API/BaseAPI";
import type { TipoCaptura } from "./tipo-captura.interfaces";

export const TipoCapturaActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfRr6TipoCapturaRest/" });

  const fetchTipoCapturas = async (): Promise<TipoCaptura[]> => {
    try {
      const response = await baseAPI.post<TipoCaptura[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoCapturas:", error);
      throw error;
    }
  };

  const createTipoCaptura = async (data: Partial<TipoCaptura>): Promise<TipoCaptura[]> => {
    try {
      const response = await baseAPI.post<TipoCaptura[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoCaptura:", error);
      throw error;
    }
  };

  const updateTipoCaptura = async (data: Partial<TipoCaptura>): Promise<TipoCaptura[]> => {
    try {
      const response = await baseAPI.put<TipoCaptura[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoCaptura:", error);
      throw error;
    }
  };

  const deleteTipoCaptura = async (id: number): Promise<TipoCaptura[]> => {
    try {
      const response = await baseAPI.delete<TipoCaptura[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting TipoCaptura:", error);
      throw error;
    }
  };

  return {
    fetchTipoCapturas,
    createTipoCaptura,
    updateTipoCaptura,
    deleteTipoCaptura,
  };
};
