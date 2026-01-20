import { BaseAPI } from "@/API/BaseAPI";
import type { TipoTarifa } from "./tarifaPropia.interfaces";

export const TipoTarifaActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_configuracion_tarifas_reaseg/api/v1/ReasegTipoTarifaPropiaRest/",
  });

  const fetchTipoTarifa = async (): Promise<TipoTarifa[]> => {
    try {
      const response = await baseAPI.post<TipoTarifa[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Tipo Tarifa:", error);
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
      console.error("Error creating Tipo Tarifa:", error);
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
      console.error("Error updating Tipo Tarifa:", error);
      throw error;
    }
  };

  const deleteTipoTarifa = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting Tipo Tarifa:", error);
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
