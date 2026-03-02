import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useCumulosValidations } from "./useCumulosValidations";
import type { CumulosSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

// Tipo del formulario — sin idContrato, numCapa y cumuloActivo (los asigna el composable)
// cveOperRamoCumulo se maneja como string | null porque los catálogos de oper/ramo son strings
type CumulosForm = {
  cveOperRamoCumulo: string | null;
  montoCumulo:       number | null;
  // campo interno para validación contextual (no lo captura el usuario)
  detallesOperRamo:  number;
};

// Tipo display — extiende la interfaz con el campo calculado para la tabla
type CumulosDisplay = CumulosSection & {
  descOperRamo: string;
};

export const useCumulosSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { tipoContrato, cumulos, excedentes, detallesProporcionales } =
    storeToRefs(aeStore);

  const { queryOperacionesRamos } = useAccidentesEnfermedades();

  // Datos derivados de detallesProporcionales (lectura única, estables)
  const primerDetalle = detallesProporcionales.value[0];

  // DETALLES_OPER_RAMO: determina si se muestra el campo operación/ramo
  const detallesOperRamo: number = primerDetalle?.detallesOperRamo ?? 0;

  // Tabla base mutable
  const originalDataTable = ref<CumulosSection[]>([...cumulos.value]);

  // Computed display — agrega descOperRamo, es solo lectura
  const dataTable = computed<CumulosDisplay[]>(() =>
    originalDataTable.value.map((row) => ({
      ...row,
      descOperRamo: getDescOperRamo(row.cveOperRamoCumulo),
    }))
  );

  // Ref numérico para montoCumulo (formateo visual)
  const montoCumulo = ref("");

  // ID_TCONTRATO = 3 → EXCEDENTE POR CAPAS → permite múltiples registros
  const esExcedentePorCapas = computed(() => tipoContrato.value === 3);

  // Máximo de capas según excedentes registrados
  const maxCapas = computed(() => {
    if (!esExcedentePorCapas.value || excedentes.value.length === 0) return 1;
    return Math.max(...excedentes.value.map((e) => e.noCapa ?? 0));
  });

  // Opciones de oper/ramo: solo detalles con cumulos = 1 (SI)
  const operacionesRamosData = computed<{ title: string; value: string }[]>(() => {
    const detallesFiltrados = detallesProporcionales.value.filter(
      (d) => d.cumulos === 1
    );

    return detallesFiltrados
      .map((d) => {
        if (!d.cveOperRamoDetalles) return null;
        const operacion = queryOperacionesRamos.data.value?.find(
          (el) => el.cveCobertura === d.cveOperRamoDetalles
        );
        return operacion
          ? { title: operacion.descOperacionRamos, value: operacion.cveCobertura }
          : null;
      })
      .filter((item): item is { title: string; value: string } => item !== null)
      .filter(
        (item, index, self) =>
          self.findIndex((t) => t.value === item.value) === index
      );
  });

  // Formulario
  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<CumulosForm>({
    validationSchema: useCumulosValidations(),
    validateOnMount: false,
    initialValues: {
      cveOperRamoCumulo: null,
      montoCumulo:       null,
      detallesOperRamo,
    },
  });

  const showErrors = ref(false);

  // numCapa en tiempo real (preview)
  const numCapa = computed<number | string>(() => {
    if (detallesOperRamo === 1) {
      const cve = formData.cveOperRamoCumulo;
      if (!cve) return "—";
      return (
        originalDataTable.value.filter((r) => r.cveOperRamoCumulo === cve).length + 1
      );
    }
    return originalDataTable.value.length + 1;
  });

  // numCapa fijo al momento de agregar
  const calcularNumCapa = (cveOperRamo: string | null): number => {
    if (detallesOperRamo === 1 && cveOperRamo) {
      return (
        originalDataTable.value.filter((r) => r.cveOperRamoCumulo === cveOperRamo).length + 1
      );
    }
    return originalDataTable.value.length + 1;
  };

  // Handlers numéricos
  const onInputMontoCumulo = (value: string) => {
    const clean = formattNumber(value);
    montoCumulo.value = clean;
    setFieldValue("montoCumulo", clean === "" ? null : parseFloat(clean));
  };

  const onBlurMontoCumulo = () => {
    if (!montoCumulo.value) {
      setFieldValue("montoCumulo", null);
      return;
    }
    const numeric = parseFloat(montoCumulo.value);
    if (isNaN(numeric)) {
      montoCumulo.value = "";
      setFieldValue("montoCumulo", null);
      return;
    }
    setFieldValue("montoCumulo", numeric);
    montoCumulo.value = formatCurrency(numeric);
  };

  // Reset
  const resetFormAndRefs = () => {
    resetForm();
    setFieldValue("detallesOperRamo", detallesOperRamo);
    montoCumulo.value = "";
    showErrors.value  = false;
  };

  // Helper descripción oper/ramo
  const getDescOperRamo = (cve: string | null): string => {
    if (!cve) return "";
    return operacionesRamosData.value.find((o) => o.value === cve)?.title ?? "";
  };

  // Agregar cúmulo
  const handleAgregarCumulo = () => {
    const activosActuales = originalDataTable.value.filter((r) => r.cumuloActivo).length;

    if (!esExcedentePorCapas.value && activosActuales >= 1) {
      dialog.show({
        title: "Atención",
        message: "Solo se permite un registro de cúmulo para este tipo de contrato.",
        type: DialogType.ERROR,
      });
      return;
    }

    if (esExcedentePorCapas.value && originalDataTable.value.length >= maxCapas.value) {
      dialog.show({
        title: "Atención",
        message: `Solo se permiten hasta ${maxCapas.value} cúmulo(s) de acuerdo con las capas registradas en excedentes.`,
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar el cúmulo capturado?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarCumulo,
      },
    });
  };

  const confirmAgregarCumulo = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: CumulosSection = {
      idContrato:        aeStore.generales.idContrato,
      cveOperRamoCumulo: formData.cveOperRamoCumulo,
      numCapa:           calcularNumCapa(formData.cveOperRamoCumulo),
      montoCumulo:       formData.montoCumulo ?? 0,
      cumuloActivo:      true,
    };

    originalDataTable.value.push(newRow);
    resetFormAndRefs();
  };

  // Toggle activo
  // Busca en originalDataTable por clave compuesta (oper/ramo + numCapa)
  const toggleRowActiva = (item: CumulosDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveOperRamoCumulo === item.cveOperRamoCumulo &&
        r.numCapa           === item.numCapa
    );
    if (index !== -1) {
      originalDataTable.value[index]!.cumuloActivo =
        !originalDataTable.value[index]!.cumuloActivo;
    }
  };

  // Editar fila
  const editRow = (item: CumulosDisplay) => {
    const index = originalDataTable.value.findIndex(
      (r) =>
        r.cveOperRamoCumulo === item.cveOperRamoCumulo &&
        r.numCapa           === item.numCapa
    );
    if (index === -1) return;

    const row = originalDataTable.value[index]!;

    setFieldValue("cveOperRamoCumulo", row.cveOperRamoCumulo);
    setFieldValue("montoCumulo",       row.montoCumulo);

    montoCumulo.value = row.montoCumulo ? formatCurrency(row.montoCumulo) : "";

    originalDataTable.value.splice(index, 1);
    showErrors.value = false;
  };

  // Guardar
  const handleGuardarCumulos = () => {
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
      message: "¿Confirma que los datos ingresados de cúmulos son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: doGuardarCumulos,
      },
    });
  };

  const doGuardarCumulos = () => {
    aeStore.guardarCumulos(originalDataTable.value);
    dialog.cerrar();
  };

  // Headers
  const hp = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "OPERACIÓN / RAMO", key: "descOperRamo",  sortable: true,  headerProps: hp },
    { title: "NO. CAPA",         key: "numCapa",        sortable: true,  headerProps: hp },
    { title: "MONTO CÚMULO",     key: "montoCumulo",    sortable: true,  headerProps: hp },
    { title: "ACTIVO",           key: "cumuloActivo",   sortable: true,  headerProps: hp },
    { title: "EDITAR",           key: "editar",         sortable: false, headerProps: hp },
  ];

  return {
    // form
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    // numérico
    montoCumulo,
    onInputMontoCumulo,
    onBlurMontoCumulo,
    // estado derivado
    detallesOperRamo,
    numCapa,
    // opciones
    operacionesRamosData,
    // tabla
    tableHeaders,
    dataTable,
    // handlers
    handleAgregarCumulo,
    handleGuardarCumulos,
    toggleRowActiva,
    editRow,
  };
};