import { ref } from "vue";

export const useReaseguradores = () => {
  const search = ref("");

  const headers = [
    { title: "Clave", key: "cveReasegurador", sortable: true },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Extranjero", key: "extranjero", sortable: true },
    { title: "Fecha registro", key: "fechaRegistro", sortable: true },
    { title: "Nombre reasegurador", key: "nombreReasegurador", sortable: true },
    { title: "Registro CNSF", key: "registroCnsf", sortable: true },
  ];

  const reaseguradores = ref([
    {
      id: 1,
      cveReasegurador: 1,
      esActivo: 1,
      extranjero: 0,
      fechaRegistro: "2002-12-01",
      nombreReasegurador: "nombre de reasegurador",
      registroCnsf: "IBJSODKC"
    },
  ]);

  return {
    search,
    headers,
    reaseguradores
  };
};
