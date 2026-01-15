import { BaseAPI } from "@/API/BaseAPI";
import type { TipoReaseguro } from "./tipo-reaseguro.interfaces";

export const TipoReaseguroActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntTipoReaseguroRest/" });

  const fetchTipoReaseguro = async (): Promise<TipoReaseguro[]> => {
    try {
      const response = await baseAPI.post<TipoReaseguro[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoReaseguro:", error);
      throw error;
    }
  };

  const createTipoReaseguro = async (data: Partial<TipoReaseguro>): Promise<TipoReaseguro[]> => {
    try {
      const response = await baseAPI.post<TipoReaseguro[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoReaseguro:", error);
      throw error;
    }
  };

  const updateTipoReaseguro = async (data: Partial<TipoReaseguro>): Promise<TipoReaseguro[]> => {
    try {
      const response = await baseAPI.put<TipoReaseguro[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoReaseguro:", error);
      throw error;
    }
  };

  const deleteTipoReaseguro = async (id: number): Promise<TipoReaseguro[]> => {
    try {
      const response = await baseAPI.delete<TipoReaseguro[]>(`deleteRecord/${id}`);
    return response.data;
    } catch (error) {
      console.error("Error deleting TipoReaseguro:", error);
      throw error;
    }
  };

  return {
    fetchTipoReaseguro,
    createTipoReaseguro,
    updateTipoReaseguro,
    deleteTipoReaseguro,
  };
};
