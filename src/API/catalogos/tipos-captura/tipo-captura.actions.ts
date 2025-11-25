import { BaseAPI } from "@/API/BaseAPI";
import { fakeData } from "@/API/fakeData";
import type { TipoCaptura } from "./tipo-captura.interfaces";

export const TipoCapturaActions = () => {
  const baseAPI = BaseAPI({ prefix: "ReasegCatCnsfRr6TipoCapturaRest/" });

  const fetchTipoCapturas = async (): Promise<TipoCaptura[]> => {
    try {
      return fakeData().dataTiposCaptura;
      const response = await baseAPI.get<TipoCaptura[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoCapturas:", error);
      throw error;
    }
  };

  const createTipoCaptura = async (
    data: Partial<TipoCaptura>
  ): Promise<TipoCaptura> => {
    try {
      const response = await baseAPI.post<TipoCaptura>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoCaptura:", error);
      throw error;
    }
  };

  const updateTipoCaptura = async (
    id: number,
    data: Partial<TipoCaptura>
  ): Promise<TipoCaptura> => {
    try {
      const response = await baseAPI.put<TipoCaptura>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoCaptura:", error);
      throw error;
    }
  };

  const deleteTipoCaptura = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
