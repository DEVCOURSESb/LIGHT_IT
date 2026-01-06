import { BaseAPI } from "@/API/BaseAPI";
import type { TipoAsignacion } from "./tipo-asignacion.interfaces";

export const TipoAsignacionActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntTipoAsignacionRest/" });

  const fetchTipoAsignacion = async (): Promise<TipoAsignacion[]> => {
    try {
      const response = await baseAPI.post<TipoAsignacion[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoAsignacion:", error);
      throw error;
    }
  };

  const createTipoAsignacion = async (
    data: Partial<TipoAsignacion>
  ): Promise<TipoAsignacion> => {
    try {
      const response = await baseAPI.post<TipoAsignacion>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoAsignacion:", error);
      throw error;
    }
  };

  const updateTipoAsignacion = async (
    id: number,
    data: Partial<TipoAsignacion>
  ): Promise<TipoAsignacion> => {
    try {
      const response = await baseAPI.put<TipoAsignacion>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoAsignacion:", error);
      throw error;
    }
  };

  const deleteTipoAsignacion = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting TipoAsignacion:", error);
      throw error;
    }
  };

  return {
    fetchTipoAsignacion,
    createTipoAsignacion,
    updateTipoAsignacion,
    deleteTipoAsignacion,
  };
};
