import { BaseAPI } from "@/API/BaseAPI";
import type { EmisionContableAYE } from "./emision_contable_AYE.interface";

export const emisionCobtableAYEActions = () => {
  const baseAPI = BaseAPI({
    prefix: "ws_contratos_ae/api/v1/emisionContableaye/",
  });

  const fetch = async (): Promise<EmisionContableAYE[]> => {
    try {
      return [1, 2, 3, 4, 5].map((num) => ({
        id: num,
        NUM_POLIZA: num * 10,
      }));

      const response =
        await baseAPI.post<EmisionContableAYE[]>("getAllRecords");
      return response.data;
    } catch (error) {
      console.error("Error fetching emision contable AYE:", error);
      throw error;
    }
  };

  return {
    fetch,
  };
};
