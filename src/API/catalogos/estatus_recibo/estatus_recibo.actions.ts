import { BaseAPI } from "@/API/BaseAPI";
import type { EstatusRecibo } from "./estatus_recibo.interfaces";

export function EstatusReciboActions() {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntEstatusReciboRest/" });

  const fetch = async (): Promise<EstatusRecibo[]> => {
    try {
      const response = await baseAPI.post<EstatusRecibo[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching EstatusRecibos:", error);
      throw error;
    }
  };

  const create = async (data: Partial<EstatusRecibo>): Promise<EstatusRecibo[]> => {
    try {
      const response = await baseAPI.post<EstatusRecibo[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating EstatusRecibo:", error);
      throw error;
    }
  };

  const update = async (data: Partial<EstatusRecibo>): Promise<EstatusRecibo[]> => {
    try {
      const response = await baseAPI.put<EstatusRecibo[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating EstatusRecibo:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<EstatusRecibo[]> => {
    try {
      const response = await baseAPI.delete<EstatusRecibo[]>(`deleteRecord/${id}`);
      return response.data;
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
