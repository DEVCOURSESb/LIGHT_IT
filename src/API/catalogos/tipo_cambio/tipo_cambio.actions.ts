import { BaseAPI } from "@/API/BaseAPI";
import type { TipoCambio } from "./tipo_cambio.interfaces";
import { MonedaActions } from "@/API/catalogos/monedas/moneda.actions";

export function TipoCambioActions() {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntTipoCambioRest/" });

  const fetch = async (): Promise<TipoCambio[]> => {
    try {
      const response = await baseAPI.post<TipoCambio[]>("getAllRecords");
      const monedaActions = MonedaActions();
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoCambios:", error);
      throw error;
    }
  };

  const create = async (data: Partial<TipoCambio>): Promise<TipoCambio> => {
    try {
      const response = await baseAPI.post<TipoCambio>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoCambio:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<TipoCambio>
  ): Promise<TipoCambio> => {
    try {
      const response = await baseAPI.put<TipoCambio>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoCambio:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
    } catch (error) {
      console.error("Error deleting TipoCambio:", error);
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
