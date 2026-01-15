import { BaseAPI } from "@/API/BaseAPI";
import type { TipoTarifa } from "./tipos-tarifa.interfaces";
import { showModalExistRow } from "@/utilities/catalogos/showModalExistRow";

export const TipoTarifaActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntTipoTarifaRest/" });

  const fetchTipoTarifa = async (): Promise<TipoTarifa[]> => {
    try {
      const response = await baseAPI.post<TipoTarifa[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoTarifa:", error);
      throw error;
    }
  };

  const createTipoTarifa = async ( data: Partial<TipoTarifa> ): Promise<TipoTarifa[]> => {
    try {
      const response = await baseAPI.post<TipoTarifa[]>("insertRecord", data);
      if (response.status === 208) {
        showModalExistRow();
      }
      return response.data;
    } catch (error) {
      console.error("Error creating TipoTarifa:", error);
      throw error;
    }
  };

  const updateTipoTarifa = async (data: Partial<TipoTarifa>): Promise<TipoTarifa[]> => {
    try {
      const response = await baseAPI.put<TipoTarifa[]>("updateRecord", data);
      if (response.status === 208) {
        showModalExistRow();
      }
      return response.data;
    } catch (error) {
      console.error("Error updating TipoTarifa:", error);
      throw error;
    }
  };

  const deleteTipoTarifa = async (id: number): Promise<TipoTarifa[]> => {
    try {
      const data = await baseAPI.delete<TipoTarifa[]>(`deleteRecord/${id}`);
      return data.data;
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
