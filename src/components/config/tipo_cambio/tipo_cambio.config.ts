import { TipoCambioActions } from "@/API/catalogos/tipo_cambio/tipo_cambio.actions";
import { MonedaActions } from "@/API/catalogos/monedas/moneda.actions";
import type { Moneda } from "@/API/catalogos/monedas/moneda.interfaces";

const actions = TipoCambioActions();
const monedaActions = MonedaActions();

let monedaMap = new Map<number, string>();

const loadMonedas = async () => {
  if (monedaMap.size === 0) {
    const monedas: Moneda[] = await monedaActions.fetchMonedas();
    monedas.forEach(m =>
      monedaMap.set(m.cveMoneda, m.descMoneda)
    );
  }
};

const fetchWithMonedaDesc = async () => {
  await loadMonedas();

  const data = await actions.fetch();

  return data.map((row: any) => ({
    ...row,
    cveMonedaOrigen:
      monedaMap.get(row.cveMonedaOrigen) ?? row.cveMonedaOrigen,
  }));
};

export const tipoCambioConfig = {
  entity: "tipoCambio",
  title: "Tipo de Cambio",
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
      label: "Clave",
      type: "number",
      required: true,
      dataKey: "cveMonedaOrigen",
    },
    {
      name: "tipoCambio",
      label: "Tipo de Cambio",
      type: "decimal",
      required: true,
      dataKey: "tipoCambio",
    },
  ],

  apiActions: {
    fetch: fetchWithMonedaDesc,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
};
