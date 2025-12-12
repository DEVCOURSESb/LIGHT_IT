import { BaseAPICatalogos } from "@/API/BaseAPICatalogos";
import type { TipoEndoso } from "./tipo_endoso.interfaces";
import { fakeData } from "@/API/fakeData";

export function TipoEndosoActions() {
  const baseAPI = BaseAPICatalogos({ prefix: "ReasegCatIntTipoEndosoRest/" });

  const fetch = async (): Promise<TipoEndoso[]> => {
    try {
      return fakeData().dataTipoEndoso;
      const response = await baseAPI.post<TipoEndoso[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching TipoEndosos:", error);
      throw error;
    }
  };

  const create = async (
    data: Partial<TipoEndoso>
  ): Promise<TipoEndoso> => {
    try {
      const response = await baseAPI.post<TipoEndoso>("create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating TipoEndoso:", error);
      throw error;
    }
  };

  const update = async (
    id: number,
    data: Partial<TipoEndoso>
  ): Promise<TipoEndoso> => {
    try {
      const response = await baseAPI.put<TipoEndoso>(`update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating TipoEndoso:", error);
      throw error;
    }
  };

  const deletes = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`);
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
