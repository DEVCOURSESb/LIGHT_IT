import { BaseAPI } from "@/API/BaseAPI";
import type { Extension } from "./extensiones.interfaces";

export const ExtensionesActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatExtensionCoberturaRest/" });

  const fetchExtensiones = async (): Promise<Extension[]> => {
    try {
      const response = await baseAPI.post<Extension[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Extensiones:", error);
      throw error;
    }
  };

  const createExtension = async (data: Partial<Extension>): Promise<Extension[]> => {
    try {
      const response = await baseAPI.post<Extension[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Extension:", error);
      throw error;
    }
  };

  const updateExtension = async (data: Partial<Extension>): Promise<Extension[]> => {
    try {
      const response = await baseAPI.put<Extension[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Extension:", error);
      throw error;
    }
  };

  const deleteExtension = async (id: number): Promise<Extension[]> => {
    try {
      const response = await baseAPI.delete<Extension[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Extension:", error);
      throw error;
    }
  };

  return {
    fetchExtensiones,
    createExtension,
    updateExtension,
    deleteExtension,
  };
};
