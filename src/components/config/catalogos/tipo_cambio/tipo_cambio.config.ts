// tipo_cambio.config.ts
import { TipoCambioActions } from "@/API/catalogos/tipo_cambio/tipo_cambio.actions";
import { MonedaActions } from "@/API/catalogos/monedas/moneda.actions";
import type { Moneda } from "@/API/catalogos/monedas/moneda.interfaces";
import { validationsHandler } from "@/utilities/validations/validationsHandler";
import { ref, computed } from "vue";

export const useTipoCambioConfig = () => {
  const actions = TipoCambioActions();
  const monedaActions = MonedaActions();
  const { transformBooleanToNumber, transformNumberToBoolean } = validationsHandler();

  const monedaMap = new Map<number, string>();
  const monedaItems = ref<Array<{ text: string; value: number }>>([]);
  const isLoading = ref(true);

  const loadMonedas = async () => {
    if (monedaMap.size === 0) {
      const monedas: Moneda[] = await monedaActions.fetchMonedas();
      monedas.forEach((m) => {
        monedaMap.set(m.cveMoneda, m.descMoneda);
      });

      monedaItems.value = Array.from(monedaMap.entries()).map(
        ([key, value]) => ({
          text: value,
          value: key,
        })
      );

      console.log("Monedas cargadas:", monedaItems.value);
      isLoading.value = false;
    }
  };

  loadMonedas();

  const fetchWithMonedaDesc = async () => {
    await loadMonedas();
    const data = await actions.fetch();

    return data.map((row: any) => ({
      ...row,
      cveMonedaOrigen:
        monedaMap.get(row.cveMonedaOrigen) ?? row.cveMonedaOrigen,
    }));
  };

  const tipoCambioConfig = computed(() => ({
    entity: "tipoCambio",
    title: "Tipo de Cambio",
    searchPlaceholder: "",
    addButtonText: "",
    modalTitle: "Agregar nuevo tipo cambio",
    editModalTitle: "Editar tipo de cambio",
    tableTitle: "Lista de Tipo Cambio",

    headers: [
      {
        title: "FECHA",
        key: "fecha",
        sortable: true,
        headerProps: { style: "font-weight: bold" },
      },
      {
        title: "DESCRIPCIÓN DE MONEDA ORIGEN",
        key: "cveMonedaOrigen",
        sortable: true,
        headerProps: { style: "font-weight: bold" },
      },
      {
        title: "TIPO DE CAMBIO",
        key: "tipoCambio",
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
        name: "cveMonedaOrigen",
        label: "Moneda Origen",
        type: "select",
        items: monedaItems.value.map((item) => (item.value + "| " + item.text)),
        required: true,
        dataKey: "cveMonedaOrigen",
        defaultValue: 0,
        transformToAPI: (value: string) => {
          const [key] = value.split("|").map((part) => part.trim());
          return Number(key);
        },
      },
      {
        name: "tipoCambio",
        label: "Tipo de Cambio",
        type: "decimal",
        required: true,
        dataKey: "tipoCambio",
      },
      {
        name: "esActivo",
        label: "Activo",
        type: "Checkbox",
        required: true,
        dataKey: "esActivo",
        displayType: "checkbox",
        defaultValue: true,
        transformFromAPI: (value: number) => transformNumberToBoolean(value),
        transformToAPI: (value: boolean) => transformBooleanToNumber(value),
      },
    ],

    validationSchema: {
      cveMonedaOrigen: (value: string) => !!value || "La moneda origen es requerida.",
      tipoCambio: (value: number) => {
        const numValue = Number(value);
        return numValue > 0 || "El tipo de cambio debe ser mayor a 0.";
      },
      esActivo: (value: boolean) =>
        value !== undefined || "El campo activo es requerido",
    },

    apiActions: {
      fetch: fetchWithMonedaDesc,
      create: actions.create,
      update: actions.update,
      delete: actions.deletes,
    },
  }));

  return {
    tipoCambioConfig,
    isLoading,
  };
};
