import { BaseAPI } from "@/API/BaseAPI";
import { fakeData } from "@/API/fakeData";
import type { Clasificacion } from "./clasificacion.interfaces";

export const ClasificacionCoberturaActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ReasegCatIntClasificacionCoberturaRest/",
  });

  const fetchClasificaciones = async (): Promise<Clasificacion[]> => {
    try {
      return fakeData().dataClasificacionCobertura;
      const response = await baseAPI.get<Clasificacion[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Clasificaciones:", error);
      throw error;
    }
  };

  const createClasificacion = async (
    data: Partial<Clasificacion>
  ): Promise<Clasificacion> => {
    try {
      const response = await baseAPI.post<Clasificacion>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Clasificacion:", error);
      throw error;
    }
  };

  const updateClasificacion = async (
    id: number,
    data: Partial<Clasificacion>
  ): Promise<Clasificacion> => {
    try {
      const response = await baseAPI.put<Clasificacion>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating Clasificacion:", error);
      throw error;
    }
  };

  const deleteClasificacion = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting Clasificacion:", error);
      throw error;
    }
  };

  return {
    fetchClasificaciones,
    createClasificacion,
    updateClasificacion,
    deleteClasificacion,
  };
};
