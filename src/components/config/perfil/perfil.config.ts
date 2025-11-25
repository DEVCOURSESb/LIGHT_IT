import { PerfilActions } from "@/API/catalogos/perfiles/perfiles.actions";

const actions = PerfilActions();

export const perfilConfig = {
  entity: "perfil",
  title: "Perfiles",
  searchPlaceholder: "perfil",
  addButtonText: "Agregar perfil",
  modalTitle: "Agregar nuevo perfil",
  tableTitle: "Lista de Perfiles",

  headers: [
    { title: "Nombre perfil", key: "nombrePerfil", sortable: true },
    { title: "Accesos", key: "accesos", sortable: true },
    { title: "Fecha Alta", key: "fechaAlta", sortable: true },
    { title: "Usuario Alta", key: "usuarioAlta", sortable: true },
    { title: "Fecha Modificado", key: "fechaModifica", sortable: true },
    { title: "Usuario Modificado", key: "usuarioModifica", sortable: true },
    { title: "Activo", key: "activo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Acciones", key: "actions", sortable: false },
  ],

  fields: [
    {
      name: "id",
      label: "ID",
      type: "text",
      hidden: true,
    },
    {
      name: "nombrePerfil",
      label: "Nombre perfil",
      type: "text",
      required: true,
      dataKey: "nombrePerfil",
    },
    {
      name: "activo",
      label: "Activo",
      type: "select",
      items: ["Sí", "No"],
      required: true,
      dataKey: "activo",
      transformFromAPI: (value: number) => (value === 1 ? "Sí" : "No"),
      transformToAPI: (value: string) => (value === "Sí" ? 1 : 0),
    },
  ],

  validationSchema: {
    nombrePerfil: (value: string) => value?.length >= 2 || "El nombre es requerido",
    activo: (value: string) => !!value || "El campo activo es requerido",
  },

  apiActions: {
    fetch: actions.fetchPerfiles,
    create: actions.createPerfil,
    update: actions.updatePerfil,
    delete: actions.deletePerfil,
  },
};
