<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">
          <!-- ! ROW-->
          <v-row>
            <!-- DETALLES POR OPERACION RAMO -->
            <v-col cols="12" md="3">
              <v-select
                v-model="lastDetalleOperacionRamoSelected"
                :items="['SÍ', 'NO']"
                label="¿Detalles por operación / ramo?"
                variant="solo-filled"
                clearable
                :model-value="formData['detallesOperRamo']"
                @update:model-value="setFieldValue('detallesOperRamo', $event)"
                :error-messages="showErrors ? formErrors['detallesOperRamo'] : undefined"
                :disabled="isDetallesOperacionRamoDisabled"
              />
            </v-col>

            <!-- TIPO DE OPERCIÓN / RAMO DETALLADA -->
            <v-col cols="12" md="3" v-show="formData['detallesOperRamo'] === 'SÍ'">
              <v-select
                :items="extensionesCoberturaToShow || []"
                item-title="descExtCober"
                item-value="cveExtCober"
                label="Tipo de operación / ramo (detallada)"
                variant="solo-filled"
                clearable
                :disabled="queryExtensionesCobertura.isLoading.value"
                :model-value="formData['cveExtCoberDetalles']"
                @update:model-value="setFieldValue('cveExtCoberDetalles', $event)"
                :error-messages="showErrors ? formErrors['cveExtCoberDetalles'] : undefined"
              />
            </v-col>

            <!-- OPERCIÓN / RAMO DETALLADA si detalles por operacion ramo es si -->
            <v-col cols="12" md="3"  v-show="formData['detallesOperRamo'] === 'SÍ'">
              <v-select
                :items="queryOperacionesRamos.data.value?.filter((op: any) => op.cveExtCober == formData['cveExtCoberDetalles']) || []"
                item-title="descOperacionRamos"
                item-value="cveCobertura"
                label="Operación / ramo (detallada)"
                variant="solo-filled"
                clearable
                :disabled="queryOperacionesRamos.isLoading.value"
                :model-value="formData['cveOperRamoDetalles']"
                @update:model-value="setFieldValue('cveOperRamoDetalles', $event)"
                :error-messages="showErrors ? formErrors['cveOperRamoDetalles'] : undefined"
              />

            </v-col>
            <!-- % DE RETENCION -->
            <v-col cols="12" md="3">
              <v-text-field 
                label="% Retención" variant="solo-filled"
                type="number" 
                v-model.number="porcentajeRetencion"
                min="0.00"
                max="100.00"
                step=".01" />
              
                <v-slider
                v-model="porcentajeRetencion"
                min="0.00"
                max="100.00"
                step=".01"
                thumb-label
                color="primary"
              />
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row>
            <!-- % DE CESION -->
            <v-col cols="12" md="3">
              <v-text-field label="% Cesión" variant="solo-filled" 
                type="number" 
                v-model.number="porcentajeCesion"
                min="0.00"
                max="100.00"
                step=".01" />
              <v-slider
                v-model="porcentajeCesion"
                min="0.00"
                max="100.00"
                step=".01"
                thumb-label
                color="primary"
              />
            </v-col>
            <!-- MONTO RETENCION -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Monto retención"
                variant="solo-filled"
                type="text"
                :model-value="montoRetencion"
                @update:model-value="onInput"
                @blur="onBlur"
                :error-messages="showErrors ? formErrors['montoRetencion'] : undefined"
              />
            </v-col>
            <!-- MONTO RETENCION CONTRATO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Monto retención contrato"
                variant="solo-filled"
                type="text"
                :model-value="montoRetencionContrato"
                @update:model-value="onInputRC"
                @blur="onBlurRC"
                :error-messages="showErrors ? formErrors['montoRetencionContrato'] : undefined"
              />
            </v-col>
            <!-- MONTO CESION -->
            <v-col cols="12" md="3">
              <v-text-field 
              label="Monto cesión" 
              variant="solo-filled"
              :model-value="montoCesion"
              @update:model-value="onInputMC"
              @blur="onBlurMC"
              :error-messages="showErrors ? formErrors['montoCesion'] : undefined"
            />
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row>
            <!-- CAPACIDAD DE CONTRATO -->
            <v-col cols="12" md="3">
             <v-text-field 
              label="Capacidad de contrato" 
              variant="solo-filled"
              :model-value="capacidadContrato"
              @update:model-value="onInputCC"
              @blur="onBlurCC"
              :error-messages="showErrors ? formErrors['capacidadContrato'] : undefined"
              />
            </v-col>

            <!-- CRITERIO DE CAPACIDAD -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryCriterioAsignacion.data.value?.filter( item => [5, 10].includes(item.cveCriterioAsig) ) ?? []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Criterio de capacidad"
                variant="solo-filled"
                clearable
                :disabled="queryCriterioAsignacion.isLoading.value"
                :model-value="formData['cveCriterioAsigCapacidad']"
                @update:model-value="setFieldValue('cveCriterioAsigCapacidad', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioAsigCapacidad'] : undefined"
              />
            </v-col>

            <!-- DISTRIBUCIÓN DE LA CESIÓN -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryDistribucionCesion.data.value ?? []"
                item-title="descDistrcesion"
                item-value="cveDistrcesion"
                label="Distribución de la cesión"
                variant="solo-filled"
                clearable
                :disabled="queryDistribucionCesion.isLoading.value"
                :model-value="formData['cveDistrCesion']"
                @update:model-value="setFieldValue('cveDistrCesion', $event)"
                :error-messages="showErrors ? formErrors['cveDistrCesion'] : undefined"
              />
            </v-col>
            <!-- MONEDA DETALLES -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryMoneda.data.value ?? []"
                item-title="descMoneda"
                item-value="cveMoneda"
                label="Moneda detalles"
                variant="solo-filled"
                clearable
                :disabled="queryMoneda.isLoading.value"
                :model-value="formData['cveMonedaDetalles']"
                @update:model-value="setFieldValue('cveMonedaDetalles', $event)"
                :error-messages="showErrors ? formErrors['cveMonedaDetalles'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row>
            <!-- CÚMULOS -->
            <v-col cols="12" md="3">
              <v-select
                :items="['SÍ', 'NO']"
                label="¿Cúmulos?"
                variant="solo-filled"
                clearable
                :model-value="formData['cumulos']"
                @update:model-value="setFieldValue('cumulos', $event)"
                :error-messages="showErrors ? formErrors['cumulos'] : undefined"
              />
            </v-col>

            <!-- SPACER -->
            <v-col cols="12" md="6"></v-col>

            <!-- AGREGAR DETALLES -->
            <v-col cols="12" md="3" class="d-flex gap-2 justify-end">
              <v-btn size="large" variant="outlined" @click="sendDataToTable">
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
                :headers="detallesProporcionalesTableHeaders"
                :items="detallesProporcionalesTableDisplay"
                :loading="false"
                striped="odd"
              >
              <template #top>
                <v-toolbar class="encabezado" flat>
                  <v-toolbar-title>Solo los registros de esta tabla se registrarán</v-toolbar-title>
                  <v-spacer />
                </v-toolbar>
              </template>
                <template #no-data> No hay datos disponibles </template>
                <template #item.detalleActivo="{ item }">
                  <v-checkbox
                    :model-value="item?.detalleActivo"
                    @update:model-value="() => toggleActive(item)"
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.actions="{ item }">
                <v-icon class="edit" size="large" @click="editRow(item)">
                  mdi-pencil
                </v-icon>
              </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
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
  extensionesCoberturaToShow,
  queryOperacionesRamos,
  porcentajeRetencion,
  porcentajeCesion,
  montoRetencion,
  onInput,
  onBlur,
  montoRetencionContrato,
  onInputRC,
  onBlurRC,
  montoCesion,
  onInputMC,
  onBlurMC,
  capacidadContrato,
  onInputCC,
  onBlurCC,
  queryCriterioAsignacion,  
  queryDistribucionCesion,
  queryMoneda,
  detallesProporcionalesTableDisplay,
  detallesProporcionalesTableHeaders,
  sendDataToTable,
  editRow,
  toggleActive,
  lastDetalleOperacionRamoSelected,
  isDetallesOperacionRamoDisabled
} = useDetallesProporcionalesSection();

</script>