import { BaseAPI } from "@/API/BaseAPI";
import type { Estatus } from "./estatus.interfaces";
import { fakeData } from "@/API/fakeData";


export function EstatusActions() {
  const baseAPI = BaseAPI({ prefix: "ReasegCatIntEstatusRest/" });

  const fetch = async (): Promise<Estatus[]> => {
    try {
      return fakeData().dataEstatus;
      const response = await baseAPI.post<Estatus[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Estatuss:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<Estatus>
  ): Promise<Estatus> => {
    try {
      const response = await baseAPI.post<Estatus>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Estatus:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<Estatus>
  ): Promise<Estatus> => {
    try {
      const response = await baseAPI.put<Estatus>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Estatus:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
