import { BaseAPICatalogos } from "@/API/BaseAPICatalogos";
import type { TipoReaseguro } from "./tipo-reaseguro.interfaces";

export const TipoReaseguroActions = () => {
  const baseAPI = BaseAPICatalogos({ prefix: "ReasegCatIntTipoReaseguroRest/" });

  const fetchTipoReaseguro = async (): Promise<TipoReaseguro[]> => {
    try {
      const response = await baseAPI.post<TipoReaseguro[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoReaseguro:", error);
      throw error;
    }
  };

  const createTipoReaseguro = async (
    data: Partial<TipoReaseguro>
  ): Promise<TipoReaseguro> => {
    try {
      const response = await baseAPI.post<TipoReaseguro>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoReaseguro:", error);
      throw error;
    }
  };

  const updateTipoReaseguro = async (
    id: number,
    data: Partial<TipoReaseguro>
  ): Promise<TipoReaseguro> => {
    try {
      const response = await baseAPI.put<TipoReaseguro>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoReaseguro:", error);
      throw error;
    }
  };

  const deleteTipoReaseguro = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
