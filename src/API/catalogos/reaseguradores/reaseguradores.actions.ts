import { BaseAPI } from "@/API/BaseAPI";
import type { Reasegurador } from "./reasegurador.interface";

export const ReaseguradoresActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintReaseguradoraRest/" });

  const fetchReaseguradores = async (): Promise<Reasegurador[]> => {
    try {
      const response = await baseAPI.post<Reasegurador[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching reaseguradores:", error);
      throw error;
    }
  };

  const createReasegurador = async (
    data: Partial<Reasegurador>
  ): Promise<Reasegurador> => {
    try {
      const response = await baseAPI.post<Reasegurador>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating intermediario:", error);
      throw error;
    }
  };

  const updateReasegurador = async (
    id: number,
    data: Partial<Reasegurador>
  ): Promise<Reasegurador> => {
    try {
      const response = await baseAPI.put<Reasegurador>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating intermediario:", error);
      throw error;
    }
  };

  const deleteReasegurador = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting reasegurador:", error);
      throw error;
    }
  };

  return {
    fetchReaseguradores,
    createReasegurador,
    updateReasegurador,
    deleteReasegurador,
  };
};
