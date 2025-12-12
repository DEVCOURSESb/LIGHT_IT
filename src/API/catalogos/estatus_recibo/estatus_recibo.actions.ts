import { BaseAPICatalogos } from "@/API/BaseAPICatalogos";
import type { EstatusRecibo } from "./estatus_recibo.interfaces";

export function EstatusReciboActions() {
  const baseAPI = BaseAPICatalogos({ prefix: "ReasegCatIntEstatusReciboRest/" });

  const fetch = async (): Promise<EstatusRecibo[]> => {
    try {
      const response = await baseAPI.post<EstatusRecibo[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching EstatusRecibos:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<EstatusRecibo>
  ): Promise<EstatusRecibo> => {
    try {
      const response = await baseAPI.post<EstatusRecibo>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating EstatusRecibo:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<EstatusRecibo>
  ): Promise<EstatusRecibo> => {
    try {
      const response = await baseAPI.put<EstatusRecibo>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating EstatusRecibo:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting EstatusRecibo:", error);
      throw error;
    }
  };

  return {
    fetch,
    create,
    update,
    deletes,
  };
}
