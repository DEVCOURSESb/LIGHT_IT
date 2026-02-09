import { monedaConfig } from "@/components/config/catalogos/moneda/moneda.config";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useGeneralValidations } from "./useGeneralValidations";
import { catalogosActions } from "@/API/reaseguro/contratos/accidentes_enfermedades/nuevo/catalogos.actions";
import type { Moneda } from "@/API/catalogos/monedas/moneda.interfaces";
import { DialogType, useDialog } from "@/stores/dialogStore";

export const useGeneralSection = () => {
  // estado general del contrato de accidentes y enfermedades
  const contratoAEStore = useContratoAEStore();
  
  const  dialog = useDialog();

  // catalogos a utilizar
  const {
    queryTiposReaseguro,
    queryTiposContrato,
    queryFormaContractual,
    queryCriterioCobertura,
    queryEntidadFederativa,
    queryRr6Sector,
    queryMoneda,
    queryExtensionesCobertura,
    queryOperacionesRamos,
  } = catalogosActions();

  const showErrors = ref(false);

  const initialValues = contratoAEStore.obtenerGenerales();

  const dataTableMoneda = ref<Moneda[]>(initialValues.dataTableMoneda || []);

  const errorTablaMonedas = ref<string | undefined>(undefined);

 const sendSelectToTableMoneda = () => {
    dialog.show({
      title: "Agregar monedas",
      message: "Se agregarán las monedas seleccionadas a la tabla. ¿Desea continuar?",
      ExtraAction: {
       text: "Aceptar",
        handler: () => {
          const monedasFound = formData['cveMonedaContrato']?.map((monedaSelected: number) => {
            const found = queryMoneda.data.value?.find(moneda => moneda.cveMoneda === monedaSelected)
            return found ? { ...found, monActiva: true } : null;
          }).filter(Boolean);

          dataTableMoneda.value = monedasFound || [];

           if (dataTableMoneda.value.length > 0) {
            errorTablaMonedas.value = undefined;
          }
        },
        color: "primary",
      }
    });
  }

  const toggleMonActiva = (item: Moneda) => {

    // buca si por lo menos hay dos monedas activas, para permitir desactivar una
    const algunaActiva = dataTableMoneda.value.some(m => m.cveMoneda !== item.cveMoneda && m.monActiva);

    // si no hay ninguna activa, mostramos un dialogo y salimos de la funcion
    if (!algunaActiva) {
      dialog.show({
        title: "Atención",
        message: "Debe haber al menos una moneda activa.",
        type: DialogType.ERROR
      });

      return;
    }

    // busca el index del itm a modificar
    const index = dataTableMoneda.value.findIndex(m => m.cveMoneda === item.cveMoneda);

    // si el index es valido, cambia el valor de monActiva
    if (index !== -1) {
      dataTableMoneda.value[index]!.monActiva = !dataTableMoneda.value[index]?.monActiva;
      console.log('Toggle monActiva:', dataTableMoneda.value[index]);
    }
  };

    const validarTablaMonedas = (): boolean => {
    if (dataTableMoneda.value.length === 0) {
      errorTablaMonedas.value = "Debe agregar al menos una moneda a la tabla.";
      return false;
    }

    const algunaActiva = dataTableMoneda.value.some(m => m.monActiva);
    if (!algunaActiva) {
      errorTablaMonedas.value = "Debe haber al menos una moneda activa.";
      return false;
    }

    errorTablaMonedas.value = undefined;
    return true;
  };

  const {
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
  } = useForm({
    initialValues,
    validationSchema: useGeneralValidations(),
    validateOnMount: false,
  });

  const headerMoneda = monedaConfig.headers.filter(
    (header) => header.key != "esActivo" &&  header.key != "actions",
  );

  headerMoneda.push({
    title: "Activa",
    key: "monActiva",
    sortable: true,
    headerProps: {
      style: "font-weight: bold",
    },
  });

  const headerOperaciones = [
    {
      title: "Tipo operación / ramo",
      key: "cveOperacion",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "OPERACIÓN / RAMO",
      key: "descOperacion",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "ACTIVO",
      key: "esActivo",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
  ];

  const handleSubmit = async () => {
    showErrors.value = true;

    const { valid } = await validate();
    const tablaValida = validarTablaMonedas();

    if (valid && tablaValida) {
      console.log({...formData, dataTableMoneda })
      contratoAEStore.guardarGenerales({...formData, dataTableMoneda: dataTableMoneda.value });
    } else {
      console.log("Errores de validación:", formErrors);
    }
  };

  return {
    formData,
    formErrors,
    setFieldValue,
    handleSubmit,
    headerMoneda,
    headerOperaciones,
    showErrors,
    dataTableMoneda,
    sendSelectToTableMoneda,
    toggleMonActiva,
    errorTablaMonedas,

    // catalogos a utilizar
    queryTiposReaseguro,
    queryTiposContrato,
    queryFormaContractual,
    queryCriterioCobertura,
    queryEntidadFederativa,
    queryRr6Sector,
    queryMoneda,
    queryExtensionesCobertura,
    queryOperacionesRamos,
  };  
};
