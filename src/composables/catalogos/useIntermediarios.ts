import { IntermediariosActions } from "@/API/catalogos/intermediarios/intermediariosActions";
import { ref } from "vue";

export const useIntermediarios = () => {
  const { fetchIntermediarios } = IntermediariosActions();

  const getIntermediarios = async () => fetchIntermediarios();

  const headers = [
    { title: "ID", key: "id", sortable: true },
    { title: "Clave intermediario", key: "cveIntermediario", sortable: true },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Nombre intermediario", key: "nombreIntermediario", sortable: false, },
    { title: "Acciones", key: "actions", sortable: false },
  ];

  const intermediarios = ref([
    {
      id: 1,
      cveIntermediario: "cve-1",
      esActivo: 1,
      fechaRegistro: "2025-11-04",
      nombreIntermediario: "nombre kmk",
    },
    {
      id: 2,
      cveIntermediario: "cvea-2",
      esActivo: 1,
      fechaRegistro: "2025-11-04",
      nombreIntermediario: "nombre kmk",
    },
    {
      id: 3,
      cveIntermediario: "cvez-3",
      esActivo: 1,
      fechaRegistro: "2025-11-04",
      nombreIntermediario: "nombre kmk",
    },
  ]);

  return {
    getIntermediarios,
    headers,
    intermediarios,
  };
};
