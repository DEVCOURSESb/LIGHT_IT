import { BaseAPI } from "@/API/BaseAPI";
import type { Cobertura } from "./coberturas.interfaces";

export const CoberturasActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntCoberturaRest/" });

  const fetchCoberturas = async (): Promise<Cobertura[]> => {
    try {
      const response = await baseAPI.post<Cobertura[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Coberturas:", error);
      throw error;
    }
  };

  const createCobertura = async ( data: Partial<Cobertura> ): Promise<Cobertura[]> => {
    try {
      const response = await baseAPI.post<Cobertura[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Cobertura:", error);
      throw error;
    }
  };

  const updateCobertura = async ( data: Partial<Cobertura> ): Promise<Cobertura[]> => {
    try {
      const response = await baseAPI.put<Cobertura[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Cobertura:", error);
      throw error;
    }
  };

  const deleteCobertura = async (id: number): Promise<Cobertura[]> => {
    try {
      const response = await baseAPI.delete<Cobertura[]>(`deleteRecord/${id}`);
      return response.data;
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
