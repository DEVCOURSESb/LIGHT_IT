import { BaseAPI } from "@/API/BaseAPI";
import type { CriterioCobertura } from "./criterio_cobertura.interfaces";


export function CriterioCoberturaActions() {
  const baseAPI = BaseAPI({ prefix: "ReasegCatIntCriterioCoberturaRest/" });

  const fetch = async (): Promise<CriterioCobertura[]> => {
    try {
      const response = await baseAPI.post<CriterioCobertura[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching CriterioCoberturas:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<CriterioCobertura>
  ): Promise<CriterioCobertura> => {
    try {
      const response = await baseAPI.post<CriterioCobertura>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating CriterioCobertura:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<CriterioCobertura>
  ): Promise<CriterioCobertura> => {
    try {
      const response = await baseAPI.put<CriterioCobertura>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating CriterioCobertura:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting CriterioCobertura:", error);
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
