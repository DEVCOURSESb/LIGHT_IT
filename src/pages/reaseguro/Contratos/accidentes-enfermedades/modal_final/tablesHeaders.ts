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
    { title: "MUNICIPIO", key: "municipio", sortable: true, headerProps },
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
    { title: "TIPO DE OPERACIÓN / RAMO (DETALLADA)", key: "cveExtCoberDetalles", sortable: true, headerProps, },
    { title: "OPERACIÓN / RAMO (DETALLADA)", key: "cveOperRamoDetalles", sortable: true, headerProps, },
    { title: "PORCENTAJE RETENCIÓN", key: "porcentajeRetencion", sortable: true, headerProps, },
    { title: "PORCENTAJE CESIÓN", key: "porcentajeCesion", sortable: true, headerProps, },
    { title: "MONTO RETENCIÓN", key: "montoRetencion", sortable: true, headerProps, },
    { title: "MONTO RETENCIÓN CONTRATO", key: "montoRetencionContrato", sortable: true, headerProps, },
    { title: "MONTO CESIÓN", key: "montoCesion", sortable: true, headerProps },
    { title: "CAPACIDAD CONTRATO", key: "capacidadContrato", sortable: true, headerProps, },
    { title: "CRITERIO DE CAPACIDAD", key: "cveCriterioAsigCapacidad", sortable: true, headerProps, },
    { title: "DISTRIBUCIÓN DE LA CESIÓN", key: "cveDistrCesion", sortable: true, headerProps, },
    { title: "MONEDA DETALLES", key: "cveMonedaDetalles", sortable: true, headerProps, },
    { title: "CÚMULOS", key: "cumulos", sortable: true, headerProps },
    { title: "ACTIVO", key: "detalleActivo", sortable: true, headerProps, },
  ];

  const polizasFacultativasHeaders = [
    { title: "NO. PÓLIZA", key: "noPoliza", sortable: true, headerProps },
    { title: "ACTIVA", key: "polActiva", sortable: true, headerProps },
  ];

  const reaseguradoresHeaders = [
    { title: "REASEGURADOR", key: "cveReasegurador", sortable: true, headerProps, },
    { title: "PARTICIPACIÓN", key: "participacion", sortable: true, headerProps, },
    { title: "OTORGA PTU", key: "otorgaPtu", sortable: true, headerProps },
    { title: "PORCENTAJE PTU", key: "porcentajePtu", sortable: true, headerProps, },
    { title: "PTU", key: "cvePtu", sortable: true, headerProps },
    { title: "PORCENTAJE K", key: "porcentajeK", sortable: true, headerProps },
    { title: "GASTOS", key: "gastos", sortable: true, headerProps },
    { title: "AÑOS ARRASTRE", key: "aniosArrastre", sortable: true, headerProps, },
    { title: "COMISION / RATE ON LINE", key: "comisRolReaseguro", sortable: true, headerProps, },
    { title: "TIPO DE COMISION / RATE ON LINE", key: "cveAsignacionComisRol", sortable: true, headerProps, },
    { title: "FÓRMULA COMISIÓN / RATE ON LINE", key: "cveCalcomis", sortable: true, headerProps },
    { title: "COMISIÓN / RATE ON LINE FIJAA", key: "comisRolFija", sortable: true, headerProps },
    { title: "COMISIÓN / RATE ON LINE PROVISIONAL", key: "comisRolProvisional", sortable: true, headerProps, },
    { title: "COMISIÓN / RATE ON LINE MÍNIMA", key: "comisRolMin", sortable: true, headerProps },
    { title: "COMISIÓN / RATE ON LINE MÁXIMA", key: "comisRolMax", sortable: true, headerProps },
    { title: "CAPA", key: "capa", sortable: true, headerProps },
    { title: "PRIORIDAD", key: "prioridad", sortable: true, headerProps },
    { title: "LIM. RESPONSABILIDAD", key: "limResponsabilidad", sortable: true, headerProps, },
    { title: "LIM. AGREGADO", key: "limAgregado", sortable: true, headerProps },
    { title: "TIPO LIMITE AGREGADO", key: "cveCriterioAsigLimAgregado", sortable: true, headerProps, },
    { title: "TIPO DE COSTO", key: "cveAsignacionCosto", sortable: true, headerProps, },
    { title: "COSTO FIJO", key: "costoFijo", sortable: true, headerProps },
    { title: "PRIMA MÍNIMA Y DE DEPOSITO", key: "pmd", sortable: true, headerProps },
    { title: "PRIMA MÍNIMA", key: "primaMin", sortable: true, headerProps },
    { title: "PRIMA MÁXIMA", key: "primaMax", sortable: true, headerProps },
    { title: "FAC.AJUSTE DIVIDENDO", key: "facAjusteDividendo", sortable: true, headerProps, },
    { title: "FAC.AJUSTE DIVISOR", key: "facAjusteDivisor", sortable: true, headerProps, },
    { title: "NO. CLAIMS", key: "noClaims", sortable: true, headerProps },
    { title: "ACTIVA", key: "reasegActiva", sortable: true, headerProps },
  ];

  const comisionesRateOnLineHeaders = [
    { title: "REASEGURADOR", key: "cveReaseguradorComisRol", sortable: true, headerProps, },
    { title: "LIM. INFERIOR", key: "limiteInf", sortable: true, headerProps },
    { title: "LIM. SUPERIOR", key: "limiteSup", sortable: true, headerProps },
    { title: "COMISIÓN / RATE ON LINE DEFINITIVO", key: "comisRolDefinitiva", sortable: true, headerProps, },
    { title: "ACTIVA", key: "comisRolActiva", sortable: true, headerProps, },
  ];

  const coberturasHeaders = [
    { title: "ASIGNACIÓN DE COBERTURAS", key: "cveCriterioAsigCobertura", sortable: true, headerProps, },
    { title: "REASEGURADORA", key: "cveReaseguradorCobertura", sortable: true, headerProps, },
    { title: "OPERACIÓN / RAMO", key: "cveOperRamoCobertura", sortable: true, headerProps, },
    { title: "COBERTURA", key: "cveCobaye", sortable: true, headerProps },
    { title: "¿PROPIA SUMA ASEGURADA MÁXIMA?", key: "propiaSaMax", sortable: true, headerProps },
    { title: "SUMA ASEGURADA MÁXIMA", key: "saMax", sortable: true, headerProps },
    { title: "COBERTURA BASICA", key: "cobBasica", sortable: true, headerProps },
    { title: "ACTIVA", key: "coberActiva", sortable: true, headerProps },
  ];

  const excedentesHeaders = [
    { title: "ASIGNACIÓN DE CAPA", key: "cveCriterioAsigCapa", sortable: true, headerProps, },
    { title: "COBERTURA", key: "cveCobayeCapa", sortable: true, headerProps, },
    { title: "NO. CAPA", key: "noCapa", sortable: true, headerProps },
    { title: "RETENCIÓN CAPA", key: "retencionCapa", sortable: true, headerProps, },
    { title: "CESIÓN CAPA", key: "cesionCapa", sortable: true, headerProps },
    { title: "ACTIVA", key: "capaActiva", sortable: true, headerProps },
  ];

  const cumulosHeaders = [
    { title: "OPERACIÓN / RAMO", key: "cveOperRamoCumulo", sortable: true, headerProps, },
    { title: "NO. CAPA", key: "numCapa", sortable: true, headerProps },
    { title: "MONTO CÚMULO", key: "montoCumulo", sortable: true, headerProps },
    { title: "ACTIVO", key: "cumuloActivo", sortable: true, headerProps },
  ];

  const tarifasHeadrs = [
    { title: "ASIGNACIÓN DE TARIFA", key: "cveCriterioAsigTarifa", sortable: true, headerProps, },
    { title: "REASEGURADOR", key: "cveReaseguradorTarifa", sortable: true, headerProps, },
    { title: "OPERACIÓN / RAMO", key: "cveOperRamoTarifa", sortable: true, headerProps, },
    { title: "COBERTURA", key: "cveCobayeTarifa", sortable: true, headerProps, },
    { title: "TIPO DE TARIFA", key: "cveTarifa", sortable: true, headerProps },
    { title: "PRIMA DE TARIFA FIJA", key: "primaTarifaReaseg", sortable: true, headerProps, },
    { title: "PORCENTAJE SOBRE PRIMA EMITIDA", key: "porcentajePrimaEmi", sortable: true, headerProps, },
    { title: "TARIFA MILLAR", key: "tarifaMillar", sortable: true, headerProps },
    { title: "EDAD", key: "edad", sortable: true, headerProps },
    { title: "SEXO", key: "cveSexo", sortable: true, headerProps },
    { title: "¿PROPORCIÓN POR DÍAS DE VIGENCIA?", key: "proporcionDias", sortable: true, headerProps, },
    { title: "MONEDA TARIFA", key: "cveMonedaTarifa", sortable: true, headerProps, },
    { title: "ACTIVA", key: "tarifaActiva", sortable: true, headerProps },
  ];

  const proporcionPrimasHeaders = [
    { title: "ASIGNACIÓN DE PROPORCIÓN DE PRIMA", key: "cveCriterioAsigPrimaPropor", sortable: true, headerProps, },
    { title: "REASEGURADORA", key: "cveReaseguradorPrimaPropor", sortable: true, headerProps, },
    { title: "OPERACIÓN / RAMO", key: "cveOperRamoPrimaPropor", sortable: true, headerProps, },
    { title: "COBERTURA", key: "cveCobayePrimaPropor", sortable: true, headerProps, },
    { title: "NO. DIAS CUBIERTOS", key: "noDiasCubiertos", sortable: true, headerProps, },
    { title: "PORCENTAJE PRIMA ANUAL", key: "porcentajePrimaAnual", sortable: true, headerProps, },
    { title: "ACTIVA", key: "proporcionActiva", sortable: true, headerProps, },
  ];

  const reinstalacionesHeaders = [
    { title: "¿REINSTALACIÓN?", key: "reinstalacion", sortable: true, headerProps, },
    { title: "ASIGNACIÓN DE REINSTALACIÓN", key: "cveCriterioAsigReinstalacion", sortable: true, headerProps, },
    { title: "CVEREASEGURADREASEGURADORAORREINSTALACION", key: "cveReaseguradorReinstalacion", sortable: true, headerProps, },
    { title: "NO. REINSTALACIÓN", key: "noReinstalacion", sortable: true, headerProps, },
    { title: "CUOTA DE AJUSTE", key: "cuotaAjusteReinstalacion", sortable: true, headerProps, },
    { title: "COSTO REINSTALACIÓN", key: "costoReinstalacion", sortable: true, headerProps, },
    { title: "MONTO REINSTALADO", key: "montoReinstalado", sortable: true, headerProps, },
    { title: "ACTIVA", key: "reinstalacionActiva", sortable: true, headerProps, },
  ];

  const intermediariosHeaders = [
    { title: "¿INTERMEDIARIO?", key: "intermediario", sortable: true, headerProps, },
    { title: "ASIGNACIÓN DE INTERMEDIARIO", key: "cveCriterioAsigIntermediario", sortable: true, headerProps, },
    { title: "REASEGURADOR", key: "cveReaseguradorIntermediario", sortable: true, headerProps, },
    { title: "INTERMEDIARIO", key: "cveIntermediario", sortable: true, headerProps, },
    { title: "¿CORRETAJE?", key: "corretaje", sortable: true, headerProps },
    { title: "ASIGNACIÓN CORRETAJE", key: "cveAsignacionCorretaje", sortable: true, headerProps, },
    { title: "PORCENTAJE CORRETAJE FIJO", key: "porcentajeCorretajeFijo", sortable: true, headerProps, },
    { title: "MONTO CORRETAJE FIJO", key: "montoCorretajeFijo", sortable: true, headerProps, },
    { title: "LIM. CORRETAJE", key: "cveLimCorretaje", sortable: true, headerProps, },
    { title: "PORCENTAJE CORRETAJE PROVISIONAL", key: "porcentajeCorretajeProvisional", sortable: true, headerProps, },
    { title: "MONTO CORRETAJE PROVISIONAL", key: "montoCorretajeProvisional", sortable: true, headerProps, },
    { title: "ACTIVO", key: "interActivo", sortable: true, headerProps },
  ];

  const corretajesHeaders = [
    { title: "INTERMEDIARIO", key: "cveIntermediarioCorretaje", sortable: true, headerProps, },
    { title: "REASEGURADOR", key: "cveReaseguradorCorretaje", sortable: true, headerProps, },
    { title: "LIM. INFERIOR", key: "limiteInfCorretaje", sortable: true, headerProps, },
    { title: "LIM. SUPERIOR", key: "limiteSupCorretaje", sortable: true, headerProps, },
    { title: "PORCENTAJE CORRETAJE", key: "porcentajeCorretajeDef", sortable: true, headerProps, },
    { title: "MONTO CORRETAJE DEFINITIVO", key: "montoCorretajeDef", sortable: true, headerProps, },
    { title: "ACTIVO", key: "corActivo", sortable: true, headerProps },
  ];

  const administracionPagoHeaders = [
    { title: "FORMA PAGO", key: "cveFormapago", sortable: true, headerProps },
    { title: "PORCENTAJE PAGO", key: "porcentajePago", sortable: true, headerProps, },
    { title: "FECHA PAGO", key: "fechaPago", sortable: true, headerProps },
    { title: "ACTIVO", key: "pagoActivo", sortable: true, headerProps },
  ];

  const administracionEdoHeaders = [
    { title: "PERIODICIDAD ESTADO DE CUENTA", key: "cvePeriodicidadEdo", sortable: true, headerProps, },
    { title: "FECHA", key: "fechaEdo", sortable: true, headerProps },
    { title: "ACTIVO", key: "edoActivo", sortable: true, headerProps },
  ];

  const administracionBorPrimasHeaders = [
    { title: "PERIODICIDAD PRIMAS", key: "cvePeriodicidadPrimas", sortable: true, headerProps, },
    { title: "FECHA", key: "fechaPrimas", sortable: true, headerProps },
    { title: "ACTIVA", key: "primasActivo", sortable: true, headerProps },
  ];

  const administracionBorSiniestrosHeaders = [
    { title: "PERIODICIDAD SINIESTROS", key: "cvePeriodicidadSiniestros", sortable: true, headerProps, },
    { title: "FECHA SINIESTROS", key: "fechaSiniestros", sortable: true, headerProps, },
    { title: "ACTIVO", key: "siniestrosActivo", sortable: true, headerProps, },
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
