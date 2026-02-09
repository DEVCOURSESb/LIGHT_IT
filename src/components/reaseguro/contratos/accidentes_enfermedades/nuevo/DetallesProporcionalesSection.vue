<template>
  <v-window-item value="tab-2">
    <v-card>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent="">
            <!-- ! ROW-->
            <v-row>
              <!-- DETALLES POR OPERACION RAMO -->
              <v-col cols="12" md="3">
                <v-select
                  :items="['SI', 'NO']"
                  label="¿Detalles por operación / ramo?"
                  variant="solo-filled"
                  clearable
                  :model-value="formData['detallesOperRamo']"
                  @update:model-value="setFieldValue('detallesOperRamo', $event)"
                  :error-messages="showErrors ? formErrors['detallesOperRamo'] : undefined
                  "
                />
              </v-col>

              <!-- TIPO DE OPERCIÓN / RAMO DETALLADA -->
              <v-col cols="12" md="3">
                <v-select
                  :items="queryExtensionesCobertura.data.value || []"
                  item-title="descExtCober"
                  item-value="cveExtCober"
                  label="Tipo de operación / ramo (detallada)"
                  variant="solo-filled"
                  clearable
                />
              </v-col>

              <!-- OPERCIÓN / RAMO DETALLADA -->
              <v-col cols="12" md="3">
                <v-select
                  :items="[]"
                  label="Operación / ramo (detallada)"
                  variant="solo-filled"
                  clearable
                />
              </v-col>
              <!-- % DE RETENCION -->
              <v-col cols="12" md="3">
                <v-text-field label="% Retención" variant="solo-filled" />
              </v-col>
            </v-row>

            <!-- ! ROW-->
            <v-row>
              <!-- % DE CESION -->
              <v-col cols="12" md="3">
                <v-text-field label="% Cesión" variant="solo-filled" />
              </v-col>
              <!-- MONTO RETENCION -->
              <v-col cols="12" md="3">
                <v-text-field label="Monto retención" variant="solo-filled" />
              </v-col>
              <!-- MONTO RETENCION CONTRATO -->
              <v-col cols="12" md="3">
                <v-text-field
                  label="Monto retención contrato"
                  variant="solo-filled"
                />
              </v-col>
              <!-- MONTO CESION -->
              <v-col cols="12" md="3">
                <v-text-field label="Monto cesión" variant="solo-filled" />
              </v-col>
            </v-row>

            <!-- ! ROW-->
            <v-row>
              <!-- CAPACIDAD DE CONTRATO -->
              <v-col cols="12" md="3">
                <v-select
                  :items="[]"
                  label="Capacidad de contrato"
                  variant="solo-filled"
                  clearable
                />
              </v-col>

              <!-- CRITERIO DE CAPACIDAD -->
              <v-col cols="12" md="3">
                <v-select
                  :items="[]"
                  label="Criterio de capacidad"
                  variant="solo-filled"
                  clearable
                />
              </v-col>

              <!-- DISTRIBUCIÓN DE LA CESIÓN -->
              <v-col cols="12" md="3">
                <v-select
                  :items="[]"
                  label="Distribución de la cesión"
                  variant="solo-filled"
                  clearable
                />
              </v-col>
              <!-- MONEDA DETALLES -->
              <v-col cols="12" md="3">
                <v-select
                  :items="[]"
                  label="Moneda detalles"
                  variant="solo-filled"
                  clearable
                />
              </v-col>
            </v-row>

            <!-- ! ROW-->
            <v-row>
              <!-- CÚMULOS -->
              <v-col cols="12" md="3">
                <v-select
                  :items="[]"
                  label="¿Cúmulos?"
                  variant="solo-filled"
                  clearable
                />
              </v-col>

              <!-- SPACER -->
              <v-col cols="12" md="6"></v-col>

              <!-- AGREGAR DETALLES -->
              <v-col cols="12" md="3" class="d-flex gap-2 justify-end">
                <v-btn size="large" variant="outlined">
                  Agregar detalles
                </v-btn>
                <!-- GUARDAR DETALLES -->
                <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleSubmit">
                  Guardar detalles
                </v-btn>
              </v-col>

              <v-col cols="12" md="12">
                <v-data-table
                  class="mt-4"
                  :headers="[]"
                  :items="[]"
                  :loading="false"
                  striped="odd"
                >
                  <template #no-data> No hay datos disponibles </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-window-item>
</template>

<script lang="ts" setup>
import { useDetallesProporcionalesSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/detalles_proporcionales/useDetallesProporcionalesSection";

const {
  formData,
  setFieldValue,
  formErrors,
  showErrors,
  handleSubmit,
  queryExtensionesCobertura,
} = useDetallesProporcionalesSection();
</script>
