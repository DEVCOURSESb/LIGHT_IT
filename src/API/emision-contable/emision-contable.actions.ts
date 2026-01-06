import { BaseAPI } from "@/API/BaseAPI";
import type {EmisionContable} from "./emision-contable.interfaces";

export const EmisionContableActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_catalogos_reaseguro/api/v1/EmisionContableRest/getRecordsBetween/2025-01-01/2025-12-31"});

  const fetchEmisionContables = async (): Promise<EmisionContable[]> => {
    try {
      const response = await baseAPI.post<EmisionContable[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching EmisionContables:", error);
      throw error;
    }
  };

  return {
    fetchEmisionContables,
  };
};
