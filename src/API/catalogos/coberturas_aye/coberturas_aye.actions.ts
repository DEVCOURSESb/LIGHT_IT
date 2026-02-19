import { BaseAPI } from "@/API/BaseAPI";
import type { coberturasAye } from "./coberturas_aye.interfaces";

export const CoberturasAyeActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntCoberturasAyERest/",
  });

  const fetch = async (): Promise<coberturasAye[]> => {
    try {
      const response = await baseAPI.post<coberturasAye[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching coberturasAye:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<coberturasAye>,
  ): Promise<coberturasAye[]> => {
    try {
      const response = await baseAPI.post<coberturasAye[]>(
        "insertRecord",
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating coberturasAye:", error);
      throw error;
    }
  };

  const update = async (
    data: Partial<coberturasAye>,
  ): Promise<coberturasAye[]> => {
    try {
      const response = await baseAPI.put<coberturasAye[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating coberturasAye:", error);
      throw error;
    }
  };

  const deleteF = async (id: number): Promise<coberturasAye[]> => {
    try {
      const response = await baseAPI.delete<coberturasAye[]>(
        `deleteRecord/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting coberturasAye:", error);
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
