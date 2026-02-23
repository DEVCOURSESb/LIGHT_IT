export const useProporcionPrima = () => {
  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "Reaseguradora", key: "nombreReasegurador", sortable: true, headerProps, },
    { title: "Operación / ramo", key: "participacion", sortable: true, headerProps, },
    { title: "Cobertura", key: "comisRolReaseguro", sortable: true, headerProps, },
    { title: "Número de días cubiertos", key: "limResponsabilidad", sortable: true, headerProps, },
    { title: "% prima anual", key: "limResponsabilidad", sortable: true, headerProps, },
    { title: "Activo", key: "reasegActiva", sortable: true, headerProps },
    { title: "Editar", key: "editar", sortable: false, headerProps },
  ];

  return {
    tableHeaders,
  };
};
