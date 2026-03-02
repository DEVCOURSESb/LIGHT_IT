import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useForm } from "vee-validate";
import { ref, computed } from "vue";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { validarCSV, esArchivoCSVValido } from "@/utils/validateCSV";
import { parseCSVLine, getCSVColumns } from "@/utils/csvParser";
import { useComisionesRateOnLineValidations } from "./useComisionesRateOnLineValidations";
import { storeToRefs } from "pinia";
import type { ComisionesRateOnLineSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

const COLUMNAS_CSV = ["REASEGURADOR", "LIMITE_INF", "LIMITE_SUP", "COMISION"] as const;

// Tipo display: extiende la interfaz con el campo calculado para la tabla
type ComisionesDisplay = ComisionesRateOnLineSection & {
  nombreReasegurador: string;
};

export const useComisionesRateOnLine = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { queryReaseguradoras } = useAccidentesEnfermedades();
  const { comisionesRateOnLine, reaseguradores } = storeToRefs(aeStore);

  // Tabla base mutable — todas las mutaciones van aquí
  const originalDataTable = ref<ComisionesRateOnLineSection[]>(
    [...comisionesRateOnLine.value]
  );

  // Computed display — agrega nombreReasegurador, es solo lectura
  const dataTable = computed<ComisionesDisplay[]>(() =>
    originalDataTable.value.map((item) => ({
      ...item,
      nombreReasegurador:
        queryReaseguradoras.data.value?.find(
          (r) => r.cveReasegurador === item.cveReaseguradorComisRol
        )?.nombreReasegurador ?? "",
    }))
  );

  // CSV
  const showCsvDialog   = ref(false);
  const csvRows         = ref<ComisionesDisplay[]>([]);
  const csvSelectedRows = ref<ComisionesDisplay[]>([]);
  const csvLoading      = ref(false);

  // Refs numéricos de formulario
  const limiteInf          = ref("");
  const limiteSup          = ref("");
  const comisRolDefinitiva = ref("");

  const formatNumberRefs: Record<string, typeof limiteInf> = {
    limiteInf,
    limiteSup,
    comisRolDefinitiva,
  };

  // Formulario
  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
    resetForm,
  } = useForm<Omit<ComisionesRateOnLineSection, "idContrato" | "comisRolActiva">>({
    validationSchema: useComisionesRateOnLineValidations(),
    validateOnMount: false,
  });

  const showErrors = ref(false);

  // Reaseguradoras con comisión escalonada
  const reaseguradoresEscalonadas = computed(() => {
    const cvesEscalonadas = reaseguradores.value
      .filter((r) => r.cveAsignacionComisRol === 2)
      .map((r) => r.cveReasegurador);

    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesEscalonadas.includes(r.cveReasegurador)
    );
  });

  // Handlers genéricos numéricos
  const onInputGeneric = (key: string, value: string) => {
    const clean    = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof typeof formData,
        clean === "" ? 0 : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof typeof formData, 0);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof typeof formData, 0);
      return;
    }
    setFieldValue(key as keyof typeof formData, numeric);
    fieldRef.value = formatCurrency(numeric);
  };

  const resetFormAndRefs = () => {
    resetForm();
    limiteInf.value          = "";
    limiteSup.value          = "";
    comisRolDefinitiva.value = "";
    showErrors.value         = false;
  };

  // Helper
  const getNombreReasegurador = (cve: number): string =>
    (queryReaseguradoras.data.value ?? []).find(
      (r) => r.cveReasegurador === cve
    )?.nombreReasegurador ?? "";

  // Agregar comisión
  const handleAgregarComision = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar la comisión capturada?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Sí, agregar",
        color: "primary",
        handler: confirmAgregarComision,
      },
    });
  };

  const confirmAgregarComision = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    // Se construye como ComisionesRateOnLineSection (sin nombreReasegurador)
    // originalDataTable solo almacena el tipo base; el computed agrega el display
    const newRow: ComisionesRateOnLineSection = {
      idContrato:              "",
      cveReaseguradorComisRol: formData.cveReaseguradorComisRol,
      limiteInf:               formData.limiteInf,
      limiteSup:               formData.limiteSup,
      comisRolDefinitiva:      formData.comisRolDefinitiva,
      comisRolActiva:          true,
    };

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // Carga CSV
  const handleFileUpload = () => {
    document.querySelector<HTMLInputElement>("#file-input")?.click();
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

      const idxReaseg = headers.indexOf("REASEGURADOR");
      const idxInf    = headers.indexOf("LIMITE_INF");
      const idxSup    = headers.indexOf("LIMITE_SUP");
      const idxComis  = headers.indexOf("COMISION");

      const allReaseguradoras = queryReaseguradoras.data.value ?? [];
      const parsed: ComisionesDisplay[] = lines.slice(1).map((line) => {
        const cols         = parseCSVLine(line);
        const registroCnsf = cols[idxReaseg]?.trim() ?? "";
        const reaseg       = allReaseguradoras.find(
          (r) => String(r.registroCnsf) === registroCnsf
        );

        return {
          idContrato:              "",
          cveReaseguradorComisRol: reaseg?.cveReasegurador ?? 0,
          nombreReasegurador:      reaseg?.nombreReasegurador ?? registroCnsf,
          limiteInf:               parseFloat(cols[idxInf] ?? "0") || 0,
          limiteSup:               parseFloat(cols[idxSup] ?? "0") || 0,
          comisRolDefinitiva:      parseFloat(cols[idxComis] ?? "0") || 0,
          comisRolActiva:          true,
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
    const aAgregar: ComisionesRateOnLineSection[] = [];

    csvSelectedRows.value.forEach((row, i) => {
      if (row.cveReaseguradorComisRol === 0) {
        errores.push(
          `Fila ${i + 1}: reaseguradora no encontrada ("${row.nombreReasegurador}").`
        );
        return;
      }
      // Se descarta nombreReasegurador antes de agregar a originalDataTable
      const { nombreReasegurador: _, ...base } = row;
      aAgregar.push(base);
    });

    if (errores.length > 0) {
      dialog.show({
        title: "Advertencia al cargar CSV",
        message: errores.join("<br/>"),
        type: DialogType.ERROR,
      });
    }

    originalDataTable.value.push(...aAgregar);
    _cerrarDialogoCsv();
  };

  const handleCsvCancel = () => _cerrarDialogoCsv();

  const _cerrarDialogoCsv = () => {
    showCsvDialog.value   = false;
    csvRows.value         = [];
    csvSelectedRows.value = [];
  };

  const toggleSelectAllCsv = (selectAll: boolean) => {
    csvSelectedRows.value = selectAll ? [...csvRows.value] : [];
  };

  // Activar / desactivar filas
  const toggleAllActiva = () => {
    const allActive = originalDataTable.value.every((r) => r.comisRolActiva);
    originalDataTable.value = originalDataTable.value.map((r) => ({
      ...r,
      comisRolActiva: !allActive,
    }));
  };

  // Busca en originalDataTable por clave compuesta (reaseg + rangos)
  const toggleRowActiva = (item: ComisionesDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveReaseguradorComisRol === item.cveReaseguradorComisRol &&
        r.limiteInf               === item.limiteInf &&
        r.limiteSup               === item.limiteSup
    );
    if (index !== -1) {
      originalDataTable.value[index]!.comisRolActiva =
        !originalDataTable.value[index]!.comisRolActiva;
    }
  };

  // Editar fila
  const editRow = (item: ComisionesDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveReaseguradorComisRol === item.cveReaseguradorComisRol &&
        r.limiteInf               === item.limiteInf &&
        r.limiteSup               === item.limiteSup
    );
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("cveReaseguradorComisRol", row.cveReaseguradorComisRol);
    setFieldValue("limiteInf",              row.limiteInf);
    setFieldValue("limiteSup",              row.limiteSup);
    setFieldValue("comisRolDefinitiva",     row.comisRolDefinitiva);

    limiteInf.value          = row.limiteInf          ? formatCurrency(row.limiteInf)          : "";
    limiteSup.value          = row.limiteSup          ? formatCurrency(row.limiteSup)          : "";
    comisRolDefinitiva.value = row.comisRolDefinitiva ? formatCurrency(row.comisRolDefinitiva) : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Guardar
  const handleGuardarComisiones = () => {
    if (originalDataTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe contener al menos un registro para continuar. Verifique por favor.",
        type: DialogType.ERROR,
      });
      return;
    }

    const cvesRequeridos = reaseguradoresEscalonadas.value.map((r) => r.cveReasegurador);
    const cvesEnTabla    = [...new Set(originalDataTable.value.map((r) => r.cveReaseguradorComisRol))];
    const faltantes      = cvesRequeridos.filter((cve) => !cvesEnTabla.includes(cve));

    if (faltantes.length > 0) {
      dialog.show({
        title: "Atención",
        message: "Faltan registros de comisiones por reaseguradora. ¿Deseas continuar?",
        type: DialogType.ERROR,
        ExtraAction: {
          text: "Continuar",
          color: "primary",
          handler: confirmGuardarComisiones,
        },
      });
      return;
    }

    confirmGuardarComisiones();
  };

  const confirmGuardarComisiones = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirmas que los datos ingresados de comisiones son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarComisiones,
      },
    });
  };

  const doGuardarComisiones = () => {
    aeStore.guardarComisionesRateOnLine(originalDataTable.value);
    dialog.cerrar();
  };

  // Headers
  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "REASEGURADORA",                      key: "nombreReasegurador", sortable: true,  headerProps },
    { title: "LÍMITE INFERIOR",                    key: "limiteInf",          sortable: true,  headerProps },
    { title: "LÍMITE SUPERIOR",                    key: "limiteSup",          sortable: true,  headerProps },
    { title: "COMISIÓN / RATE ON LINE DEFINITIVO", key: "comisRolDefinitiva", sortable: true,  headerProps },
    { title: "ACTIVO",                             key: "comisRolActiva",     sortable: true,  headerProps },
    { title: "EDITAR",                             key: "editar",             sortable: false, headerProps },
  ];

  const csvTableHeaders = tableHeaders.filter((h) => h.key !== "editar");

  return {
    dataTable,
    showErrors,
    formData,
    formErrors,
    setFieldValue,
    limiteInf,
    limiteSup,
    comisRolDefinitiva,
    onInputGeneric,
    onBlurGeneric,
    reaseguradoresEscalonadas,
    tableHeaders,
    csvTableHeaders,
    showCsvDialog,
    csvRows,
    csvSelectedRows,
    csvLoading,
    handleFileUpload,
    handleFileChange,
    handleCsvAccept,
    handleCsvCancel,
    toggleSelectAllCsv,
    handleAgregarComision,
    handleGuardarComisiones,
    toggleAllActiva,
    toggleRowActiva,
    editRow,
  };
};