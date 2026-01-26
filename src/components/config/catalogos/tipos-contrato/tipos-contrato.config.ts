import { TiposContratoActions } from "@/API/catalogos/tipos-contrato/tipos-contrato.actions";
import { validationsHandler } from "@/utilities/validations/validationsHandler";
import type { TipoReaseguro } from "@/API/catalogos/tipo-reaseguro/tipo-reaseguro.interfaces";
import { TipoReaseguroActions } from "@/API/catalogos/tipo-reaseguro/tipo-reaseguro.actions";
import { ref } from "vue";

const actions = TiposContratoActions();
const tipoReasegAction = TipoReaseguroActions();
const { minMax, minMaxString, validateBoolean, transformBooleanToNumber, transformNumberToBoolean, transformToUpperCase } = validationsHandler();

const tipoReaseMap = new Map<number, string>();
const tipoReasegItems = ref<Array<{ text: string; value: number }>>([]);
const isLoading = ref(true);

const loadTipoReaseg = async () => {
  if (tipoReaseMap.size === 0) {
    try {
      const dataReaseguro: TipoReaseguro[] = await tipoReasegAction.fetchTipoReaseguro();

      dataReaseguro.forEach((m) => {
        tipoReaseMap.set(m.cveTreaseg, m.descTreaseg);
      });

      tipoReasegItems.value = dataReaseguro.map((m) => ({
        text: m.descTreaseg,
        value: m.cveTreaseg,
      }));

    } catch (error) {
      console.error("Error cargando catálogo de reaseguro:", error);
    } finally {
      isLoading.value = false;
    }
  }
};

const fetchTransformado = async () => {
  await loadTipoReaseg();

  const data = await actions.fetchTipoContratos();

  return data.map((row: any) => ({
    ...row,
    cveTreasegRaw: row.cveTreaseg,
    cveTreaseg: tipoReaseMap.get(row.cveTreaseg) ?? `Clave: ${row.cveTreaseg}`,
  }));
};

export const tiposContratoConfig = {
  entity: "tipos-contrato",
  title: "Tipos de Contrato",
  searchPlaceholder: "Buscar tipo de contrato...",
  addButtonText: "Agregar tipo de contrato",
  modalTitle: "Agregar nuevo tipo de contrato",
  editModalTitle: "Editar tipo de contrato",
  tableTitle: "Lista de tipos de contrato",

  headers: [
    {
      title: "CLAVE",
      key: "cveTcontrato",
      sortable: true,
      headerProps: { style: "font-weight: bold" },
    },
    {
      title: "TIPO DE CONTRATO",
      key: "descTcontrato",
      sortable: true,
      headerProps: { style: "font-weight: bold" },
    },
    {
      title: "TIPO REASEGURO",
      key: "cveTreaseg",
      sortable: true,
      headerProps: { style: "font-weight: bold" },
    },
    {
      title: "ACTIVO",
      key: "esActivo",
      sortable: true,
      headerProps: { style: "font-weight: bold" },
    },
    {
      title: "ACCIONES",
      key: "actions",
      sortable: false,
      headerProps: { style: "font-weight: bold" },
    },
  ],

  fields: [
    {
      name: "id",
      label: "ID",
      type: "text",
      hidden: true,
    },
    {
      name: "cveTcontrato",
      label: "Clave Tipo Contrato",
      type: "number",
      required: true,
      dataKey: "cveTcontrato",
      defaultValue: 0,
    },
    {
      name: "cveTreaseg",
      label: "Tipo de Reaseguro",
      type: "number",
      required: true,
      dataKey: "cveTreaseg",
      defaultValue: null,
      options: tipoReasegItems,
    },
    {
      name: "descTcontrato",
      label: "Descripción tipo contrato",
      type: "text",
      required: true,
      dataKey: "descTcontrato",
      defaultValue: "",
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: "esActivo",
      label: "Activo",
      type: "Checkbox",
      required: true,
      dataKey: "esActivo",
      defaultValue: true,
      displayType: "checkbox",
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    cveTcontrato: (value: number) => minMax(value, 1, 999) || "La clave es requerida.",
    cveTreaseg: (value: any) => !!value || "El tipo de reaseguro es requerido",
    descTcontrato: (value: string) => minMaxString(value, 1, 100) || "La descripción es requerida",
    esActivo: (value: boolean) => validateBoolean(value) || "El campo activo es requerido",
  },

  apiActions: {
    fetch: fetchTransformado,
    create: actions.createTipoContrato,
    update: actions.updateTipoContrato,
    delete: actions.deleteTipoContrato,
  },
};
