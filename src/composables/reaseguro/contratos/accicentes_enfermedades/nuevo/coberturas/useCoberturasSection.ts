import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useCoberturasValidations } from "./useCoberturasValidations";

// ─────────────────────────────────────────────
// Mapa de coberturas permitidas por operación/ramo
// ─────────────────────────────────────────────
const COBERTURAS_POR_OPER_RAMO: Record<string, string[]> = {
  "3000": [], // todas — se maneja aparte
  "030":  [], // todas — se maneja aparte
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

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

interface CoberturaForm {
  cveCriterioAsigCobertura: number | null;
  cveReaseguradorCobertura: number | null;
  cveOperRamoCobertura: string | null;
  cveCobaye: number | null;
  propiaSaMax: string;
  saMax: number | null;
}

interface CoberturaRow extends CoberturaForm {
  nombreReasegurador: string;
  descOperRamo: string;
  descCobaye: string;
  coberActiva: boolean; // true = 1 ACTIVO | false = 2 INACTIVO
}

// ─────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────

export const useCoberturasSection = () => {
  const aeStore = useContratoAEStore();
  const { isTypeProporcional } = storeToRefs(aeStore);
  const dialog = useDialog();

  const {
    queryCriterioAsignacion,
    queryOperacionesRamos,
    queryCoberturasAyE,
    queryReaseguradoras,
  } = useAccidentesEnfermedades();

  // ── Tabla principal ────────────────────────────────────────────────────
  const dataTable = ref<CoberturaRow[]>([]);

  // ── Ref numérico para saMax (formateo visual) ──────────────────────────
  const saMax = ref("");

  // ── Formulario ─────────────────────────────────────────────────────────
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<CoberturaForm>({
    validationSchema: useCoberturasValidations(),
    validateOnMount: false,
    initialValues: {
      cveCriterioAsigCobertura: 1, // default: POR CONTRATO
      cveReaseguradorCobertura: null,
      cveOperRamoCobertura: null,
      cveCobaye: null,
      propiaSaMax: "NO",
      saMax: null,
    },
  });

  const showErrors = ref(false);

  // ─────────────────────────────────────────────
  // Criterio de asignación fijo una vez usado
  // Una vez que hay registros en tabla, el criterio queda bloqueado
  // a menos que todos estén inactivos
  // ─────────────────────────────────────────────
  const criterioFijo = computed(() => {
    const activos = dataTable.value.filter((r) => r.coberActiva);
    return activos.length > 0 ? activos[0]!.cveCriterioAsigCobertura : null;
  });

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  // ─────────────────────────────────────────────
  // Opciones de Operación / Ramo según tipo de reaseguro
  // ─────────────────────────────────────────────
  const operacionesRamosData = ref<{ title: string; value: string }[]>([]);

  watch(
    [
      isTypeProporcional,
      () => queryOperacionesRamos.data.value,
      () => queryOperacionesRamos.isLoading.value,
    ],
    ([proporcional, _, isLoading]) => {
      if (proporcional == null || isLoading) return;

      const helper: { title: string; value: string }[] = [];

      const pushOperacion = (cveCobertura: string) => {
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

      if (!proporcional) {
        // NO PROPORCIONAL → tabla OPERACION_RAMO_CONTRATO
        aeStore.recuperarTablaOperacionRamoContrato().forEach((row) => {
          pushOperacion(row.cveOperRamo);
        });
      } else {
        // PROPORCIONAL → tabla DETALLES_CONTRATO
        const detalles = aeStore.obtenerDetallesProporcionales();
        const tieneDetalleOperRamo = detalles[0]?.detallesOperRamo === "SI";

        if (tieneDetalleOperRamo) {
          // DETALLES_OPER_RAMO = SI → usar CVE_OPER_RAMO_DETALLES
          detalles.forEach((row) => {
            pushOperacion(row.cveOperRamoDetalles);
          });
        } else {
          // DETALLES_OPER_RAMO = NO → usar tabla OPERACION_RAMO_CONTRATO
          aeStore.recuperarTablaOperacionRamoContrato().forEach((row) => {
            pushOperacion(row.cveOperRamo);
          });
        }
      }

      // Eliminar duplicados por value
      operacionesRamosData.value = helper.filter(
        (item, index, self) => self.findIndex((t) => t.value === item.value) === index
      );
    },
    { immediate: true }
  );

  // ─────────────────────────────────────────────
  // Opciones de Cobertura según criterio y operación/ramo seleccionados
  // ─────────────────────────────────────────────
  const coberturasDisponibles = computed(() => {
    const todasLasCoberturas = queryCoberturasAyE.data.value ?? [];
    const criterio = formData.cveCriterioAsigCobertura;

    // Determinar los CVE_OPER_RAMO relevantes
    let cvesOperRamo: string[] = [];

    if ([3, 6].includes(criterio!)) {
      // Usar el operación/ramo seleccionado en el formulario
      if (formData.cveOperRamoCobertura) {
        cvesOperRamo = [formData.cveOperRamoCobertura];
      }
    } else {
      // Usar todos los operaciones/ramos del contrato
      cvesOperRamo = operacionesRamosData.value.map((o) => o.value);
    }

    if (cvesOperRamo.length === 0) return todasLasCoberturas;

    // Si existe 3000 o 030 → mostrar todas
    if (cvesOperRamo.some((c) => ["3000", "030"].includes(c))) {
      return todasLasCoberturas;
    }

    // Acumular CVEs de cobertura permitidos según cada operación/ramo
    const cvesPermitidos = new Set<string>();
    cvesOperRamo.forEach((cve) => {
      const permitidos = COBERTURAS_POR_OPER_RAMO[cve];
      if (permitidos) {
        permitidos.forEach((c) => cvesPermitidos.add(c));
      }
    });

    if (cvesPermitidos.size === 0) return todasLasCoberturas;

    return todasLasCoberturas.filter((c) =>
      cvesPermitidos.has(String(c.cveCobaye))
    );
  });

  // ─────────────────────────────────────────────
  // Limpiar campos dependientes al cambiar criterio
  // ─────────────────────────────────────────────
  watch(
    () => formData.cveCriterioAsigCobertura,
    () => {
      setFieldValue("cveReaseguradorCobertura", null);
      setFieldValue("cveOperRamoCobertura", null);
      setFieldValue("cveCobaye", null);
    }
  );

  watch(
    () => formData.cveOperRamoCobertura,
    () => {
      setFieldValue("cveCobaye", null);
    }
  );

  watch(
    () => formData.propiaSaMax,
    (newValue) => {
      if (newValue !== "SI") {
        setFieldValue("saMax", null);
        saMax.value = "";
      }
    }
  );

  // ─────────────────────────────────────────────
  // Formateo del campo saMax
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // Helpers de resolución de nombres
  // ─────────────────────────────────────────────
  const getNombreReasegurador = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      (queryReaseguradoras.data.value ?? []).find(
        (r) => r.cveReasegurador === cve
      )?.nombreReasegurador ?? ""
    );
  };

  const getDescOperRamo = (cve: string | null): string => {
    if (!cve) return "";
    return (
      operacionesRamosData.value.find((o) => o.value === cve)?.title ?? ""
    );
  };

  const getDescCobaye = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      (queryCoberturasAyE.data.value ?? []).find(
        (c) => c.cveCobaye === cve
      )?.descCobaye ?? ""
    );
  };

  // ─────────────────────────────────────────────
  // Reset
  // ─────────────────────────────────────────────
  const resetFormAndRefs = () => {
    // Conservar el criterio si ya está fijo
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigCobertura;
    resetForm();
    setFieldValue("cveCriterioAsigCobertura", criterioActual);
    setFieldValue("propiaSaMax", "NO");
    saMax.value = "";
    showErrors.value = false;
  };

  // ─────────────────────────────────────────────
  // Botón "Agregar coberturas"
  // ─────────────────────────────────────────────
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

    const newRow: CoberturaRow = {
      cveCriterioAsigCobertura: formData.cveCriterioAsigCobertura,
      cveReaseguradorCobertura: formData.cveReaseguradorCobertura,
      cveOperRamoCobertura: formData.cveOperRamoCobertura,
      cveCobaye: formData.cveCobaye,
      propiaSaMax: formData.propiaSaMax,
      saMax: formData.saMax,
      nombreReasegurador: getNombreReasegurador(formData.cveReaseguradorCobertura),
      descOperRamo: getDescOperRamo(formData.cveOperRamoCobertura),
      descCobaye: getDescCobaye(formData.cveCobaye),
      coberActiva: true,
    };

    dataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // ─────────────────────────────────────────────
  // Toggle activa (individual)
  // ─────────────────────────────────────────────
  const toggleRowActiva = (item: CoberturaRow) => {
    const index = dataTable.value.indexOf(item);
    if (index !== -1) {
      dataTable.value[index]!.coberActiva = !dataTable.value[index]!.coberActiva;
    }
  };

  // ─────────────────────────────────────────────
  // Editar fila
  // ─────────────────────────────────────────────
  const editRow = (row: CoberturaRow) => {
    const index = dataTable.value.indexOf(row);
    if (index !== -1) dataTable.value.splice(index, 1);

    setFieldValue("cveCriterioAsigCobertura", row.cveCriterioAsigCobertura);
    setFieldValue("cveReaseguradorCobertura", row.cveReaseguradorCobertura);
    setFieldValue("cveOperRamoCobertura", row.cveOperRamoCobertura);
    setFieldValue("cveCobaye", row.cveCobaye);
    setFieldValue("propiaSaMax", row.propiaSaMax);
    setFieldValue("saMax", row.saMax);

    saMax.value = row.saMax != null ? formatCurrency(row.saMax) : "";
  };

  // ─────────────────────────────────────────────
  // Botón "Guardar coberturas" + validaciones por criterio
  // ─────────────────────────────────────────────
  const handleGuardarCoberturas = () => {
    if (dataTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe contener al menos un registro para continuar. Verifique por favor.",
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
    const criterio = dataTable.value[0]?.cveCriterioAsigCobertura;
    const activas = dataTable.value.filter((r) => r.coberActiva);
    const error = ejecutarValidacionPorCriterio(criterio, activas);

    if (error) {
      dialog.show({
        title: "Error",
        message: error,
        type: DialogType.ERROR,
      });
      return;
    }

    doGuardarCoberturas();
  };

  /**
   * Ejecuta la validación correspondiente según CVE_CRITERIOASIG_COBERTURA
   * Devuelve el mensaje de error o null si pasa.
   */
  const ejecutarValidacionPorCriterio = (
    criterio: number | null | undefined,
    activas: CoberturaRow[]
  ): string | null => {

    // ── 1. POR CONTRATO ────────────────────────────────────────────────
    if (criterio === 1) {
      const cvesCobertura = activas.map((r) => r.cveCobaye);
      const hayDuplicados = cvesCobertura.length !== new Set(cvesCobertura).size;
      if (hayDuplicados) {
        return "Solo se permite un registro por cobertura para el contrato.";
      }
      return null;
    }

    // ── 0. POR REASEGURADORA ───────────────────────────────────────────
    if (criterio === 0) {
      const reaseguradoresContrato = (aeStore.recuperarReaseguradores() as any[]).map(
        (r) => r.cveReasegurador
      );
      const cvesEnTabla = [...new Set(activas.map((r) => r.cveReaseguradorCobertura))];
      const faltantes = reaseguradoresContrato.filter((cve) => !cvesEnTabla.includes(cve));

      if (faltantes.length > 0) {
        return "Se debe registrar al menos una cobertura por cada reaseguradora.";
      }
      return null;
    }

    // ── 3. POR OPERACIÓN / RAMO ────────────────────────────────────────
    if (criterio === 3) {
      const cvesOperRamoRequeridos = _obtenerCvesOperRamoRequeridos();
      const cvesEnTabla = [...new Set(activas.map((r) => r.cveOperRamoCobertura))];
      const faltantes = cvesOperRamoRequeridos.filter((cve) => !cvesEnTabla.includes(cve));

      if (faltantes.length > 0) {
        return "Se debe registrar al menos una cobertura por cada operación / ramo.";
      }
      return null;
    }

    // ── 6. POR REASEGURADORA Y OPERACIÓN / RAMO ───────────────────────
    if (criterio === 6) {
      const cvesOperRamoRequeridos = _obtenerCvesOperRamoRequeridos();
      const reaseguradoresContrato = (aeStore.recuperarReaseguradores() as any[]).map(
        (r) => r.cveReasegurador as number
      );

      // Validar que exista al menos una cobertura por cada combinación reaseg × oper/ramo
      const combinacionesFaltantes: string[] = [];

      reaseguradoresContrato.forEach((cveReaseg) => {
        cvesOperRamoRequeridos.forEach((cveOper) => {
          const existe = activas.some(
            (r) =>
              r.cveReaseguradorCobertura === cveReaseg &&
              r.cveOperRamoCobertura === cveOper
          );
          if (!existe) {
            combinacionesFaltantes.push(`Reaseg ${cveReaseg} – Oper/Ramo ${cveOper}`);
          }
        });
      });

      if (combinacionesFaltantes.length > 0) {
        return "Se debe registrar al menos una cobertura por cada operación / ramo.";
      }
      return null;
    }

    return null;
  };

  /**
   * Obtiene los CVE_OPER_RAMO requeridos según tipo de reaseguro y detalles del contrato.
   * Reutilizado para criterios 3 y 6.
   */
  const _obtenerCvesOperRamoRequeridos = (): string[] => {
    if (!isTypeProporcional.value) {
      // NO PROPORCIONAL → tabla OPERACION_RAMO_CONTRATO
      return (aeStore.recuperarTablaOperacionRamoContrato() as any[]).map(
        (r) => r.cveOperRamo as string
      );
    }

    // PROPORCIONAL
    const detalles = aeStore.obtenerDetallesProporcionales() as any[];
    const tieneDetalleOperRamo = detalles[0]?.detallesOperRamo === "SI";

    if (tieneDetalleOperRamo) {
      // DETALLES_OPER_RAMO = SI → CVE_OPER_RAMO_DETALLES
      return detalles.map((d) => d.cveOperRamoDetalles as string);
    } else {
      // DETALLES_OPER_RAMO = NO → tabla OPERACION_RAMO_CONTRATO
      return (aeStore.recuperarTablaOperacionRamoContrato() as any[]).map(
        (r) => r.cveOperRamo as string
      );
    }
  };

  const doGuardarCoberturas = () => {
    const payload = dataTable.value.map((r) => ({
      cveCriterioAsigCobertura: r.cveCriterioAsigCobertura,
      cveReaseguradorCobertura: r.cveReaseguradorCobertura,
      cveOperRamoCobertura: r.cveOperRamoCobertura,
      cveCobaye: r.cveCobaye,
      propiaSaMax: r.propiaSaMax,
      saMax: r.saMax,
      coberActiva: r.coberActiva ? 1 : 2,
    }));

    aeStore.guardarCoberturas(payload);
    dialog.cerrar();
  };

  // ─────────────────────────────────────────────
  // Filtros de tabla
  // ─────────────────────────────────────────────
  const filtroReaseguradora = ref("");
  const filtroOperRamo = ref("");

  const dataTableFiltrada = computed(() => {
    return dataTable.value.filter((row) => {
      const matchReaseg =
        !filtroReaseguradora.value ||
        row.nombreReasegurador
          .toLowerCase()
          .includes(filtroReaseguradora.value.toLowerCase());
      const matchOper =
        !filtroOperRamo.value ||
        row.descOperRamo
          .toLowerCase()
          .includes(filtroOperRamo.value.toLowerCase());
      return matchReaseg && matchOper;
    });
  });

  const limpiarFiltros = () => {
    filtroReaseguradora.value = "";
    filtroOperRamo.value = "";
  };

  // ─────────────────────────────────────────────
  // Headers
  // ─────────────────────────────────────────────
  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "Reaseguradora",       key: "nombreReasegurador",    sortable: true,  headerProps },
    { title: "Operación / Ramo",    key: "descOperRamo",          sortable: true,  headerProps },
    { title: "Cobertura",           key: "descCobaye",            sortable: true,  headerProps },
    { title: "¿Propia SA máx.?",    key: "propiaSaMax",           sortable: true,  headerProps },
    { title: "Suma asegurada máx.", key: "saMax",                 sortable: true,  headerProps },
    { title: "Activa",              key: "coberActiva",           sortable: true,  headerProps },
    { title: "Editar",              key: "editar",                sortable: false, headerProps },
  ];

  // ─────────────────────────────────────────────
  // Reaseguradoras del contrato (para el select)
  // ─────────────────────────────────────────────
  const reaseguradoraData = computed(() => {
    const reaseguradoresContrato = aeStore.recuperarReaseguradores() as Array<{
      cveReasegurador: number;
      nombreReasegurador?: string;
    }>;

    const cvesContrato = reaseguradoresContrato.map((r) => r.cveReasegurador);

    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesContrato.includes(r.cveReasegurador)
    );
  });

  // ─────────────────────────────────────────────
  // Exposición
  // ─────────────────────────────────────────────
  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // campo numérico
    saMax,
    onInputSaMax,
    onBlurSaMax,
    // opciones
    queryCriterioAsignacion,
    reaseguradoraData,
    operacionesRamosData,
    coberturasDisponibles,
    // tabla
    tableHeaders,
    dataTable,
    dataTableFiltrada,
    // filtros
    filtroReaseguradora,
    filtroOperRamo,
    limpiarFiltros,
    // estado
    criterioEstaFijo,
    // handlers
    handleAgregarCobertura,
    handleGuardarCoberturas,
    toggleRowActiva,
    editRow,
  };
};