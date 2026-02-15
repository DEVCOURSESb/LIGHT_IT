import { othersActions } from "@/API/reaseguro/contratos/accidentes_enfermedades/nuevo/others.actions";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useForm } from "vee-validate";
import { ref } from "vue";

interface PolizasFacultativasForm {
  noPoliza: string;
  polActiva: boolean;
}

export const usePolizasFacultativasSection = () => {
  const { queryEmisionContableAYE } = othersActions();
  const dataTableItems = ref<PolizasFacultativasForm[]>([]);

  const showErrors = ref(false);
  const dialog = useDialog();

  const {
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
  } = useForm({
    validationSchema: {},
    validateOnMount: false,
  });

  const handleSubmit = () => {
    console.log("send");
  };

  const sendSelect = () => {
    const polizas = formData["noPoliza"];
    if (!polizas || polizas.length === 0) {
      dialog.show({
        title: "Atención",
        message: "Por favor, selecciona al menos una póliza.",
        type: DialogType.ERROR,
        ExtraAction: {
          text: "Aceptar",
          color: "primary",
          handler: () => {},
        },
      });

      return;
    }

    const newItems = polizas.map((poliza: string) => ({
      noPoliza: poliza,
      polActiva: true,
    }));

    dataTableItems.value = [...newItems];

    setFieldValue("noPoliza", null);
  };

  const togglePolizaStatus = (item: PolizasFacultativasForm) => {
    // alguna activa
    const algunaActiva = dataTableItems.value.some(
      (p) => p.polActiva && p.noPoliza !== item.noPoliza,
    );

    // si no hay ninguna activa, mostramos un dialogo y salimos de la funcion
    if (!algunaActiva) {
      dialog.show({
        title: "Atención",
        message: "Debe haber al menos una póliza activa.",
        type: DialogType.ERROR,
      });

      return;
    }

    const index = dataTableItems.value.findIndex(
      (p) => p.noPoliza === item.noPoliza,
    );

    if (index !== -1) {
      dataTableItems.value[index]!.polActiva =
        !dataTableItems.value[index]!.polActiva;
    }
  };

  const polizasHeader = [
    {
      title: "NÚMERO DE PÓLIZA",
      key: "noPoliza",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "ACTIVO",
      key: "polActiva",
      headerProps: {
        style: "font-weight: bold",
      },
    },
  ];

  return {
    queryEmisionContableAYE,
    handleSubmit,
    formData,
    showErrors,
    formErrors,
    setFieldValue,
    polizasHeader,
    dataTableItems,
    sendSelect,
    togglePolizaStatus,
  };
};
