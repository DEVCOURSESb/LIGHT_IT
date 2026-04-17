import type { BorPrimasSection, BorSiniestrosSection, CoberturasSection, ComisionesRateOnLineSection, CorretajeSection, CumulosSection, DetallesProporcionalesSection, EdoSection, ExcedentesSection, GeneralesSection, GeneralSectionCompleteData, GeneralSectionTableMoneda, GeneralSectionTableOperacionRamo, IntermediarioSection, PagoSection, PolizasFacultativasSection, ProporcionPrimasSection, ReaseguradoresSection, ReinstalacionesSection, TarifasSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
export interface TablaOperacionRamoContratoInterface {
  idContrato: string;
  cveExtCoberContrato: number;
  cveOperRamo: string;
  operRamoActivo: boolean;
}

// claves para localStorage
const STORAGE_KEYS = {
  activeTab: "CAE_ACTIVE_TAB",
  generalesContrato: "CAE_GENERALES_CONTRATO",
  monedaContrato: "CAE_MONEDA_CONTRATO",
  operacionRamoContrato: "CAE_OPERACION_RAMO_CONTRATO",
  generalesCompletos: "AE_GENERALES_COMPLETOS",
  detallesContrato: "CAE_DETALLES_CONTRATO",
  polizasFacultativasContrato: "CAE_POL_FAC_CONTRATO",
  reaseguradores: "CAE_REASEGURADORES_CONTRATO",
  comisionesRol: "CAE_COMIS_ROL_CONTRATO",
  coberturasContrato: "CAE_COBERTURAS_CONTRATO",
  excedentesContratos: "CAE_EXCEDENTES_CONTRATO",
  cumulosContratos: "CAE_CUMULOS_CONTRATO",
  tarifasContrato: "CAE_TARIFAS_CONTRATO",
  proporcionPrimasContrato: "CAE_PROPORCION_CONTRATO",
  reinstalacionesContrato: "CAE_REINSTALACIONES_CONTRATO",
  intermediariosContrato: "CAE_INTERMEDIARIOS_CONTRATO",
  corretajeContrato: "CAE_CORRETAJE_CONTRATO",
  pagos:                 "CAE_PAGOS_CONTRATO",
  edoCuenta:             "CAE_EDO_CONTRATO",
  borPrimas:             "CAE_BOR_PRIMAS_CONTRATO",
  borSiniestros:         "CAE_BOR_SINIESTROS_CONTRATO"
} as const;

export const useContratoAEStore = defineStore("CONTRATO_AYE", () => {
  const dialog = useDialog();

  const activeTab = ref<string>(localStorage.getItem(STORAGE_KEYS.activeTab) ?? "tab-1",);

  // !GENERALES
  const generalesData = JSON.parse(localStorage.getItem(STORAGE_KEYS.generalesCompletos) || "{}") as GeneralSectionCompleteData;
  const generales = ref<GeneralSectionCompleteData>({...generalesData, fechaFinContrato: new Date(generalesData.fechaFinContrato), fechaInicioContrato: new Date(generalesData.fechaInicioContrato)});
 
  const isTypeProporcional = computed<boolean>(() => {
    return generales.value.cveTreaseg === 0;
  });

  const isFacultativo = computed<boolean>(() => {
    return generales.value.cveFcontrac === 1;
  });

  const tipoContrato = computed<number | null>(() => {
    return generales.value.idTcontrato ?? null;
  });
  
  //const guardarGenerales = (data: Record<string, any>) => {
  const guardarGenerales = (data: GeneralesSection, tableMonedas: GeneralSectionTableMoneda[], tableOperacionesRamos: GeneralSectionTableOperacionRamo[]) => {
    tableMonedas = tableMonedas.map((item) => ({ ...item, idContrato: data.idContrato }));
    tableOperacionesRamos = tableOperacionesRamos.map((item) => ({ ...item, idContrato: data.idContrato }));
    
    // actualizar estado reactivo
    generales.value = {
      ...generales.value,
      ...data,
      fechaInicioContrato: new Date(data.fechaInicioContrato),
      fechaFinContrato: new Date(data.fechaFinContrato),
      CAE_MONEDA_CONTRATO: tableMonedas,
      CAE_OPERACION_RAMO: tableOperacionesRamos,
    };
    // Guardar generales
    localStorage.setItem(STORAGE_KEYS.generalesContrato, JSON.stringify(data));
    // Guardar tablas relacionadas
    localStorage.setItem(STORAGE_KEYS.monedaContrato, JSON.stringify(tableMonedas));
    localStorage.setItem(STORAGE_KEYS.operacionRamoContrato, JSON.stringify(tableOperacionesRamos));
    
    // guardar juntos
    localStorage.setItem(STORAGE_KEYS.generalesCompletos, JSON.stringify({
      ...data,
      CAE_MONEDA_CONTRATO: tableMonedas,
      CAE_OPERACION_RAMO: tableOperacionesRamos
    }));
    
    
    // Navegar al siguiente tab según el tipo de reaseguro
    activeTab.value = isTypeProporcional.value ? "tab-2" : ( isFacultativo.value ? "tab-3" : "tab-4");
    
    dialog.show({
      title: "Datos guardados",
      message: "Los datos generales han sido guardados exitosamente.",
      type: DialogType.SUCCESS,
    });
  };
    
    // !DETALLES PROPORCIONALES
  const detallesProporcionales = ref<DetallesProporcionalesSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.detallesContrato) || "[]"),);

  const haveCumulos = computed<boolean>(() => {
    return detallesProporcionales.value.some((item) => item.cumulos === 1);
  });
  
  const guardarDetallesProporcionales = (data: Record<string, any>[]) => {
    const { idContrato } = generales.value;

    const detallesConContrato = data.map((item) => ({
      ...item,
      idContrato,
    })) as DetallesProporcionalesSection[];
    
    // actualizacion de estado reactivo
    detallesProporcionales.value = detallesConContrato;
    
    // Persistimos
    localStorage.setItem(
      STORAGE_KEYS.detallesContrato,
      JSON.stringify(detallesConContrato),
    );
    
    activeTab.value = isFacultativo.value ? "tab-3" : "tab-4";
  };
  
  // !PÓLIZAS FACULTATIVAS
  const polizasFacultativas = ref<PolizasFacultativasSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.polizasFacultativasContrato) || "[]"),);
  const guardarPolizasFacultativas = (data: PolizasFacultativasSection[]) => {
    const { idContrato } = generales.value;

    const polizasConContrato = data.map((item) => ({ ...item, idContrato }));

    // actualizacion de estado reactivo
    polizasFacultativas.value = polizasConContrato;

    localStorage.setItem(STORAGE_KEYS.polizasFacultativasContrato, JSON.stringify(polizasConContrato),);
    activeTab.value = "tab-4";
  };

  // ! REASEGURADORES
  const reaseguradores = ref<ReaseguradoresSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.reaseguradores) || "[]"),);

  const haveComisionEscalonada = computed<boolean>(() => {
    return reaseguradores.value.some((item) => item?.cveAsignacionComisRol === 2);
  });

  const guardarReaseguradores = (data: ReaseguradoresSection[]) => {
    const { idContrato } = generales.value;
    const reaseguradoresConContrato = data.map((item) => ({
      ...item,
      idContrato,
    }));
    localStorage.setItem(
      STORAGE_KEYS.reaseguradores,
      JSON.stringify(reaseguradoresConContrato),
    );
    // actualizacion de estado reactivo
    reaseguradores.value = reaseguradoresConContrato;

    activeTab.value = haveComisionEscalonada.value ? "tab-5" : "tab-6";
  };

  // !COMISIONES RATE ON LINE
  const comisionesRateOnLine = ref<ComisionesRateOnLineSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.comisionesRol) || "[]"));

  const guardarComisionesRateOnLine = (data: ComisionesRateOnLineSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));
    comisionesRateOnLine.value = rows;

    localStorage.setItem(STORAGE_KEYS.comisionesRol, JSON.stringify(rows));

    activeTab.value = "tab-6";
  };

  // !COBERTURAS
  const coberturas = ref<CoberturasSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.coberturasContrato) || "[]"));

  const guardarCoberturas = (data: CoberturasSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));
    coberturas.value = rows;

    localStorage.setItem(STORAGE_KEYS.coberturasContrato, JSON.stringify(rows));

    activeTab.value = tipoContrato.value == 3 ? "tab-7" : ( haveCumulos.value ? "tab-8" : "tab-9");
  };

  // TODO: validar active tabs
  // !EXCEDENTES
  const excedentes = ref<ExcedentesSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.excedentesContratos) || "[]"));

  const guardarExcedentes = (data: ExcedentesSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));
    excedentes.value = rows;

    localStorage.setItem(
      STORAGE_KEYS.excedentesContratos,
      JSON.stringify(rows),
    );

    activeTab.value = haveCumulos.value ? "tab-8" : (isTypeProporcional.value ? "tab-9" : haveProporcionDias.value ? "tab-10" : ( !isTypeProporcional.value ? "tab-11" : "tab-12" ));
  };

  // !CÚMULOS
  const cumulos = ref<CumulosSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.cumulosContratos) || "[]"));

  const guardarCumulos = (data: CumulosSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));
    cumulos.value = rows;

    localStorage.setItem(
      STORAGE_KEYS.cumulosContratos,
      JSON.stringify(rows),
    );

    activeTab.value = isTypeProporcional.value ? "tab-9" : haveProporcionDias.value ? "tab-10" : ( !isTypeProporcional.value ? "tab-11" : "tab-12" );
  };

  // !TARIFAS
  const tarifas = ref<TarifasSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.tarifasContrato) || "[]"));

  const haveProporcionDias = computed<boolean>(() => {
    return tarifas.value.some((item) => item.proporcionDias !== null && item.proporcionDias !== undefined && item.proporcionDias === 1);
  });

  const guardarTarifas = (data: TarifasSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));

    tarifas.value = rows;

    localStorage.setItem(
      STORAGE_KEYS.tarifasContrato,
      JSON.stringify(rows),
    );

    activeTab.value = haveProporcionDias.value ? "tab-10" : ( !isTypeProporcional.value ? "tab-11" : "tab-12" );
  };

  // !PROPORCION PRIMAS
  const proporcionPrimas = ref<ProporcionPrimasSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.proporcionPrimasContrato) || "[]"));

  const guardarProporcionPrimas = (data: ProporcionPrimasSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));

    proporcionPrimas.value = rows;

    localStorage.setItem(
      STORAGE_KEYS.proporcionPrimasContrato,
      JSON.stringify(rows),
    );

    activeTab.value = !isTypeProporcional.value ? "tab-11" : "tab-12" ;
  };

  //! REINSTALACIONES
  const reinstalaciones = ref<ReinstalacionesSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.reinstalacionesContrato) || "[]"));

  const guardarReinstalaciones = (data: ReinstalacionesSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));

    reinstalaciones.value = rows;

    localStorage.setItem(STORAGE_KEYS.reinstalacionesContrato, JSON.stringify(rows));
    activeTab.value = "tab-12";
  };

  // ! INTERMEDIARIOS
  const intermediarios = ref<IntermediarioSection[]>(JSON.parse(localStorage.getItem(STORAGE_KEYS.intermediariosContrato) || "[]"));
  const guardarIntermediarios = (data: IntermediarioSection[]) => {
    const { idContrato } = generales.value;
    const rows = data.map((row) => ({ ...row, idContrato }));
    intermediarios.value = rows;
    localStorage.setItem(STORAGE_KEYS.intermediariosContrato, JSON.stringify(rows));
    activeTab.value = haveCorretajeEscalonado.value ? "tab-13" : "tab-14";
  }

  const haveCorretajeEscalonado = computed<boolean>(() => {
    return intermediarios.value.some((item) => item?.cveAsignacionCorretaje === 2);
  });

  //!CORRETAJE
  const corretajes = ref<CorretajeSection[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEYS.corretajeContrato) || "[]")
  );

  const guardarCorretajes = (data: CorretajeSection[]) => {
    const { idContrato } = generales.value;

    const rows = data.map(row => ({
      ...row,
      idContrato
    }));

    corretajes.value = rows;

    localStorage.setItem(
      STORAGE_KEYS.corretajeContrato,
      JSON.stringify(rows)
    );
    activeTab.value = "tab-14";
  };

  function fromStorage<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  //! ADMINISTRACION
  const pagos         = ref<PagoSection[]>(fromStorage(STORAGE_KEYS.pagos,         []));
  const edoCuenta     = ref<EdoSection[]>(fromStorage(STORAGE_KEYS.edoCuenta,      []));
  const borPrimas     = ref<BorPrimasSection[]>(fromStorage(STORAGE_KEYS.borPrimas,    []));
  const borSiniestros = ref<BorSiniestrosSection[]>(fromStorage(STORAGE_KEYS.borSiniestros, []));

  const guardarAdministracion = (
    dataPagos:      PagoSection[],
    dataEdo:        EdoSection[],
    dataPrimas:     BorPrimasSection[],
    dataSiniestros: BorSiniestrosSection[]
  ) => {
    const id = generales.value.idContrato;
    pagos.value         = dataPagos.map((r) => ({ ...r, idContrato: id }));
    edoCuenta.value     = dataEdo.map((r) => ({ ...r, idContrato: id }));
    borPrimas.value     = dataPrimas.map((r) => ({ ...r, idContrato: id }));
    borSiniestros.value = dataSiniestros.map((r) => ({ ...r, idContrato: id }));
    localStorage.setItem(STORAGE_KEYS.pagos,         JSON.stringify(pagos.value));
    localStorage.setItem(STORAGE_KEYS.edoCuenta,     JSON.stringify(edoCuenta.value));
    localStorage.setItem(STORAGE_KEYS.borPrimas,     JSON.stringify(borPrimas.value));
    localStorage.setItem(STORAGE_KEYS.borSiniestros, JSON.stringify(borSiniestros.value));
  };

  const obtenerPayloadBackend = () => {
    const payload: Record<string, any> = {
      GENERALES: generales.value,
      REASEGURADORES: reaseguradores.value,
      COBERTURAS: coberturas.value,
      INTERMEDIARIOS: intermediarios.value,
      ADMINISTRACION: {
        PAGOS: pagos.value,
        ESTADO_CUENTA: edoCuenta.value,
        BOR_PRIMAS: borPrimas.value,
        BOR_SINIESTROS: borSiniestros.value,
      },
    };

    // Tipo proporcional
    if (isTypeProporcional.value) {
      payload.DETALLES_PROPORCIONALES = detallesProporcionales.value;
      payload.TARIFAS = tarifas.value;
    }

    // Facultativo
    if (isFacultativo.value) {
      payload.POLIZAS_FACULTATIVAS = polizasFacultativas.value;
    }

    // Comisión escalonada
    if (haveComisionEscalonada.value) {
      payload.COMISIONES_RATE_ON_LINE = comisionesRateOnLine.value;
    }

    // Excedentes
    if (tipoContrato.value === 3) {
      payload.EXCEDENTES = excedentes.value;
    }

    // Cúmulos
    if (haveCumulos.value) {
      payload.CUMULOS = cumulos.value;
    }

    // Proporción de prima
    if (haveProporcionDias.value) {
      payload.PROPORCION_PRIMAS = proporcionPrimas.value;
    }

    // Reinstalaciones (solo si NO es proporcional)
    if (!isTypeProporcional.value) {
      payload.REINSTALACIONES = reinstalaciones.value;
    }

    // Corretaje escalonado
    if (haveCorretajeEscalonado.value) {
      payload.CORRETAJE = corretajes.value;
    }

    return payload;
  };

  watch(activeTab, (nuevoTab) => {
    localStorage.setItem(STORAGE_KEYS.activeTab, nuevoTab);
  });

  return {
    activeTab,
    isTypeProporcional,
    isFacultativo,
    tipoContrato,
    haveComisionEscalonada,
    haveCumulos,
    guardarGenerales,
    generales,
    guardarDetallesProporcionales,
    detallesProporcionales,
    guardarPolizasFacultativas,
    polizasFacultativas,
    guardarReaseguradores,
    reaseguradores,
    guardarComisionesRateOnLine,
    comisionesRateOnLine,
    guardarCoberturas,
    coberturas,
    guardarExcedentes,
    excedentes,
    guardarCumulos,
    cumulos,
    guardarTarifas,
    tarifas,
    haveProporcionDias,
    proporcionPrimas,
    guardarProporcionPrimas,
    reinstalaciones,
    guardarReinstalaciones,
    intermediarios,
    guardarIntermediarios,
    corretajes,
    guardarCorretajes,
    haveCorretajeEscalonado,
    pagos,
    edoCuenta,
    borPrimas,
    borSiniestros,
    guardarAdministracion,
    obtenerPayloadBackend
  };
});
