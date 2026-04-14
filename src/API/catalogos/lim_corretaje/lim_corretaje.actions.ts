import { BaseAPI } from "@/API/BaseAPI";
import type { LimCorretaje } from "./lim_corretaje.interfaces";


export const LimCorretajeActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntLimCorretajeRest/",
  });

  const fetch = async (): Promise<LimCorretaje[]> => {
    try {
      const response = await baseAPI.post<LimCorretaje[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching LimCorretaje:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<LimCorretaje>,
  ): Promise<LimCorretaje[]> => {
    try {
      const response = await baseAPI.post<LimCorretaje[]>(
        "insertRecord",
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating LimCorretaje:", error);
      throw error;
    }
  };

  const update = async (
    data: Partial<LimCorretaje>,
  ): Promise<LimCorretaje[]> => {
    try {
      const response = await baseAPI.put<LimCorretaje[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating LimCorretaje:", error);
      throw error;
    }
  };

  const deleteF = async (id: number): Promise<LimCorretaje[]> => {
    try {
      const response = await baseAPI.delete<LimCorretaje[]>(
        `deleteRecord/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting LimCorretaje:", error);
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
