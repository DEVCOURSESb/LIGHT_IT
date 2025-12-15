import { BaseAPI } from "@/API/BaseAPI";
import type { DistribucionCesion } from "./distribucion-cesion.interfaces";

export const DistribucionCesionActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ReasegCatIntDistribucionCesionRest/",
  });

  const fetchDistribucionesCesion = async (): Promise<DistribucionCesion[]> => {
    try {
      const response = await baseAPI.post<DistribucionCesion[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching distribuciones cesion:", error);
      throw error;
    }
  };

  const createDistribucionCesion = async (
    data: Partial<DistribucionCesion>
  ): Promise<DistribucionCesion> => {
    try {
      const response = await baseAPI.post<DistribucionCesion>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating DistribucionCesion:", error);
      throw error;
    }
  };

  const updateDistribucionCesion = async (
    id: number,
    data: Partial<DistribucionCesion>
  ): Promise<DistribucionCesion> => {
    try {
      const response = await baseAPI.put<DistribucionCesion>(
        `update/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating DistribucionCesion:", error);
      throw error;
    }
  };

  const deleteDistribucionCesion = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting DistribucionCesion:", error);
      throw error;
    }
  };

  return {
    fetchDistribucionesCesion,
    createDistribucionCesion,
    updateDistribucionCesion,
    deleteDistribucionCesion,
  };
};
