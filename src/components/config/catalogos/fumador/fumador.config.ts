import { FumadorActions } from "@/API/catalogos/fumador/fumador.actions"
import { handleValidations } from "@/utils/validations/handleValidations";

const actions = FumadorActions();
const { minMaxString, validateBoolean, transformToUpperCase, transformBooleanToNumber, transformNumberToBoolean } = handleValidations();

export const FumadorConfig = {
  entity: 'Fumador',
  title: 'Fumador',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo Fumador',
  editModalTitle: 'Editar Fumador',
  tableTitle: 'Lista de fumadores',

  headers: [
    { title: 'CLAVE', key: 'cveFumador', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    /* { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    }, */
    { title: 'DESCRIPCIÓN', key: 'descFumador', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: "ACCIONES", key: "actions", sortable: false,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
  ],

  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      hidden: true,
    },
    {
      name: 'cveFumador',
      label: 'Clave',
      type: 'text',
      required: true,
      dataKey: 'cveFumador',
      defaultValue: 0,
    },
    {
      name: 'descFumador',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descFumador',
      transformToAPI: (value: string) => transformToUpperCase(value),
    },
    {
      name: 'esActivo',
      label: 'Activo',
      type: 'Checkbox',
      required: true,
      dataKey: 'esActivo',
      displayType: 'checkbox',
      defaultValue: true,
      transformFromAPI: (value: number) => transformNumberToBoolean(value),
      transformToAPI: (value: boolean) => transformBooleanToNumber(value),
    },
  ],

  validationSchema: {
    // numerico, 3 digitos max,
    cveFumador: (value: string) => minMaxString(value, 1, 1) || 'La clave es requerida, mayor a 0 y máximo 1 dígitos.',
    // alfanumerico, max 100 chars.
    descFumador: (value: string) => minMaxString(value, 1, 1000) || 'El nombre es requerido y mínimo de 1 y máximo de 1000 caracteres.',
    esActivo: (value: boolean) => validateBoolean(value) || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
