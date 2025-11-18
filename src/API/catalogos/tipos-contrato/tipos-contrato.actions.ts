import { BaseAPI } from "@/API/BaseAPI";
import { fakeData } from "@/API/fakeData";
import type { TipoContrato } from "./tipos-contrato.interfaces";

export const TiposContratoActions = () => {
  const baseAPI = BaseAPI({ prefix: "ReasegCatCnsfintTipoContratoRest/" });

  const fetchTipoContratos = async (): Promise<TipoContrato[]> => {
    try {
      return fakeData().dataTiposContrato;
      const response = await baseAPI.get<TipoContrato[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TiposContrato:", error);
      throw error;
    }
  };

  const createTipoContrato = async (
    data: Partial<TipoContrato>
  ): Promise<TipoContrato> => {
    try {
      const response = await baseAPI.post<TipoContrato>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoContrato:", error);
      throw error;
    }
  };

  const updateTipoContrato = async (
    id: number,
    data: Partial<TipoContrato>
  ): Promise<TipoContrato> => {
    try {
      const response = await baseAPI.put<TipoContrato>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoContrato:", error);
      throw error;
    }
  };

  const deleteTipoContrato = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting TipoContrato:", error);
      throw error;
    }
  };

  return {
    fetchTipoContratos,
    createTipoContrato,
    updateTipoContrato,
    deleteTipoContrato,
  };
};
