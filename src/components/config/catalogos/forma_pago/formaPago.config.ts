import { FormaPagoActions } from '@/API/catalogos/forma_pago/forma_pago.actions'
import { handleValidations } from '@/utils/validations/handleValidations';

const actions = FormaPagoActions();
const { minMaxString, validateBoolean, transformToUpperCase, transformBooleanToNumber, transformNumberToBoolean } = handleValidations();

export const FormaPagoConfig = {
  entity: 'formaPago',
  title: 'Forma pago',
  searchPlaceholder: '',
  addButtonText: '',
  modalTitle: 'Agregar nueva Forma pago',
  editModalTitle: "Editar forma de pago",
  tableTitle: 'Lista de formas de pago',

  headers: [
    { title: 'CLAVE', key: 'cveFormaPago', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
      },
      /*{ title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },*/
    { title: 'DESCRIPCIÓN DE FORMA DE PAGO', key: 'descFormaPago', sortable: true,
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
    /* {
      name: 'cveFormaPago',
      label: 'Clave',
      type: 'number',
      required: true,
      dataKey: 'cveFormaPago',
      defaultValue: 0,
    }, */
    {
      name: 'descFormaPago',
      label: 'Descripción',
      type: 'text',
      required: true,
      dataKey: 'descFormaPago',
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
    // alfanumerico, max 100 chars.
    descFormaPago: (value: string) => minMaxString(value, 1, 1000) || 'El nombre es requerido y mínimo de 1 y máximo de 1000 caracteres.',
    esActivo: (value: boolean) => validateBoolean(value) || 'El campo activo es requerido',
  },

  apiActions: {
    fetch: actions.fetch,
    create: actions.create,
    update: actions.update,
    delete: actions.deletes,
  },
}
