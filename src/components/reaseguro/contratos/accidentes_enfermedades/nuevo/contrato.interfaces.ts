export interface GeneralesSection {
  cveContrato: number | null;
  idContrato: string;
  fechaInicioContrato: Date;
  fechaFinContrato: Date;
  ordenCobertura: number;
  cveTreaseg: number;
  idTcontrato: number | null;
  cveFcontrac: number;
  cveCriterioCob: number | null;
  traspasoCartera: number | null;
  cveEntidad: string | null;
  municipio: string | null;
  cveSector: string | null;
  asegurado: string | null;
  negociosCubiertos: string;
  contratoActivo: boolean;
}

export interface GeneralSectionTableMoneda {
  idContrato: string;
  cveMonedaContrato: number;
  monActiva: boolean;
}

export interface GeneralSectionTableOperacionRamo {
  idContrato: string;
  cveExtCoberContrato: number;
  cveOperRamo: string;
  operRamoActivo: boolean;
}

export interface GeneralSectionCompleteData extends GeneralesSection {
  CAE_MONEDA_CONTRATO: GeneralSectionTableMoneda[];
  CAE_OPERACION_RAMO: GeneralSectionTableOperacionRamo[];
}

export interface DetallesProporcionalesSection {
  idContrato: string;
  detallesOperRamo: number;
  cveExtCoberDetalles: number | null;
  cveOperRamoDetalles: string | null;
  porcentajeRetencion: number | null;
  porcentajeCesion: number | null;
  montoRetencion: number;
  montoRetencionContrato: number;
  montoCesion: number;
  capacidadContrato: number;
  cveCriterioAsigCapacidad: number;
  cveDistrCesion: number;
  cveMonedaDetalles: number;
  cumulos: number;
  detalleActivo: boolean;
}

export interface PolizasFacultativasSection {
  idContrato: string;
  noPoliza: string;
  polActiva: boolean;
}

export interface ReaseguradoresSection {
  idContrato: string;
  cveReasegurador: number;
  participacion: number;
  otorgaPtu: number | null;
  porcentajePtu: number | null;
  cvePtu: number | null;
  porcentajeK: number | null;
  gastos: number | null;
  aniosArrastre: number | null;
  comisRolReaseguro: number;
  cveAsignacionComisRol: number | null;
  cveCalcomis: number | null;
  comisRolFija: number | null;
  comisRolProvisional: number | null;
  comisRolMin: number | null;
  comisRolMax: number | null;
  capa: number | null;
  prioridad: number | null;
  limResponsabilidad: number | null;
  limAgregado: number | null;
  cveCriterioAsigLimAgregado: number | null;
  cveAsignacionCosto: number | null;
  costoFijo: number | null;
  pmd: number | null;
  primaMin: number | null;
  primaMax: number | null;
  facAjusteDividendo: number | null;
  facAjusteDivisor: number | null;
  noClaims: number | null;
  reasegActiva: boolean;
}

export interface ComisionesRateOnLineSection {
  idContrato: string;
  cveReaseguradorComisRol: number;
  limiteInf: number;
  limiteSup: number;
  comisRolDefinitiva: number;
  comisRolActiva: boolean;
}

export interface CoberturasSection {
  idContrato: string;
  cveCriterioAsigCobertura: number;
  cveReaseguradorCobertura: number | null;
  cveOperRamoCobertura: string | null;
  cveCobaye: number;
  propiaSaMax: number;
  saMax: number | null;
  cobBasica: boolean;
  coberActiva: boolean;
}

export interface ExcedentesSection {
  idContrato: string;
  cveCriterioAsigCapa: number;
  cveCobayeCapa: number | null;
  noCapa: number;
  retencionCapa: number;
  cesionCapa: number;
  capaActiva: boolean;
}

export interface CumulosSection {
  idContrato: string;
  cveOperRamoCumulo: string | null;
  numCapa: number;
  montoCumulo: number | null;
  cumuloActivo: boolean;
}

export interface TarifasSection {
  idContrato: string;
  cveCriterioAsigTarifa: number;
  cveReaseguradorTarifa: number | null;
  cveOperRamoTarifa: string | null;
  cveCobayeTarifa: number | null;
  cveTarifa: number | null;
  primaTarifaReaseg: number | null;
  porcentajePrimaEmi: number | null;
  tarifaMillar: number | null;
  edad: number | null;
  cveSexo: string | null;
  proporcionDias: number | null;
  cveMonedaTarifa: number | null;
  tarifaActiva: boolean;
}

export interface ProporcionPrimasSection {
  idContrato: string;
  cveCriterioAsigPrimaPropor: number;
  cveReaseguradorPrimaPropor: number | null;
  cveOperRamoPrimaPropor: string | null;
  cveCobayePrimaPropor: number | null;
  noDiasCubiertos: number;
  porcentajePrimaAnual: number;
  proporcionActiva: boolean;
}

export interface ReinstalacionesSection {
  idContrato: string;
  reinstalacion: number;
  cveCriterioAsigReinstalacion: number | null;
  cveReaseguradorReinstalacion: number | null;
  noReinstalacion: number | null;
  cuotaAjusteReinstalacion: number | null;
  costoReinstalacion: number | null;
  montoReinstalado: number | null;
  reinstalacionActiva: boolean;
}

export interface IntermediarioSection {
  idContrato: string;
  intermediario: number;
  cveCriterioAsigIntermediario: number | null;
  cveReaseguradorIntermediario: number | null;
  cveIntermediario: number | null;
  corretaje: number;
  cveAsignacionCorretaje: number | null;
  porcentajeCorretajeFijo: number | null;
  montoCorretajeFijo: number | null;
  cveLimCorretaje: number | null;
  porcentajeCorretajeProvisional: number | null;
  montoCorretajeProvisional: number | null;
  interActivo: boolean;
}

export interface CorretajeSection {
  idContrato: string;
  cveIntermediarioCorretaje: number;
  cveReaseguradorCorretaje: number | null;
  limiteInfCorretaje: number;
  limiteSupCorretaje: number;
  porcentajeCorretajeDef: number | null;
  montoCorretajeDef: number | null;
  corActivo: boolean;
}

export interface PagoSection {
  idContrato: string;
  cveFormapago: number;
  porcentajePago: number | null;
  fechaPago: string | null;
  pagoActivo: boolean;
}

export interface EdoSection {
  idContrato: string;
  cvePeriodicidadEdo: number;
  fechaEdo: string | null;
  edoActivo: boolean;
}

export interface BorPrimasSection {
  idContrato: string;
  cvePeriodicidadPrimas: number;
  fechaPrimas: string | null;
  primasActivo: boolean;
}

export interface BorSiniestrosSection {
  idContrato: string;
  cvePeriodicidadSiniestros: number;
  fechaSiniestros: string | null;
  siniestrosActivo: boolean;
}
