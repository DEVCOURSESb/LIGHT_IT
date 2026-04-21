import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
import { storeToRefs } from "pinia";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { useAdministracionValidations } from "./useAdministracionValidations";
import type {
  PagoSection,
  EdoSection,
  BorPrimasSection,
  BorSiniestrosSection,
} from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

//
// Opciones de periodicidad compartidas (edo, primas, siniestros)
//
export const OPCIONES_PERIODICIDAD = [
  { title: "ANUAL",      value: 1 },
  { title: "SEMESTRAL",  value: 2 },
  { title: "TRIMESTRAL", value: 3 },
  { title: "MENSUAL",    value: 4 },
  { title: "ESPECÍFICA", value: 7 },
] as const;

export const useAdministracionSection = () => {
  const aeStore = useContratoAEStore();
  const dialog  = useDialog();

  const { pagos, edoCuenta, borPrimas, borSiniestros } = storeToRefs(aeStore);
  const { queryFormaPago } = useAccidentesEnfermedades();

  // Fecha mínima: FECHA_INICIO_CONTRATO de generales
  const fechaMinIso = computed<string>(() => {
    const d = aeStore.generales.fechaInicioContrato;
    return d ? new Date(d).toISOString().split("T")[0]! : "";
  });

  // Tablas mutables
  const tablaPagos         = ref<PagoSection[]>([...pagos.value]);
  const tablaEdo           = ref<EdoSection[]>([...edoCuenta.value]);
  const tablaBorPrimas     = ref<BorPrimasSection[]>([...borPrimas.value]);
  const tablaBorSiniestros = ref<BorSiniestrosSection[]>([...borSiniestros.value]);

  // Formularios (uno por sub-sección)
  const {
    validate: validatePagos,
    resetForm: resetPagos,
    setFieldValue: setFieldPago,
    values: formPago,
    errors: errorsPago,
  } = useForm<Omit<PagoSection, "idContrato" | "pagoActivo">>({
    validationSchema: useAdministracionValidations().pago,
    validateOnMount: false,
    initialValues: { cveFormapago: undefined as unknown as number, porcentajePago: null, fechaPago: null },
  });

  const {
    validate: validateEdo,
    resetForm: resetEdo,
    setFieldValue: setFieldEdo,
    values: formEdo,
    errors: errorsEdo,
  } = useForm<Omit<EdoSection, "idContrato" | "edoActivo">>({
    validationSchema: useAdministracionValidations().edo,
    validateOnMount: false,
    initialValues: { cvePeriodicidadEdo: undefined as unknown as number, fechaEdo: null },
  });

  const {
    validate: validatePrimas,
    resetForm: resetPrimas,
    setFieldValue: setFieldPrimas,
    values: formPrimas,
    errors: errorsPrimas,
  } = useForm<Omit<BorPrimasSection, "idContrato" | "primasActivo">>({
    validationSchema: useAdministracionValidations().borPrimas,
    validateOnMount: false,
    initialValues: { cvePeriodicidadPrimas: undefined as unknown as number, fechaPrimas: null },
  });

  const {
    validate: validateSiniestros,
    resetForm: resetSiniestros,
    setFieldValue: setFieldSiniestros,
    values: formSiniestros,
    errors: errorsSiniestros,
  } = useForm<Omit<BorSiniestrosSection, "idContrato" | "siniestrosActivo">>({
    validationSchema: useAdministracionValidations().borSiniestros,
    validateOnMount: false,
    initialValues: { cvePeriodicidadSiniestros: undefined as unknown as number, fechaSiniestros: null },
  });

  const showErrorsPago       = ref(false);
  const showErrorsEdo        = ref(false);
  const showErrorsPrimas     = ref(false);
  const showErrorsSiniestros = ref(false);

  // Ref para el slider de % pago
  const porcentajePago = ref<number | null>(null);

  // Computed: suma de porcentajes de pagos activos
  const sumaPorcentajePagos = computed(() =>
    tablaPagos.value
      .filter((p) => p.pagoActivo)
      .reduce((acc, p) => acc + (p.porcentajePago ?? 0), 0)
  );

  // Helpers: ¿ya existe un registro con esa fecha?
  const fechaPagoExiste   = (f: string) => tablaPagos.value.some((r) => r.fechaPago === f);
  const fechaEdoExiste    = (f: string) => tablaEdo.value.some((r) => r.fechaEdo === f);
  const fechaPrimasExiste = (f: string) => tablaBorPrimas.value.some((r) => r.fechaPrimas === f);
  const fechaSinExiste    = (f: string) => tablaBorSiniestros.value.some((r) => r.fechaSiniestros === f);

  // Helpers: ¿ya existe un registro con esa periodicidad (no-ESPECÍFICA)?
  const periodicidadPagoExiste   = (v: number) => tablaPagos.value.some((r) => r.cveFormapago === v);
  const periodicidadEdoExiste    = (v: number) => tablaEdo.value.some((r) => r.cvePeriodicidadEdo === v);
  const periodicidadPrimasExiste = (v: number) => tablaBorPrimas.value.some((r) => r.cvePeriodicidadPrimas === v);
  const periodicidadSinExiste    = (v: number) => tablaBorSiniestros.value.some((r) => r.cvePeriodicidadSiniestros === v);

  // PAGOS
  const handleAgregarPago = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar el pago capturado?",
      type: DialogType.ERROR,
      ExtraAction: { text: "Continuar", color: "primary", handler: confirmAgregarPago },
    });
  };

  const confirmAgregarPago = async () => {
    showErrorsPago.value = true;
    const { valid } = await validatePagos();
    if (!valid) return;

    const { cveFormapago, porcentajePago: pct, fechaPago } = formPago;

    // Un solo registro si periodicidad ≠ ESPECÍFICA
    if (cveFormapago !== 7 && periodicidadPagoExiste(cveFormapago)) {
      dialog.show({ title: "Atención", message: "Solo se permite un registro por forma de pago.", type: DialogType.ERROR });
      return;
    }

    // Fecha única
    if (cveFormapago === 7 && fechaPago && fechaPagoExiste(fechaPago)) {
      dialog.show({ title: "Atención", message: "Ya existe un registro para esa fecha de pago.", type: DialogType.ERROR });
      return;
    }

    tablaPagos.value.push({
      idContrato: aeStore.generales.idContrato,
      cveFormapago,
      porcentajePago: cveFormapago === 7 ? pct : null,
      fechaPago:      cveFormapago === 7 ? fechaPago : null,
      pagoActivo:     true,
    });

    porcentajePago.value = null;
    resetPagos();
    showErrorsPago.value = false;
  };

  const togglePagoActivo = (item: PagoSection) => {
    const idx = tablaPagos.value.findIndex(
      (r) => r.cveFormapago === item.cveFormapago && r.fechaPago === item.fechaPago
    );
    if (idx !== -1) tablaPagos.value[idx]!.pagoActivo = !tablaPagos.value[idx]!.pagoActivo;
  };

  const editPago = (item: PagoSection) => {
    const idx = tablaPagos.value.findIndex(
      (r) => r.cveFormapago === item.cveFormapago && r.fechaPago === item.fechaPago
    );
    if (idx === -1) return;
    const row = tablaPagos.value[idx]!;
    setFieldPago("cveFormapago",    row.cveFormapago);
    setFieldPago("porcentajePago",  row.porcentajePago);
    setFieldPago("fechaPago",       row.fechaPago);
    porcentajePago.value = row.porcentajePago;
    tablaPagos.value.splice(idx, 1);
    showErrorsPago.value = false;
  };

  // ESTADOS DE CUENTA
  const handleAgregarEdo = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar estado de cuenta capturado?",
      type: DialogType.ERROR,
      ExtraAction: { text: "Continuar", color: "primary", handler: confirmAgregarEdo },
    });
  };

  const confirmAgregarEdo = async () => {
    showErrorsEdo.value = true;
    const { valid } = await validateEdo();
    if (!valid) return;

    const { cvePeriodicidadEdo, fechaEdo } = formEdo;

    if (cvePeriodicidadEdo !== 7 && periodicidadEdoExiste(cvePeriodicidadEdo)) {
      dialog.show({ title: "Atención", message: "Solo se permite un registro por periodicidad.", type: DialogType.ERROR });
      return;
    }
    if (cvePeriodicidadEdo === 7 && fechaEdo && fechaEdoExiste(fechaEdo)) {
      dialog.show({ title: "Atención", message: "Ya existe un registro para esa fecha.", type: DialogType.ERROR });
      return;
    }

    tablaEdo.value.push({
      idContrato: aeStore.generales.idContrato,
      cvePeriodicidadEdo,
      fechaEdo: cvePeriodicidadEdo === 7 ? fechaEdo : null,
      edoActivo: true,
    });

    resetEdo();
    showErrorsEdo.value = false;
  };

  const toggleEdoActivo = (item: EdoSection) => {
    const idx = tablaEdo.value.findIndex(
      (r) => r.cvePeriodicidadEdo === item.cvePeriodicidadEdo && r.fechaEdo === item.fechaEdo
    );
    if (idx !== -1) tablaEdo.value[idx]!.edoActivo = !tablaEdo.value[idx]!.edoActivo;
  };

  const editEdo = (item: EdoSection) => {
    const idx = tablaEdo.value.findIndex(
      (r) => r.cvePeriodicidadEdo === item.cvePeriodicidadEdo && r.fechaEdo === item.fechaEdo
    );
    if (idx === -1) return;
    const row = tablaEdo.value[idx]!;
    setFieldEdo("cvePeriodicidadEdo", row.cvePeriodicidadEdo);
    setFieldEdo("fechaEdo",           row.fechaEdo);
    tablaEdo.value.splice(idx, 1);
    showErrorsEdo.value = false;
  };

  // BORDEREAUX PRIMAS
  const handleAgregarBorPrimas = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar bordereaux primas capturado?",
      type: DialogType.ERROR,
      ExtraAction: { text: "Continuar", color: "primary", handler: confirmAgregarBorPrimas },
    });
  };

  const confirmAgregarBorPrimas = async () => {
    showErrorsPrimas.value = true;
    const { valid } = await validatePrimas();
    if (!valid) return;

    const { cvePeriodicidadPrimas, fechaPrimas } = formPrimas;

    if (cvePeriodicidadPrimas !== 7 && periodicidadPrimasExiste(cvePeriodicidadPrimas)) {
      dialog.show({ title: "Atención", message: "Solo se permite un registro por periodicidad.", type: DialogType.ERROR });
      return;
    }
    if (cvePeriodicidadPrimas === 7 && fechaPrimas && fechaPrimasExiste(fechaPrimas)) {
      dialog.show({ title: "Atención", message: "Ya existe un registro para esa fecha.", type: DialogType.ERROR });
      return;
    }

    tablaBorPrimas.value.push({
      idContrato: aeStore.generales.idContrato,
      cvePeriodicidadPrimas,
      fechaPrimas: cvePeriodicidadPrimas === 7 ? fechaPrimas : null,
      primasActivo: true,
    });

    resetPrimas();
    showErrorsPrimas.value = false;
  };

  const togglePrimasActivo = (item: BorPrimasSection) => {
    const idx = tablaBorPrimas.value.findIndex(
      (r) => r.cvePeriodicidadPrimas === item.cvePeriodicidadPrimas && r.fechaPrimas === item.fechaPrimas
    );
    if (idx !== -1) tablaBorPrimas.value[idx]!.primasActivo = !tablaBorPrimas.value[idx]!.primasActivo;
  };

  const editBorPrimas = (item: BorPrimasSection) => {
    const idx = tablaBorPrimas.value.findIndex(
      (r) => r.cvePeriodicidadPrimas === item.cvePeriodicidadPrimas && r.fechaPrimas === item.fechaPrimas
    );
    if (idx === -1) return;
    const row = tablaBorPrimas.value[idx]!;
    setFieldPrimas("cvePeriodicidadPrimas", row.cvePeriodicidadPrimas);
    setFieldPrimas("fechaPrimas",           row.fechaPrimas);
    tablaBorPrimas.value.splice(idx, 1);
    showErrorsPrimas.value = false;
  };

  // BORDEREAUX SINIESTROS
  const handleAgregarBorSiniestros = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar bordereaux siniestros capturado?",
      type: DialogType.ERROR,
      ExtraAction: { text: "Continuar", color: "primary", handler: confirmAgregarBorSiniestros },
    });
  };

  const confirmAgregarBorSiniestros = async () => {
    showErrorsSiniestros.value = true;
    const { valid } = await validateSiniestros();
    if (!valid) return;

    const { cvePeriodicidadSiniestros, fechaSiniestros } = formSiniestros;

    if (cvePeriodicidadSiniestros !== 7 && periodicidadSinExiste(cvePeriodicidadSiniestros)) {
      dialog.show({ title: "Atención", message: "Solo se permite un registro por periodicidad.", type: DialogType.ERROR });
      return;
    }
    if (cvePeriodicidadSiniestros === 7 && fechaSiniestros && fechaSinExiste(fechaSiniestros)) {
      dialog.show({ title: "Atención", message: "Ya existe un registro para esa fecha.", type: DialogType.ERROR });
      return;
    }

    tablaBorSiniestros.value.push({
      idContrato: aeStore.generales.idContrato,
      cvePeriodicidadSiniestros,
      fechaSiniestros: cvePeriodicidadSiniestros === 7 ? fechaSiniestros : null,
      siniestrosActivo: true,
    });

    resetSiniestros();
    showErrorsSiniestros.value = false;
  };

  const toggleSiniestrosActivo = (item: BorSiniestrosSection) => {
    const idx = tablaBorSiniestros.value.findIndex(
      (r) => r.cvePeriodicidadSiniestros === item.cvePeriodicidadSiniestros && r.fechaSiniestros === item.fechaSiniestros
    );
    if (idx !== -1) tablaBorSiniestros.value[idx]!.siniestrosActivo = !tablaBorSiniestros.value[idx]!.siniestrosActivo;
  };

  const editBorSiniestros = (item: BorSiniestrosSection) => {
    const idx = tablaBorSiniestros.value.findIndex(
      (r) => r.cvePeriodicidadSiniestros === item.cvePeriodicidadSiniestros && r.fechaSiniestros === item.fechaSiniestros
    );
    if (idx === -1) return;
    const row = tablaBorSiniestros.value[idx]!;
    setFieldSiniestros("cvePeriodicidadSiniestros", row.cvePeriodicidadSiniestros);
    setFieldSiniestros("fechaSiniestros",           row.fechaSiniestros);
    tablaBorSiniestros.value.splice(idx, 1);
    showErrorsSiniestros.value = false;
  };

  // GUARDAR ADMINISTRACIÓN
  const handleGuardarAdministracion = () => {
    // Validar suma de porcentajes = 100 si hay registros con forma ESPECÍFICA
    const tieneEspecifica = tablaPagos.value.some((p) => p.cveFormapago === 7);
    if (tieneEspecifica && Math.abs(sumaPorcentajePagos.value - 100) > 0.001) {
      dialog.show({
        title: "Error de validación",
        message: "Se necesita tener el pago del 100%. La suma actual es " +
          sumaPorcentajePagos.value.toFixed(2) + "%.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados de administración son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: { text: "Continuar", color: "primary", handler: doGuardarAdministracion },
    });
  };

  const doGuardarAdministracion = () => {
    aeStore.guardarAdministracion(
      tablaPagos.value,
      tablaEdo.value,
      tablaBorPrimas.value,
      tablaBorSiniestros.value
    );
    dialog.cerrar();
  };

  // CREAR CONTRATO
  const handleCrearContrato = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados para crear el contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: { text: "Continuar", color: "primary", handler: doCrearContrato },
    });
  };

  const doCrearContrato = () => {
    // Aquí se llama al endpoint/acción de persistencia definitiva
    const data = aeStore.obtenerPayloadBackend();
    console.log(data)
    dialog.cerrar();
  };

  // Headers
  const hp = { style: "font-weight: bold" };

  const headersPago = [
    { title: "Forma de pago",   key: "cveFormapago",    sortable: true,  headerProps: hp },
    { title: "% Pago",          key: "porcentajePago",  sortable: true,  headerProps: hp },
    { title: "Fecha de pago",   key: "fechaPago",       sortable: true,  headerProps: hp },
    { title: "Activo",          key: "pagoActivo",      sortable: true,  headerProps: hp },
    { title: "Editar",          key: "editar",          sortable: false, headerProps: hp },
  ];

  const headersEdo = [
    { title: "Periodicidad",    key: "cvePeriodicidadEdo", sortable: true,  headerProps: hp },
    { title: "Fecha",           key: "fechaEdo",           sortable: true,  headerProps: hp },
    { title: "Activo",          key: "edoActivo",          sortable: true,  headerProps: hp },
    { title: "Editar",          key: "editar",             sortable: false, headerProps: hp },
  ];

  const headersBorPrimas = [
    { title: "Periodicidad",    key: "cvePeriodicidadPrimas", sortable: true,  headerProps: hp },
    { title: "Fecha",           key: "fechaPrimas",           sortable: true,  headerProps: hp },
    { title: "Activo",          key: "primasActivo",          sortable: true,  headerProps: hp },
    { title: "Editar",          key: "editar",                sortable: false, headerProps: hp },
  ];

  const headersBorSiniestros = [
    { title: "Periodicidad",    key: "cvePeriodicidadSiniestros", sortable: true,  headerProps: hp },
    { title: "Fecha",           key: "fechaSiniestros",           sortable: true,  headerProps: hp },
    { title: "Activo",          key: "siniestrosActivo",          sortable: true,  headerProps: hp },
    { title: "Editar",          key: "editar",                    sortable: false, headerProps: hp },
  ];

  return {
    // catálogos
    queryFormaPago,
    // fecha mínima
    fechaMinIso,
    // pagos
    formPago, errorsPago, showErrorsPago, setFieldPago,
    porcentajePago,
    tablaPagos, sumaPorcentajePagos,
    headersPago,
    handleAgregarPago, togglePagoActivo, editPago,
    // edo cuenta
    formEdo, errorsEdo, showErrorsEdo, setFieldEdo,
    tablaEdo,
    headersEdo,
    handleAgregarEdo, toggleEdoActivo, editEdo,
    // bor primas
    formPrimas, errorsPrimas, showErrorsPrimas, setFieldPrimas,
    tablaBorPrimas,
    headersBorPrimas,
    handleAgregarBorPrimas, togglePrimasActivo, editBorPrimas,
    // bor siniestros
    formSiniestros, errorsSiniestros, showErrorsSiniestros, setFieldSiniestros,
    tablaBorSiniestros,
    headersBorSiniestros,
    handleAgregarBorSiniestros, toggleSiniestrosActivo, editBorSiniestros,
    // guardar / crear
    handleGuardarAdministracion,
    handleCrearContrato,
  };
};