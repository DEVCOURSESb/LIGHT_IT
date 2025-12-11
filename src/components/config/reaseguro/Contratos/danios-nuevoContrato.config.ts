export const DaniosContratoNuevo = {
  entity: 'clasificacion-cobertura',
  title: 'Clasificación cobertura',
  tableTitle: 'Lista de Clasificación Coberturas',

  headers: [
    { title: 'CLAVE', key: 'cveClasifcober', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'DESCRIPCIÓN', key: 'descClasifcober', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'ACTIVO', key: 'esActivo', sortable: true,
      headerProps: {
        style: 'font-weight: bold',
      },
    },
    { title: 'FECHA DE REGISTRO', key: 'fechaRegistro', sortable: true,
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
}
