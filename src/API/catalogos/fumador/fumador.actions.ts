import { BaseAPI } from "@/API/BaseAPI";
import type { Fumador } from "./fumador.interfaces";


export function FumadorActions() {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntFumadorRest/" });

  const fetch = async (): Promise<Fumador[]> => {
    try {
      const response = await baseAPI.post<Fumador[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Fumadors:", error);
      throw error;
    }
  };

  const create = async (data: Partial<Fumador>): Promise<Fumador[]> => {
    try {
      const response = await baseAPI.post<Fumador[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Fumador:", error);
      throw error;
    }
  };

  const update = async (data: Partial<Fumador>): Promise<Fumador[]> => {
    try {
      const response = await baseAPI.put<Fumador[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Fumador:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<Fumador[]> => {
    try {
      const response = await baseAPI.delete<Fumador[]>(`deleteRecord/${id}`);
      return response.data;
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
