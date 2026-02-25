import { DialogType, useDialog } from "@/stores/dialogStore";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
export interface TablaOperacionRamoContratoInterface {
  idContrato:          string;
  cveExtCoberContrato: number;
  cveOperRamo:         string;
  operRamoActivo:      boolean;
}

export interface TablaDetallesContrato {
  detallesOperRamo:         string;
  cveExtCoberDetalles:      number;
  cveOperRamoDetalles:      string;
  montoRetencion:           number;
  montoRetencionContrato:   number;
  montoCesion:              number;
  capacidadContrato:        number;
  cveCriterioAsigCapacidad: number;
  cveDistrCesion:           number;
  cveMonedaDetalles:        number;
  cumulos:                  string;
  porcentajeRetencion:      number;
  porcentajeCesion:         number;
  detalleActivo:            boolean;
  idContrato:               string;
}


// claves para localStorage
const STORAGE_KEYS = {
  activeTab: "activeTab",
  isProporcional: "isTypeProporcional",
  isFacultativo: "isFacultativo",
  tipoContrato: "tipoContrato",
  generalesContrato: "CAE_GENERALES_CONTRATO",
  monedaContrato: "CAE_MONEDA_CONTRATO",
  operacionRamoContrato: "CAE_OPERACION_RAMO_CONTRATO",
  generalesCompletos: "AE_GENERALES_COMPLETOS",
  detallesContrato: "CAE_DETALLES_CONTRATO",
  polizasFacultativasContrato: "CAE_POL_FAC_CONTRATO",
  reaseguradores: "CAE_REASEGURADORES_CONTRATO",
  isComisionEscalonada: "isComisionEscalonada",
  comisionesRol: "CAE_COMIS_ROL_CONTRATO",
  coberturasContrato: "CAE_COBERTURAS_CONTRATO",
  excedentesContratos: "CAE_EXCEDENTES_CONTRATO"
} as const;

