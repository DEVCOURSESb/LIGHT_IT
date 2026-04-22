import { othersActions } from "@/API/reaseguro/contratos/accidentes_enfermedades/nuevo/others.actions";
import type { PolizasFacultativasSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import { useForm } from "vee-validate";
import { ref } from "vue";

export const usePolizasFacultativasSection = () => {
  const store = useContratoAEStore();
  const { queryEmisionContableAYE } = othersActions();
  const { polizasFacultativas } = storeToRefs(store);
  const dataTableItems = ref<PolizasFacultativasSection[]>(polizasFacultativas.value || []);

  const showErrors = ref(false);
  const dialog = useDialog();

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm({
    validationSchema: {},
    validateOnMount: false,
  });

  const handleSubmit = () => {
   dialog.show({
    title: "Confirmación",
    message: "¿Confirma que los datos ingresados de pólizas facultativas del contrato son correctos?",
    type: DialogType.INFO,
    ExtraAction: {
      text: "Aceptar",
      handler: () => {
        store.guardarPolizasFacultativas(dataTableItems.value);
      }
    }
   });
  };

  const sendSelect = () => {
    const polizas = formData["noPoliza"];
    if (!polizas || polizas.length === 0) {
      dialog.show({
        title: "Atención",
        message: "Por favor, selecciona al menos una póliza.",
        type: DialogType.ERROR,
      });

      return;
    }

    dialog.show({
      title: "Agregar pólizas",
      message: "¿Confirma que los datos ingresados de pólizas facultativas del contrato son correctos?",
      ExtraAction: {
        text: "Aceptar",
        handler: () => {
          const newItems = polizas.map((poliza: string) => ({
            idContrato: "",
            noPoliza: poliza,
            polActiva: true,
          }));

          dataTableItems.value = [...newItems];

          setFieldValue("noPoliza", null);
        },
        color: "primary"
      }
    });
  };

  const togglePolizaStatus = (item: PolizasFacultativasSection) => {
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
      title: "PÓLIZA ACTIVA",
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
