import { BaseAPI } from "@/API/BaseAPI";
import type { TipoContrato } from "./tipos-contrato.interfaces";

export const TiposContratoActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintTipoContratoRest/" });

  const fetchTipoContratos = async (): Promise<TipoContrato[]> => {
    try {
      const response = await baseAPI.post<TipoContrato[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TiposContrato:", error);
      throw error;
    }
  };

  const createTipoContrato = async (data: Partial<TipoContrato>): Promise<TipoContrato[]> => {
    try {
      const response = await baseAPI.post<TipoContrato[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoContrato:", error);
      throw error;
    }
  };

  const updateTipoContrato = async (data: Partial<TipoContrato>): Promise<TipoContrato[]> => {
    try {
      const response = await baseAPI.put<TipoContrato[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoContrato:", error);
      throw error;
    }
  };

  const deleteTipoContrato = async (id: number): Promise<TipoContrato[]> => {
    try {
      const response = await baseAPI.delete<TipoContrato[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting TipoContrato:", error);
      throw error;
    }
  };

  return {
    fetchTipoContratos,
    createTipoContrato,
    updateTipoContrato,
    deleteTipoContrato,
  };
};
