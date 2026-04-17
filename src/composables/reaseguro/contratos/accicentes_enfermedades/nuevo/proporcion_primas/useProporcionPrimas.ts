import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { useProporcionPrimasValidations } from "./useProporcionPrimasValidations";
import type { ProporcionPrimasSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

//
// Mapa de coberturas permitidas por operación/ramo (idéntico a Tarifas y Coberturas)
//
const COBERTURAS_POR_OPER_RAMO: Record<string, string[]> = {
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

// Tipo del formulario — sin idContrato y proporcionActiva
type ProporcionPrimasForm = Omit<ProporcionPrimasSection, "idContrato" | "proporcionActiva">;

// Tipo display — extiende la interfaz con campos calculados para la tabla
type ProporcionPrimasDisplay = ProporcionPrimasSection & {
  nombreReasegurador: string;
  descOperRamo:       string;
  descCobaye:         string;
};

export const useProporcionPrimas = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const {
    isTypeProporcional,
    proporcionPrimas,
    reaseguradores,
    coberturas,
    detallesProporcionales,
  } = storeToRefs(aeStore);

  const {
    queryCriterioAsignacion,
    queryOperacionesRamos,
    queryCoberturasAyE,
    queryReaseguradoras,
  } = useAccidentesEnfermedades();

  // Tabla base mutable
  const originalDataTable = ref<ProporcionPrimasSection[]>([...proporcionPrimas.value]);

  // Computed display — agrega campos de descripción, es solo lectura
  const dataTable = computed<ProporcionPrimasDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      nombreReasegurador: getNombreReasegurador(row.cveReaseguradorPrimaPropor),
      descOperRamo:       getDescOperRamo(row.cveOperRamoPrimaPropor),
      descCobaye:         getDescCobaye(row.cveCobayePrimaPropor),
    }))
  );

  // Formulario
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<ProporcionPrimasForm>({
    validationSchema: useProporcionPrimasValidations(),
    validateOnMount: false,
    initialValues: {
      cveCriterioAsigPrimaPropor: 1,
      cveReaseguradorPrimaPropor: null,
      cveOperRamoPrimaPropor:     null,
      cveCobayePrimaPropor:       null,
      noDiasCubiertos:            undefined as unknown as number,
      porcentajePrimaAnual:       undefined as unknown as number,
    },
  });

  const showErrors = ref(false);

  // Porcentaje prima anual — ref separado para el slider
  const porcentajePrimaAnual = ref<number | null>(null);

  watch(porcentajePrimaAnual, (val) => {
    if (val != null) {
      const clamped = Math.min(100, Math.max(0, parseFloat(val.toFixed(2))));
      if (clamped !== val) porcentajePrimaAnual.value = clamped;
      setFieldValue("porcentajePrimaAnual", clamped);
    } else {
      setFieldValue("porcentajePrimaAnual", undefined as unknown as number);
    }
  });

  // Criterio fijo mientras haya registros activos
  const criterioFijo = computed<number | null>(() =>
    originalDataTable.value.find((r) => r.proporcionActiva)?.cveCriterioAsigPrimaPropor ?? null
  );

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  // Visibilidad condicional de campos según criterio
  const criterio = computed(() => formData.cveCriterioAsigPrimaPropor);

  const showReasegurador = computed(() =>
    [0, 6, 7, 9].includes(criterio.value!)
  );
  const showOperRamo = computed(() =>
    [3, 6, 8, 9].includes(criterio.value!)
  );
  const showCobertura = computed(() =>
    [4, 7, 8, 9].includes(criterio.value!)
  );

  // Operaciones/ramos disponibles (idéntico a Tarifas)
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

      const pushOperacion = (cveCobertura: string | null) => {
        if (!cveCobertura) return;
        const op = queryOperacionesRamos.data.value?.find(
          (el) => el.cveCobertura === cveCobertura
        );
        if (op) helper.push({ title: op.descOperacionRamos, value: op.cveCobertura });
      };

      if (!proporcional) {
        aeStore.generales.CAE_OPERACION_RAMO?.forEach((row) => {
          pushOperacion(row.cveOperRamo);
        });
      } else {
        const tieneDetalleOperRamo = detallesProporcionales.value[0]?.detallesOperRamo === 1;
        if (tieneDetalleOperRamo) {
          detallesProporcionales.value.forEach((row) => {
            pushOperacion(row.cveOperRamoDetalles);
          });
        } else {
          aeStore.generales.CAE_OPERACION_RAMO?.forEach((row) => {
            pushOperacion(row.cveOperRamo);
          });
        }
      }

      operacionesRamosData.value = helper.filter(
        (item, idx, self) => self.findIndex((t) => t.value === item.value) === idx
      );
    },
    { immediate: true }
  );

  // Reaseguradoras del contrato
  const reaseguradoraData = computed(() => {
    const cvesContrato = reaseguradores.value.map((r) => r.cveReasegurador);
    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesContrato.includes(r.cveReasegurador)
    );
  });

  // Coberturas disponibles (lógica del spec, idéntica a Tarifas)
  const coberturasDisponibles = computed(() => {
    const todasCoberturas   = queryCoberturasAyE.data.value ?? [];
    const crit              = formData.cveCriterioAsigPrimaPropor;
    const coberturaContrato = coberturas.value;
    const critCob           = coberturaContrato[0]?.cveCriterioAsigCobertura;

    // Aplica filtro por oper/ramo sobre un conjunto base de CVE_COBAYE
    const filtrarPorOperRamo = (cvesPermitidos: string[], cveOper: string | null) => {
      let base = todasCoberturas.filter((c) =>
        cvesPermitidos.includes(String(c.cveCobaye))
      );
      if (!cveOper || ["3000", "030"].includes(cveOper)) return base;
      const permitidos = COBERTURAS_POR_OPER_RAMO[cveOper];
      return permitidos
        ? base.filter((c) => permitidos.includes(String(c.cveCobaye)))
        : base;
    };

    // criterio 4 → todos los cveCobaye de coberturas del contrato
    if (crit === 4) {
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobaye)))];
      return todasCoberturas.filter((c) => cves.includes(String(c.cveCobaye)));
    }

    // criterio 7 → por reaseguradora
    if (crit === 7) {
      if ([0, 6].includes(critCob!)) {
        const cves = coberturaContrato
          .filter((c) => c.cveReaseguradorCobertura === formData.cveReaseguradorPrimaPropor)
          .map((c) => String(c.cveCobaye));
        return todasCoberturas.filter((c) => cves.includes(String(c.cveCobaye)));
      }
      // criterio cobertura 1 o 3 → todos
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobaye)))];
      return todasCoberturas.filter((c) => cves.includes(String(c.cveCobaye)));
    }

    // criterio 8 → por oper/ramo
    if (crit === 8) {
      const cveOper = formData.cveOperRamoPrimaPropor;
      if ([3, 6].includes(critCob!)) {
        const cves = coberturaContrato
          .filter((c) => c.cveOperRamoCobertura === cveOper)
          .map((c) => String(c.cveCobaye));
        return filtrarPorOperRamo(cves, cveOper);
      }
      // criterio cobertura 0 o 1 → todos + filtro oper/ramo
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobaye)))];
      return filtrarPorOperRamo(cves, cveOper);
    }

    // criterio 9 → reaseg + oper/ramo
    if (crit === 9) {
      const cveOper   = formData.cveOperRamoPrimaPropor;
      const cveReaseg = formData.cveReaseguradorPrimaPropor;

      if (critCob === 6) {
        const cves = coberturaContrato
          .filter(
            (c) =>
              c.cveOperRamoCobertura     === cveOper &&
              c.cveReaseguradorCobertura === cveReaseg
          )
          .map((c) => String(c.cveCobaye));
        return filtrarPorOperRamo(cves, cveOper);
      }
      if (critCob === 3) {
        const cves = coberturaContrato
          .filter((c) => c.cveOperRamoCobertura === cveOper)
          .map((c) => String(c.cveCobaye));
        return filtrarPorOperRamo(cves, cveOper);
      }
      if (critCob === 0) {
        const cves = coberturaContrato
          .filter((c) => c.cveReaseguradorCobertura === cveReaseg)
          .map((c) => String(c.cveCobaye));
        return filtrarPorOperRamo(cves, cveOper);
      }
      // criterio cobertura 1 → todos + filtro oper/ramo
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobaye)))];
      return filtrarPorOperRamo(cves, cveOper);
    }

    return todasCoberturas;
  });

  // Watches de limpieza
  watch(
    () => formData.cveCriterioAsigPrimaPropor,
    () => {
      setFieldValue("cveReaseguradorPrimaPropor", null);
      setFieldValue("cveOperRamoPrimaPropor",     null);
      setFieldValue("cveCobayePrimaPropor",        null);
    }
  );

  watch(() => formData.cveOperRamoPrimaPropor,     () => setFieldValue("cveCobayePrimaPropor", null));
  watch(() => formData.cveReaseguradorPrimaPropor, () => setFieldValue("cveCobayePrimaPropor", null));

  // Reset
  const resetFormAndRefs = () => {
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigPrimaPropor;
    resetForm();
    setFieldValue("cveCriterioAsigPrimaPropor", criterioActual);
    porcentajePrimaAnual.value = null;
    showErrors.value           = false;
  };

  // Helpers de descripción
  const getNombreReasegurador = (cve: number | null): string =>
    queryReaseguradoras.data.value?.find((r) => r.cveReasegurador === cve)
      ?.nombreReasegurador ?? "";

  const getDescOperRamo = (cve: string | null): string =>
    operacionesRamosData.value.find((o) => o.value === cve)?.title ?? "";

  const getDescCobaye = (cve: number | null): string =>
    queryCoberturasAyE.data.value?.find((c) => c.cveCobaye === cve)?.descCobaye ?? "";

  // Validación de duplicados
  const esDuplicado = (newRow: ProporcionPrimasSection): boolean => {
    const crit = newRow.cveCriterioAsigPrimaPropor;

    // POR CONTRATO → solo se permite un registro
    if (crit === 1) {
      return originalDataTable.value.some((r) => r.cveCriterioAsigPrimaPropor === 1);
    }

    // Para el resto → sin restricción adicional (tantos registros como combinaciones posibles)
    return false;
  };

  // Agregar proporción
  const handleAgregarProporcion = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar la proporción de tarifa capturada?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarProporcion,
      },
    });
  };

  const confirmAgregarProporcion = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: ProporcionPrimasSection = {
      idContrato:                 aeStore.generales.idContrato,
      cveCriterioAsigPrimaPropor: formData.cveCriterioAsigPrimaPropor!,
      cveReaseguradorPrimaPropor: formData.cveReaseguradorPrimaPropor ?? null,
      cveOperRamoPrimaPropor:     formData.cveOperRamoPrimaPropor ?? null,
      cveCobayePrimaPropor:       formData.cveCobayePrimaPropor ?? null,
      noDiasCubiertos:            formData.noDiasCubiertos,
      porcentajePrimaAnual:       formData.porcentajePrimaAnual,
      proporcionActiva:           true,
    };

    if (esDuplicado(newRow)) {
      dialog.show({
        title: "Atención",
        message: "Solo se permite un registro de proporción de prima para el contrato cuando el criterio es POR CONTRATO.",
        type: DialogType.ERROR,
      });
      return;
    }

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // Toggle activo
  const toggleRowActiva = (item: ProporcionPrimasDisplay) => {
    const index = _findIndex(item);
    if (index !== -1) {
      originalDataTable.value[index]!.proporcionActiva =
        !originalDataTable.value[index]!.proporcionActiva;
    }
  };

  // Editar fila
  const editRow = (item: ProporcionPrimasDisplay) => {
    const index = _findIndex(item);
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("cveCriterioAsigPrimaPropor", row.cveCriterioAsigPrimaPropor);
    setFieldValue("cveReaseguradorPrimaPropor", row.cveReaseguradorPrimaPropor);
    setFieldValue("cveOperRamoPrimaPropor",     row.cveOperRamoPrimaPropor);
    setFieldValue("cveCobayePrimaPropor",        row.cveCobayePrimaPropor);
    setFieldValue("noDiasCubiertos",            row.noDiasCubiertos);
    setFieldValue("porcentajePrimaAnual",       row.porcentajePrimaAnual);

    porcentajePrimaAnual.value = row.porcentajePrimaAnual;

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Clave compuesta — todos los discriminadores únicos del spec
  const _findIndex = (item: ProporcionPrimasSection): number =>
    originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigPrimaPropor === item.cveCriterioAsigPrimaPropor &&
        r.cveReaseguradorPrimaPropor === item.cveReaseguradorPrimaPropor &&
        r.cveOperRamoPrimaPropor     === item.cveOperRamoPrimaPropor     &&
        r.cveCobayePrimaPropor       === item.cveCobayePrimaPropor       &&
        r.noDiasCubiertos            === item.noDiasCubiertos
    );

  // Guardar
  const handleGuardarProporciones = () => {
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
      message: "¿Confirma que los datos ingresados de proporción de primas para este contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarProporciones,
      },
    });
  };

  const doGuardarProporciones = () => {
    aeStore.guardarProporcionPrimas(originalDataTable.value);
    dialog.cerrar();
  };

  // Headers
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "REASEGURADORA",          key: "nombreReasegurador",   sortable: true,  headerProps: hp },
    { title: "OPERACIÓN / RAMO",       key: "descOperRamo",         sortable: true,  headerProps: hp },
    { title: "COBERTURA",              key: "descCobaye",           sortable: true,  headerProps: hp },
    { title: "NÚMERO DE DÍAS CUBIERTOS", key: "noDiasCubiertos",    sortable: true,  headerProps: hp },
    { title: "% PRIMA ANUAL",          key: "porcentajePrimaAnual", sortable: true,  headerProps: hp },
    { title: "ACTIVO",                 key: "proporcionActiva",     sortable: true,  headerProps: hp },
    { title: "EDITAR",                 key: "editar",               sortable: false, headerProps: hp },
  ];

  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // slider / porcentaje
    porcentajePrimaAnual,
    // visibilidad condicional
    criterioEstaFijo,
    showReasegurador,
    showOperRamo,
    showCobertura,
    // catálogos
    queryCriterioAsignacion,
    reaseguradoraData,
    operacionesRamosData,
    coberturasDisponibles,
    // tabla
    tableHeaders,
    dataTable,
    // acciones
    handleAgregarProporcion,
    handleGuardarProporciones,
    toggleRowActiva,
    editRow,
  };
};