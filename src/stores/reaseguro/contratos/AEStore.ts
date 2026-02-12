import { DialogType, useDialog } from "@/stores/dialogStore";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useContratoAEStore = defineStore("contratoAccEnf", () => {
  const activeTab = ref<string>(localStorage.getItem("activeTab") ?? "tab-1");
  const isTypeProporcional = ref<boolean>(
    localStorage.getItem("isTypeProporcional") === "true",
  );

  const dialog = useDialog();

  const guardarGenerales = (data: Record<string, any>) => {
    console.log("Guardando datos generales:", data);

    // actualizar antes de usarlo para decidir el tab
    isTypeProporcional.value = Number(data.cveTreaseg) === 0;
    localStorage.setItem("isTypeProporcional", isTypeProporcional.value.toString());

    const copy = { ...data };
    delete copy?.dataTableMoneda;
    delete copy?.dataTableOperacionRamo;
    window.localStorage.setItem("CAE_GENERALES_CONTRATO", JSON.stringify(copy));

    const informacionMoneda = data.dataTableMoneda.map((moneda: any) => {
      return {
        cveContrato: data.idContrato,
        cveMonedaContrato: moneda.cveMoneda,
        monActiva: moneda.monActiva,
      };
    });
    window.localStorage.setItem("CAE_MONEDA_CONTRATO", JSON.stringify(informacionMoneda));

    const informacionOperacionRamo = data.dataTableOperacionRamo.map((operacionRamo: any) => {
      return {
        cveContrato: data.idContrato,
        cveExtCoberContrato: operacionRamo.cveExtCober,
        cveOperRamo: operacionRamo.cveCobertura,
        operRamoActivo: operacionRamo.operRamoActivo,
      };
    });
    window.localStorage.setItem("CAE_OPERACION_RAMO_CONTRATO", JSON.stringify(informacionOperacionRamo));

    window.localStorage.setItem("contratoAE_generales", JSON.stringify(data));

    // ahora isTypeProporcional ya tiene el valor correcto
    activeTab.value = isTypeProporcional.value ? "tab-2" : "tab-3";

    dialog.show({
      title: "Datos guardados",
      message: "Los datos generales han sido guardados exitosamente.",
      type: DialogType.SUCCESS,
    });
  };

  const obtenerGenerales = () => {
    const data = window.localStorage.getItem("contratoAE_generales") || "{}";
    const parsed = JSON.parse(data);

    if (parsed.cveTreaseg !== undefined && parsed.cveTreaseg !== null) {
      isTypeProporcional.value = Number(parsed.cveTreaseg) === 0;
    }

    return {
      ...parsed,
      fechaInicioContrato: parsed.fechaInicioContrato
        ? new Date(parsed.fechaInicioContrato)
        : null,
      fechaFinContrato: parsed.fechaFinContrato
        ? new Date(parsed.fechaFinContrato)
        : null,
    };
  };

  const setTipoReaseguro = (newValue: number) => {
    isTypeProporcional.value = newValue === 0;
    localStorage.setItem("isTypeProporcional", isTypeProporcional.value.toString());
  };

  const guardarDetallesProporcionales = (data: Record<string, any>[]) => {
    
    // TODO, CLAVE DE CONTRATO, DE MOMENTO SE ASIGNA EL ID
    const cveContrato = obtenerGenerales().idContrato;
    const dataWithContrato = data.map((item) => ({
      ...item,
      cveContrato,
    }));
    window.localStorage.setItem("CAE_DETALLES_CONTRATO", JSON.stringify(dataWithContrato));
    activeTab.value = "tab-3";
  }

  const obtenerDetallesProporcionales = () => {
    const data = window.localStorage.getItem("CAE_DETALLES_CONTRATO") || "[]";
    return JSON.parse(data);
  }

  // Persistencia automática
  watch(activeTab, (value) => {
    localStorage.setItem("activeTab", value);
  });

  return {
    activeTab,
    guardarGenerales,
    obtenerGenerales,
    isTypeProporcional,
    setTipoReaseguro,
    guardarDetallesProporcionales,
    obtenerDetallesProporcionales,
  };
});