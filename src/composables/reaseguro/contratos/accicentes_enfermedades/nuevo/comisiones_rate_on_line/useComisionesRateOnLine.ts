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

const COLUMNAS_CSV = ["REASEGURADOR", "LIMITE_INF", "LIMITE_SUP", "COMISION"] as const;


interface ComisionRateOnLineForm {
  cveReaseguradorComisRol: number | null;
  limiteInf: number | null;
  limiteSup: number | null;
  comisRolDefinitiva: number | null;
}

interface ComisionRateOnLineRow extends ComisionRateOnLineForm {
  nombreReasegurador: string;
  comisRolActiva: boolean;
}


export const useComisionesRateOnLine = () => {
  const aeStore = useContratoAEStore();
  const dialog = useDialog();

  const { queryReaseguradoras } = useAccidentesEnfermedades();


  const dataTable = ref<ComisionRateOnLineRow[]>(aeStore.recuperarComisionesRateOnLine());


  const showCsvDialog = ref(false);
  const csvRows = ref<ComisionRateOnLineRow[]>([]);
  const csvSelectedRows = ref<ComisionRateOnLineRow[]>([]);
  const csvLoading = ref(false);


  const limiteInf = ref("");
  const limiteSup = ref("");
  const comisRolDefinitiva = ref("");

  const formatNumberRefs: Record<string, typeof limiteInf> = {
    limiteInf,
    limiteSup,
    comisRolDefinitiva,
  };


  const validationSchema = useComisionesRateOnLineValidations();

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
    resetForm,
  } = useForm<ComisionRateOnLineForm>({
    validationSchema,
    validateOnMount: false,
    initialValues: {
      cveReaseguradorComisRol: null,
      limiteInf: null,
      limiteSup: null,
      comisRolDefinitiva: null,
    },
  });

  const showErrors = ref(false);


  const reaseguradoresEscalonadas = computed(() => {
    const reaseguradoresContrato = aeStore.recuperarReaseguradores() as Array<{
      cveReasegurador: number;
      cveAsignacionComisRol: number;
    }>;

    const cvesEscalonadas = reaseguradoresContrato
      .filter((r) => r.cveAsignacionComisRol === 2)
      .map((r) => r.cveReasegurador);

    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesEscalonadas.includes(r.cveReasegurador)
    );
  });


  const onInputGeneric = (key: string, value: string) => {
    const clean = formattNumber(value);
    const fieldRef = formatNumberRefs[key];
    if (fieldRef) {
      fieldRef.value = clean;
      setFieldValue(
        key as keyof ComisionRateOnLineForm,
        clean === "" ? null : parseFloat(clean)
      );
    }
  };

  const onBlurGeneric = (key: string) => {
    const fieldRef = formatNumberRefs[key];
    if (!fieldRef?.value) {
      setFieldValue(key as keyof ComisionRateOnLineForm, null);
      return;
    }
    const numeric = parseFloat(fieldRef.value);
    if (isNaN(numeric)) {
      fieldRef.value = "";
      setFieldValue(key as keyof ComisionRateOnLineForm, null);
      return;
    }
    setFieldValue(key as keyof ComisionRateOnLineForm, numeric);
    fieldRef.value = formatCurrency(numeric);
  };


  const resetFormAndRefs = () => {
    resetForm();
    limiteInf.value = "";
    limiteSup.value = "";
    comisRolDefinitiva.value = "";
    showErrors.value = false;
  };


  const getNombreReasegurador = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      (queryReaseguradoras.data.value ?? []).find(
        (r) => r.cveReasegurador === cve
      )?.nombreReasegurador ?? ""
    );
  };

  /** Devuelve true si el rango del nuevo registro se traslapa con alguno existente de la misma reaseguradora */
  /* const hasOverlap = (
    newRow: ComisionRateOnLineRow,
    existingRows: ComisionRateOnLineRow[]
  ): boolean =>
    existingRows
      .filter((r) => r.cveReaseguradorComisRol === newRow.cveReaseguradorComisRol)
      .some(
        (r) => newRow.limiteInf! < r.limiteSup! && newRow.limiteSup! > r.limiteInf!
      ); */

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

    const newRow: ComisionRateOnLineRow = {
      cveReaseguradorComisRol: formData.cveReaseguradorComisRol,
      limiteInf: formData.limiteInf,
      limiteSup: formData.limiteSup,
      comisRolDefinitiva: formData.comisRolDefinitiva,
      nombreReasegurador: getNombreReasegurador(formData.cveReaseguradorComisRol),
      comisRolActiva: true,
    };

    /* if (hasOverlap(newRow, dataTable.value)) {
      dialog.show({
        title: "Atención",
        message:
          "El rango de límites capturado se traslapa con un registro existente para esta reaseguradora. Verifique la información.",
        type: DialogType.ERROR,
      });
      return;
    } */

    dataTable.value.push(newRow);
    resetFormAndRefs();
  };

  const handleFileUpload = () => {
    document.querySelector<HTMLInputElement>("#file-input")?.click();
  };

  const handleFileChange = async (file: File | File[] | null) => {
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
      const text = await f.text();
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    
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
    
      const parsed: ComisionRateOnLineRow[] = lines.slice(1).map((line) => {
        const cols = parseCSVLine(line);
        const registroCnsf = cols[idxReaseg]?.trim() ?? "";

      
        const reaseg = allReaseguradoras.find(
          (r: any) => String(r.registroCnsf) === registroCnsf
        );

        return {
          cveReaseguradorComisRol: reaseg?.cveReasegurador ?? null,
          nombreReasegurador: reaseg?.nombreReasegurador ?? registroCnsf,
          limiteInf: parseFloat(cols[idxInf] ?? "0") || 0,
          limiteSup: parseFloat(cols[idxSup] ?? "0") || 0,
          comisRolDefinitiva: parseFloat(cols[idxComis] ?? "0") || 0,
          comisRolActiva: true,
        };
      });

      csvRows.value = parsed;
      csvSelectedRows.value = [...parsed];
      showCsvDialog.value = true;
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
    const aAgregar: ComisionRateOnLineRow[] = [];

    csvSelectedRows.value.forEach((row, i) => {
      if (row.cveReaseguradorComisRol == null) {
        errores.push(
          `Fila ${i + 1}: reaseguradora no encontrada ("${row.nombreReasegurador}").`
        );
        return;
      }
      /* if (hasOverlap(row, [...dataTable.value, ...aAgregar])) {
        errores.push(
          `Fila ${i + 1}: el rango [${row.limiteInf}, ${row.limiteSup}] se traslapa con un registro existente de "${row.nombreReasegurador}".`
        );
        return;
      } */
      aAgregar.push(row);
    });

    if (errores.length > 0) {
      dialog.show({
        title: "Advertencia al cargar CSV",
        message: errores.join("<br/>"),
        type: DialogType.ERROR,
      });
    }

    dataTable.value.push(...aAgregar);
    _cerrarDialogoCsv();
  };

  const handleCsvCancel = () => _cerrarDialogoCsv();

  const _cerrarDialogoCsv = () => {
    showCsvDialog.value = false;
    csvRows.value = [];
    csvSelectedRows.value = [];
  };

  const toggleSelectAllCsv = (selectAll: boolean) => {
    csvSelectedRows.value = selectAll ? [...csvRows.value] : [];
  };

  const toggleAllActiva = () => {
    const allActive = dataTable.value.every((r) => r.comisRolActiva);
    dataTable.value = dataTable.value.map((r) => ({ ...r, comisRolActiva: !allActive }));
  };

  const toggleRowActiva = (item: ComisionRateOnLineRow) => {
    const index = dataTable.value.indexOf(item);
    if (index !== -1) {
      dataTable.value[index]!.comisRolActiva = !dataTable.value[index]!.comisRolActiva;
    }
  };

  const editRow = (row: ComisionRateOnLineRow) => {
    const index = dataTable.value.indexOf(row);
    if (index !== -1) dataTable.value.splice(index, 1);

    setFieldValue("cveReaseguradorComisRol", row.cveReaseguradorComisRol);
    setFieldValue("limiteInf",              row.limiteInf);
    setFieldValue("limiteSup",              row.limiteSup);
    setFieldValue("comisRolDefinitiva",     row.comisRolDefinitiva);

    limiteInf.value          = row.limiteInf          != null ? formatCurrency(row.limiteInf)          : "";
    limiteSup.value          = row.limiteSup          != null ? formatCurrency(row.limiteSup)          : "";
    comisRolDefinitiva.value = row.comisRolDefinitiva != null ? formatCurrency(row.comisRolDefinitiva) : "";
  };

  const handleGuardarComisiones = () => {
    if (dataTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe contener al menos un registro para continuar. Verifique por favor.",
        type: DialogType.ERROR,
      });
      return;
    }
  
    const cvesRequeridos = reaseguradoresEscalonadas.value.map((r) => r.cveReasegurador);
    const cvesEnTabla    = [...new Set(dataTable.value.map((r) => r.cveReaseguradorComisRol))];
    const faltantes      = cvesRequeridos.filter((cve) => !cvesEnTabla.includes(cve));

    if (faltantes.length > 0) {
      dialog.show({
        title: "Atención",
        message: "Faltan registro de comisiones por reaseguradora ¿Deseas continuar?",
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
    aeStore.guardarComisionesRateOnLine(dataTable.value);
    dialog.cerrar();
  };

  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "Reaseguradora",                     key: "nombreReasegurador",  sortable: true,  headerProps },
    { title: "Límite inferior",                   key: "limiteInf",           sortable: true,  headerProps },
    { title: "Límite superior",                   key: "limiteSup",           sortable: true,  headerProps },
    { title: "Comisión / rate on line definitivo", key: "comisRolDefinitiva",  sortable: true,  headerProps },
    { title: "Activo",                            key: "comisRolActiva",      sortable: true,  headerProps },
    { title: "Editar",                            key: "editar",              sortable: false, headerProps },
  ];

  const csvTableHeaders = tableHeaders.filter((h) => h.key !== "editar");

  return {
    dataTable,
    showErrors,
    formData,
    formErrors,
    limiteInf,
    limiteSup,
    comisRolDefinitiva,
    reaseguradoresEscalonadas,
    tableHeaders,
    showCsvDialog,
    csvRows,
    csvSelectedRows,
    csvTableHeaders,
    csvLoading,
    setFieldValue,
    onInputGeneric,
    onBlurGeneric,
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