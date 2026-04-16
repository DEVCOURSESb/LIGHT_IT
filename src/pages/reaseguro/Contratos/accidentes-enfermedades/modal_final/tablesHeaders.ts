const headerProps = { style: "font-weight: bold" };

export const tablesHaders = () => {
  const generalesContratoHeaders = [
    { title: "ID", key: "idContrato", sortable: true, headerProps },
    { title: "FECHA INICIO", key: "fechaInicioContrato", sortable: true, headerProps, },
    { title: "FECHA FIN", key: "fechaFinContrato", sortable: true, headerProps, },
    { title: "ORDEN COBERTURA",key: "ordenCobertura",sortable: true,headerProps, },
    { title: "TIPO REASEGURO", key: "cveTreaseg", sortable: true, headerProps },
    { title: "TIPO CONTRATO", key: "idTcontrato", sortable: true, headerProps },
    { title: "FORMA CONTRACTUAL", key: "cveFcontrac", sortable: true, headerProps, },
    { title: "CRITERIO COBERTURA", key: "cveCriterioCob", sortable: true, headerProps, },
    { title: "TRASPASO CARTERA", key: "traspasoCartera", sortable: true, headerProps, },
    { title: "ENTIDAD", key: "cveEntidad", sortable: true, headerProps },
    { title: "MUNICIPIo", key: "municipio", sortable: true, headerProps },
    { title: "SECTOR", key: "cveSector", sortable: true, headerProps },
    { title: "ASEGURADO", key: "asegurado", sortable: true, headerProps },
    { title: "NEGOCIOS CUBIERTOS", key: "negociosCubiertos", sortable: true, headerProps, },
    { title: "ACTIVO", key: "contratoActivo", sortable: true, headerProps },
  ];

  const generalesContratoMonedaHeader = [
    { title: "MONEDA", key: "cveMonedaContrato", sortable: true, headerProps },
    { title: "ACTIVA", key: "monActiva", sortable: true, headerProps },
  ];

  const generalesContratoOperaciones = [
    { title: "COBERTURA", key: "cveExtCoberContrato", sortable: true, headerProps, },
    { title: "OPERACIÓN", key: "cveOperRamo", sortable: true, headerProps },
    { title: "ACTIVA", key: "operRamoActivo", sortable: true, headerProps },
  ];

  const detallesProporcionalesHeaders = [
    { title: "DETALLES", key: "detallesOperRamo", sortable: true, headerProps },
    { title: "CVEEXTCOBERDETALLES", key: "cveExtCoberDetalles", sortable: true, headerProps, },
    { title: "CVEOPERRAMODETALLES", key: "cveOperRamoDetalles", sortable: true, headerProps, },
    { title: "PORCENTAJERETENCION", key: "porcentajeRetencion", sortable: true, headerProps, },
    { title: "PORCENTAJECESION", key: "porcentajeCesion", sortable: true, headerProps, },
    { title: "MONTORETENCION", key: "montoRetencion", sortable: true, headerProps, },
    { title: "MONTORETENCIONCONTRATO", key: "montoRetencionContrato", sortable: true, headerProps, },
    { title: "MONTOCESION", key: "montoCesion", sortable: true, headerProps },
    { title: "CAPACIDADCONTRATO", key: "capacidadContrato", sortable: true, headerProps, },
    { title: "CVECRITERIOASIGCAPACIDAD", key: "cveCriterioAsigCapacidad", sortable: true, headerProps, },
    { title: "CVEDISTRCESION", key: "cveDistrCesion", sortable: true, headerProps, },
    { title: "CVEMONEDADETALLES", key: "cveMonedaDetalles", sortable: true, headerProps, },
    { title: "CUMULOS", key: "cumulos", sortable: true, headerProps },
    { title: "DETALLEACTIVO", key: "detalleActivo", sortable: true, headerProps, },
  ];

  const polizasFacultativasHeaders = [
    { title: "NO. POLIZA", key: "noPoliza", sortable: true, headerProps },
    { title: "ACTIVA", key: "polActiva", sortable: true, headerProps },
  ];

  const reaseguradoresHeaders = [
    { title: "CVEREASEGURADOR", key: "cveReasegurador", sortable: true, headerProps, },
    { title: "PARTICIPACION", key: "participacion", sortable: true, headerProps, },
    { title: "OTORGAPTU", key: "otorgaPtu", sortable: true, headerProps },
    { title: "PORCENTAJEPTU", key: "porcentajePtu", sortable: true, headerProps, },
    { title: "CVEPTU", key: "cvePtu", sortable: true, headerProps },
    { title: "PORCENTAJEK", key: "porcentajeK", sortable: true, headerProps },
    { title: "GASTOS", key: "gastos", sortable: true, headerProps },
    { title: "ANIOSARRASTRE", key: "aniosArrastre", sortable: true, headerProps, },
    { title: "COMISROLREASEGURO", key: "comisRolReaseguro", sortable: true, headerProps, },
    { title: "CVEASIGNACIONCOMISROL", key: "cveAsignacionComisRol", sortable: true, headerProps, },
    { title: "CVECALCOMIS", key: "cveCalcomis", sortable: true, headerProps },
    { title: "COMISROLFIJA", key: "comisRolFija", sortable: true, headerProps },
    { title: "COMISROLPROVISIONAL", key: "comisRolProvisional", sortable: true, headerProps, },
    { title: "COMISROLMIN", key: "comisRolMin", sortable: true, headerProps },
    { title: "COMISROLMAX", key: "comisRolMax", sortable: true, headerProps },
    { title: "CAPA", key: "capa", sortable: true, headerProps },
    { title: "PRIORIDAD", key: "prioridad", sortable: true, headerProps },
    { title: "LIMRESPONSABILIDAD", key: "limResponsabilidad", sortable: true, headerProps, },
    { title: "LIMAGREGADO", key: "limAgregado", sortable: true, headerProps },
    { title: "CVECRITERIOASIGLIMAGREGADO", key: "cveCriterioAsigLimAgregado", sortable: true, headerProps, },
    { title: "CVEASIGNACIONCOSTO", key: "cveAsignacionCosto", sortable: true, headerProps, },
    { title: "COSTOFIJO", key: "costoFijo", sortable: true, headerProps },
    { title: "PMD", key: "pmd", sortable: true, headerProps },
    { title: "PRIMAMIN", key: "primaMin", sortable: true, headerProps },
    { title: "PRIMAMAX", key: "primaMax", sortable: true, headerProps },
    { title: "FACAJUSTEDIVIDENDO", key: "facAjusteDividendo", sortable: true, headerProps, },
    { title: "FACAJUSTEDIVISOR", key: "facAjusteDivisor", sortable: true, headerProps, },
    { title: "NOCLAIMS", key: "noClaims", sortable: true, headerProps },
    { title: "REASEGACTIVA", key: "reasegActiva", sortable: true, headerProps },
  ];

  const comisionesRateOnLineHeaders = [
    { title: "IDCONTRATO", key: "idContrato", sortable: true, headerProps },
    { title: "CVEREASEGURADORCOMISROL", key: "cveReaseguradorComisRol", sortable: true, headerProps, },
    { title: "LIMITEINF", key: "limiteInf", sortable: true, headerProps },
    { title: "LIMITESUP", key: "limiteSup", sortable: true, headerProps },
    { title: "COMISROLDEFINITIVA", key: "comisRolDefinitiva", sortable: true, headerProps, },
    { title: "COMISROLACTIVA", key: "comisRolActiva", sortable: true, headerProps,
    },
  ];

  const coberturasHeaders = [
    { title: "CVECRITERIOASIGCOBERTURA", key: "cveCriterioAsigCobertura", sortable: true, headerProps, },
    { title: "CVEREASEGURADORCOBERTURA", key: "cveReaseguradorCobertura", sortable: true, headerProps, },
    { title: "CVEOPERRAMOCOBERTURA", key: "cveOperRamoCobertura", sortable: true, headerProps, },
    { title: "CVECOBAYE", key: "cveCobaye", sortable: true, headerProps },
    { title: "PROPIASAMAX", key: "propiaSaMax", sortable: true, headerProps },
    { title: "SAMAX", key: "saMax", sortable: true, headerProps },
    { title: "COBBASICA", key: "cobBasica", sortable: true, headerProps },
    { title: "COBERACTIVA", key: "coberActiva", sortable: true, headerProps },
  ];

  const excedentesHeaders = [
    { title: "CVECRITERIOASIGCAPA", key: "cveCriterioAsigCapa", sortable: true, headerProps, },
    { title: "CVECOBAYECAPA", key: "cveCobayeCapa", sortable: true, headerProps, },
    { title: "NOCAPA", key: "noCapa", sortable: true, headerProps },
    { title: "RETENCIONCAPA", key: "retencionCapa", sortable: true, headerProps, },
    { title: "CESIONCAPA", key: "cesionCapa", sortable: true, headerProps },
    { title: "CAPAACTIVA", key: "capaActiva", sortable: true, headerProps },
  ];

  const cumulosHeaders = [
    { title: "CVEOPERRAMOCUMULO", key: "cveOperRamoCumulo", sortable: true, headerProps, },
    { title: "NUMCAPA", key: "numCapa", sortable: true, headerProps },
    { title: "MONTOCUMULO", key: "montoCumulo", sortable: true, headerProps },
    { title: "CUMULOACTIVO", key: "cumuloActivo", sortable: true, headerProps },
  ];

  const tarifasHeadrs = [
    { title: "CVECRITERIOASIGTARIFA", key: "cveCriterioAsigTarifa", sortable: true, headerProps, },
    { title: "CVEREASEGURADORTARIFA", key: "cveReaseguradorTarifa", sortable: true, headerProps, },
    { title: "CVEOPERRAMOTARIFA", key: "cveOperRamoTarifa", sortable: true, headerProps, },
    { title: "CVECOBAYETARIFA", key: "cveCobayeTarifa", sortable: true, headerProps, },
    { title: "CVETARIFA", key: "cveTarifa", sortable: true, headerProps },
    { title: "PRIMATARIFAREASEG", key: "primaTarifaReaseg", sortable: true, headerProps, },
    { title: "PORCENTAJEPRIMAEMI", key: "porcentajePrimaEmi", sortable: true, headerProps, },
    { title: "TARIFAMILLAR", key: "tarifaMillar", sortable: true, headerProps },
    { title: "EDAD", key: "edad", sortable: true, headerProps },
    { title: "CVESEXO", key: "cveSexo", sortable: true, headerProps },
    { title: "PROPORCIONDIAS", key: "proporcionDias", sortable: true, headerProps, },
    { title: "CVEMONEDATARIFA", key: "cveMonedaTarifa", sortable: true, headerProps, },
    { title: "TARIFAACTIVA", key: "tarifaActiva", sortable: true, headerProps },
  ];

  const proporcionPrimasHeaders = [
    { title: "CVECRITERIOASIGPRIMAPROPOR", key: "cveCriterioAsigPrimaPropor", sortable: true, headerProps, },
    { title: "CVEREASEGURADORPRIMAPROPOR", key: "cveReaseguradorPrimaPropor", sortable: true, headerProps, },
    { title: "CVEOPERRAMOPRIMAPROPOR", key: "cveOperRamoPrimaPropor", sortable: true, headerProps, },
    { title: "CVECOBAYEPRIMAPROPOR", key: "cveCobayePrimaPropor", sortable: true, headerProps, },
    { title: "NODIASCUBIERTOS", key: "noDiasCubiertos", sortable: true, headerProps, },
    { title: "PORCENTAJEPRIMAANUAL", key: "porcentajePrimaAnual", sortable: true, headerProps, },
    { title: "PROPORCIONACTIVA", key: "proporcionActiva", sortable: true, headerProps, },
  ];

  const reinstalacionesHeaders = [
    { title: "REINSTALACION", key: "reinstalacion", sortable: true, headerProps, },
    { title: "CVECRITERIOASIGREINSTALACION", key: "cveCriterioAsigReinstalacion", sortable: true, headerProps, },
    { title: "CVEREASEGURADORREINSTALACION", key: "cveReaseguradorReinstalacion", sortable: true, headerProps, },
    { title: "NOREINSTALACION", key: "noReinstalacion", sortable: true, headerProps, },
    { title: "CUOTAAJUSTEREINSTALACION", key: "cuotaAjusteReinstalacion", sortable: true, headerProps, },
    { title: "COSTOREINSTALACION", key: "costoReinstalacion", sortable: true, headerProps, },
    { title: "MONTOREINSTALADO", key: "montoReinstalado", sortable: true, headerProps, },
    { title: "REINSTALACIONACTIVA", key: "reinstalacionActiva", sortable: true, headerProps, },
  ];

  const intermediariosHeaders = [
    { title: "INTERMEDIARIO", key: "intermediario", sortable: true, headerProps, },
    { title: "CVECRITERIOASIGINTERMEDIARIO", key: "cveCriterioAsigIntermediario", sortable: true, headerProps, },
    { title: "CVEREASEGURADORINTERMEDIARIO", key: "cveReaseguradorIntermediario", sortable: true, headerProps, },
    { title: "CVEINTERMEDIARIO", key: "cveIntermediario", sortable: true, headerProps, },
    { title: "CORRETAJE", key: "corretaje", sortable: true, headerProps },
    { title: "CVEASIGNACIONCORRETAJE", key: "cveAsignacionCorretaje", sortable: true, headerProps, },
    { title: "PORCENTAJECORRETAJEFIJO", key: "porcentajeCorretajeFijo", sortable: true, headerProps, },
    { title: "MONTOCORRETAJEFIJO", key: "montoCorretajeFijo", sortable: true, headerProps, },
    { title: "CVELIMCORRETAJE", key: "cveLimCorretaje", sortable: true, headerProps, },
    { title: "PORCENTAJECORRETAJEPROVISIONAL", key: "porcentajeCorretajeProvisional", sortable: true, headerProps, },
    { title: "MONTOCORRETAJEPROVISIONAL", key: "montoCorretajeProvisional", sortable: true, headerProps, },
    { title: "INTERACTIVO", key: "interActivo", sortable: true, headerProps },
  ];

  const corretajesHeaders = [
    { title: "CVEINTERMEDIARIOCORRETAJE", key: "cveIntermediarioCorretaje", sortable: true, headerProps, },
    { title: "CVEREASEGURADORCORRETAJE", key: "cveReaseguradorCorretaje", sortable: true, headerProps, },
    { title: "LIMITEINFCORRETAJE", key: "limiteInfCorretaje", sortable: true, headerProps, },
    { title: "LIMITESUPCORRETAJE", key: "limiteSupCorretaje", sortable: true, headerProps, },
    { title: "PORCENTAJECORRETAJEDEF", key: "porcentajeCorretajeDef", sortable: true, headerProps, },
    { title: "MONTOCORRETAJEDEF", key: "montoCorretajeDef", sortable: true, headerProps, },
    { title: "CORACTIVO", key: "corActivo", sortable: true, headerProps },
  ];

  const administracionPagoHeaders = [
    { title: "CVEFORMAPAGO", key: "cveFormapago", sortable: true, headerProps },
    { title: "PORCENTAJEPAGO", key: "porcentajePago", sortable: true, headerProps, },
    { title: "FECHAPAGO", key: "fechaPago", sortable: true, headerProps },
    { title: "PAGOACTIVO", key: "pagoActivo", sortable: true, headerProps },
  ];

  const administracionEdoHeaders = [
    { title: "CVEPERIODICIDADEDO", key: "cvePeriodicidadEdo", sortable: true, headerProps, },
    { title: "FECHAEDO", key: "fechaEdo", sortable: true, headerProps },
    { title: "EDOACTIVO", key: "edoActivo", sortable: true, headerProps },
  ];

  const administracionBorPrimasHeaders = [
    { title: "CVEPERIODICIDADPRIMAS", key: "cvePeriodicidadPrimas", sortable: true, headerProps, },
    { title: "FECHAPRIMAS", key: "fechaPrimas", sortable: true, headerProps },
    { title: "PRIMASACTIVO", key: "primasActivo", sortable: true, headerProps },
  ];

  const administracionBorSiniestrosHeaders = [
    { title: "CVEPERIODICIDADSINIESTROS", key: "cvePeriodicidadSiniestros", sortable: true, headerProps, },
    { title: "FECHASINIESTROS", key: "fechaSiniestros", sortable: true, headerProps, },
    { title: "SINIESTROSACTIVO", key: "siniestrosActivo", sortable: true, headerProps, },
  ];

  return {
    generalesContratoHeaders,
    generalesContratoMonedaHeader,
    generalesContratoOperaciones,
    detallesProporcionalesHeaders,
    polizasFacultativasHeaders,
    reaseguradoresHeaders,
    comisionesRateOnLineHeaders,
    coberturasHeaders,
    excedentesHeaders,
    cumulosHeaders,
    tarifasHeadrs,
    proporcionPrimasHeaders,
    reinstalacionesHeaders,
    intermediariosHeaders,
    corretajesHeaders,
    administracionPagoHeaders,
    administracionEdoHeaders,
    administracionBorPrimasHeaders,
    administracionBorSiniestrosHeaders,
  };
};
