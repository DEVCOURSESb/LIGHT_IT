import { ref } from "vue";

export const useOperacionesRamos = () => {
  const headers = [
    { title: "Clave cobertura", key: "cveCobertura", sortable: true },
    { title: "Clave extra cobertura", key: "cveExtCober", sortable: true },
    { title: "Descripción", key: "descOperacionRamos", sortable: true },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Operación", key: "operacion", sortable: false },
    { title: "Ramo", key: "ramo", sortable: false },
    { title: "Subramo", key: "subramo", sortable: false },
    { title: "Subsubramo", key: "subsubramo", sortable: false },
    { title: "Acciones", key: "actions", sortable: false },
  ];

  const OperacionesRamos = ref([
    {
      id: 1,
      cveCobertura: "1931",
      cveExtCober: "3",
      descOperacionRamos: "POR OBRA",
      esActivo: 1,
      fechaRegistro: "2025-11-04 08:56:21.05",
      operacion: "4000",
      ramo: "190",
      subramo: "193",
      subsubramo: "1931",
    },
  ]);

  return {
    headers,
    OperacionesRamos,
  };
};
