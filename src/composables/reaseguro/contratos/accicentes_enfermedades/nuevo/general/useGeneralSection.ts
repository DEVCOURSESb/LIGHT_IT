import { monedaConfig } from "@/components/config/catalogos/moneda/moneda.config";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useGeneralValidations } from "./useGeneralValidations";
import { catalogosActions } from "@/API/reaseguro/contratos/accidentes_enfermedades/nuevo/catalogos.actions";
import type { Moneda } from "@/API/catalogos/monedas/moneda.interfaces";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { ExtensionesConfig } from "@/components/config/catalogos/extensiones/extensiones.config";
import { operacionesRamosConfig } from "@/components/config/catalogos/operaciones-ramos/operaciones-ramos.config";

interface dataOperacionRamo {
  cveExtCober: number;
  descExtCober: string;
  cveCobertura: string;
  descOperacionRamos: string;
  operRamoActivo: boolean;
}

export const useGeneralSection = () => {
  // estado general del contrato de accidentes y enfermedades
  const contratoAEStore = useContratoAEStore();

  const dialog = useDialog();

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

  const dataTableOperacionRamo = ref<dataOperacionRamo[]>(initialValues.dataTableOperacionRamo || []);
  const errorTablaOperacionRamo = ref<string | undefined>(undefined);

  const sendSelectToTableMoneda = () => {
    const monedaSeleccionadas = formData["cveMonedaContrato"];

    if (!monedaSeleccionadas || monedaSeleccionadas.length === 0) {
      dialog.show({
        title: "Atención",
        message:
          "Debe seleccionar al menos una moneda antes de agregar a la tabla.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Agregar monedas",
      message:
        "Se agregarán las monedas seleccionadas a la tabla. ¿Desea continuar?",
      ExtraAction: {
        text: "Aceptar",
        handler: () => {
          const monedasFound = formData["cveMonedaContrato"]?.map((monedaSelected: number) => {
              const found = queryMoneda.data.value?.find((moneda) => moneda.cveMoneda === monedaSelected);
              return found ? { ...found, monActiva: true } : null;
            })
            .filter(Boolean);

          dataTableMoneda.value = monedasFound || [];

          if (dataTableMoneda.value.length > 0) {
            errorTablaMonedas.value = undefined;
          }

          setFieldValue("cveMonedaContrato", null);
        },
        color: "primary",
      },
    });
  };

  const toggleMonActiva = (item: Moneda) => {
    // busca si por lo menos hay dos monedas activas, para permitir desactivar una
    const algunaActiva = dataTableMoneda.value.some((m) => m.cveMoneda !== item.cveMoneda && m.monActiva);

    // si no hay ninguna activa, mostramos un dialogo y salimos de la funcion
    if (!algunaActiva) {
      dialog.show({
        title: "Atención",
        message: "Debe haber al menos una moneda activa.",
        type: DialogType.ERROR,
      });

      return;
    }

    // busca el index del itm a modificar
    const index = dataTableMoneda.value.findIndex((m) => m.cveMoneda === item.cveMoneda);

    // si el index es valido, cambia el valor de monActiva
    if (index !== -1) {
      dataTableMoneda.value[index]!.monActiva = !dataTableMoneda.value[index]?.monActiva;
    }
  };

  const validarTablaMonedas = (): boolean => {
    if (dataTableMoneda.value.length === 0) {
      errorTablaMonedas.value = "Debe agregar al menos una moneda a la tabla.";
      return false;
    }

    const algunaActiva = dataTableMoneda.value.some((m) => m.monActiva);

    if (!algunaActiva) {
      errorTablaMonedas.value = "Debe haber al menos una moneda activa.";
      return false;
    }

    errorTablaMonedas.value = undefined;
    return true;
  };

  const sendSelectToTableOperacionRamo = () => {
    const cveExtCoberSeleccionada = formData["cveExtCober"];
    const cveCoberturaSeleccionadas = formData["cveCobertura"];

    if (!cveExtCoberSeleccionada || !cveCoberturaSeleccionadas) {
      dialog.show({
        title: "Atención",
        message: "Debe seleccionar una extensión de cobertura y una cobertura antes de agregar a la tabla.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Agregar operación/ramo",
      message: "Se agregará la operación/ramo seleccionada a la tabla. ¿Desea continuar?",
      ExtraAction: {
        text: "Aceptar",
        handler: () => {
          // obtener el objeto completo de extensión de cobertura
          const extCoberSelected = queryExtensionesCobertura.data.value?.find(
            (ext) => ext.cveExtCober === cveExtCoberSeleccionada,
          );

          dataTableOperacionRamo.value = dataTableOperacionRamo.value.filter(
            (row) => row.cveExtCober !== cveExtCoberSeleccionada,
          );

          // obtener los objetos completos de operacion ramo seleccionadas
          const coberturasSelected = queryOperacionesRamos.data.value?.filter(
            (cob) => cveCoberturaSeleccionadas.includes(cob.cveCobertura),
          );

          if (extCoberSelected && coberturasSelected) {
            coberturasSelected.forEach((cobertura) => {
              dataTableOperacionRamo.value.push({
                cveExtCober: extCoberSelected.cveExtCober,
                descExtCober: extCoberSelected.descExtCober,
                cveCobertura: cobertura.cveCobertura,
                descOperacionRamos: cobertura.descOperacionRamos,
                operRamoActivo: true,
              });
              setFieldValue("cveExtCober", null);
              setFieldValue("cveCobertura", null);
            });
          }
        },
      },
    });
  };

  const toggleOperRamoActivo = (item: dataOperacionRamo) => {
    console.log("cambio de activo", item);
    // buca si por lo menos hay dos monedas activas, para permitir desactivar una
    const algunaActiva = dataTableOperacionRamo.value.some(
      (m) => m.cveCobertura !== item.cveCobertura && m.operRamoActivo,
    );

    // si no hay ninguna activa, mostramos un dialogo y salimos de la funcion
    if (!algunaActiva) {
      dialog.show({
        title: "Atención",
        message: "Debe haber al menos un ramo operación activo.",
        type: DialogType.ERROR,
      });

      return;
    }

    // busca el index del itm a modificar
    const index = dataTableOperacionRamo.value.findIndex(
      (m) =>
        m.cveExtCober === item.cveExtCober &&
        m.cveCobertura === item.cveCobertura,
    );

    // si el index es valido, cambia el valor de monActiva
    if (index !== -1) {
      dataTableOperacionRamo.value[index]!.operRamoActivo = !dataTableOperacionRamo.value[index]?.operRamoActivo;
    }
  };

  const validarTablaOperacionRamo = (): boolean => {
    if (dataTableOperacionRamo.value.length === 0) {
      errorTablaOperacionRamo.value = "Debe agregar al menos un operación/ramo a la tabla.";
      return false;
    }
    const algunaActiva = dataTableOperacionRamo.value.some((m) => m.operRamoActivo);

    if (!algunaActiva) {
      errorTablaOperacionRamo.value = "Debe haber al menos un operación/ramo activo.";
      return false;
    }
    errorTablaOperacionRamo.value = undefined;
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

  // Watch para limpiar campos cuando cambia el tipo de reaseguro
  watch(
    () => formData.cveTreaseg,
    (newValue) => {
      contratoAEStore.setTipoReaseguro(Number(newValue));

      if (Number(newValue) !== 0) {
        setFieldValue("cveCriterioCob", null);
        setFieldValue("traspasoCartera", null);
      }
    }
  );


  // Watch para limpiar campos cuando cambia la forma contractual
  watch(
    () => formData.cveFcontrac,
    (newValue, oldValue) => {
      // Si cambia de facultativa (1) a otro valor, limpiar campos relacionados
      if (oldValue === 1 && newValue !== 1) {
        setFieldValue('cveEntidad', null);
        setFieldValue('municipio', null);
        setFieldValue('cveSector', null);
        setFieldValue('asegurado', null);
      }
    }
  );

  // obteniendo los headers de tablas desde sus archivos de configuracion
  const headerMoneda = monedaConfig.headers.filter(
    (header) => header.key != "esActivo" && header.key != "actions",
  );

  headerMoneda.push({
    title: "ACTIVO",
    key: "monActiva",
    sortable: true,
    headerProps: {
      style: "font-weight: bold",
    },
  });

  const headersExtension = ExtensionesConfig.headers.filter(header => header.key !== "actions" && header.key !== "esActivo");
  const headeroperations = operacionesRamosConfig.headers.filter(header => header.key !== "actions" && header.key !== "esActivo");

  const headerOperaciones = [
    ...headersExtension,
    ... headeroperations,
    {
      title: "ACTIVO",
      key: "operRamoActivo",
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
    const tablaOperacionRamoValida = validarTablaOperacionRamo();

    if (valid && tablaValida && tablaOperacionRamoValida) {
      contratoAEStore.guardarGenerales({
        ...formData,
        dataTableMoneda: dataTableMoneda.value,
        dataTableOperacionRamo: dataTableOperacionRamo.value,
      });
    }
  };

  return {
    // formulario
    formData,
    formErrors,
    setFieldValue,
    handleSubmit,
    showErrors,

    //tablas
    headerMoneda,
    dataTableMoneda,
    sendSelectToTableMoneda,
    toggleMonActiva,
    errorTablaMonedas,
    //
    headerOperaciones,
    dataTableOperacionRamo,
    sendSelectToTableOperacionRamo,
    toggleOperRamoActivo,
    errorTablaOperacionRamo,

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
