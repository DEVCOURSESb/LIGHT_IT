import { BaseAPI } from "@/API/BaseAPI";
import type { Ptu } from "./ptu.interfaces";

export const PtuActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntPtuRest/" });

  const fetchPtus = async (): Promise<Ptu[]> => {
    try {
      const response = await baseAPI.post<Ptu[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Ptus:", error);
      throw error;
    }
  };

  const createPtu = async (data: Partial<Ptu>): Promise<Ptu[]> => {
    try {
      const response = await baseAPI.post<Ptu[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Ptu:", error);
      throw error;
    }
  };

  const updatePtu = async (data: Partial<Ptu>): Promise<Ptu[]> => {
    try {
      const response = await baseAPI.put<Ptu[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Ptu:", error);
      throw error;
    }
  };

  const deletePtu = async (id: number): Promise<Ptu[]> => {
    try {
      const response = await baseAPI.delete<Ptu[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Ptu:", error);
      throw error;
    }
  };

  return {
    fetchPtus,
    createPtu,
    updatePtu,
    deletePtu,
  };
};
