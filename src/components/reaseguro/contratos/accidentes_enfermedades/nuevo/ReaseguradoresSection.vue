<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="handleSubmit">
          <!-- !ROW -->
          <v-row>
            <!-- REASEGURADORA -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryReaseguradoras.data.value ?? []"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                :disabled="queryReaseguradoras.isLoading.value"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :model-value="formData['cveReasegurador']"
                @update:model-value="setFieldValue('cveReasegurador', $event)"
                :error-messages="
                  showErrors ? formErrors['cveReasegurador'] : undefined
                "
              />
            </v-col>

            <!-- PARTICIPACION -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Participación"
                variant="solo-filled"
                type="text"
                :model-value="participacion"
                @update:model-value="onInput"
                @blur="onBlur"
                :error-messages="
                  showErrors ? formErrors['participacion'] : undefined
                "
              />
            </v-col>

            <!-- ¿OTORGA PTU? -->
            <v-col cols="12" md="3">
              <v-select
                :items="['SÍ', 'NO']"
                item-title=""
                item-value=""
                :disabled="false"
                label="¿Otorga PTU?"
                variant="solo-filled"
                clearable
              />
            </v-col>

            <!-- COMISION / RATE ON LINE -->
            <v-col cols="12" md="3">
              <v-select
                :items="[]"
                item-title=""
                item-value=""
                :disabled="false"
                label="¿Comisión / rate on line?"
                variant="solo-filled"
                clearable
              />
            </v-col>

            <!-- TIPO DE COMISION / RATE ON LINE -->
            <v-col cols="12" md="3">
              <v-select
                :items="[]"
                item-title=""
                item-value=""
                :disabled="false"
                label="Tipo de comisión / rate on line"
                variant="solo-filled"
                clearable
              />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- FÓRMULA COMISIÓN / RATE ON LINE -->
            <v-col cols="12" md="3">
              <v-select
                :items="[]"
                item-title=""
                item-value=""
                :disabled="false"
                label="Fórmula comisión / rate on line"
                variant="solo-filled"
                clearable
              />
            </v-col>

            <!-- % COMISIÓN / RATE ON LINE PROVISIONAL -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Comisión / rate on line provisional"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- % COMISIÓN / RATE ON LINE MÍNIMA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Comisión / rate on line mínima"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- % COMISIÓN / RATE ON LINE MÁXIMA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Comisión / rate on line máxima"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- CAPA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Capa"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- PRIORIDAD -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Prioridad"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- LÍMITE DE RESPONSABILIDAD -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Límite de responsabilidad"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- LÍMITE AGREGADO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Límite agregado"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- TIPO LIMITE AGREGADO -->
            <v-col cols="12" md="3">
              <v-select
                :items="[]"
                item-title=""
                item-value=""
                :disabled="false"
                label="Tipo de límite agregado"
                variant="solo-filled"
                clearable
              />
            </v-col>

            <!-- TIPO DE COSTO -->
            <v-col cols="12" md="3">
              <v-select
                :items="[]"
                item-title=""
                item-value=""
                :disabled="false"
                label="Tipo de costo"
                variant="solo-filled"
                clearable
              />
            </v-col>

            <!-- PRIMA MÍNIMA Y DE DEPOSITO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Prima mínima y de deposito"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- PRIMA MÍNIMA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Prima mínima"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- PRIMA MÁXIMA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Prima máxima"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- FACTOR DE AJUSTE DIVIDENDO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Factor de ajuste dividendo"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- FACTOR DE AJUSTE DIVISOR -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Factor de ajuste divisor"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- BONO POR NO RECLAMACIONES -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Bono por no reclamaciones"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>
          </v-row>

          <!-- !ROW BUTTONS -->
          <v-row class="flex justify-end">
            <!-- AGREGAR REASEGURADOR -->
            <v-col cols="12" md="3" class="d-flex gap-2 justify-end">
              <v-btn type="submit" size="large" variant="outlined">
                Agregar reasegurador
              </v-btn>
              <!-- GUARDAR REASEGURADORES -->
              <v-btn
                size="large"
                variant="outlined"
                class="btn-guardar"
                @click="() => {}"
              >
                Guardar reaseguradores
              </v-btn>
            </v-col>
          </v-row>

          <!-- !ROW TABLE -->
          <!-- 
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
           -->
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useReaseguradoresSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/reaseguradores/useReaseguradoresSection";

const {
  queryReaseguradoras,
  participacion,
  formData,
  setFieldValue,
  formErrors,
  showErrors,
  handleSubmit,
  onInput,
  onBlur,
} = useReaseguradoresSection();
</script>
