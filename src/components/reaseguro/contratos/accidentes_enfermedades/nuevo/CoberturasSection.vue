<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">
          <v-row>
            <!-- ASIGNACIÓN DE COBERTURAS -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryCriterioAsignacion.data.value?.filter( item => [0, 1, 3, 6].includes(item.cveCriterioAsig) ) ?? []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Asignación de coberturas"
                variant="solo-filled"
                clearable
                :disabled="queryCriterioAsignacion.isLoading.value"
                :model-value="formData['cveCriterioAsigCobertura']"
                @update:model-value="setFieldValue('cveCriterioAsigCobertura', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioAsigCobertura'] : undefined"
              />
            </v-col>
            
            <!-- REASEGURADORA -->
            <v-col cols="12" md="3" v-if="[0, 6].includes(formData['cveCriterioAsigCobertura'])">
              <v-select
                :items="reaseguradoraData"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :model-value="formData['cveReaseguradorCobertura']"
                @update:model-value="setFieldValue('cveReaseguradorCobertura', $event)"
                :error-messages="showErrors ? formErrors['cveReaseguradorCobertura'] : undefined"
              />
            </v-col>

            <!-- OPERACION / RAMO -->
            <v-col cols="12" md="3" v-if="[3, 6].includes(formData['cveCriterioAsigCobertura'])">
              <v-select
                :items="operacionesRamosData"
                item-title="title"
                item-value="value"
                label="Operación ramo"
                variant="solo-filled"
                clearable
                :model-value="formData['cveOperRamoCobertura']"
                @update:model-value="setFieldValue('cveOperRamoCobertura', $event)"
                :error-messages="showErrors ? formErrors['cveOperRamoCobertura'] : undefined"
              />
            </v-col>

            <!-- COBERTURA -->
            <v-col cols="12" md="3">
              <v-select
                :items="[]"
                item-title="title"
                item-value="value"
                label="Cobertura"
                variant="solo-filled"
                clearable
                :model-value="formData['cveCobaye']"
                @update:model-value="setFieldValue('cveCobaye', $event)"
                :error-messages="showErrors ? formErrors['cveCobaye'] : undefined"
              />
            </v-col>

            

          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { useCoberturasSection } from '@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/coberturas/useCoberturasSection';

const {
  formData,
  formErrors,
  setFieldValue,
  showErrors,
  queryCriterioAsignacion,
  reaseguradoraData ,
  operacionesRamosData,
 } = useCoberturasSection();
</script>