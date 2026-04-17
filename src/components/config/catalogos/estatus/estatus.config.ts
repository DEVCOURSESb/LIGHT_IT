import { EstatusActions } from "@/API/catalogos/estatus/estatus.actions";
import { handleValidations } from "@/utils/validations/handleValidations";


const actions = EstatusActions();
const { minMaxString, validateBoolean, transformToUpperCase, transformBooleanToNumber, transformNumberToBoolean } = handleValidations();

export const EstatusConfig = {
  entity: 'Estatus',
  title: 'Estatus',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nuevo estatus',
  editModalTitle: 'Editar estatus',
  tableTitle: 'Lista de estatus',

  headers: [
    { title: 'CLAVE', key: 'cveEstatus', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    /*{ title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
    headerProps: {
      style: 'font-weight: bold',
    },
  },
  */
    { title: 'DESCRIPCIÓN DE ESTATUS', key: 'descEstatus', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACCIONES', key: 'actions', sortable: false,
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
      name: 'cveEstatus',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveEstatus',
      defaultValue: 0,
    },
    {
      name: 'descEstatus',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descEstatus',
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
    // cveEstatus: (value: number) => !!value && value <= 999 || 'La clave es requerida, mayor a 0 y máximo 3 dígitos.',
    // alfanumerico, max 100 chars.
    descEstatus: (value: string) => minMaxString(value, 1, 1000) || 'El nombre es requerido y mínimo de 1 y máximo de 1000 caracteres.',
    esActivo: (value: boolean) => validateBoolean(value) || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
