import { DialogType, useDialog } from "@/stores/dialogStore";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useContratoAEStore = defineStore("contratoAccEnf", () => {
  const activeTab = ref<string>(localStorage.getItem("activeTab") ?? "tab-1");

  const dialog = useDialog();

  const guardarGenerales = (data: Object) => {
    console.log("Guardando datos generales:", data);
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
