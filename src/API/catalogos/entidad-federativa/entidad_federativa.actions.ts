import { BaseAPI } from "@/API/BaseAPI";
import type { EntidadFederativa } from "./entidad_federativa.interfaces";


export function EntidadFederativaActions() {
  const baseAPI = BaseAPI({ prefix: "ReasegCatCnsfRr6EntidadFederativaRest/" });

  const fetch = async (): Promise<EntidadFederativa[]> => {
    try {
      const response = await baseAPI.post<EntidadFederativa[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching EntidadFederativas:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<EntidadFederativa>
  ): Promise<EntidadFederativa> => {
    try {
      const response = await baseAPI.post<EntidadFederativa>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating EntidadFederativa:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<EntidadFederativa>
  ): Promise<EntidadFederativa> => {
    try {
      const response = await baseAPI.put<EntidadFederativa>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating EntidadFederativa:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting EntidadFederativa:", error);
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
