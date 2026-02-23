export const useComisionesRateOnLine = () => {


  const handleFileUpload = () => {
    const element = document.querySelector("#file-input");
    if (element) {
      (element as HTMLInputElement).click();
    }
  };

  const headerProps = { style: "font-weight: bold" };
  const tableHeaders = [
    { title: "Reaseguradora", key: "nombreReasegurador", sortable: true, headerProps, },
    { title: "Límite inferior", key: "participacion", sortable: true, headerProps, },
    { title: "Límite superior", key: "comisRolReaseguro", sortable: true, headerProps, },
    { title: "Comisión / rate on line definitivo", key: "limResponsabilidad", sortable: true, headerProps, },
    { title: "Activo", key: "reasegActiva", sortable: true, headerProps },
    { title: "Editar", key: "editar", sortable: false, headerProps },
  ];

  return {
    tableHeaders,
    handleFileUpload
  };
};
