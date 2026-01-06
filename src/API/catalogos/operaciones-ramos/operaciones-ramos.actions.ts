import { BaseAPI } from "@/API/BaseAPI";
import type { OperacionRamo } from "./operaciones-ramos.interfaces";

export const OperacionesRamosActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintOperYRamosAnx3817Rest/" });

  const fetchOperacionesRamos = async (): Promise<OperacionRamo[]> => {
    try {
      const response = await baseAPI.post<OperacionRamo[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching operaciones ramos:", error);
      throw error;
    }
  };

  const createOperacionRamo = async (
    data: Partial<OperacionRamo>
  ): Promise<OperacionRamo> => {
    try {
      const response = await baseAPI.post<OperacionRamo>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating operacion ramo:", error);
      throw error;
    }
  };

  const updateOperacionRamo = async (
    id: number,
    data: Partial<OperacionRamo>
  ): Promise<OperacionRamo> => {
    try {
      const response = await baseAPI.put<OperacionRamo>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating operacion ramo:", error);
      throw error;
    }
  };

  const deleteOperacionRamo = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting operacion ramo:", error);
      throw error;
    }
  };

  return {
    fetchOperacionesRamos,
    createOperacionRamo,
    updateOperacionRamo,
    deleteOperacionRamo,
  };
};
