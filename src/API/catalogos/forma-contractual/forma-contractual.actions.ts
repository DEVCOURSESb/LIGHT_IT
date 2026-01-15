import { BaseAPI } from "@/API/BaseAPI";
import type { FormaContractual } from "./forma-contractual.interface";

export const FormaContractualActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntFormaContractualRest/" });

  const fetchFormaContractual = async (): Promise<FormaContractual[]> => {
    try {
      const response = await baseAPI.post<FormaContractual[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching FormaContractual:", error);
      throw error;
    }
  };

  const createFormaContractual = async (data: Partial<FormaContractual>): Promise<FormaContractual[]> => {
    try {
      const response = await baseAPI.post<FormaContractual[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating FormaContractual:", error);
      throw error;
    }
  };

  const updateFormaContractual = async (data: Partial<FormaContractual>): Promise<FormaContractual[]> => {
    try {
      const response = await baseAPI.put<FormaContractual[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating FormaContractual:", error);
      throw error;
    }
  };

  const deleteFormaContractual = async (id: number): Promise<FormaContractual[]> => {
    try {
      const response = await baseAPI.delete<FormaContractual[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting FormaContractual:", error);
      throw error;
    }
  };

  return {
    fetchFormaContractual,
    createFormaContractual,
    updateFormaContractual,
    deleteFormaContractual,
  };
};
