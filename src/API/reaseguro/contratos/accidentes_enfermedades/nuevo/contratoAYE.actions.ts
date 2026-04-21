import { BaseAPI } from "@/API/BaseAPI";
import type { GeneralesSection, GeneralSectionTableMoneda, GeneralSectionTableOperacionRamo } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

export const contratoAYEActions = () => {
  const baseApi = BaseAPI({
    prefix: "ws_reaseguro_contratos_aye/api/v1/",
  });

  /* !GENERALES */
  const saveGeneralesContrato = async (data: GeneralesSection) => {
    try {
      const response = await baseApi.post("CaeGeneralesContratoRest/insertRecord",
        data,
      );

      console.log(response.data)
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const saveMonedaContrato = async (data: GeneralSectionTableMoneda[]) => {
    console.log({saveMonedaContrato: data})
    try {
      await Promise.all(
        data.map((item) => {
          return baseApi.post("CaeMonedaContratoRest/insertRecord", item);
        })
      );
    } catch (error) {
      console.log(error)
    }
  }

  const saveOperacionesRamos = async (data: GeneralSectionTableOperacionRamo[]) => {
    console.log({saveOperacionesRamos: data})
    try {
      await Promise.all(
        data.map((item) => {
          return baseApi.post("CaeOperacionRamoContratoRest/insertRecord", item);
        })
      );
    } catch (error) {
      console.log(error)
    }
  };


  const getAllContracts = async () => {
    try {
      const response = await baseApi.post< GeneralesSection[] >("CaeGeneralesContratoRest/getAllRecords");
      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  return {
    saveGeneralesContrato,
    saveMonedaContrato,
    saveOperacionesRamos,
    getAllContracts,
  };
};
