import { BaseAPI } from "@/API/BaseAPI";
import type { Intermediario } from "./intermediario.interfaces";
import { fakeData } from "@/API/fakeData";

export const IntermediariosActions = () => {
  const baseAPI = BaseAPI({ prefix: "ReasegCatCnsfIntermediarioRest/" });

  const fetchIntermediarios = async (): Promise<Intermediario[]> => {
    try {
      return fakeData().dataIntermediarios;
      const response = await baseAPI.get<Intermediario[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching intermediarios:", error);
      throw error;
    }
  };

  const createIntermediario = async (
    data: Partial<Intermediario>
  ): Promise<Intermediario> => {
    try {
      const response = await baseAPI.post<Intermediario>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating intermediario:", error);
      throw error;
    }
  };

  const updateIntermediario = async (
    id: number,
    data: Partial<Intermediario>
  ): Promise<Intermediario> => {
    try {
      const response = await baseAPI.put<Intermediario>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating intermediario:", error);
      throw error;
    }
  };

  const deleteIntermediario = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting intermediario:", error);
      throw error;
    }
  };

  return {
    fetchIntermediarios,
    createIntermediario,
    updateIntermediario,
    deleteIntermediario,
  };
};
