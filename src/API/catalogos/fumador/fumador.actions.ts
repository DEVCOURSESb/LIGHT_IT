import { BaseAPI } from "@/API/BaseAPI";
import type { Fumador } from "./fumador.interfaces";


export function FumadorActions() {
  const baseAPI = BaseAPI({ prefix: "ReasegCatIntFumadorRest/" });

  const fetch = async (): Promise<Fumador[]> => {
    try {
      const response = await baseAPI.post<Fumador[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Fumadors:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<Fumador>
  ): Promise<Fumador> => {
    try {
      const response = await baseAPI.post<Fumador>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Fumador:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<Fumador>
  ): Promise<Fumador> => {
    try {
      const response = await baseAPI.put<Fumador>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Fumador:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting Fumador:", error);
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
