import { BaseAPI } from "@/API/BaseAPI";
import type { Intermediario } from "./intermediario.interfaces";

export const IntermediariosActions = () => {
  const baseAPI = BaseAPI({ prefix: "ReasegCatCnsfIntermediarioRest/" });

  const fetchIntermediarios = async (): Promise<Intermediario[]> => {
    try {
      const response = await baseAPI.get<Intermediario[]>("getAllRecords");
      return response.data;
    } catch (error) {
      throw new Error("");
    }
  };

  return { fetchIntermediarios };
};
