import { BaseAPI } from "@/API/BaseAPI";
import type { FormaPago } from "./forma_pago.interfaces";


export function FormaPagoActions() {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntFormaPagoRest/" });

  const fetch = async (): Promise<FormaPago[]> => {
    try {
      const response = await baseAPI.post<FormaPago[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching FormaPagos:", error);
      throw error;
    }
  };

  const create = async (data: Partial<FormaPago>): Promise<FormaPago[]> => {
    try {
      const response = await baseAPI.post<FormaPago[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating FormaPago:", error);
      throw error;
    }
  };

  const update = async (data: Partial<FormaPago>): Promise<FormaPago[]> => {
    try {
      const response = await baseAPI.put<FormaPago[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating FormaPago:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<FormaPago[]> => {
    try {
      const response = await baseAPI.delete<FormaPago[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting FormaPago:", error);
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