export const useContratoAEStore = defineStore("contratoAccEnf", () => {
  const dialog = useDialog();

  const activeTab = ref<string>(
    localStorage.getItem(STORAGE_KEYS.activeTab) ?? "tab-1",
  );

  const isTypeProporcional = ref<boolean>(
    localStorage.getItem(STORAGE_KEYS.isProporcional) === "true",
  );

  const haveComisionEscalonada = ref<boolean>(
    localStorage.getItem(STORAGE_KEYS.isComisionEscalonada) === "true",
  );

  const isFacultativo = ref<boolean>(
    localStorage.getItem(STORAGE_KEYS.isFacultativo) === "true",
  );

  const tipoContrato = ref<number | null>(
    JSON.parse(localStorage.getItem(STORAGE_KEYS.tipoContrato)!) || null,
  );

  const setTipoReaseguro = (cveReaseguro: number) => {
    isTypeProporcional.value = cveReaseguro === 0;
    localStorage.setItem(STORAGE_KEYS.isProporcional, isTypeProporcional.value.toString());
  };

  const setIsFacultativo = (cveFcontrac: number) => {
    isFacultativo.value = cveFcontrac === 1;
    localStorage.setItem(STORAGE_KEYS.isFacultativo, isFacultativo.value.toString());
  };

  const setTipoContrato = (idTcontrato: number) => {
    tipoContrato.value = idTcontrato;
    localStorage.setItem(STORAGE_KEYS.tipoContrato, tipoContrato.value.toString());
  };

  const setHaveComisionEscalonada = (isEscalonada: boolean) => {
    haveComisionEscalonada.value = isEscalonada;
    localStorage.setItem(STORAGE_KEYS.isComisionEscalonada, haveComisionEscalonada.value.toString());
  };

  // !GENERALES

  const guardarGenerales = (data: Record<string, any>) => {
    // Actualizar estado derivado
    setTipoReaseguro(Number(data.cveTreaseg));
    setIsFacultativo(Number(data.cveFcontrac));
    setTipoContrato(Number(data.idTcontrato));

    // Guardar datos del formulario (sin las tablas)
    const { dataTableMoneda, dataTableOperacionRamo, ...generalesSinTablas } = data;
    localStorage.setItem(STORAGE_KEYS.generalesContrato, JSON.stringify(generalesSinTablas));

    // Guardar monedas del contrato
    const monedasContrato = dataTableMoneda.map((moneda: any) => ({
      idContrato: data.idContrato,
      cveMonedaContrato: moneda.cveMoneda,
      monActiva: moneda.monActiva,
    }));
    localStorage.setItem(STORAGE_KEYS.monedaContrato, JSON.stringify(monedasContrato));

    // Guardar operaciones/ramos del contrato
    const operacionesRamoContrato = dataTableOperacionRamo.map((operacionRamo: any) => ({
      idContrato: data.idContrato,
      cveExtCoberContrato: operacionRamo.cveExtCober,
      cveOperRamo: operacionRamo.cveCobertura,
      operRamoActivo: operacionRamo.operRamoActivo,
    }));
    localStorage.setItem(STORAGE_KEYS.operacionRamoContrato, JSON.stringify(operacionesRamoContrato));

    // Guardar snapshot completo para recuperación del formulario
    localStorage.setItem(STORAGE_KEYS.generalesCompletos, JSON.stringify(data));

    // Navegar al siguiente tab según el tipo de reaseguro
    activeTab.value = isTypeProporcional.value ? "tab-2" : "tab-3";

    dialog.show({
      title: "Datos guardados",
      message: "Los datos generales han sido guardados exitosamente.",
      type: DialogType.SUCCESS,
    });
  };

  const obtenerGenerales = () => {
    const rawData = localStorage.getItem(STORAGE_KEYS.generalesCompletos) || "{}";
    const parsed = JSON.parse(rawData);

    // Sincronizar estado derivado con lo que haya en el storage
    if (parsed.cveTreaseg != null) {
      isTypeProporcional.value = Number(parsed.cveTreaseg) === 0;
    }
    if (parsed.cveFcontrac != null) {
      isFacultativo.value = Number(parsed.cveFcontrac) === 1;
    }

    return {
      ...parsed,
      fechaInicioContrato: parsed.fechaInicioContrato
        ? new Date(parsed.fechaInicioContrato)
        : null,
      fechaFinContrato: parsed.fechaFinContrato
        ? new Date(parsed.fechaFinContrato)
        : null,
    };
  };

  // !DETALLES PROPORCIONALES

  const guardarDetallesProporcionales = (data: Record<string, any>[]) => {
    const { idContrato } = obtenerGenerales();

    const detallesConContrato = data.map((item) => ({ ...item, idContrato }));
    localStorage.setItem(STORAGE_KEYS.detallesContrato, JSON.stringify(detallesConContrato));

    activeTab.value = isFacultativo.value ? "tab-3" : "tab-4";
  };

  const obtenerDetallesProporcionales = () => {
    const rawData = localStorage.getItem(STORAGE_KEYS.detallesContrato) || "[]";
    return JSON.parse(rawData) as TablaDetallesContrato[];
  };

  // !PÓLIZAS FACULTATIVAS

  const guardarPolizasFacultativas = (data: Record<string, any>[]) => {
    const { idContrato } = obtenerGenerales();

    const polizasConContrato = data.map((item) => ({ ...item, idContrato }));

    localStorage.setItem(STORAGE_KEYS.polizasFacultativasContrato, JSON.stringify(polizasConContrato));
    activeTab.value = "tab-4";
  };

  const obtenerPolizasFacultativas = () => {
    const rawData = localStorage.getItem(STORAGE_KEYS.polizasFacultativasContrato) || "[]";
    return JSON.parse(rawData);
  }

  // ! REASEGURADORES
  const guardarReaseguradores = (data: Record<string, any>[]) => {
    console.log("reaseg cargados")
    const { idContrato } = obtenerGenerales();
    const reaseguradoresConContrato = data.map((item) => ({ ...item, idContrato }));
    localStorage.setItem(STORAGE_KEYS.reaseguradores, JSON.stringify(reaseguradoresConContrato));

    const haveComisionEscalonada = data.some((item) => item?.cveAsignacionComisRol === 2);

    setHaveComisionEscalonada(haveComisionEscalonada);

    // TODO: verificar tabs
    activeTab.value = haveComisionEscalonada ? "tab-5" : "tab-6";
  };

  const recuperarReaseguradores = () => {
    const dataRaw = localStorage.getItem(STORAGE_KEYS.reaseguradores) || "[]";
    return JSON.parse(dataRaw);
  }

  // !COMISIONES RATE ON LINE
  const guardarComisionesRateOnLine = (data: Record<string, any>[]) => {
    const { idContrato } = obtenerGenerales();
    const rows = data.map(row => ({...row, idContrato}));

    localStorage.setItem(STORAGE_KEYS.comisionesRol, JSON.stringify(rows));

    activeTab.value = "tab-6";
  }

  const recuperarComisionesRateOnLine = () => {
    const data = localStorage.getItem(STORAGE_KEYS.comisionesRol) || "[]";
    return JSON.parse(data);
  }

  // !COBERTURAS
  const guardarCoberturas = (data: Record<string, any>[]) => {
    const { idContrato } = obtenerGenerales();
    const rows = data.map(row => ({...row, idContrato}));

    localStorage.setItem(STORAGE_KEYS.coberturasContrato, JSON.stringify(rows));

    activeTab.value = "tab-6";
  }

  const recuperarCoberturas = () => {
    const data = localStorage.getItem(STORAGE_KEYS.coberturasContrato) || "[]";
    return JSON.parse(data);
  }

  // !COBERTURAS
  const guardarExcedentes = (data: Record<string, any>[]) => {
    const { idContrato } = obtenerGenerales();
    const rows = data.map(row => ({...row, idContrato}));

    localStorage.setItem(STORAGE_KEYS.excedentesContratos, JSON.stringify(rows));

    activeTab.value = "tab-6";
  }

  const recuperarExcedentes = () => {
    const data = localStorage.getItem(STORAGE_KEYS.excedentesContratos) || "[]";
    return JSON.parse(data);
  }


  const recuperarTablaOperacionRamoContrato = () => {
    const raw = localStorage.getItem(STORAGE_KEYS.operacionRamoContrato) || "[]";
    return JSON.parse(raw) as TablaOperacionRamoContratoInterface[];
  }


  watch(activeTab, (nuevoTab) => {
    localStorage.setItem(STORAGE_KEYS.activeTab, nuevoTab);
  });

  return {
    activeTab,
    isTypeProporcional,
    isFacultativo,
    tipoContrato,
    haveComisionEscalonada,
    guardarGenerales,
    obtenerGenerales,
    guardarDetallesProporcionales,
    obtenerDetallesProporcionales,
    guardarPolizasFacultativas,
    obtenerPolizasFacultativas,
    guardarReaseguradores,
    recuperarReaseguradores,
    guardarComisionesRateOnLine,
    recuperarComisionesRateOnLine,
    recuperarTablaOperacionRamoContrato,
    guardarCoberturas,
    recuperarCoberturas,
    guardarExcedentes,
    recuperarExcedentes
  };
});