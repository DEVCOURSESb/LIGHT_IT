import { BaseAPI } from "@/API/BaseAPI";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";

export const calculoPrimasActions = () => {
  const baseAPI = BaseAPI({ prefix: "/reaseguro/primas" });

  const fetchData = async () => {
    try {
      const { data } = await baseAPI.post("/");
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calcular = async (subramo: string, fechaCalculo: Date) => {
    try {
      const { data } = await baseAPI.post("/calcular", {
        subramo,
        fechaCalculo,
      });
      return data;
    } catch (error) {
      console.error("Error calculating data:", error);
    }
  };

  const downloadExcel = async (subramo: string, fechaCalculo: Date) => {
    try {
      const { data } = await baseAPI.post("/calcular/excel", {
        subramo,
        fechaCalculo,
      });

      downloadFileFromBase64(
        data.base64Data,
        "archivo.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      return data;
    } catch (error) {
      console.error("Error downloading excel:", error);
    }
  };

  const deleteCalcule = async (id: number) => {
    try {
      const { data } = await baseAPI.delete(`/${id}`);
      return data;
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return {
    fetchData,
    calcular,
    downloadExcel,
    deleteCalcule,
  };
};
