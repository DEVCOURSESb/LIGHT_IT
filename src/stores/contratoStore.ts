import { defineStore } from "pinia";

/* DATOS GENERALES */
export interface ContratoGeneralDatos {
  idContrato: string
  idRamo?: string
  subramo: any[]
  fechaInicio: string
  fechaFin: string
  contratoProrrogado?: null
  fechaFinProrroga?: null
  contratoCancelado?: null
  fechaCancelacion?: null
  negociosCubiertos: string
  cveMoneda: any
  cveFormaContractual: any
  cveTReaseguro: any
  idTContrato: any
  criterioCobertura: any
  limiteMax: string
  limiteMaxResCR: string
  montoRetencion: string
  piso: string
  techo: string
  porcentajeCesion: string
}

export interface ContratoGeneralPol {
  idContrato: string | number
  polizas: {
    poliza: string
    renovacion: number
  }[]
}
/* CONFIGURACION GENERAL */
export interface TipoCoberturas {
  tipoCobertura: string | null
  comisionPrimerAnio: number | null
  comisionRenovacion: number | null
}

export interface ContratoGeneralConfReaseg {
  idContrato: string | number
  cveReasegurador: string | null
  nombreReasegurador: any
  participacion: number
  indicadorDistrC: any
  cesionCoberBasi: any
  comisionReaseg: any
  detalleCobertura: any
  tipoComision: any
  coberturas: TipoCoberturas[]
}

/* EXCEDENTE POR CAPAS*/
export interface CapaExPC {
  detalleCapa: string
  retencionC: string
  techoC: string
}

export interface ContratoDatosExPC {
  idContrato: string
  capas: CapaExPC[]
}

/* COBERTURAS */
export interface Cobertura {
  value: number
  title: string
}

export interface Agrupacion {
  coberturas: Cobertura[]
  madre: Cobertura | null
}

export interface DetalleTarifa {
  detalleCapa: string
  tipoCobertura: string
  cobertura: string
  tipoTarifa: number
  primaTarifa: number | null
  porSobrePrima: number | null
  tarifaFijaM: number | null
  factorTap: number | null
  tarifaP: File | null
}

export interface ContratoGeneralReasegCobertura {
  idContrato: string | number
  agrupacionCoberturas: number
  agrupaciones: Agrupacion[]
  coberturasBasi: number[]
  coberturasAdici: number[]
  detalleCapa: number
  detalleC: CapaExPC[]
  detalleCobertura: number
  tarifas: DetalleTarifa[]
}

export interface ReaseguradorFila{
  general: ContratoGeneralConfReaseg;
  coberturas: ContratoGeneralReasegCobertura | null;
  comisiones: ContratoConfigReasCom | null;
  ptu: ContratoReasePTU | null;
}

export interface IntermediarioRegistro {
  intermediario: number
  asignacionInterm: any
  reaseguradora: any
  broker: number | null
  corretaje: number
  tipoCorretaje: number | null
  corretajeFijo: number | null
  montoCorreFijo: number | null
  display: {
    asignacion: any
    reaseguradora: any
    broker: string
    corretaje: string
    tipo: any
  }
}

export interface ContratoConfigInt {
  idContrato: string | number
  intermediariosTabla?: IntermediarioRegistro[]
  intermediario: number
  asignacionIntermediario: number
  reaseguradora: any[]
  interme: number | null
  corretajeP: number
  tipoCorretaje: number | null
  corretaje: number
  montoCorretaje: number | null
  formulaLimiteCorre?: string
  corretajeProvi?: string
  montoCorretajeProvi?: string
}

export interface ComisionReaseguro {
  cveReasegurador: string
  limiteInf: number
  limiteSup: number
  comisionDefinitiva: number
}

export interface ContratoConfigReasCom {
  idContrato: string | number
  tipoCobertura: string | number
  comisiones: ComisionReaseguro[]
}

export interface ContratoReasePTU {
  idContrato: string | number
  otorgaPtu: number
  metodoCalPTU: number | null
  ptu: string | null
  kPor: string | null
  aniosArrastre: number | null
  gastos: string | null
}

export interface ReaseguradorCompleto {
  general: ContratoGeneralConfReaseg;
  coberturas: ContratoGeneralReasegCobertura | null;
  comisiones: ContratoConfigReasCom | null;
  ptu: ContratoReasePTU | null;
  participacion: number;
}

export interface ContratoCompletoDTO {
  general: ContratoGeneralDatos | null
  expc: ContratoDatosExPC | null
  configReaseg: ContratoGeneralConfReaseg | null
  configReasegCob: ContratoGeneralReasegCobertura | null
  configReasegCom: ContratoConfigReasCom | null
  configInt: ContratoConfigInt | null
}

