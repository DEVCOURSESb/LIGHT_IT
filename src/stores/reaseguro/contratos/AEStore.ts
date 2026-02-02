import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useContratoAEStore = defineStore("contratoAccEnf", () => {
  const activeTab = ref<string>(localStorage.getItem("activeTab") ?? "tab-1");

  const setActiveTab = (newTab: string): void => {
    activeTab.value = newTab;
  };

  // Persistencia automática
  watch(activeTab, (value) => {
    localStorage.setItem("activeTab", value);
  });

  return {
    activeTab,
    setActiveTab,
  };
});
