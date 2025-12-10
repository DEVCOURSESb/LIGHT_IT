import { BaseAPI } from "@/API/BaseAPI";
import type { Sexo } from "./sexo.interfaces";
import { fakeData } from "@/API/fakeData";


export function SexoActions() {
  const baseAPI = BaseAPI({ prefix: "ReasegCatIntSexoRest/" });

  const fetch = async (): Promise<Sexo[]> => {
    try {
      return fakeData().dataSexo;
      const response = await baseAPI.post<Sexo[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Sexos:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<Sexo>
  ): Promise<Sexo> => {
    try {
      const response = await baseAPI.post<Sexo>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Sexo:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<Sexo>
  ): Promise<Sexo> => {
    try {
      const response = await baseAPI.put<Sexo>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Sexo:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
