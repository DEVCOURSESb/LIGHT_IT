import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useContratoAEStore = defineStore("contratoAccEnf", () => {
  const activeTab = ref<string>(localStorage.getItem("activeTab") ?? "tab-1");

  const guardarGenerales = (data: Object) => {
    console.log("Guardando datos generales:", data);
    window.localStorage.setItem("contratoAE_generales", JSON.stringify(data));
  };

  const obtenerGenerales = () => {
    const data = window.localStorage.getItem("contratoAE_generales");
    return data ? JSON.parse(data) : {};
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
