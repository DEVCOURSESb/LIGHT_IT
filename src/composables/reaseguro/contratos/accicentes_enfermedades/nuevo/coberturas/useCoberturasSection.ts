import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formattNumber } from "@/utils/formatters/formattNumber";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { useCoberturasValidations } from "./useCoberturasValidations";
import type { CoberturasSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

//
// Mapa de coberturas permitidas por operación/ramo
//
const COBERTURAS_POR_OPER_RAMO: Record<string, string[]> = {
  "3000": [],
  "030":  [],
  "331":  ["3000", "030", "331", "0031", "0032", "0033"],
  "332":  ["3000", "030", "332", "0034", "0035", "0036"],
  "333":  ["3000", "030", "333", "0037", "0038", "0039"],
  "0031": ["3000", "030", "331", "0031"],
  "0032": ["3000", "030", "331", "0032"],
  "0033": ["3000", "030", "331", "0033"],
  "0034": ["3000", "030", "332", "0034"],
  "0035": ["3000", "030", "332", "0035"],
  "0036": ["3000", "030", "332", "0036"],
  "0037": ["3000", "030", "333", "0037"],
  "0038": ["3000", "030", "333", "0038"],
  "0039": ["3000", "030", "333", "0039"],
};

// Tipo del formulario — sin idContrato ni coberActiva (los agrega el composable al construir la fila)
type CoberturasForm = Omit<CoberturasSection, "idContrato" | "coberActiva">;

// Tipo display — extiende la interfaz con campos calculados para la tabla
type CoberturasDisplay = CoberturasSection & {
  nombreReasegurador: string;
  descOperRamo: string;
  descCobaye: string;
  descPropiaSaMax: string;
};

export const useCoberturasSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  // Refs reactivos del store
  const { isTypeProporcional, coberturas, reaseguradores, detallesProporcionales } =
    storeToRefs(aeStore);

  const {
    queryCriterioAsignacion,
    queryOperacionesRamos,
    queryCoberturasAyE,
    queryReaseguradoras,
  } = useAccidentesEnfermedades();

  // Tabla base mutable — todas las mutaciones van aquí
  const originalDataTable = ref<CoberturasSection[]>([...coberturas.value]);

  // Computed display — agrega campos de descripción, es solo lectura
  const dataTable = computed<CoberturasDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      nombreReasegurador: getNombreReasegurador(row.cveReaseguradorCobertura),
      descOperRamo:       getDescOperRamo(row.cveOperRamoCobertura),
      descCobaye:         getDescCobaye(row.cveCobaye),
      descPropiaSaMax:    row.propiaSaMax === 1 ? "SÍ" : "NO",
    }))
  );

  // Ref numérico para saMax
  const saMax = ref("");

  const showErrors = ref(false);

  // Criterio fijo mientras haya registros activos
  const criterioFijo = computed<number | null>(() => {
    const primerActivo = originalDataTable.value.find((r) => r.coberActiva);
    return primerActivo?.cveCriterioAsigCobertura ?? null;
  });

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

    // Formulario
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<CoberturasForm>({
    validationSchema: useCoberturasValidations(),
    validateOnMount: false,
    initialValues: {
      cveCriterioAsigCobertura: criterioFijo.value ?? 0,
    }
  });

  // Operaciones/ramos disponibles según tipo de reaseguro
  const operacionesRamosData = ref<{ title: string; value: string }[]>([]);

  // este watch sirve para obtener 
  // las operaciones / ramos en base a lal tipo de reaseguro
  watch(
    [
      isTypeProporcional,
      detallesProporcionales,
      () => queryOperacionesRamos.data.value,
      () => queryOperacionesRamos.isLoading.value,
    ],
    ([proporcional,__, _, isLoading]) => {
      if (proporcional == null || isLoading) return;

      const helper: { title: string; value: string }[] = [];

      // funcion de ayuda
      const pushOperacion = (cveCobertura: string | null) => {
        if (!cveCobertura) return;
        const operacion = queryOperacionesRamos.data.value?.find(
          (el) => el.cveCobertura === cveCobertura
        );

        if (operacion) {
          helper.push({
            title: operacion.descOperacionRamos,
            value: operacion.cveCobertura,
          });
        }
      };

      // si es NO PROPORCIONAL
      if (!proporcional) {
        // usa CAE_OPERACION_RAMO de generales
        aeStore.generales.CAE_OPERACION_RAMO?.forEach((row) => {
          pushOperacion(row.cveOperRamo);
        });
      } else { // PROPORCIONAL
        // usa detallesProporcionales si tiene detalle por oper/ramo
        const tieneDetalleOperRamo = detallesProporcionales.value.some(row => row.detallesOperRamo === 1);

        if (tieneDetalleOperRamo) {
          detallesProporcionales.value.forEach((row) => {
            pushOperacion(row.cveOperRamoDetalles);
          });
        } else {
          aeStore.generales.CAE_OPERACION_RAMO.forEach((row) => {
            pushOperacion(row.cveOperRamo);
          })
        }
      }

      // Eliminar duplicados
      operacionesRamosData.value = helper.filter(
        (item, index, self) => self.findIndex((t) => t.value === item.value) === index
      );
    },
    { immediate: true }
  );

  // Coberturas disponibles según criterio y operación/ramo
  const coberturasDisponibles = computed(() => {
    const todasLasCoberturas = queryCoberturasAyE.data.value ?? [];
    const criterio = formData.cveCriterioAsigCobertura;

    let cvesOperRamo: string[] = [];

    if ([3, 6].includes(criterio!)) {
      // Criterio 3 o 6: filtrara por el seleccionado en el form
      // continua con punto d
        cvesOperRamo = [String(formData.cveOperRamoCobertura)];
    } else {
      // segun el tipo de reaseguro, punto b
      cvesOperRamo = operacionesRamosData.value.map((o) => o.value);
    }

    // punto d
    // Si hay "3000" o "030" se muestran todas las coberturas
    if (cvesOperRamo.some((c) => ["3000", "030"].includes(c))) {
      return todasLasCoberturas;
    }

    const cvesPermitidos = new Set<string>();

    cvesOperRamo.forEach((cve) => {
      COBERTURAS_POR_OPER_RAMO[cve]?.forEach((p) => cvesPermitidos.add(p));
    });

    if (cvesPermitidos.size === 0) return todasLasCoberturas;

    return todasLasCoberturas.filter((c) =>
      cvesPermitidos.has(String(c.cveCobertura))
    );

//    if (cvesOperRamo.length === 0) return todasLasCoberturas;
  });

  // Watches de limpieza
  watch(
    () => formData.cveCriterioAsigCobertura,
    () => {
      setFieldValue("cveReaseguradorCobertura", null);
      setFieldValue("cveOperRamoCobertura", null);
      setFieldValue("cveCobaye", 0);
    }
  );

  watch(
    () => formData.cveOperRamoCobertura,
    () => { setFieldValue("cveCobaye", 0); }
  );

  watch(
    () => formData.propiaSaMax,
    (newValue) => {
      if (newValue !== 1) {
        setFieldValue("saMax", null);
        saMax.value = "";
      }
    }
  );

  // Handler numérico para saMax
  const onInputSaMax = (value: string) => {
    const clean = formattNumber(value);
    saMax.value = clean;
    setFieldValue("saMax", clean === "" ? null : parseFloat(clean));
  };

  const onBlurSaMax = () => {
    if (!saMax.value) {
      setFieldValue("saMax", null);
      return;
    }
    const numeric = parseFloat(saMax.value);
    if (isNaN(numeric)) {
      saMax.value = "";
      setFieldValue("saMax", null);
      return;
    }
    setFieldValue("saMax", numeric);
    saMax.value = formatCurrency(numeric);
  };

  // Helpers de descripción (para el computed display)
  const getNombreReasegurador = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      queryReaseguradoras.data.value?.find((r) => r.cveReasegurador === cve)
        ?.nombreReasegurador ?? ""
    );
  };

  const getDescOperRamo = (cve: number | string | null): string => {
    if (cve == null) return "";
    return operacionesRamosData.value.find((o) => o.value === String(cve))?.title ?? "";
  };

  const getDescCobaye = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      queryCoberturasAyE.data.value?.find((c) => c.cveCobaye === cve)?.descCobaye ?? ""
    );
  };

  // Reset
  const resetFormAndRefs = () => {
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigCobertura;
    resetForm();
    setFieldValue("cveCriterioAsigCobertura", criterioActual);
    setFieldValue("propiaSaMax", 0);
    saMax.value      = "";
    showErrors.value = false;
  };

  // Agregar cobertura
  const handleAgregarCobertura = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar las coberturas capturadas?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarCobertura,
      },
    });
  };

  const confirmAgregarCobertura = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: CoberturasSection = {
      idContrato:               aeStore.generales.idContrato,
      cveCriterioAsigCobertura: formData.cveCriterioAsigCobertura!,
      cveReaseguradorCobertura: formData.cveReaseguradorCobertura ?? null,
      cveOperRamoCobertura:     formData.cveOperRamoCobertura ?? null,
      cveCobaye:                formData.cveCobaye!,
      propiaSaMax:              formData.propiaSaMax,
      saMax:                    formData.saMax ?? null,
      cobBasica:                true,
      coberActiva:              true,
    };

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // Toggle activo
  const toggleRowActiva = (item: CoberturasDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigCobertura === item.cveCriterioAsigCobertura &&
        r.cveReaseguradorCobertura === item.cveReaseguradorCobertura &&
        r.cveOperRamoCobertura     === item.cveOperRamoCobertura &&
        r.cveCobaye                === item.cveCobaye
    );
    if (index !== -1) {
      originalDataTable.value[index]!.coberActiva =
        !originalDataTable.value[index]!.coberActiva;
    }
  };

  const toggleCobBasica = (item: CoberturasDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigCobertura === item.cveCriterioAsigCobertura &&
        r.cveReaseguradorCobertura === item.cveReaseguradorCobertura &&
        r.cveOperRamoCobertura     === item.cveOperRamoCobertura &&
        r.cveCobaye                === item.cveCobaye
    );
    if (index !== -1) {
      originalDataTable.value[index]!.cobBasica = !originalDataTable.value[index]!.cobBasica;
    }
  };

  // Editar fila
  const editRow = (item: CoberturasDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigCobertura === item.cveCriterioAsigCobertura &&
        r.cveReaseguradorCobertura === item.cveReaseguradorCobertura &&
        r.cveOperRamoCobertura     === item.cveOperRamoCobertura &&
        r.cveCobaye                === item.cveCobaye
    );
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("cveCriterioAsigCobertura", row.cveCriterioAsigCobertura);
    setFieldValue("cveReaseguradorCobertura", row.cveReaseguradorCobertura);
    setFieldValue("cveOperRamoCobertura",     row.cveOperRamoCobertura);
    setFieldValue("cveCobaye",                row.cveCobaye);
    setFieldValue("propiaSaMax",              row.propiaSaMax);
    setFieldValue("saMax",                    row.saMax);

    saMax.value = row.saMax != null ? formatCurrency(row.saMax) : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Guardar
  const handleGuardarCoberturas = () => {
    if (originalDataTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe contener al menos un registro para continuar.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados de coberturas del contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: validarYGuardar,
      },
    });
  };

  const validarYGuardar = () => {
    const criterio = originalDataTable.value[0]?.cveCriterioAsigCobertura;
    const activas  = originalDataTable.value.filter((r) => r.coberActiva);
    const error    = ejecutarValidacionPorCriterio(criterio, activas);

    if (error) {
      dialog.show({ title: "Error", message: error, type: DialogType.ERROR });
      return;
    }

    doGuardarCoberturas();
  };

  // Validaciones por criterio
  const ejecutarValidacionPorCriterio = (
    criterio: number | null | undefined,
    activas: CoberturasSection[]
  ): string | null => {

    if (criterio === 1) { // por contrato
      const cves        = activas.map((r) => r.cveCobaye);
      const hayDuplicados = cves.length !== new Set(cves).size;
      return hayDuplicados
        ? "Solo se permite un registro por cobertura para el contrato."
        : null;
    }

    if (criterio === 0) { // por reaseguradora
      const cvesContrato = reaseguradores.value.map((r) => r.cveReasegurador);
      const cvesEnTabla  = [...new Set(activas.map((r) => r.cveReaseguradorCobertura))];
      const faltantes    = cvesContrato.filter((cve) => !cvesEnTabla.includes(cve));
      return faltantes.length > 0
        ? "Se debe registrar al menos una cobertura por cada reaseguradora."
        : null;
    }

    if (criterio === 3) { // por operación / ramo
      const requeridos  = _obtenerCvesOperRamoRequeridos();
      const cvesEnTabla = [...new Set(activas.map((r) => String(r.cveOperRamoCobertura)))];
      const faltantes   = requeridos.filter((cve) => !cvesEnTabla.includes(cve));
      return faltantes.length > 0
        ? "Se debe registrar al menos una cobertura por cada operación / ramo."
        : null;
    }

    if (criterio === 6) { // por reaseguradora y operacion / ramo
      const cvesOperRamo = _obtenerCvesOperRamoRequeridos();
      const cvesReaseg   = reaseguradores.value.map((r) => r.cveReasegurador);

      const falta = cvesReaseg.some((cveReaseg) =>
        cvesOperRamo.some((cveOper) =>
          !activas.some(
            (r) =>
              r.cveReaseguradorCobertura === cveReaseg &&
              String(r.cveOperRamoCobertura) === cveOper
          )
        )
      );

      return falta
        ? "Se debe registrar al menos una cobertura por cada combinación reaseguradora / operación / ramo."
        : null;
    }

    return null;
  };

  // Helper: CVEs de operación/ramo requeridos según tipo de contrato
  const _obtenerCvesOperRamoRequeridos = (): string[] => {
    if (!isTypeProporcional.value) {
      return (
        aeStore.generales.CAE_OPERACION_RAMO?.map((r) => r.cveOperRamo) ?? []
      );
    }

    const tieneDetalleOperRamo = detallesProporcionales.value.some(row => row.detallesOperRamo === 1);

    if (tieneDetalleOperRamo) {
      return detallesProporcionales.value
        .map((d) => d.cveOperRamoDetalles)
        .filter((v): v is string => v != null);
    }

    return aeStore.generales.CAE_OPERACION_RAMO?.map((r) => r.cveOperRamo) ?? [];
  };

  const doGuardarCoberturas = () => {
    aeStore.guardarCoberturas(originalDataTable.value);
    dialog.show({
      title: "Éxito",
      message: "Información de coberturas guardada con éxito.",
      type: DialogType.SUCCESS,
    });
    dialog.cerrar();
  };

  // Reaseguradoras del contrato (filtradas por las del store)
  const reaseguradoraData = computed(() => {
    const cvesContrato = reaseguradores.value.map((r) => r.cveReasegurador);
    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesContrato.includes(r.cveReasegurador)
    );
  });

  // Headers
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "REASEGURADORA",       key: "nombreReasegurador", sortable: true,  headerProps: hp },
    { title: "OPERACIÓN / RAMO",    key: "descOperRamo",       sortable: true,  headerProps: hp },
    { title: "COBERTURA",           key: "descCobaye",         sortable: true,  headerProps: hp },
    { title: "¿PROPIA SA MÁX.?",    key: "descPropiaSaMax",        sortable: true,  headerProps: hp },
    { title: "SUMA ASEGURADA MÁX.", key: "saMax",              sortable: true,  headerProps: hp },
    { title: "BÁSICA",              key: "cobBasica",        sortable: true,  headerProps: hp },
    { title: "ACTIVA",              key: "coberActiva",        sortable: true,  headerProps: hp },
    { title: "EDITAR",              key: "editar",             sortable: false, headerProps: hp },
  ];

  return {
    // formulario
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // saMax
    saMax,
    onInputSaMax,
    onBlurSaMax,
    // catálogos
    queryCriterioAsignacion,
    reaseguradoraData,
    operacionesRamosData,
    coberturasDisponibles,
    // tabla
    tableHeaders,
    dataTable,
    // criterio
    criterioEstaFijo,
    // acciones
    handleAgregarCobertura,
    handleGuardarCoberturas,
    toggleRowActiva,
    toggleCobBasica,
    editRow,
  };
};