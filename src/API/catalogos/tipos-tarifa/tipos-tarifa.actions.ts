import { BaseAPI } from "@/API/BaseAPI";
import { fakeData } from "@/API/fakeData";
import type { TipoTarifa } from "./tipos-tarifa.interfaces";

export const TipoTarifaActions = () => {
  const baseAPI = BaseAPI({ prefix: "ReasegCatIntTipoTarifaRest/" });

  const fetchTipoTarifa = async (): Promise<TipoTarifa[]> => {
    try {
      return fakeData().dataTipoTarifa;
      const response = await baseAPI.get<TipoTarifa[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoTarifa:", error);
      throw error;
    }
  };

  const createTipoTarifa = async (
    data: Partial<TipoTarifa>
  ): Promise<TipoTarifa> => {
    try {
      const response = await baseAPI.post<TipoTarifa>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoTarifa:", error);
      throw error;
    }
  };

  const updateTipoTarifa = async (
    id: number,
    data: Partial<TipoTarifa>
  ): Promise<TipoTarifa> => {
    try {
      const response = await baseAPI.put<TipoTarifa>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoTarifa:", error);
      throw error;
    }
  };

  const deleteTipoTarifa = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting TipoTarifa:", error);
      throw error;
    }
  };

  return {
    fetchTipoTarifa,
    createTipoTarifa,
    updateTipoTarifa,
    deleteTipoTarifa,
  };
};
