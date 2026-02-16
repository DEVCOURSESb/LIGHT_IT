<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="handleSubmit">
          <!-- !ROW -->
          <v-row class="flex justify-center">
            <v-col cols="12" md="6">
              <v-select
                :items="queryEmisionContableAYE.data.value || []"
                item-title="NUM_POLIZA"
                item-value="NUM_POLIZA"
                label="Número de póliza"
                variant="solo-filled"
                clearable
                multiple
                :disabled="queryEmisionContableAYE.isLoading.value || tipoContrato !== 3"
                :model-value="formData['noPoliza']"
                @update:model-value="setFieldValue('noPoliza', $event)"
                :error-messages="
                  showErrors ? formErrors['noPoliza'] : undefined
                "
              />
            </v-col>
          </v-row>
          <!-- !ROW -->
          <v-row class="flex justify-end">
            <v-col cols="12" md="3" class="d-flex gap-2 justify-end">
              <v-btn size="large" variant="outlined" @click="sendSelect">
                Agregar póliza
              </v-btn>
              <!-- GUARDAR PÓLIZAS -->
              <v-btn
                size="large"
                variant="outlined"
                class="btn-guardar"
                @click="handleSubmit"
              >
                Guardar pólizas
              </v-btn>
            </v-col>
          </v-row>
          <!-- !  row -->
           <v-row>
            <v-col cols="12" md="12">
              <v-data-table class="mt-4" :headers="polizasHeader" :items="dataTableItems"
                :loading="false" striped="odd">
                <template #top>
                  <v-toolbar class="encabezado" flat>
                    <v-toolbar-title>Solo los registros de esta tabla se registrarán</v-toolbar-title>
                    <v-spacer />
                  </v-toolbar>
                </template>
                <template #no-data> No hay datos disponibles </template>
                <template #item.polActiva="{ item }">
                  <v-checkbox :model-value="item?.polActiva" @update:model-value="() => togglePolizaStatus(item)" hide-details
                    density="compact" />
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
import { usePolizasFacultativasSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/polizas_facultativas/usePolizasFacultativasSection";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";

const {
  handleSubmit,
  queryEmisionContableAYE,
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  polizasHeader,
  dataTableItems,
  sendSelect,
  togglePolizaStatus,
} = usePolizasFacultativasSection();

const useAEStore = useContratoAEStore();
const { tipoContrato } = storeToRefs(useAEStore);
</script>
