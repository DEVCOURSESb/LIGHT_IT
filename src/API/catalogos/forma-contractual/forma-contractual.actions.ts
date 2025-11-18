import { BaseAPI } from "@/API/BaseAPI";
import { fakeData } from "@/API/fakeData";
import type { FormaContractual } from "./forma-contractual.interface";

export const FormaContractualActions = () => {
  const baseAPI = BaseAPI({ prefix: "ReasegCatIntFormaContractualRest/" });

  const fetchFormaContractual = async (): Promise<FormaContractual[]> => {
    try {
      return fakeData().dataFormaContractual;
      const response = await baseAPI.get<FormaContractual[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching FormaContractual:", error);
      throw error;
    }
  };

  const createFormaContractual = async (
    data: Partial<FormaContractual>
  ): Promise<FormaContractual> => {
    try {
      const response = await baseAPI.post<FormaContractual>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating FormaContractual:", error);
      throw error;
    }
  };

  const updateFormaContractual = async (
    id: number,
    data: Partial<FormaContractual>
  ): Promise<FormaContractual> => {
    try {
      const response = await baseAPI.put<FormaContractual>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating FormaContractual:", error);
      throw error;
    }
  };

  const deleteFormaContractual = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting FormaContractual:", error);
      throw error;
    }
  };

  return {
    fetchMonedas: fetchFormaContractual,
    createFormaContractual,
    updateFormaContractual,
    deleteFormaContractual,
  };
};
