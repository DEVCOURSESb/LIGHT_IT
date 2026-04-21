import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { useForm } from "vee-validate";
import { computed, ref, toRaw, watch } from "vue";
import { useGeneralValidations } from "./useGeneralValidations";
import { catalogosActions } from "@/API/reaseguro/contratos/accidentes_enfermedades/nuevo/catalogos.actions";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import type {
  GeneralesSection,
  GeneralSectionTableMoneda,
  GeneralSectionTableOperacionRamo,
} from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

type GeneralesForm = GeneralesSection & {
  cveMonedaContrato?: number[] | null;
  cveExtCoberContrato?: number | null;
  cveOperRamo?: string[] | null;
};

export const useGeneralSection = () => {
  // estado general del contrato de accidentes y enfermedades
  const aeStore = useContratoAEStore();

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
  const rawGenerales = toRaw(aeStore.generales);

  const { CAE_MONEDA_CONTRATO, CAE_OPERACION_RAMO, ...initialValues } =
  structuredClone(rawGenerales);

  const headerProps = { style: "font-weight: bold" };

  const dataTableMoneda = ref<GeneralSectionTableMoneda[]>(
    CAE_MONEDA_CONTRATO || [],
  );
  const errorTablaMonedas = ref<string | undefined>(undefined);
  const headersMoneda = [
    { title: "MONEDA", key: "cveMonedaContrato", sortable: true, headerProps },
    {
      title: "DESCRIPCIÓN DE MONEDA",
      key: "decMoneda",
      sortable: true,
      headerProps,
    },
    { title: "ACTIVA", key: "monActiva", sortable: true, headerProps },
  ];
  const dataMonedaToShow = computed(() => {
    return dataTableMoneda.value.map((mon) => {
      const monedaInfo = queryMoneda.data.value?.find(
        (m) => m.cveMoneda === mon.cveMonedaContrato,
      );
      return {
        ...mon,
        decMoneda: monedaInfo ? monedaInfo.descMoneda : "Desconocida",
      };
    });
  });

  const dataTableOperacionRamo = ref<GeneralSectionTableOperacionRamo[]>(
    CAE_OPERACION_RAMO || [],
  );
  const errorTablaOperacionRamo = ref<string | undefined>(undefined);
  const headersOperacionRamo = [
    {
      title: "TIPO OPERACIÓN / RAMO",
      key: "descTipoContrato",
      sortable: true,
      headerProps,
    },
    {
      title: "OPERACIÓN / RAMO",
      key: "descOperacionRamos",
      sortable: true,
      headerProps,
    },
    { title: "ACTIVA", key: "operRamoActivo", sortable: true, headerProps },
  ];
  const dataOperacionesRamosShow = computed(() => {
    return dataTableOperacionRamo.value.map((row) => {
      // busca el tipo de operacion
      const tipoOperacionRamo = queryExtensionesCobertura.data.value?.find(
        (o) => o.cveExtCober === row.cveExtCoberContrato,
      );
      // busca la operacion ramo
      const operacionRamoInfo = queryOperacionesRamos.data.value?.find(
        (o) => o.cveCobertura === row.cveOperRamo,
      );
      return {
        ...row,
        descTipoContrato: tipoOperacionRamo?.descExtCober || "Desconocida",
        descOperacionRamos:
          operacionRamoInfo?.descOperacionRamos || "Desconocida",
      };
    });
  });

  const tiposExtCoberBloqueados = computed<Set<number>>(() => {
    const bloqueados = new Set<number>();
    const tabla = dataTableOperacionRamo.value;
    const catalogo = queryOperacionesRamos.data.value ?? [];

    // Tipos 0 y 1: basta con que haya al menos un registro activo
    for (const tipo of [0, 1]) {
      const tieneActivo = tabla.some(
        (r) => r.cveExtCoberContrato === tipo && r.operRamoActivo,
      );
      if (tieneActivo) bloqueados.add(tipo);
    }

    // Tipos 2 y 3: bloqueado solo cuando todas las opciones del catálogo están cubiertas y activas
    for (const tipo of [2, 3]) {
      const opcionesDelCatalogo = catalogo
        .filter(
          (c) => Number(c.cveExtCober) === tipo && c.operacion === "3000",
        )
        .map((c) => c.cveCobertura);

      if (opcionesDelCatalogo.length === 0) continue;

      const todasCubiertasYActivas = opcionesDelCatalogo.every((cve) =>
        tabla.some(
          (r) =>
            r.cveExtCoberContrato === tipo &&
            String(r.cveOperRamo) === String(cve) &&
            r.operRamoActivo,
        ),
      );

      if (todasCubiertasYActivas) bloqueados.add(tipo);
    }

    return bloqueados;
  });

  const opcionesExtCoberDisponibles = computed(() => {
    return (queryExtensionesCobertura.data.value ?? []).map((item) => ({
        ...item,
        disabled: tiposExtCoberBloqueados.value.has(item.cveExtCober),
      }));
  });

  const opcionesOperRamoFiltradas = computed(() => {
    const tipo = Number(formData.cveExtCoberContrato);
    const catalogo = queryOperacionesRamos.data.value ?? [];
    const tabla = dataTableOperacionRamo.value ?? [];

    if (!tipo) return [];

    let opciones = catalogo.filter(c =>
      Number(c.cveExtCober) === tipo &&
      String(c.operacion) === "3000"
    );

    if (tipo === 3) {
      const usadosTipo2 = new Set(
        tabla
          .filter(r => Number(r.cveExtCoberContrato) === 2)
          .map(r => String(r.cveOperRamo))
      );

      opciones = opciones.filter(
        c => !usadosTipo2.has(String(c.subramo))
      );
    }

    return opciones;
  });

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
          const monedasFound =
            monedaSeleccionadas
              ?.map((monedaSelected: number) => {
                const found = queryMoneda.data.value?.find(
                  (moneda) => moneda.cveMoneda === monedaSelected,
                );

                return found
                  ? {
                      idContrato: "",
                      cveMonedaContrato: found.cveMoneda,
                      monActiva: true,
                    }
                  : null;
              })
              .filter(
                (
                  m,
                ): m is {
                  idContrato: string;
                  cveMonedaContrato: number;
                  monActiva: boolean;
                } => m !== null,
              ) ?? [];

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

  const toggleMonActiva = (item: GeneralSectionTableMoneda) => {
    // busca si por lo menos hay dos monedas activas, para permitir desactivar una
    const algunaActiva = dataTableMoneda.value.some(
      (m) => m.cveMonedaContrato !== item.cveMonedaContrato && m.monActiva,
    );

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
    const index = dataTableMoneda.value.findIndex(
      (m) => m.cveMonedaContrato === item.cveMonedaContrato,
    );

    // si el index es valido, cambia el valor de monActiva
    if (index !== -1) {
      dataTableMoneda.value[index]!.monActiva =
        !dataTableMoneda.value[index]?.monActiva;
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
    const cveExtCoberSeleccionada = formData["cveExtCoberContrato"];
    const cveCoberturaSeleccionadas = formData["cveOperRamo"];

    if (cveExtCoberSeleccionada === null || cveCoberturaSeleccionadas === null) {
      dialog.show({
        title: "Atención",
        message:
          "Debe seleccionar una extensión de cobertura y una cobertura antes de agregar a la tabla.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Agregar operación/ramo",
        message: "¿Confirma que desea agregar las operaciones / ramos seleccionados?",
      ExtraAction: {
        text: "Continuar",
        handler: () => {
          // obtener el objeto completo de extensión de cobertura
          const extCoberSelected = queryExtensionesCobertura.data.value?.find(
            (ext) => ext.cveExtCober === cveExtCoberSeleccionada,
          );

          // filtra para eliminar los que no tenga el mismo tipo de operacion ramo
          dataTableOperacionRamo.value = dataTableOperacionRamo.value.filter(
            (row) => row.cveExtCoberContrato !== cveExtCoberSeleccionada,
          );

          // obtener los objetos completos de operacion ramo seleccionadas
          const coberturasSelected = queryOperacionesRamos.data.value?.filter(
            (cob) => cveCoberturaSeleccionadas!.includes(cob.cveCobertura),
          );

          if (extCoberSelected && coberturasSelected) {
            coberturasSelected.forEach((cobertura) => {
              dataTableOperacionRamo.value.push({
                idContrato: "",
                cveExtCoberContrato: extCoberSelected.cveExtCober,
                cveOperRamo: cobertura.cveCobertura,
                operRamoActivo: true,
              });
              setFieldValue("cveExtCoberContrato", null);
              setFieldValue("cveOperRamo", null);
            });
          }
        },
      },
    });
  };

  const toggleOperRamoActivo = (item: GeneralSectionTableOperacionRamo) => {
    // buca si por lo menos hay dos monedas activas, para permitir desactivar una
    const algunaActiva = dataTableOperacionRamo.value.some(
      (m) => m.cveOperRamo !== item.cveOperRamo && m.operRamoActivo,
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
        m.cveExtCoberContrato === item.cveExtCoberContrato &&
        m.cveOperRamo === item.cveOperRamo,
    );

    // si el index es valido, cambia el valor de monActiva
    if (index !== -1) {
      dataTableOperacionRamo.value[index]!.operRamoActivo =
        !dataTableOperacionRamo.value[index]?.operRamoActivo;
    }
  };

  const validarTablaOperacionRamo = (): boolean => {
    if (dataTableOperacionRamo.value.length === 0) {
      errorTablaOperacionRamo.value =
        "Debe agregar al menos un operación/ramo a la tabla.";
      return false;
    }
    const algunaActiva = dataTableOperacionRamo.value.some(
      (m) => m.operRamoActivo,
    );

    if (!algunaActiva) {
      errorTablaOperacionRamo.value =
        "Debe haber al menos un operación/ramo activo.";
      return false;
    }
    errorTablaOperacionRamo.value = undefined;
    return true;
  };

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
  } = useForm<GeneralesForm>({
    initialValues: {
      ...initialValues, 
      ordenCobertura: initialValues.ordenCobertura ?? 1,
      cveFContrac: initialValues.cveFContrac ?? 0,
      negociosCubiertos: initialValues.negociosCubiertos ?? "TODA LA CARTERA",
      contratoActivo: initialValues.contratoActivo ?? false
    },
    validationSchema: useGeneralValidations(),
    validateOnMount: false,
  });

  // Watch para limpiar campos cuando cambia el tipo de reaseguro
  watch(
    () => formData.cveTreaseg,
    (newValue) => {
      setFieldValue("idTContrato", null);
      if (Number(newValue) !== 0) {
        setFieldValue("cveCriterioCob", 1);
        setFieldValue("traspasoCartera", null);
      }
    },
  );

  // Watch para limpiar campos cuando cambia la forma contractual
  watch(
    () => formData.cveFContrac,
    (newValue, oldValue) => {
      // Si cambia de facultativa (1) a otro valor, limpiar campos relacionados
      if (oldValue === 1 && newValue !== 1) {
        setFieldValue("cveEntidad", null);
        setFieldValue("municipio", null);
        setFieldValue("cveSector", null);
        setFieldValue("asegurado", null);
      }
    },
  );

  watch(
    () => formData.cveExtCoberContrato,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        setFieldValue("cveOperRamo", null);
      }
    }
  );

  watch(
    () => formData.ordenCobertura,
    (newValue, oldValue) => {
      if (newValue !== oldValue && newValue == 1) {
        setFieldValue("contratoRetencion", 0);
      }
    }
  );

  const handleSubmit = async () => {
    showErrors.value = true;

    const { valid } = await validate();
    const tablaValida = validarTablaMonedas();
    const tablaOperacionRamoValida = validarTablaOperacionRamo();

    if (valid && tablaValida && tablaOperacionRamoValida) {
      aeStore.guardarGenerales(
        formData,
        dataTableMoneda.value,
        dataTableOperacionRamo.value,
      );
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
    headerMoneda: headersMoneda,
    dataTableMoneda,
    dataMonedaToShow,
    sendSelectToTableMoneda,
    toggleMonActiva,
    errorTablaMonedas,
    //
    headerOperaciones: headersOperacionRamo,
    dataTableOperacionRamo,
    dataOperacionesRamosShow,
    sendSelectToTableOperacionRamo,
    toggleOperRamoActivo,
    errorTablaOperacionRamo,
    opcionesExtCoberDisponibles,
    opcionesOperRamoFiltradas,

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
