import { BaseAPICatalogos } from "@/API/BaseAPICatalogos";
import type { Cobertura } from "./coberturas.interfaces";

export const CoberturasActions = () => {
  const baseAPI = BaseAPICatalogos({ prefix: "ReasegCatIntCoberturaRest/" });

  const fetchCoberturas = async (): Promise<Cobertura[]> => {
    try {
      const response = await baseAPI.post<Cobertura[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Coberturas:", error);
      throw error;
    }
  };

  const createCobertura = async (
    data: Partial<Cobertura>
  ): Promise<Cobertura> => {
    try {
      const response = await baseAPI.post<Cobertura>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Cobertura:", error);
      throw error;
    }
  };

  const updateCobertura = async (
    id: number,
    data: Partial<Cobertura>
  ): Promise<Cobertura> => {
    try {
      const response = await baseAPI.put<Cobertura>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Cobertura:", error);
      throw error;
    }
  };

  const deleteCobertura = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting Cobertura:", error);
      throw error;
    }
  };

  return {
    fetchCoberturas,
    createCobertura,
    updateCobertura,
    deleteCobertura,
  };
};
