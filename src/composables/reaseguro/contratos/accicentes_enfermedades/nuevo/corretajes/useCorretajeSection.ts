import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { formattNumber } from "@/utils/formatters/formattNumber";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { validarCSV, esArchivoCSVValido } from "@/utils/files/validateCSV";
import { parseCSVLine, getCSVColumns } from "@/utils/files/csvParser";
import { useCorretajeValidations } from "./useCorretajeValidations";
import type { CorretajeSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

//
// Columnas requeridas en el CSV
//
const COLUMNAS_CSV = [
  "INTERMEDIARIO",
  "REASEGURADOR",
  "LIMITE_INF",
  "LIMITE_SUP",
  "PORCENTAJE_CORRETAJE_DEF",
  "MONTO_CORRETAJE_DEF",
] as const;

// Tipo del formulario
type CorretajeForm = Omit<CorretajeSection, "idContrato" | "corActivo">;

// Tipo display — agrega campos descriptivos para la tabla
export type CorretajeDisplay = CorretajeSection & {
  nombreIntermediario: string;
  nombreReasegurador: string;
};

export const useCorretajeSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { corretajes: corretaje, intermediarios } = storeToRefs(aeStore);

  const { queryReaseguradoras, queryIntermediarios } = useAccidentesEnfermedades();

  // Tabla base mutable
  const originalDataTable = ref<CorretajeSection[]>([...corretaje.value]);

  // Computed display
  const dataTable = computed<CorretajeDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      nombreIntermediario: getNombreIntermediario(row.cveIntermediarioCorretaje),
      nombreReasegurador:  getNombreReasegurador(row.cveReaseguradorCorretaje),
    }))
  );

  // CSV state
  const csvRows         = ref<CorretajeDisplay[]>([]);
  const csvSelectedRows = ref<CorretajeDisplay[]>([]);
  const csvLoading      = ref(false);
  const showCsvDialog   = ref(false);

  // Refs numéricos
  const limiteInf             = ref("");
  const limiteSup             = ref("");
  const porcentajeCorretajeDef = ref("");
  const montoCorretajeDef      = ref("");

  const formatNumberRefs: Record<string, typeof limiteInf> = {
    limiteInfCorretaje:     limiteInf,
    limiteSupCorretaje:     limiteSup,
    porcentajeCorretajeDef,
    montoCorretajeDef,
  };

  // Intermediarios escalonados del contrato
  // Solo los que tienen CVE_ASIGNACION_CORRETAJE = 2 (ESCALONADA)
  const intermediariosEscalonados = computed(() =>
    intermediarios.value.filter((i) => i.cveAsignacionCorretaje === 2)
  );

  // ¿Algún intermediario escalonado tiene criterio POR REASEGURADORA (0)?
  const hayEscalonadoPorReaseg = computed(() =>
    intermediariosEscalonados.value.some(
      (i) => i.cveCriterioAsigIntermediario === 0
    )
  );

  // Opciones de intermediario para el select (filtradas)
  const intermediariosData = computed(() => {
    const cvesEscalonados = [
      ...new Set(intermediariosEscalonados.value.map((i) => i.cveIntermediario)),
    ].filter((v): v is number => v != null);

    return (queryIntermediarios?.data.value ?? []).filter((i: any) =>
      cvesEscalonados.includes(i.cveIntermediario)
    );
  });

  // Opciones de reasegurador filtradas según intermediario seleccionado
  const reaseguradoraData = computed(() => {
    const cveInter = formData.cveIntermediarioCorretaje;
    if (!hayEscalonadoPorReaseg.value || !cveInter) return [];

    // Solo reaseguradoras del intermediario seleccionado con tipo ESCALONADA
    const cvesReaseg = [
      ...new Set(
        intermediariosEscalonados.value
          .filter(
            (i) =>
              i.cveIntermediario    === cveInter &&
              i.cveCriterioAsigIntermediario === 0
          )
          .map((i) => i.cveReaseguradorIntermediario)
      ),
    ].filter((v): v is number => v != null);

    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesReaseg.includes(r.cveReasegurador)
    );
  });

  // Formulario
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<CorretajeForm>({
    validationSchema: useCorretajeValidations(),
    validateOnMount: false,
    initialValues: {
      cveIntermediarioCorretaje: undefined as unknown as number,
      cveReaseguradorCorretaje:  null,
      limiteInfCorretaje:        undefined as unknown as number,
      limiteSupCorretaje:        1000.00,
      porcentajeCorretajeDef:    null,
      montoCorretajeDef:         null,
    },
  });

  const showErrors = ref(false);

  // Watches de limpieza
  watch(
    () => formData.cveIntermediarioCorretaje,
    () => { setFieldValue("cveReaseguradorCorretaje", null); }
  );

  // Mutuamente excluyentes: % y monto
  watch(
    () => formData.porcentajeCorretajeDef,
    (val) => {
      if (val != null) {
        setFieldValue("montoCorretajeDef", null);
        montoCorretajeDef.value = "";
      }
    }
  );

  watch(
    () => formData.montoCorretajeDef,
    (val) => {
      if (val != null) {
        setFieldValue("porcentajeCorretajeDef", null);
        porcentajeCorretajeDef.value = "";
      }
    }
  );

  // Handlers genéricos numéricos
  const onInputGeneric = (key: string, value: string) => {
    const clean    = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof CorretajeForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof CorretajeForm, null);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof CorretajeForm, null);
      return;
    }
    setFieldValue(key as keyof CorretajeForm, numeric);
    fieldRef.value = key.startsWith("porcentaje")
      ? numeric.toFixed(2)
      : formatCurrency(numeric);
  };

  // Reset
  const resetFormAndRefs = () => {
    resetForm();
    setFieldValue("limiteSupCorretaje", 1000.00);
    limiteSup.value              = "1000.00";
    limiteInf.value              = "";
    porcentajeCorretajeDef.value = "";
    montoCorretajeDef.value      = "";
    showErrors.value             = false;
  };

  // Helpers de descripción
  const getNombreIntermediario = (cve: number | null | undefined): string =>
    (queryIntermediarios?.data.value ?? []).find(
      (i: any) => i.cveIntermediario === cve
    )?.nombreIntermediario ?? "";

  const getNombreReasegurador = (cve: number | null): string =>
    queryReaseguradoras.data.value?.find((r) => r.cveReasegurador === cve)
      ?.nombreReasegurador ?? "";

  // Agregar corretaje individual
  const handleAgregarCorretaje = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: CorretajeSection = {
      idContrato:                aeStore.generales.idContrato,
      cveIntermediarioCorretaje: formData.cveIntermediarioCorretaje,
      cveReaseguradorCorretaje:  formData.cveReaseguradorCorretaje ?? null,
      limiteInfCorretaje:        formData.limiteInfCorretaje,
      limiteSupCorretaje:        formData.limiteSupCorretaje,
      porcentajeCorretajeDef:    formData.porcentajeCorretajeDef ?? null,
      montoCorretajeDef:         formData.montoCorretajeDef ?? null,
      corActivo:                 true,
    };

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // Carga CSV
  const handleFileUpload = () => {
    // Vuetify v-file-input expone el input nativo dentro del componente
    document.querySelector<HTMLInputElement>("#file-input-corretaje")?.click();
  };

  const handleFileChange = async (file: File | File[] | 0) => {
    const f = Array.isArray(file) ? file[0] : file;
    if (!f) return;

    if (!esArchivoCSVValido(f)) {
      dialog.show({
        title: "Archivo inválido",
        message: "El archivo seleccionado no es un CSV válido. Verifique la extensión.",
        type: DialogType.ERROR,
      });
      return;
    }

    csvLoading.value = true;

    const validacion = await validarCSV(f);
    if (!validacion.valido) {
      csvLoading.value = false;
      dialog.show({
        title: "Error en el archivo CSV",
        message: validacion.errores.join("<br/>"),
        type: DialogType.ERROR,
      });
      return;
    }

    try {
      const text    = await f.text();
      const lines   = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const headers = getCSVColumns(lines[0]!).map((h) => h.trim().toUpperCase());

      const faltantes = COLUMNAS_CSV.filter((col) => !headers.includes(col));
      if (faltantes.length > 0) {
        dialog.show({
          title: "Error en el archivo CSV",
          message: `Faltan las siguientes columnas: ${faltantes.join(", ")}`,
          type: DialogType.ERROR,
        });
        csvLoading.value = false;
        return;
      }

      const idxInter  = headers.indexOf("INTERMEDIARIO");
      const idxReaseg = headers.indexOf("REASEGURADOR");
      const idxInf    = headers.indexOf("LIMITE_INF");
      const idxSup    = headers.indexOf("LIMITE_SUP");
      const idxPct    = headers.indexOf("PORCENTAJE_CORRETAJE_DEF");
      const idxMonto  = headers.indexOf("MONTO_CORRETAJE_DEF");

      const allReaseguradoras  = queryReaseguradoras.data.value ?? [];
      const allIntermediarios  = queryIntermediarios?.data.value ?? [];

      const parsed: CorretajeDisplay[] = lines.slice(1).map((line) => {
        const cols = parseCSVLine(line);

        // Intermediario: el CSV trae CVE_INTERMEDIARIO directamente
        const cveInter      = parseInt(cols[idxInter] ?? "0") || 0;
        const nombreInter   = (allIntermediarios as any[]).find(
          (i) => i.cveIntermediario === cveInter
        )?.nombreIntermediario ?? String(cveInter);

        // Reasegurador: el CSV trae REGISTRO_CNSF, hay que resolver a CVE
        const registroCnsf  = cols[idxReaseg]?.trim() ?? "";
        const reaseg        = allReaseguradoras.find(
          (r) => String(r.registroCnsf) === registroCnsf
        );

        const pctVal   = parseFloat(cols[idxPct]  ?? "") || null;
        const montoVal = parseFloat(cols[idxMonto] ?? "") || null;

        return {
          idContrato:                "",
          cveIntermediarioCorretaje: cveInter,
          cveReaseguradorCorretaje:  reaseg?.cveReasegurador ?? null,
          limiteInfCorretaje:        parseFloat(cols[idxInf] ?? "0") || 0,
          limiteSupCorretaje:        parseFloat(cols[idxSup] ?? "1000") || 1000,
          porcentajeCorretajeDef:    pctVal   != null && montoVal == null ? pctVal   : null,
          montoCorretajeDef:         montoVal != null && pctVal   == null ? montoVal : null,
          corActivo:                 true,
          nombreIntermediario:       nombreInter,
          nombreReasegurador:        reaseg?.nombreReasegurador ?? registroCnsf,
        };
      });

      csvRows.value         = parsed;
      csvSelectedRows.value = [...parsed];
      showCsvDialog.value   = true;
    } catch (error) {
      dialog.show({
        title: "Error",
        message: `No fue posible procesar el archivo: ${error}`,
        type: DialogType.ERROR,
      });
    } finally {
      csvLoading.value = false;
    }
  };

  const handleCsvAccept = () => {
    const errores: string[] = [];
    const aAgregar: CorretajeSection[] = [];

    csvSelectedRows.value.forEach((row, i) => {
      if (!row.cveIntermediarioCorretaje) {
        errores.push(`Fila ${i + 1}: intermediario no encontrado.`);
        return;
      }
      if (hayEscalonadoPorReaseg.value && !row.cveReaseguradorCorretaje) {
        errores.push(`Fila ${i + 1}: reaseguradora no encontrada ("${row.nombreReasegurador}").`);
        return;
      }
      if (row.porcentajeCorretajeDef == null && row.montoCorretajeDef == null) {
        errores.push(`Fila ${i + 1}: debe tener % corretaje definitivo o monto corretaje definitivo.`);
        return;
      }
      const { nombreIntermediario: _a, nombreReasegurador: _b, ...base } = row;
      aAgregar.push(base);
    });

    if (errores.length > 0) {
      dialog.show({
        title: "Errores en el archivo",
        message: errores.join("<br/>"),
        type: DialogType.ERROR,
      });
      return;
    }

    originalDataTable.value.push(...aAgregar);
    showCsvDialog.value = false;
    csvRows.value       = [];
  };

  const handleCsvCancel = () => {
    showCsvDialog.value   = false;
    csvRows.value         = [];
    csvSelectedRows.value = [];
  };

  // Toggle activo
  const toggleRowActiva = (item: CorretajeDisplay) => {
    const index = _findIndex(item);
    if (index !== -1) {
      originalDataTable.value[index]!.corActivo =
        !originalDataTable.value[index]!.corActivo;
    }
  };

  // Editar fila
  const editRow = (item: CorretajeDisplay) => {
    const index = _findIndex(item);
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("cveIntermediarioCorretaje", row.cveIntermediarioCorretaje);
    setFieldValue("cveReaseguradorCorretaje",  row.cveReaseguradorCorretaje);
    setFieldValue("limiteInfCorretaje",        row.limiteInfCorretaje);
    setFieldValue("limiteSupCorretaje",        row.limiteSupCorretaje);
    setFieldValue("porcentajeCorretajeDef",    row.porcentajeCorretajeDef);
    setFieldValue("montoCorretajeDef",         row.montoCorretajeDef);

    limiteInf.value              = row.limiteInfCorretaje != null ? String(row.limiteInfCorretaje) : "";
    limiteSup.value              = row.limiteSupCorretaje != null ? String(row.limiteSupCorretaje) : "";
    porcentajeCorretajeDef.value = row.porcentajeCorretajeDef != null ? row.porcentajeCorretajeDef.toFixed(2) : "";
    montoCorretajeDef.value      = row.montoCorretajeDef      != null ? formatCurrency(row.montoCorretajeDef)  : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Clave compuesta: intermediario + reasegurador + límite inferior
  const _findIndex = (item: CorretajeSection): number =>
    originalDataTable.value.findIndex(
      (r) =>
        r.cveIntermediarioCorretaje === item.cveIntermediarioCorretaje &&
        r.cveReaseguradorCorretaje  === item.cveReaseguradorCorretaje  &&
        r.limiteInfCorretaje        === item.limiteInfCorretaje
    );

  // Guardar
  const handleGuardarCorretaje = async () => {
    // Validación: ¿faltan registros según asignación de intermediario?
    const criterio = intermediariosEscalonados.value[0]?.cveCriterioAsigIntermediario;
    const faltanRegistros = validarRegistrosCompletos();

    if (faltanRegistros) {
      const continuar = await new Promise<boolean>((resolve) => {
        dialog.show({
          title: "Registros incompletos",
          message: "Faltan registros de corretaje ¿Deseas continuar?",
          type: DialogType.ERROR,
          autoCloseExtraAction: false,
          ExtraAction: {
            text: "Continuar",
            color: "primary",
            handler: () => resolve(true),
          },
          onCancel: () => resolve(false),
        });
      });
      if (!continuar) return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirmas que los datos ingresados de corretaje son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarCorretaje,
      },
    });
  };

  /**
   * Retorna true si faltan registros:
   * - criterio POR CONTRATO (1): debe existir al menos un corretaje
   * - criterio POR REASEGURADORA (0): debe existir al menos uno por cada combo intermediario/reasegurador escalonado
   */
  const validarRegistrosCompletos = (): boolean => {
    if (originalDataTable.value.length === 0) return true;

    const criterio = intermediariosEscalonados.value[0]?.cveCriterioAsigIntermediario;

    if (criterio === 1) {
      return originalDataTable.value.length === 0;
    }

    if (criterio === 0) {
      // Para cada combo intermediario+reasegurador escalonado debe haber al menos un registro
      return intermediariosEscalonados.value.some((inter) => {
        const cveInter  = inter.cveIntermediario;
        const cveReaseg = inter.cveReaseguradorIntermediario;
        return !originalDataTable.value.some(
          (r) =>
            r.cveIntermediarioCorretaje === cveInter &&
            r.cveReaseguradorCorretaje  === cveReaseg
        );
      });
    }

    return false;
  };

  const doGuardarCorretaje = () => {
    aeStore.guardarCorretajes(originalDataTable.value);
    dialog.cerrar();
  };

  // Activar / desactivar todos
  const toggleAllActiva = () => {
    const allActive = originalDataTable.value.every((r) => r.corActivo);
    originalDataTable.value = originalDataTable.value.map((r) => ({
      ...r,
      corActivo: !allActive,
    }));
  };

  const toggleSelectAllCsv = (selectAll: boolean) => {
    csvSelectedRows.value = selectAll ? [...csvRows.value] : [];
  };

  // Headers
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "Intermediario",             key: "nombreIntermediario",   sortable: true,  headerProps: hp },
    { title: "Reaseguradora",             key: "nombreReasegurador",    sortable: true,  headerProps: hp },
    { title: "Límite inferior",           key: "limiteInfCorretaje",    sortable: true,  headerProps: hp },
    { title: "Límite superior",           key: "limiteSupCorretaje",    sortable: true,  headerProps: hp },
    { title: "% Corretaje definitivo",    key: "porcentajeCorretajeDef", sortable: true, headerProps: hp },
    { title: "Monto corretaje definitivo",key: "montoCorretajeDef",     sortable: true,  headerProps: hp },
    { title: "Activo",                    key: "corActivo",             sortable: true,  headerProps: hp },
    { title: "Editar",                    key: "editar",                sortable: false, headerProps: hp },
  ];

  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // refs numéricos
    limiteInf,
    limiteSup,
    porcentajeCorretajeDef,
    montoCorretajeDef,
    onInputGeneric,
    onBlurGeneric,
    // opciones
    intermediariosData,
    reaseguradoraData,
    hayEscalonadoPorReaseg,
    // CSV
    csvRows,
    csvSelectedRows,
    csvLoading,
    showCsvDialog,
    handleFileUpload,
    handleFileChange,
    handleCsvAccept,
    handleCsvCancel,
    // tabla
    tableHeaders,
    dataTable,
    // acciones
    handleAgregarCorretaje,
    toggleAllActiva,
    toggleSelectAllCsv,
    handleGuardarCorretaje,
    toggleRowActiva,
    editRow,
  };
};