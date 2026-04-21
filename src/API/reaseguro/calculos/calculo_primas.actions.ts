import { BaseAPI } from "@/API/BaseAPI";
import type { CalculoPrimasVidas } from "./calculo_primas.interface";

export const calculoPrimasActions = () => {
  const baseAPI = BaseAPI({ prefix: "ws_calculo_primas_reaseg_vida_grupo/api/v1/CalculoPrimasReasegVidaRest/" });

  const formatearFecha = (fecha: Date | string) => {
    if (fecha instanceof Date) {
      return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    }
    return fecha;
  };

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

  const downloadFile = async (id: string) => {
    try {
      const { data } = await baseAPI.post("getStringFile", { id });
      return typeof data === "string" ? data : data?.documentBytes ?? data;
    } catch (error) {
      console.error("Error descargando archivo:", error);
    }
  };

  const makeFileCsv = async (payload: { idRamo?: string; fechaEvaluacion?: string | Date; nombreArchivo?: string;[k: string]: any }) => {
    payload.fechaEvaluacion = formatearFecha(payload.fechaEvaluacion!);
    try {
      const { data } = await baseAPI.post("makeFileCsv", payload);
      return data;
    } catch (error) {
      console.error("Error generando CSV (makeFileCsv):", error);
      throw error;
    }
  };

  const saveFileCsv = async (payload: { idRamo?: string; fechaEvaluacion?: string | Date; nombreArchivo?: string; documentBytes?: string;[k: string]: any }) => {
    payload.fechaEvaluacion = formatearFecha(payload.fechaEvaluacion!);
    try {
      const { data } = await baseAPI.post("saveFileCsv", payload);
      return data;
    } catch (error) {
      console.error("Error guardando CSV (saveFileCsv):", error);
      throw error;
    }
  };

  const calcular = async (subramo: string, fechaEvaluacion: Date) => {
    const fechaNormalizada = formatearFecha(fechaEvaluacion);
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

  const deleteCalculo = async (idRamo: string, fechaEvaluacion: Date | string) => {
    const fechaNormalizada = formatearFecha(fechaEvaluacion);
    return await baseAPI.delete("deleteCalcReasegPrimVida", {
      data: {
        idRamo,
        fechaEvaluacion: fechaNormalizada
      }
    });
  };
  
  return {
    fetch,
    downloadFile,
    makeFileCsv,
    saveFileCsv,
    calcular,
    deleteCalculo,
  };
};