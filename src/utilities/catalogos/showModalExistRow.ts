import { DialogType, useDialog } from "@/stores/dialogStore";

export const showModalExistRow = (message?: string) => {
  const dialog = useDialog();

  dialog.show({
    title: "Registro Existente",
    message:
      message ||
      "El registro que intentas crear / actualizar ya existe, por favor verifica la información.",
    type: DialogType.ERROR,
  });
};
