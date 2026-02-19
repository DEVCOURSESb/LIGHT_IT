import { BaseAPI } from "@/API/BaseAPI";
import type { CalculoPrimasVidas } from "./calculo_primas.interface";

export const calculoPrimasActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_calculo_primas_reaseg_vida_grupo/api/v1/CalculoPrimasReasegVidaRest/" });

  const fetch = async () => {
    try {
      const { data } = await baseAPI.post<CalculoPrimasVidas[]>("getFileCalcResegPrim", {
        subramo: "",
        fechaCalculo: "",
      });
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calcular = async (subramo: string, fechaEvaluacion: Date) => {
    const fechaNormalizada = fechaEvaluacion.toISOString().split("T")[0];
    try {
      const response = await baseAPI.post("calcReasegPrimVida", {
        idRamo: subramo,
        fechaEvaluacion: fechaNormalizada,
      });
      return response;
    } catch (error) {
      console.error("Error calculating data:", error);
    }
  };

  const deleteCalculo = async (idRamo: string, fechaEvaluacion: Date) => {
    try {
      const { data } = await baseAPI.delete("deleteCalcReasegPrimVida", {
        data: {
          idRamo,
          fechaEvaluacion
        }
      });
      return data;
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return {
    fetch,
    calcular,
    deleteCalculo,
  };
};
