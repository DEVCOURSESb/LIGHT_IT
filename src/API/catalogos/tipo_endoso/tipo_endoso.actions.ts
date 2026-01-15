import { BaseAPI } from "@/API/BaseAPI";
import type { TipoEndoso } from "./tipo_endoso.interfaces";

export function TipoEndosoActions() {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntTipoEndosoRest/" });

  const fetch = async (): Promise<TipoEndoso[]> => {
    try {
      const response = await baseAPI.post<TipoEndoso[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoEndosos:", error);
      throw error;
    }
  };

  const create = async (data: Partial<TipoEndoso>): Promise<TipoEndoso[]> => {
    try {
      const response = await baseAPI.post<TipoEndoso[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoEndoso:", error);
      throw error;
    }
  };

  const update = async (data: Partial<TipoEndoso>): Promise<TipoEndoso[]> => {
    try {
      const response = await baseAPI.put<TipoEndoso[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoEndoso:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<TipoEndoso[]> => {
    try {
      const response = await baseAPI.delete<TipoEndoso[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting TipoEndoso:", error);
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
