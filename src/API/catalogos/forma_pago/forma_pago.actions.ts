import { BaseAPICatalogos } from "@/API/BaseAPICatalogos";
import type { FormaPago } from "./forma_pago.interfaces";
import { fakeData } from "@/API/fakeData";


export function FormaPagoActions() {
  const baseAPI = BaseAPICatalogos({ prefix: "ReasegCatIntFormaPagoRest/" });

  const fetch = async (): Promise<FormaPago[]> => {
    try {
      return fakeData().dataFormaPago;
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
