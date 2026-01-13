import { BaseAPI } from "@/API/BaseAPI";
import type { Clasificacion } from "./clasificacion.interfaces";

export const ClasificacionCoberturaActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntClasificacionCoberturaRest/",
  });

  const fetchClasificaciones = async (): Promise<Clasificacion[]> => {
    try {
      const response = await baseAPI.post<Clasificacion[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Clasificaciones:", error);
      throw error;
    }
  };

  const createClasificacion = async ( data: Partial<Clasificacion> ): Promise<Clasificacion[]> => {
    try {
      const response = await baseAPI.post<Clasificacion[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Clasificacion:", error);
      throw error;
    }
  };

  const updateClasificacion = async ( data: Partial<Clasificacion> ): Promise<Clasificacion[]> => {
    try {
      const response = await baseAPI.put<Clasificacion[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Clasificacion:", error);
      throw error;
    }
  };

  const deleteClasificacion = async (id: number): Promise<Clasificacion[]> => {
    try {
      const data = await baseAPI.delete<Clasificacion[]>(`deleteRecord/${id}`);
      return data.data;
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
