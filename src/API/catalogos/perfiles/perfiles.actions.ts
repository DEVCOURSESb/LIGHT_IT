import { BaseAPI } from "@/API/BaseAPI";
import type { Perfil } from "./perfiles.interfaces";

export const PerfilActions = () => {
  const baseAPI = BaseAPI({ prefix: "PerfilRest/" });

  const fetchPerfiles = async (): Promise<Perfil[]> => {
    try {
      const response = await baseAPI.post<Perfil[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Perfiles:", error);
      throw error;
    }
  };

  const createPerfil = async (data: Partial<Perfil>): Promise<Perfil> => {
    try {
      const response = await baseAPI.post<Perfil>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Perfil:", error);
      throw error;
    }
  };

  const updatePerfil = async (
    id: number,
    data: Partial<Perfil>
  ): Promise<Perfil> => {
    try {
      const response = await baseAPI.put<Perfil>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Perfil:", error);
      throw error;
    }
  };

  const deletePerfil = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
