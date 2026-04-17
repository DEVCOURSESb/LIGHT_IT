import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbar = defineStore("snackbar", () => {
  const showSnackbar = ref(false);
  const text = ref("");
  const snackbarColor = ref<"success" | "error" | "info">("success");

  const cerrarSnackbar = () => {
    text.value = "";
    snackbarColor.value = "success";
    showSnackbar.value = false;
  };

  const mostrarMensajeSnackbar = (
    texto: string,
    color: "success" | "error" | "info"
  ) => {
    text.value = texto;
    snackbarColor.value = color;
    showSnackbar.value = true;
  };

  return {
    showSnackbar,
    text,
    snackbarColor,
    mostrarMensajeSnackbar,
    cerrarSnackbar,
  };
});
