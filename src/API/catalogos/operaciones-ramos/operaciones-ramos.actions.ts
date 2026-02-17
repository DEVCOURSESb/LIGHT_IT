import { BaseAPI } from "@/API/BaseAPI";
import type { OperacionRamo } from "./operaciones-ramos.interfaces";

export const OperacionesRamosActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintOperYRamosAnx3817Rest/" });

  const fetchOperacionesRamos = async (): Promise<OperacionRamo[]> => {
    try {
      const response = await baseAPI.post<OperacionRamo[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching operaciones ramos:", error);
      throw error;
    }
  };

  const fetchOperacionesRamosFiltered = async () => {
    try {
      const data = await fetchOperacionesRamos();
  
      return data
            .filter((row) => row.cveExtCober === "2" && row.ramo === "010")
            .map(({ descOperacionRamos, cveCobertura }) => ({ descOperacionRamos, cveCobertura }));
    } catch (error) {
      return [];
    }
  }

  const createOperacionRamo = async (data: Partial<OperacionRamo>): Promise<OperacionRamo[]> => {
    try {
      const response = await baseAPI.post<OperacionRamo[]>("insertRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error creating operacion ramo:", error);
      throw error;
    }
  };

  const updateOperacionRamo = async (data: Partial<OperacionRamo>): Promise<OperacionRamo[]> => {
    try {
      const response = await baseAPI.put<OperacionRamo[]>("updateRecord", data);
      return response.data;
    } catch (error) {
      console.error("Error updating operacion ramo:", error);
      throw error;
    }
  };

  const deleteOperacionRamo = async (id: number): Promise<OperacionRamo[]> => {
    try {
      const response = await baseAPI.delete<OperacionRamo[]>(`deleteRecord/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting operacion ramo:", error);
      throw error;
    }
  };

  return {
    fetchOperacionesRamos,
    fetchOperacionesRamosFiltered,
    createOperacionRamo,
    updateOperacionRamo,
    deleteOperacionRamo,
  };
};
