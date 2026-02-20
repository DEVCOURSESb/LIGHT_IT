import { BaseAPI } from "@/API/BaseAPI";
import type { Rr6Sector } from "./rr6_sector.interfaces";
import { fakeData } from "@/API/fakeData";

export const Rr6SectorActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfRr6SectorRest/",
  });

  const fetch = async (): Promise<Rr6Sector[]> => {
    try {
      const response = await baseAPI.post<Rr6Sector[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching Rr6Sectors:", error);
      throw error;
    }
  };

  const create = async (data: Partial<Rr6Sector>): Promise<Rr6Sector[]> => {
    try {
      const response = await baseAPI.post<Rr6Sector[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating Rr6Sector:", error);
      throw error;
    }
  };

  const update = async (data: Partial<Rr6Sector>): Promise<Rr6Sector[]> => {
    try {
      const response = await baseAPI.put<Rr6Sector[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating Rr6Sector:", error);
      throw error;
    }
  };

  const deleteF = async (id: number): Promise<Rr6Sector[]> => {
    try {
      const response = await baseAPI.delete<Rr6Sector[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting Rr6Sector:", error);
      throw error;
    }
  };

  return {
    fetch,
    create,
    update,
    deleteF,
  };
};
