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

  const createExtension = async (
    data: Partial<Extension>
  ): Promise<Extension> => {
    try {
      const response = await baseAPI.post<Extension>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Extension:", error);
      throw error;
    }
  };

  const updateExtension = async (
    id: number,
    data: Partial<Extension>
  ): Promise<Extension> => {
    try {
      const response = await baseAPI.put<Extension>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Extension:", error);
      throw error;
    }
  };

  const deleteExtension = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
