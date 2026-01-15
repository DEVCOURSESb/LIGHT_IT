import { BaseAPI } from "@/API/BaseAPI";
import type { Sexo } from "./sexo.interfaces";


export function SexoActions() {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntSexoRest/" });

  const fetch = async (): Promise<Sexo[]> => {
    try {
      const response = await baseAPI.post<Sexo[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Sexos:", error);
      throw error;
    }
  };

  const create = async (data: Partial<Sexo>): Promise<Sexo[]> => {
    try {
      const response = await baseAPI.post<Sexo[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Sexo:", error);
      throw error;
    }
  };

  const update = async (data: Partial<Sexo>): Promise<Sexo[]> => {
    try {
      const response = await baseAPI.put<Sexo[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Sexo:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<Sexo[]> => {
    try {
      const response = await baseAPI.delete<Sexo[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Sexo:", error);
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