export const useContratoStore = defineStore("contrato", {
  state: () => ({
    general: JSON.parse(localStorage.getItem("contrato_general_datos") || "null") as ContratoGeneralDatos | null,
    expc: JSON.parse(localStorage.getItem("contrato_general_expc_datos") || "null") as ContratoDatosExPC | null,
    poli: JSON.parse(localStorage.getItem("contrato_general_polizas") || "null") as ContratoGeneralPol | null,
    configReaseg: JSON.parse(localStorage.getItem("contrato_general_configReaseg_G") || "null") as ContratoGeneralConfReaseg | null,
    configReasegCob: JSON.parse(localStorage.getItem("contrato_general_configReaseg_Cob") || "null") as ContratoGeneralReasegCobertura | null,
    configReasegCom: JSON.parse(localStorage.getItem("contrato_general_configReaseg_Com") || "null") as ContratoConfigReasCom | null,
    configReasegPTU: JSON.parse(localStorage.getItem("contrato_general_configReaseg_PTU") || "null") as ContratoReasePTU | null,
    configInt: JSON.parse(localStorage.getItem("contrato_general_configInt") || "null") as ContratoConfigInt | null,
    completo: JSON.parse(localStorage.getItem("contrato_completo") || "false") as boolean,
    listaReaseguradoresFinal: [] as ReaseguradorCompleto[],
    tempReasegurador: {
      cveReasegurador: null,
      nombreReasegurador: "",
      participacion: 0,
    } as any
  }),
  getters: {
    totalParticipacion: (state) => {
      return state.listaReaseguradoresFinal.reduce((acc, r) => acc + r.participacion, 0);
    }
  },

  actions: {
    setGeneral(data: ContratoGeneralDatos) {
      this.general = data;
      localStorage.setItem("contrato_general_datos", JSON.stringify(data));
    },

    setDatosExPC(data: ContratoDatosExPC) {
      this.expc = data;
      localStorage.setItem("contrato_general_expc_datos", JSON.stringify(data));
    },

    setPolizas(data: ContratoGeneralPol) {
      this.poli = data;
      localStorage.setItem("contrato_general_polizas", JSON.stringify(data));
    },

    setConfigReasG(data: ContratoGeneralConfReaseg) {
      this.configReaseg = data;
      localStorage.setItem("contrato_general_configReaseg_G", JSON.stringify(data));
    },

    setConfigReasCob(data: ContratoGeneralReasegCobertura) {
      this.configReasegCob = data;
      localStorage.setItem("contrato_general_configReaseg_Cob", JSON.stringify(data));
    },

    setConfigReasCom(data: ContratoConfigReasCom) {
      this.configReasegCom = data;
      localStorage.setItem("contrato_general_configReaseg_Com", JSON.stringify(data));
    },

    setConfigReasPTU(data: ContratoReasePTU) {
      this.configReasegPTU = data;
      localStorage.setItem("contrato_general_configReaseg_PTU", JSON.stringify(data));
    },

    agregarReaseguradorALista(data: ReaseguradorCompleto) {
      this.listaReaseguradoresFinal.push(data);
      localStorage.setItem("lista_reaseguradores_final", JSON.stringify(this.listaReaseguradoresFinal));
    },

    setConfigInt(data: ContratoConfigInt) {
      this.configInt = data;
      localStorage.setItem("contrato_general_configInt", JSON.stringify(data));
    },

    marcarCompleto() {
      this.completo = true;
      localStorage.setItem("contrato_completo", "true");
    },

    reset() {
      this.general = null;
      this.expc = null;
      this.poli = null;
      this.configReaseg = null;
      this.configReasegCob = null;
      this.configReasegCom = null;
      this.configReasegPTU = null;
      this.tempReasegurador = {
        cveReasegurador: null,
        nombreReasegurador: "",
        participacion: 0,
      };
      this.configInt = null;
      this.completo = false;

      localStorage.removeItem("contrato_general_datos");
      localStorage.removeItem("contrato_general_expc_datos");
      localStorage.removeItem("contrato_general_polizas");
      localStorage.removeItem("contrato_general_configReaseg_G");
      localStorage.removeItem("contrato_general_configReaseg_Cob"); // este no se esta eliminando correctamente y me genera que para la parte de reaseguradores me ponga el mismo
      localStorage.removeItem("contrato_general_configReaseg_Com");
      localStorage.removeItem("contrato_general_configReaseg_PTU");
      localStorage.removeItem("contrato_general_configInt");
      localStorage.removeItem("lista_reaseguradores_final");
      localStorage.removeItem("contrato_completo");
    },
  },
  persist: {
    key: 'contrato_app_storage', // Una sola clave para TODO el objeto del store
    storage: localStorage,
  }
});
