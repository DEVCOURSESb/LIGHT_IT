import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formattNumber } from "@/utils/formatters/formattNumber";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { useTarifasValidations } from "./Usetarifasvalidations";
import type { TarifasSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

// 
// Mapa de coberturas permitidas por operación/ramo
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

// Tipo del formulario — sin idContrato y tarifaActiva
type TarifasForm = Omit<TarifasSection, "idContrato" | "tarifaActiva">;

// Tipo display — extiende la interfaz con campos calculados para la tabla
type TarifasDisplay = TarifasSection & {
  nombreReasegurador: string;
  descOperRamo: string;
  descCobaye: string;
  descTarifa: string;
};

export const useTarifasSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const {
    isTypeProporcional,
    tarifas,
    reaseguradores,
    coberturas,
    detallesProporcionales,
  } = storeToRefs(aeStore);

  const {
    queryCriterioAsignacion,
    queryOperacionesRamos,
    queryCoberturasAyE,
    queryReaseguradoras,
    queryTipoTarifa,
    queryMoneda: queryMonedas,
    querySexo,
  } = useAccidentesEnfermedades();

  //  Tabla base mutable 
  const originalDataTable = ref<TarifasSection[]>([...tarifas.value]);

  //  Computed display — agrega campos de descripción, es solo lectura 
  const dataTable = computed<TarifasDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      nombreReasegurador: getNombreReasegurador(row.cveReaseguradorTarifa),
      descOperRamo:       getDescOperRamo(row.cveOperRamoTarifa),
      descCobaye:         getDescCobaye(row.cveCobAyETarifa),
      descTarifa:         getDescTarifa(row.cveTarifa),
    }))
  );

  //  Refs numéricos (formateo visual) 
  const primaTarifaReaseg  = ref("");
  const porcentajePrimaEmi = ref("");
  const tarifaMillar       = ref("");
  const edad               = ref("");

  const formatNumberRefs: Record<string, typeof primaTarifaReaseg> = {
    primaTarifaReaseg,
    porcentajePrimaEmi,
    tarifaMillar,
    edad,
  };

  //  Formulario 
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<TarifasForm>({
    validationSchema: useTarifasValidations(),
    validateOnMount: false,
    initialValues: {
      cveCriterioAsigTarifa: 1,
      cveReaseguradorTarifa: null,
      cveOperRamoTarifa:     null,
      cveCobAyETarifa:       null,
      cveTarifa:             null,
      primaTarifaReaseg:     null,
      porcentajePrimaEmi:    null,
      tarifaMillar:          null,
      edad:                  null,
      cveSexo:               null,
      proporcionDias:        0,
      cveMonedaTarifa:       null,
    },
  });

  const showErrors = ref(false);

  //  Criterio fijo mientras haya registros activos 
  const criterioFijo = computed<number | null>(() =>
    originalDataTable.value.find((r) => r.tarifaActiva)?.cveCriterioAsigTarifa ?? null
  );

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  //  Operaciones/ramos disponibles según tipo de reaseguro 
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
        // No proporcional: usa CAE_OPERACION_RAMO de generales
        aeStore.generales.CAE_OPERACION_RAMO?.forEach((row) => {
          pushOperacion(row.cveOperRamo);
        });
      } else {
        const tieneDetalleOperRamo = detallesProporcionales.value.some(row => row.detallesOperRamo === 1);

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

  //  Reaseguradoras del contrato 
  const reaseguradoraData = computed(() => {
    const cvesContrato = reaseguradores.value.map((r) => r.cveReasegurador);
    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesContrato.includes(r.cveReasegurador)
    );
  });

  //  Coberturas disponibles según criterio y contexto 
  const coberturasDisponibles = computed(() => {
    const todasCoberturas    = queryCoberturasAyE.data.value ?? [];
    const criterio           = formData.cveCriterioAsigTarifa;
    const coberturaContrato  = coberturas.value;
    // TODO: aqui tomo el primer valor de coberturas, ya que es un array, la definicion no especifica si solo debe existir un solo registro
    const criterioCob        = coberturaContrato[0]?.cveCriterioAsigCobertura;

    const filtrarPorOperRamo = (cvesPermitidos: string[], cveOperRamo: string | null) => {
      let base = todasCoberturas.filter((c) =>
        cvesPermitidos.includes(String(c.cveCobaye))
      );
      if (!cveOperRamo || ["3000", "030"].includes(cveOperRamo)) return base;
      const permitidos = COBERTURAS_POR_OPER_RAMO[cveOperRamo];
      return permitidos
        ? base.filter((c) => permitidos.includes(String(c.cveCobaye)))
        : base;
    };

    // criterio 4 → todos los cveCobAyE de coberturas del contrato
    if (criterio === 4) {
      // recupera todas las claves registradas para l contrato de la tabla CAE_COBERTURAS_CONTRATO
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobAyE)))];
      // de todas las cobrturas extrae toda la data en base a las claves recuperadas
      return todasCoberturas.filter((c) => cves.includes(String(c.cveCobaye)));
    }

    // criterio 7 → filtrado por reaseguradora si criterio cobertura es 0 o 6
    if (criterio === 7) {
      if ([0, 6].includes(criterioCob!)) {
        const cves = coberturaContrato
          .filter((c) => c.cveReaseguradorCobertura === formData.cveReaseguradorTarifa)
          .map((c) => String(c.cveCobAyE));
        return todasCoberturas.filter((c) => cves.includes(String(c.cveCobaye)));
      }
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobAyE)))];
      return todasCoberturas.filter((c) => cves.includes(String(c.cveCobaye)));
    }

    // criterio 8 → filtrado por oper/ramo
    if (criterio === 8) {
      const cveOper = formData.cveOperRamoTarifa;
      if ([3, 6].includes(criterioCob!)) {
        const cves = coberturaContrato
          .filter((c) => c.cveOperRamoCobertura === cveOper)
          .map((c) => String(c.cveCobAyE));
        return filtrarPorOperRamo(cves, cveOper);
      }
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobAyE)))];
      return filtrarPorOperRamo(cves, cveOper);
    }

    // criterio 9 → combinación reaseg + oper/ramo
    if (criterio === 9) {
      const cveOper   = formData.cveOperRamoTarifa;
      const cveReaseg = formData.cveReaseguradorTarifa;

      /* console.log({cveOper})
      console.log({cveReaseg}) */

      if (criterioCob === 6) {
        // aqui estan los detalles
        const cves = coberturaContrato
          .filter(
            (c) =>
              c.cveOperRamoCobertura     == cveOper &&
              c.cveReaseguradorCobertura == cveReaseg
          )
          .map((c) => String(c.cveCobAyE));
          /* console.log({cves}) */
        return filtrarPorOperRamo(cves, cveOper);
      }
      if (criterioCob === 3) {
        const cves = coberturaContrato
          .filter((c) => c.cveOperRamoCobertura === cveOper)
          .map((c) => String(c.cveCobAyE));
        return filtrarPorOperRamo(cves, cveOper);
      }
      if (criterioCob === 0) {
        const cves = coberturaContrato
          .filter((c) => c.cveReaseguradorCobertura === cveReaseg)
          .map((c) => String(c.cveCobAyE));
        return filtrarPorOperRamo(cves, cveOper);
      }
      const cves = [...new Set(coberturaContrato.map((c) => String(c.cveCobAyE)))];
      return filtrarPorOperRamo(cves, cveOper);
    }

    return todasCoberturas;
  });

  //  Validación de duplicados 
  const esDuplicado = (newRow: TarifasSection): boolean => {
    const criterio  = newRow.cveCriterioAsigTarifa;
    const cveTarifa = newRow.cveTarifa;

    // POR CONTRATO con tarifa QX (2) o fija por edad/sexo (4): clave = criterio + tarifa + edad + sexo
    if (criterio === 1 && [2, 4].includes(cveTarifa!)) {
      return originalDataTable.value.some(
        (r) =>
          r.cveCriterioAsigTarifa === criterio &&
          r.cveTarifa             === cveTarifa &&
          r.edad                  === newRow.edad &&
          r.cveSexo               === newRow.cveSexo
      );
    }

    // POR CONTRATO con otro tipo de tarifa: solo un registro
    if (criterio === 1) {
      return originalDataTable.value.some((r) => r.cveCriterioAsigTarifa === criterio);
    }

    return false;
  };

  //  Watches de limpieza 
  watch(
    () => formData.cveCriterioAsigTarifa,
    () => {
      setFieldValue("cveReaseguradorTarifa", null);
      setFieldValue("cveOperRamoTarifa",     null);
      setFieldValue("cveCobAyETarifa",        null);
    }
  );

  watch(() => formData.cveOperRamoTarifa,    () => setFieldValue("cveCobAyETarifa", null));
  watch(() => formData.cveReaseguradorTarifa, () => setFieldValue("cveCobAyETarifa", null));

  watch(
    () => formData.cveTarifa,
    () => {
      setFieldValue("primaTarifaReaseg",  null);
      setFieldValue("porcentajePrimaEmi", null);
      setFieldValue("tarifaMillar",       null);
      setFieldValue("edad",               null);
      setFieldValue("cveSexo",            null);
      setFieldValue("cveMonedaTarifa",    null);
      primaTarifaReaseg.value  = "";
      porcentajePrimaEmi.value = "";
      tarifaMillar.value       = "";
      edad.value               = "";
      // Default porcentajePrimaEmi = 100 cuando cveTarifa = 1
      if (formData.cveTarifa === 1) {
        setFieldValue("porcentajePrimaEmi", 100);
        porcentajePrimaEmi.value = "100";
      }
    }
  );

  //  Handlers genéricos numéricos 
  const onInputGeneric = (key: string, value: string) => {
    const clean    = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof TarifasForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof TarifasForm, null);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof TarifasForm, null);
      return;
    }
    setFieldValue(key as keyof TarifasForm, numeric);
    // edad no lleva formatCurrency (es entero)
    fieldRef.value = key === "edad" ? String(Math.trunc(numeric)) : formatCurrency(numeric);
  };

  //  Reset 
  const resetFormAndRefs = () => {
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigTarifa;
    resetForm();
    setFieldValue("cveCriterioAsigTarifa", criterioActual);
    setFieldValue("proporcionDias",        0);
    primaTarifaReaseg.value  = "";
    porcentajePrimaEmi.value = "";
    tarifaMillar.value       = "";
    edad.value               = "";
    showErrors.value         = false;
  };

  //  Helpers de descripción (para el computed display) 
  const getNombreReasegurador = (cve: number | null): string =>
    queryReaseguradoras.data.value?.find((r) => r.cveReasegurador === cve)
      ?.nombreReasegurador ?? "";

  const getDescOperRamo = (cve: string | null): string =>
    operacionesRamosData.value.find((o) => o.value === cve)?.title ?? "";

  const getDescCobaye = (cve: number | null): string =>
    queryCoberturasAyE.data.value?.find((c) => c.cveCobaye === cve)?.descCobaye ?? "";

  const getDescTarifa = (cve: number | null): string =>
    (queryTipoTarifa?.data.value ?? []).find((t: any) => t.cveTarifa === cve)
      ?.descTarifa ?? "";

  //  Agregar tarifa 
  const handleAgregarTarifa = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar la tarifa capturada?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarTarifa,
      },
    });
  };

  const confirmAgregarTarifa = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: TarifasSection = {
      idContrato:            aeStore.generales.idContrato,
      cveCriterioAsigTarifa: formData.cveCriterioAsigTarifa!,
      cveReaseguradorTarifa: formData.cveReaseguradorTarifa ?? null,
      cveOperRamoTarifa:     formData.cveOperRamoTarifa ?? null,
      cveCobAyETarifa:       formData.cveCobAyETarifa ?? null,
      cveTarifa:             formData.cveTarifa ?? null,
      primaTarifaReaseg:     formData.primaTarifaReaseg ?? null,
      porcentajePrimaEmi:    formData.porcentajePrimaEmi ?? null,
      tarifaMillar:          formData.tarifaMillar ?? null,
      edad:                  formData.edad ?? null,
      cveSexo:               formData.cveSexo ?? null,
      proporcionDias:        formData.proporcionDias ?? 0,
      cveMonedaTarifa:       formData.cveMonedaTarifa ?? null,
      tarifaActiva:          true,
    };

    if (esDuplicado(newRow)) {
      dialog.show({
        title: "Atención",
        message: "Ya existe un registro con la misma combinación para este contrato.",
        type: DialogType.ERROR,
      });
      return;
    }

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  //  Toggle activo 
  // Busca en originalDataTable por clave compuesta (criterio + reaseg + operRamo + cobaye + tarifa + edad + sexo)
  const toggleRowActiva = (item: TarifasDisplay) => {
    const index = _findIndex(item);
    if (index !== -1) {
      originalDataTable.value[index]!.tarifaActiva =
        !originalDataTable.value[index]!.tarifaActiva;
    }
  };

  //  Editar fila 
  const editRow = (item: TarifasDisplay) => {
    const index = _findIndex(item);
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("cveCriterioAsigTarifa", row.cveCriterioAsigTarifa);
    setFieldValue("cveReaseguradorTarifa", row.cveReaseguradorTarifa);
    setFieldValue("cveOperRamoTarifa",     row.cveOperRamoTarifa);
    setFieldValue("cveCobAyETarifa",       row.cveCobAyETarifa);
    setFieldValue("cveTarifa",             row.cveTarifa);
    setFieldValue("primaTarifaReaseg",     row.primaTarifaReaseg);
    setFieldValue("porcentajePrimaEmi",    row.porcentajePrimaEmi);
    setFieldValue("tarifaMillar",          row.tarifaMillar);
    setFieldValue("edad",                  row.edad);
    setFieldValue("cveSexo",              row.cveSexo);
    setFieldValue("proporcionDias",        row.proporcionDias);
    setFieldValue("cveMonedaTarifa",       row.cveMonedaTarifa);

    primaTarifaReaseg.value  = row.primaTarifaReaseg  != null ? formatCurrency(row.primaTarifaReaseg)  : "";
    porcentajePrimaEmi.value = row.porcentajePrimaEmi != null ? formatCurrency(row.porcentajePrimaEmi) : "";
    tarifaMillar.value       = row.tarifaMillar       != null ? formatCurrency(row.tarifaMillar)       : "";
    edad.value               = row.edad               != null ? String(row.edad)                       : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Clave compuesta para findIndex — incluye todos los discriminadores únicos
  const _findIndex = (item: TarifasSection): number =>
    originalDataTable.value.findIndex(
      (r) =>
        r.cveCriterioAsigTarifa === item.cveCriterioAsigTarifa &&
        r.cveReaseguradorTarifa === item.cveReaseguradorTarifa &&
        r.cveOperRamoTarifa     === item.cveOperRamoTarifa     &&
        r.cveCobAyETarifa       === item.cveCobAyETarifa       &&
        r.cveTarifa             === item.cveTarifa             &&
        r.edad                  === item.edad                  &&
        r.cveSexo               === item.cveSexo
    );

  //  Guardar 
  const handleGuardarTarifa = () => {
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
      message: "¿Confirma que los datos ingresados de tarifas para este contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarTarifa,
      },
    });
  };

  const doGuardarTarifa = () => {
    aeStore.guardarTarifas(originalDataTable.value);
    dialog.cerrar();
  };

  //  Headers 
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "REASEGURADORA",    key: "nombreReasegurador", sortable: true,  headerProps: hp },
    { title: "OPERACIÓN / RAMO", key: "descOperRamo",       sortable: true,  headerProps: hp },
    { title: "COBERTURA",        key: "descCobaye",         sortable: true,  headerProps: hp },
    { title: "TIPO DE TARIFA",   key: "descTarifa",         sortable: true,  headerProps: hp },
    { title: "PRIMA FIJA",       key: "primaTarifaReaseg",  sortable: true,  headerProps: hp },
    { title: "% PRIMA EMITIDA",  key: "porcentajePrimaEmi", sortable: true,  headerProps: hp },
    { title: "TARIFA AL MILLAR", key: "tarifaMillar",       sortable: true,  headerProps: hp },
    { title: "EDAD",             key: "edad",               sortable: true,  headerProps: hp },
    { title: "SEXO",             key: "cveSexo",               sortable: true,  headerProps: hp },
    { title: "MONEDA TARIFA",    key: "cveMonedaTarifa",               sortable: true,  headerProps: hp },
    { title: "¿PROPORCIÓN POR DIAS DE VIGENCIA?",    key: "proporcionDias",               sortable: true,  headerProps: hp },
    { title: "ACTIVA",           key: "tarifaActiva",       sortable: true,  headerProps: hp },
    { title: "EDITAR",           key: "editar",             sortable: false, headerProps: hp },
  ];

  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // refs numéricos
    primaTarifaReaseg,
    porcentajePrimaEmi,
    tarifaMillar,
    edad,
    onInputGeneric,
    onBlurGeneric,
    // catálogos / opciones
    queryCriterioAsignacion,
    queryTipoTarifa,
    queryMonedas,
    querySexo,
    reaseguradoraData,
    operacionesRamosData,
    coberturasDisponibles,
    // tabla
    tableHeaders,
    dataTable,
    // estado
    criterioEstaFijo,
    // handlers
    handleAgregarTarifa,
    handleGuardarTarifa,
    toggleRowActiva,
    editRow,
  };
};