import { BaseAPI } from "@/API/BaseAPI";
import type { GeneralesSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

export const contratoAYEActions = () => {
  const baseApi = BaseAPI({
    prefix: "ws_reaseguro_contratos_aye/api/v1/",
  });

  const postMany = async <T>(endpoint: string, rows: T[]) => {
    if (!rows?.length) return;

    await Promise.all(
      rows.map((row) => baseApi.post(endpoint, row))
    );
  };

  const crearContratoCompleto = async (payload: Record<string, any>) => {
    try {
      
       // ! 1. GENERALES
       await baseApi.post(
        "CaeGeneralesContratoRest/insertRecord",
        payload.GENERALES
      );

      
       // ! 2. TABLAS DEPENDIENTES DE GENERALES
       await postMany(
        "CaeMonedaContratoRest/insertRecord",
        payload.GENERALES.CAE_MONEDA_CONTRATO || []
      );

      await postMany(
        "CaeOperacionRamoContratoRest/insertRecord",
        payload.GENERALES.CAE_OPERACION_RAMO || []
      );

      
       // ! 3. DETALLES PROPORCIONALES
       await postMany(
        "CaeDetallesContratoRest/insertRecord",
        payload.DETALLES_PROPORCIONALES || []
      );

      
       // ! 4. PÓLIZAS FACULTATIVAS
       await postMany(
        "CaePolFacContratoRest/insertRecord",
        payload.POLIZAS_FACULTATIVAS || []
      );

      
       // ! 5. REASEGURADORES
       await postMany(
        "CaeReaseguradoresContratoRest/insertRecord",
        payload.REASEGURADORES || []
      );

      
       // ! 6. COMISIONES RATE ON LINE
       await postMany(
        "CaeComisRolContratoRest/insertRecord",
        payload.COMISIONES_RATE_ON_LINE || []
      );

      
       // ! 7. COBERTURAS
       await postMany(
        "CaeCoberturasContratoRest/insertRecord",
        payload.COBERTURAS || []
      );

      
       // ! 8. EXCEDENTES
       await postMany(
        "CaeExcedentesContratoRest/insertRecord",
        payload.EXCEDENTES || []
      );

      
       // ! 9. CÚMULOS
       await postMany(
        "CaeCumulosContratoRest/insertRecord",
        payload.CUMULOS || []
      );

      
       // ! 10. TARIFAS
       await postMany(
        "CaeTarifasContratoRest/insertRecord",
        payload.TARIFAS || []
      );

      
       // ! 11. PROPORCIÓN PRIMAS
       await postMany(
        "CaePrimaProporcionContratoRest/insertRecord",
        payload.PROPORCION_PRIMAS || []
      );

      
       // ! 12. REINSTALACIONES
       await postMany(
        "CaeReinstalacionesContratoRest/insertRecord",
        payload.REINSTALACIONES || []
      );

      
       // ! 13. INTERMEDIARIOS
       await postMany(
        "CaeIntermediarioContratoRest/insertRecord",
        payload.INTERMEDIARIOS || []
      );

      
       // ! 14. CORRETAJE
       await postMany(
        "CaeCorretajeContratoRest/insertRecord",
        payload.CORRETAJE || []
      );

      
       // ! 15. ADMINISTRACIÓN
       await postMany(
        "CaePagosContratoRest/insertRecord",
        payload.ADMINISTRACION?.PAGOS || []
      );

      await postMany(
        "CaeEdoContratoRest/insertRecord",
        payload.ADMINISTRACION?.ESTADO_CUENTA || []
      );

      await postMany(
        "CaeBorPrimasContratoRest/insertRecord",
        payload.ADMINISTRACION?.BOR_PRIMAS || []
      );

      await postMany(
        "CaeBorSiniestrosContratoRest/insertRecord",
        payload.ADMINISTRACION?.BOR_SINIESTROS || []
      );

      return {
        ok: true,
        message: "Contrato creado correctamente",
      };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        message: "Error al crear contrato",
        error,
      };
    }
  };


  const getAllContracts = async () => {
    try {
      const response = await baseApi.post<GeneralesSection[]>("CaeGeneralesContratoRest/getAllRecords");
      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  return {
    crearContratoCompleto,
    getAllContracts
  };
};