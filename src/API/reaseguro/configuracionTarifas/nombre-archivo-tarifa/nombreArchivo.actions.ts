import { BaseAPI } from "@/API/BaseAPI";
import type { NombreArchivo } from "./nombreArchivo.interfaces";

export const NombreArchivoTarifaActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_configuracion_tarifas_reaseg/api/v1/ReasegArchivoTipoTarifaRest/",
  });

  const fetchNombreArchivo = async (): Promise<NombreArchivo[]> => {
    try {
      const response = await baseAPI.post<NombreArchivo[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Nombre Archivo:", error);
      throw error;
    }
  };

  const createNombreArchivo = async (
    data: Partial<NombreArchivo>
  ): Promise<NombreArchivo> => {
    try {
      const response = await baseAPI.post<NombreArchivo>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Nombre Archivo:", error);
      throw error;
    }
  };

  const updateNombreArchivo = async (
    id: number,
    data: Partial<NombreArchivo>
  ): Promise<NombreArchivo> => {
    try {
      const response = await baseAPI.put<NombreArchivo>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Nombre Archivo:", error);
      throw error;
    }
  };

  const deleteNombreArchivo = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting NombreArchivo:", error);
      throw error;
    }
  };

  return {
    fetchNombreArchivo,
    createNombreArchivo,
    updateNombreArchivo,
    deleteNombreArchivo,
  };
};
