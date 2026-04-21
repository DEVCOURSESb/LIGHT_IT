<template>
  <v-container>
    <v-alert v-if="contratoStore.listaReaseguradoresFinal.length === 0" type="info" variant="tonal">
      No hay reaseguradores agregados todavía.
    </v-alert>

      <v-expansion-panels v-else>
        <v-expansion-panel
          v-for="(item, index) in listaReaseguradoresFinal"
          :key="index"
        >
        <v-expansion-panel-title>
          <v-row no-gutters class="align-center">
            <v-col cols="8">
              <strong>{{ item.general.nombreReasegurador }}</strong>
            </v-col>
            <v-col cols="4" class="text-right grey--text">
              Participación: {{ item.general.participacion }}%
            </v-col>
          </v-row>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-subtitle-1 blue--text font-weight-bold">Configuración General</div>
              <v-divider class="mb-2"></v-divider>

              <ul class="text-caption mb-4">
                <li><strong>ID Contrato:</strong> {{ item.general.idContrato }}</li>
                <li><strong>Cesión Básica:</strong> {{ item.general.cesionCoberBasi?.title }}</li>
                <li><strong>Indicador Distribución:</strong> {{ item.general.indicadorDistrC?.title }}</li>
                <li><strong>Comisión Reaseguro:</strong> {{ item.general.comisionReaseg?.title }}</li>
                <li><strong>Tipo Comisión:</strong> {{ item.general.tipoComision?.title }}</li>
                <li><strong>Detalle por cobertura:</strong> {{ item.general.detalleCobertura?.title }}</li>
              </ul>

              <div class="text-subtitle-1 blue--text font-weight-bold">Coberturas por tipo de comisión</div>
              <v-divider class="mb-2"></v-divider>

              <v-data-table
                v-if="item.general && item.general.coberturas && item.general.coberturas.length > 0"
                :headers="[
                  { title: 'Tipo cobertura', key: 'tipoCobertura' },
                  { title: 'Comisión Primer Año', key: 'comisionPrimerAnio' },
                  { title: 'Comisión Renovación', key: 'comisionRenovacion' },
                ]"
                :items="item.general.coberturas"
                density="compact"
                class="elevation-0 border mt-2"
                hide-default-footer
              >
                <template #item.comisionPrimerAnio="{ value }">
                  <span class="font-weight-medium">{{ value }}%</span>
                </template>

                <template #item.comisionRenovacion="{ value }">
                  <span class="font-weight-medium">{{ value }}%</span>
                </template>
              </v-data-table>
              <v-alert
                v-else
                type="info"
                variant="tonal"
                density="compact"
                class="text-caption mt-2"
              >
                No hay coberturas configuradas.
              </v-alert>
            </v-col>

            <v-col cols="12" class="mt-4">
              <div class="text-subtitle-1 blue--text font-weight-bold">Detalle de Coberturas y Tarifas</div>
              <v-divider class="mb-2"></v-divider>
              <v-data-table
                v-if="item.coberturas && item.coberturas.tarifas.length > 0"
                :headers="[
                  { title: 'Capa', key: 'detalleCapa' },
                  { title: 'Cobertura', key: 'cobertura' },
                  { title: 'Tipo de cobertura', key: 'tipoCobertura'},
                  { title: 'Tipo Tarifa', key: 'tipoTarifa.title' },
                  { title: 'Prima tarifa', key: 'primaTarifa'},
                  { title: '% Por sobre prima', key: 'porSobrePrima' },
                  { title: 'Tarifa fija Millar', key: 'tarifaFijaM'},
                  { title: 'Factor tarifa', key: 'factorTap'},
                  { title: 'Tarifa propia', key: 'tarifaPropia'}
                ]"
                :items="item.coberturas.tarifas"
                density="compact"
                class="elevation-0 border"
              >
                <template #item.valor="{ item: tarifa }">
                  <span v-if="tarifa.tipoTarifa === 0">{{ tarifa.primaTarifa }}</span>
                  <span v-else-if="tarifa.tipoTarifa === 1">{{ tarifa.porSobrePrima }}%</span>
                  <span v-else-if="tarifa.tipoTarifa === 3">{{ tarifa.tarifaFijaM }} (Millar)</span>
                  <span v-else-if="tarifa.tipoTarifa === 2">{{ tarifa.factorTap }}% (Propia)</span>
                  <span v-else-if="tarifa.tipoTarifa === 4">{{ tarifa.tarifaP }} (Millar)</span>
                </template>
              </v-data-table>
              <v-alert v-else type="info" variant="tonal" density="compact">
                No hay detalle de tarifas específicas para esta reaseguradora.
              </v-alert>
              </v-col>
              <v-col cols="12" class="mt-1">
                <div class="text-subtitle-2 blue--text font-weight-bold">Agrupación de coberturas</div>
                <v-divider class="mb-2"></v-divider>
                <v-data-table
                  v-if="item.coberturas && item.coberturas.agrupaciones.length > 0"
                  :headers="[
                    { title: 'Coberturas', key: 'listaCoberturas' },
                    { title: 'Agrupar en:', key: 'madre.title' },
                  ]"
                  :items="item.coberturas.agrupaciones"
                  density="compact"
                  class="elevation-0 border"
                  hide-default-footer
                >
                  <template #item.listaCoberturas="{ item: agrupacion }">
                    <span>
                      {{ agrupacion.coberturas.map((c) => c.title).join(', ') }}
                    </span>
                  </template>

                  <template #item.madre.title="{ item: agrupacion }">
                    <span>
                      {{ agrupacion.madre?.title }}
                    </span>
                  </template>
                </v-data-table>
              <v-alert v-else type="info" variant="tonal" density="compact">
                No hay agrupación de coberturas para esta reaseguradora.
              </v-alert>
            </v-col>

            <v-col cols="12" class="mt-4">
              <div class="text-subtitle-1 green--text font-weight-bold">Comisiones Escalonadas</div>
              <v-divider class="mb-2"></v-divider>

              <v-data-table
                v-if="item.comisiones && item.comisiones.comisiones.length > 0"
                :headers="[
                  { title: 'Tipo de cobertura', key: 'tipoCobertura' },
                  { title: 'Límite Inferior', key: 'limiteInf' },
                  { title: 'Límite Superior', key: 'limiteSup' },
                  { title: 'Comisión Definitiva', key: 'comisionDefinitiva' }
                ]"
                :items="item.comisiones.comisiones"
                density="compact"
                class="elevation-0 border"
              >
                <template #item.limiteInf="{ value }">{{ value }}%</template>
                <template #item.limiteSup="{ value }">{{ value }}%</template>
                <template #item.comisionDefinitiva="{ value }">{{ value }}%</template>
              </v-data-table>

              <v-alert v-else type="info" variant="tonal" density="compact">
                No se definieron comisiones escalonadas (aplica comisión escalonada de la configuración general).
              </v-alert>
            </v-col>

            <v-col cols="12" md="6">
              <div class="text-subtitle-1 orange--text font-weight-bold">Participación de Utilidades (PTU)</div>
              <v-divider class="mb-2"></v-divider>
              <ul class="text-caption" v-if="item.ptu">
                <li>
                  <strong>Otorga PTU:</strong>
                  {{ getTX(item.ptu.otorgaPtu) }}
                </li>
                <li>
                  <strong>Método de cálculo:</strong>
                  {{ getTX(item.ptu.metodoCalPTU) }}
                </li>
                <li><strong>Porcentaje PTU:</strong> {{ item.ptu.ptu || 0 }}%</li>
                <li><strong>Factor K:</strong> {{ item.ptu.kPor || 0 }}%</li>
                <li><strong>Años Arrastre:</strong> {{ item.ptu.aniosArrastre || 0 }}</li>
                <li><strong>Gastos:</strong> {{ item.ptu.gastos || 0 }}%</li>
              </ul>
              <div v-else class="text-caption grey--text">
                Sin configuración de PTU definida.
              </div>
            </v-col>
          </v-row>

          <v-card-actions class="justify-end">
            <v-btn color="error" variant="text" size="small" @click="eliminarReasegurador(index)">
              Eliminar Reaseguradora
            </v-btn>
          </v-card-actions>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="mt-6 pa-4" color="grey-lighten-4" flat>
      <div class="text-right">
        <span class="text-h6">Participación Total Acumulada: </span>
        <span :class="totalPart > 100 ? 'text-error' : 'text-primary'" class="text-h5 font-weight-bold">
          {{ totalPart }}%
        </span>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useContratoStore } from '@/stores/reaseguro/contratos/vidaStore'
import { storeToRefs } from 'pinia'

const hidratarListaReaseguradores = () => {
  const data = contratoStore.listaReaseguradoresFinal
  if (!data || data.length === 0) {
    const backup = localStorage.getItem('lista_reaseguradores_final')
    if (backup) {
      contratoStore.listaReaseguradoresFinal = JSON.parse(backup)
    }
  }
}

onMounted(() => {
  hidratarListaReaseguradores()
})

const contratoStore = useContratoStore()
const { listaReaseguradoresFinal } = storeToRefs(contratoStore)


const totalPart = computed(() =>
  listaReaseguradoresFinal.value.reduce(
    (acc, curr) => acc + Number(curr.general.participacion || 0),
    0
  )
)

const getTX = (item: any): string => {
  if (!item) return 'N/A';
  if (typeof item === 'object') {
    return item.title || item.label || item.nombre || String(item.value || 'N/A');
  }
  return String(item);
};

const eliminarReasegurador = (index: number) => {
  contratoStore.listaReaseguradoresFinal.splice(index, 1)
}
</script>
