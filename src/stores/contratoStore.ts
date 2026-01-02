import { defineStore } from "pinia";

export interface ContratoGeneralDatos {
  idContrato: string
  idRamo?: string
  subramo: string[]
  fechaInicio: string
  fechaFin: string
  contratoProrrogado?: null
  fechaFinProrroga?: null
  contratoCancelado?: null
  fechaCancelacion?: null
  negociosCubiertos: string
  cveMoneda: number[]
  cveFormaContractual: string
  cveTReaseguro: string
  idTContrato: number | null
  criterioCobertura: number
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


export interface ContratoGeneralDatosM {
  ramo: string;
  subramo: string[];
  contratoProrrogado: boolean;
  fechaFinProrro: string;
  contratoCancelado: boolean;
  fechaCancelacion: string;
  idContrato: string;
  negociosCubiertos: string;
  fechaInicio: string;
  fechaFin: string;
  cveMoneda: string[];
  cveFormaContractual: string;
  limiteMax: string;
  limiteMaxResCR: string;
  cveTReaseguro: string;
  idTContrato: number;
  criterioCobertura: string;
  retencionP: string;
  piso: string;
  techo: string;
  porcentajeCesion: string;
}

export interface ReaseguradorParticipacion {
  cveReasegurador: string | number
  participacion: number
}

export interface ContratoGeneralConfReaseg {
  idContrato: string | number
  reaseguradores: ReaseguradorParticipacion[]
  indicadorDistrC: number | null
  cesionCoberBasi: number
  comisionReaseg: number
  detalleCobertura: number
  tipoComision: number | null
  tipoCobertura: number | null
  comisionPrimerAnio: number | null
  comisionRenovacion: number | null
}

export interface CapaExPC {
  detalleCapa: string
  retencionC: string
  techoC: string
}

export interface ContratoDatosExPC {
  idContrato: string
  capas: CapaExPC[]
}

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
  tarifaP: number | null
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

export interface IntermediarioRegistro {
  intermediario: number
  asignacionInterm: number
  reaseguradora: number | null
  broker: number | null
  corretaje: number
  tipoCorretaje: number | null
  corretajeFijo: number | null
  montoCorreFijo: number | null
  display: {
    asignacion: string
    reaseguradora: string
    broker: string
    corretaje: string
    tipo: string
  }
}

export interface ContratoConfigInt {
  idContrato: string | number
  intermediariosTabla?: IntermediarioRegistro[]
  intermediario: number
  asignacionIntermediario: number
  reaseguradora: number | null
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
  limiteInf: number
  limiteSup: number
  comisionDefinitiva: number
}

export interface ContratoConfigReasCom {
  idContrato: string | number
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

export interface ContratoCompletoDTO {
  general: ContratoGeneralDatos | null
  expc: ContratoDatosExPC | null
  configReaseg: ContratoGeneralConfReaseg | null
  configReasegCob: ContratoGeneralReasegCobertura | null
  configReasegCom: ContratoConfigReasCom | null
  configInt: ContratoConfigInt | null
}


export const  useContratoStore = defineStore("contrato", {
  state: () => ({
    general: JSON.parse(
      localStorage.getItem("contrato_general_datos") || "null"
    ) as ContratoGeneralDatos | null,

    expc: JSON.parse(
      localStorage.getItem("contrato_general_expc_datos") || "null"
    ) as ContratoDatosExPC | null,

    poli: JSON.parse(
      localStorage.getItem("contrato_general_polizas") || "null"
    ) as ContratoGeneralPol | null,

    configReaseg: JSON.parse(
      localStorage.getItem("contrato_general_configReaseg_G") || "null"
    ) as ContratoGeneralConfReaseg | null,

    configReasegCob: JSON.parse(
      localStorage.getItem("contrato_general_configReaseg_ Cob") || "null"
    ) as ContratoGeneralReasegCobertura | null,

    configReasegCom: JSON.parse(
      localStorage.getItem("contrato_general_configReaseg_Com") || "null"
    ) as ContratoConfigReasCom | null,

    configReasegPTU: JSON.parse(
      localStorage.getItem("contrato_general_configReaseg_PTU") || "null"
    ) as ContratoReasePTU | null,

    configInt: JSON.parse(
      localStorage.getItem("contrato_general_configInt") || "null"
    ) as ContratoConfigInt | null,

    completo: JSON.parse(
      localStorage.getItem("contrato_completo") || "false"
    ) as boolean,
  }),

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
      localStorage.setItem("contrato_general_configReaseg_ Cob", JSON.stringify(data));
    },

    setConfigReasCom(data: ContratoConfigReasCom) {
      this.configReasegCom = data;
      localStorage.setItem("contrato_general_configReaseg_Com", JSON.stringify(data));
    },

    setConfigReasPTU(data: ContratoReasePTU) {
      this.configReasegPTU = data;
      localStorage.setItem("contrato_general_configReaseg_PTU", JSON.stringify(data));
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
      this.completo = false;

      localStorage.removeItem("contrato_general_datos");
      localStorage.removeItem("contrato_general_expc_datos");
      localStorage.removeItem("contrato_general_polizas");
      localStorage.removeItem("contrato_general_configReaseg_G");
      localStorage.removeItem("contrato_general_configReaseg_Cob");
      localStorage.removeItem("contrato_general_configReaseg_Com");
      localStorage.removeItem("contrato_general_configReaseg_PTU");
      localStorage.removeItem("contrato_general_configInt");
      localStorage.removeItem("contrato_completo");
    },
  },
});
