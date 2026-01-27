<template>
  <v-container>
    <v-alert v-if="contratoStore.listaReaseguradoresFinal.length === 0" type="info" variant="tonal">
      No hay reaseguradores agregados todavía.
    </v-alert>

    <v-expansion-panels v-else variant="popout" class="mt-4">
      <v-expansion-panel
        v-for="(item, index) in contratoStore.listaReaseguradoresFinal"
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
              <ul class="text-caption">
                <li><strong>ID Contrato:</strong> {{ item.general.idContrato }}</li>
                <li><strong>Cesión Básica:</strong> {{ item.general.cesionCoberBasi?.title }}</li>
                <li><strong>Indicador Distribución:</strong> {{ item.general.indicadorDistrC }}</li>
                <li><strong>Comisión Reaseguro:</strong> {{ item.general.comisionReaseg?.title }}</li>
                <li><strong>Tipo Comisión:</strong> {{ item.general.tipoComision?.title }}</li>
                <li><strong>Comisión 1er Año:</strong> {{ item.general.comisionPrimerAnio }}%</li>
                <li><strong>Comisión Renovación:</strong> {{ item.general.comisionRenovacion }}%</li>
              </ul>
            </v-col>

            <v-col cols="12" class="mt-4">
              <div class="text-subtitle-1 blue--text font-weight-bold">Detalle de Coberturas y Tarifas</div>
              <v-divider class="mb-2"></v-divider>

              <v-data-table
                v-if="item.coberturas && item.coberturas.tarifas.length > 0"
                :headers="[
                  { title: 'Capa', key: 'detalleCapa' },
                  { title: 'Cobertura', key: 'cobertura' },
                  { title: 'Tipo Tarifa', key: 'tipoTarifa.title' },
                  { title: 'Valor', key: 'valor' }
                ]"
                :items="item.coberturas.tarifas"
                density="compact"
                class="elevation-0 border"
                hide-default-footer
              >
                <template #item.valor="{ item: tarifa }">
                  <span v-if="tarifa.tipoTarifa === 0">$ {{ tarifa.primaTarifa }}</span>
                  <span v-else-if="tarifa.tipoTarifa === 1">{{ tarifa.porSobrePrima }}%</span>
                  <span v-else-if="tarifa.tipoTarifa === 3">{{ tarifa.tarifaFijaM }} (Millar)</span>
                  <span v-else-if="tarifa.tipoTarifa === 2">{{ tarifa.factorTap }}% (Propia)</span>
                  <span v-else class="text-grey">N/A</span>
                </template>
              </v-data-table>

              <v-alert v-else type="info" variant="tonal" density="compact">
                No hay detalle de tarifas específicas para esta reaseguradora.
              </v-alert>
            </v-col>

            <v-col cols="12" class="mt-4">
              <div class="text-subtitle-1 green--text font-weight-bold">Comisiones Escalonadas</div>
              <v-divider class="mb-2"></v-divider>

              <v-data-table
                v-if="item.comisiones && item.comisiones.comisiones.length > 0"
                :headers="[
                  { title: 'Límite Inferior', key: 'limiteInf' },
                  { title: 'Límite Superior', key: 'limiteSup' },
                  { title: 'Comisión Definitiva', key: 'comisionDefinitiva' }
                ]"
                :items="item.comisiones.comisiones"
                density="compact"
                class="elevation-0 border"
                hide-default-footer
              >
                <template #item.limiteInf="{ value }">{{ value }}%</template>
                <template #item.limiteSup="{ value }">{{ value }}%</template>
                <template #item.comisionDefinitiva="{ value }">{{ value }}%</template>
              </v-data-table>

              <v-alert v-else type="info" variant="tonal" density="compact">
                No se definieron comisiones escalonadas (aplica comisión fija de la configuración general).
              </v-alert>
            </v-col>

            <v-col cols="12" md="6">
              <div class="text-subtitle-1 orange--text font-weight-bold">Participación de Utilidades (PTU)</div>
              <v-divider class="mb-2"></v-divider>
              <ul class="text-caption" v-if="item.ptu">
              <li>
                <strong>Otorga PTU:</strong>
                {{ item.ptu.otorgaPtu === 1 ? 'SÍ' : 'NO' }}
              </li>

              <template v-if="item.ptu.otorgaPtu === 1">
                <li>
                  <strong>Método:</strong>
                  {{ item.ptu.metodoCalPTU ?? 'N/A' }}
                </li>
                <li><strong>Porcentaje PTU:</strong> {{ item.ptu.ptu }}%</li>
                <li><strong>Factor K:</strong> {{ item.ptu.kPor }}%</li>
                <li><strong>Años Arrastre:</strong> {{ item.ptu.aniosArrastre }}</li>
                <li><strong>Gastos:</strong> {{ item.ptu.gastos }}%</li>
              </template>
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
import { computed } from 'vue'
import { useContratoStore } from '@/stores/contratoStore'

const contratoStore = useContratoStore()

const totalPart = computed(() => {
  return contratoStore.listaReaseguradoresFinal.reduce((acc, curr) => acc + curr.general.participacion, 0)
})

/* Falta realizar la parte de editar la reaseguradora */

const eliminarReasegurador = (index: number) => {
  contratoStore.listaReaseguradoresFinal.splice(index, 1)
}
</script>
