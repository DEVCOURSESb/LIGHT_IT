const headerProps = { style: "font-weight: bold" };

export const tablesHaders = () => {
  const generalesContratoHeaders = [
    { title: "idContrato", key: "idContrato", sortable: true, headerProps },
    { title: "fechaInicioContrato", key: "fechaInicioContrato", sortable: true, headerProps, },
    { title: "fechaFinContrato", key: "fechaFinContrato", sortable: true, headerProps, },
    { title: "ordenCobertura", key: "ordenCobertura", sortable: true, headerProps, },
    { title: "cveTreaseg", key: "cveTreaseg", sortable: true, headerProps },
    { title: "idTcontrato", key: "idTcontrato", sortable: true, headerProps },
    { title: "cveFcontrac", key: "cveFcontrac", sortable: true, headerProps },
    { title: "cveCriterioCob", key: "cveCriterioCob", sortable: true, headerProps, },
    { title: "traspasoCartera", key: "traspasoCartera", sortable: true, headerProps, },
    { title: "cveEntidad", key: "cveEntidad", sortable: true, headerProps },
    { title: "municipio", key: "municipio", sortable: true, headerProps },
    { title: "cveSector", key: "cveSector", sortable: true, headerProps },
    { title: "asegurado", key: "asegurado", sortable: true, headerProps },
    { title: "negociosCubiertos", key: "negociosCubiertos", sortable: true, headerProps, },
    { title: "contratoActivo", key: "contratoActivo", sortable: true, headerProps, },
    /* stas ya no existen */
    { title: "cveMonedaContrato", key: "cveMonedaContrato", sortable: true, headerProps, },
    { title: "cveExtCoberContrato", key: "cveExtCoberContrato", sortable: true, headerProps, },
    { title: "cveOperRamo", key: "cveOperRamo", sortable: true, headerProps },
  ];
  return {
    generalesContratoHeaders,
  };
};
