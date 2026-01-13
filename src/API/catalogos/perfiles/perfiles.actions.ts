import { BaseAPI } from "@/API/BaseAPI";
import type { Perfil } from "./perfiles.interfaces";

export const PerfilActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/PerfilRest/" });

  const fetchPerfiles = async (): Promise<Perfil[]> => {
    try {
      const response = await baseAPI.post<Perfil[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Perfiles:", error);
      throw error;
    }
  };

  const createPerfil = async (data: Partial<Perfil>): Promise<Perfil[]> => {
    try {
      const response = await baseAPI.post<Perfil[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Perfil:", error);
      throw error;
    }
  };

  const updatePerfil = async (data: Partial<Perfil>): Promise<Perfil[]> => {
    try {
      const response = await baseAPI.put<Perfil[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Perfil:", error);
      throw error;
    }
  };

  const deletePerfil = async (id: number): Promise<Perfil[]> => {
    try {
      const response = await baseAPI.delete<Perfil[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Perfil:", error);
      throw error;
    }
  };

  return {
    fetchPerfiles,
    createPerfil,
    updatePerfil,
    deletePerfil,
  };
};
