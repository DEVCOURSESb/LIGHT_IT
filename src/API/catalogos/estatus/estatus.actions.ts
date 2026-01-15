import { BaseAPI } from "@/API/BaseAPI";
import type { Estatus } from "./estatus.interfaces";


export function EstatusActions() {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntEstatusRest/" });

  const fetch = async (): Promise<Estatus[]> => {
    try {
      const response = await baseAPI.post<Estatus[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Estatuss:", error);
      throw error;
    }
  };

  const create = async (data: Partial<Estatus>): Promise<Estatus[]> => {
    try {
      const response = await baseAPI.post<Estatus[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Estatus:", error);
      throw error;
    }
  };

  const update = async (data: Partial<Estatus>): Promise<Estatus[]> => {
    try {
      const response = await baseAPI.put<Estatus[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Estatus:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<Estatus[]> => {
    try {
      const response = await baseAPI.delete<Estatus[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Estatus:", error);
      throw error;
    }
  };

  return {
    fetch,
    create,
    update,
    deletes,
  };
}
