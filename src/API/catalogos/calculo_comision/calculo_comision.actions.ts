import { BaseAPI } from "@/API/BaseAPI";
import type { CalculoComision } from "./calculo_comision.interfaces";
import { fakeData } from "@/API/fakeData";

export const CalculoComisionActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntCalculoComisionRest/",
  });

  const fetch = async (): Promise<CalculoComision[]> => {
    try {
      const response = await baseAPI.post<CalculoComision[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching CalculoComision:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<CalculoComision>,
  ): Promise<CalculoComision[]> => {
    try {
      const response = await baseAPI.post<CalculoComision[]>(
        "insertRecord",
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating CalculoComision:", error);
      throw error;
    }
  };

  const update = async (
    data: Partial<CalculoComision>,
  ): Promise<CalculoComision[]> => {
    try {
      const response = await baseAPI.put<CalculoComision[]>(
        "updateRecord",
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating CalculoComision:", error);
      throw error;
    }
  };

  const deleteF = async (id: number): Promise<CalculoComision[]> => {
    try {
      const response = await baseAPI.delete<CalculoComision[]>(
        `deleteRecord/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting CalculoComision:", error);
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
