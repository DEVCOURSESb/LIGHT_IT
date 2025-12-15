import { BaseAPI } from "@/API/BaseAPI";
import type { FormaPago } from "./forma_pago.interfaces";


export function FormaPagoActions() {
  const baseAPI = BaseAPI({ prefix: "ReasegCatIntFormaPagoRest/" });

  const fetch = async (): Promise<FormaPago[]> => {
    try {
      const response = await baseAPI.post<FormaPago[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching FormaPagos:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<FormaPago>
  ): Promise<FormaPago> => {
    try {
      const response = await baseAPI.post<FormaPago>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating FormaPago:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<FormaPago>
  ): Promise<FormaPago> => {
    try {
      const response = await baseAPI.put<FormaPago>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating FormaPago:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
