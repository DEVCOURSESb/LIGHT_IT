<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Vida', 'Visualizar contrato']" />
    <v-card-title class="d-flex align-center">
      Visualizar Contrato Vida
    </v-card-title>
    <v-spacer class="mb-4" />
    <v-row justify="end">
      <v-col cols="5" md="5">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar contrato"
          single-line
          hide-details
          class="mb-4"
          variant="solo-filled"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-data-table
        :headers="headers"
        :items="itemTablasDtG"
        :custom-filter="filtrarBusqueda"
        :search="search"
        item-value="title"
        striped="even"
      >
        <template #item.acciones="{ item }">
          <v-btn icon color="blue" variant="text" size="small" @click="visualizarDatosContrato(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router';
  import { BaseAPI } from '@/API/BaseAPI';
  import { onMounted, ref } from 'vue';
  import { format, parseISO } from 'date-fns';
  import { NuevoContratoVida } from './NuevoContratoVida/NuevoContratoDG.actions';

  const {
    subramoOptions, fetchSubramos
  } = NuevoContratoVida()

  onMounted(async () => {
    await Promise.all([
      fetchSubramos()
    ])
  })

  const itemTablasDtG = ref<any[]>([])
  const search = ref('')

  const apiDatosContrato = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/DatosContratoRest', isBase: true, isPrivate: true });

  const headers = [
    { title: 'SUBRAMO',  key: 'subRamo', headerProps: {
        style: "font-weight: bold",
      }
    },
    { title: 'FORMA CONTRACTUAL',  key: 'cveFContrac', headerProps: {
        style: "font-weight: bold",
      }
    },
    { title: 'IDENTIFICADOR DEL CONTRATO',  key: 'idContrato', headerProps: {
        style: "font-weight: bold",
      }
    },
    { title: 'FECHA INICIO CONTRATO',  key: 'fechaInicioContrato', headerProps: {
        style: "font-weight: bold",
      }
    },
    { title: 'FECHA FIN CONTRATO',  key: 'fechaFinContrato', headerProps: {
        style: "font-weight: bold",
      }
    },
    { title: 'CONTRATO PRORROGADO',  key: 'contratoProrrogado', headerProps: {
        style: "font-weight: bold",
      }
    },
    { title: 'FECHA PRORROGA',  key: 'fechaFinProrrogada', headerProps: {
        style: "font-weight: bold",
      }
    },
    { title: 'ACCIONES',  key: 'acciones', headerProps: {
        style: "font-weight: bold",
      }
    },

  ]

  const normalizarFecha = (fecha: string | undefined | null): string => {
    if (!fecha) return ''
    return format(parseISO(fecha), 'dd/MM/yyyy');
  }

  const cargarDatosContrato = async () => {
    try {
      const response = await apiDatosContrato.post('getAllRecords');

      if (response.data) {
        const mapaNombres: Record<string, string> = {};

        subramoOptions.value.forEach((opt: { title: string; value: string }) => {
          mapaNombres[opt.value] = opt.title;
        });

        itemTablasDtG.value = response.data.map((t: any) => ({
          subRamo: t.subRamo
            ? t.subRamo
                .split('-')
                .map((clave: string) => mapaNombres[clave.trim()] || clave)
                .join(', ')
            : '',

          cveFContrac: (t.cveFContrac == 0) ? 'AUTOMATICO' : 'FACULTATIVO',
          idContrato: t.idContrato,
          fechaInicioContrato: normalizarFecha(t.fechaInicioContrato),
          fechaFinContrato: normalizarFecha(t.fechaFinContrato),
          contratoProrrogado: t.contratoProrrogado === 1 ? 'SI' : 'NO',
          fechaFinProrrogada: normalizarFecha(t.fechaFinProrrogada) || 'NO APLICA'
        }));
      }
    } catch (error) {
      console.error("Error cargando tarifas:", error);
    }
  };

  onMounted(cargarDatosContrato);

  function filtrarBusqueda (value: any, query: string | null, _item: any) {
    if (value == null || query == null) return false;

    const valorTexto = value.toString().toLowerCase();
    const busquedaTexto = query.toLowerCase();

    return valorTexto.indexOf(busquedaTexto) !== -1;
  }

  const visualizarDatosContrato = (item: any) => {
    const nombreParaEnviar = item.tarifaP || item.nombreTarifa || item.nombreArchivo;
    router.push({
      path: `/reaseguro/contratos/vida/modificarContratoVida/${item.id}`,
      query: { nombre: nombreParaEnviar }
    });
  };

</script>
