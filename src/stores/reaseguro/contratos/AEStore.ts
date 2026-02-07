import { DialogType, useDialog } from "@/stores/dialogStore";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useContratoAEStore = defineStore("contratoAccEnf", () => {
  const activeTab = ref<string>(localStorage.getItem("activeTab") ?? "tab-1");

  const dialog = useDialog();

  const guardarGenerales = (data: Record<string, any>) => {
    console.log("Guardando datos generales:", data);

    const copy = { ...data, };
    delete copy?.dataTableMoneda;
    delete copy?.dataTableOperacionRamo;
    window.localStorage.setItem("CAE_GENERALES_CONTRATO", JSON.stringify(copy));
    
    const informacionMoneda = data.dataTableMoneda.map((moneda: any) => {
        /* TODO: verificar clave de contrato */
        /* TODO: cveMonedaContrato opcion de crear un type desde la tabla */
        return {
          cveContrato: data.idContrato,
          cveMonedaContrato: moneda.cveMoneda,
          monActiva: moneda.monActiva,
      }
    });
    window.localStorage.setItem("CAE_MONEDA_CONTRATO", JSON.stringify(informacionMoneda));


    const informacionOperacionRamo = data.dataTableOperacionRamo.map((operacionRamo: any) => {
      /* TODO: mismo caso de clave contrato y types */
      return {
        cveContrato: data.idContrato,
        cveExtCoberContrato: operacionRamo.cveExtCober,
        cveCoberContrato: operacionRamo.cveCobertura,
        cveOperacionRamo: operacionRamo.cveOperacionRamo,
        operRamoActivo: operacionRamo.operRamoActivo,
      }
    });

    window.localStorage.setItem("CAE_OPERACION_RAMO_CONTRATO", JSON.stringify(informacionOperacionRamo));


    window.localStorage.setItem("contratoAE_generales", JSON.stringify(data));

    activeTab.value = "tab-2";

    dialog.show({
      title: "Datos guardados",
      message: "Los datos generales han sido guardados exitosamente.",
      type: DialogType.SUCCESS,
    })
  };

  const obtenerGenerales = () => {
    const data = window.localStorage.getItem("contratoAE_generales") || "{}";
      const parsed = JSON.parse(data);
    
    return {
      ...parsed,
      fechaInicioContrato: parsed.fechaInicioContrato 
        ? new Date(parsed.fechaInicioContrato) 
        : null,
      fechaFinContrato: parsed.fechaFinContrato 
        ? new Date(parsed.fechaFinContrato) 
        : null,
    };
  }

  // Persistencia automática
  watch(activeTab, (value) => {
    localStorage.setItem("activeTab", value);
  });

  return {
    activeTab,
    guardarGenerales,
    obtenerGenerales
  };
});
