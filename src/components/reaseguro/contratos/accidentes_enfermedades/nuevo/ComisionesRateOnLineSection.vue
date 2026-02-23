<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">
          <!-- ! ROW-->
          <v-row>
            <!-- REASEGURADORA -->
            <v-col cols="12" md="3">
              <v-select
                :items="[]"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :disabled="false"
              />
            </v-col>

            <!-- LÍMITE INFERIOR -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Límite inferior"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- LÍMITE SUPERIOR -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Límite superior"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>

            <!-- COMISION RATE / ON LINE DEFINITIVO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Comisión / rate on line definitivo"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
              />
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="() => {}">
              Cargar comisiones
            </v-btn>
            <v-btn size="large" variant="outlined" @click="() => {}">
              Agregar proporción
            </v-btn>
            <v-btn
              size="large"
              variant="outlined"
              class="btn-guardar"
              @click="() => {}"
            >
              Guardar proporciones
            </v-btn>
          </v-row>

          <br />
          <br />
          <br />

          <!-- ! ROW-->
          <v-row>
            <!-- v-model="archivo" -->
            <!-- Cargar archivo -->
            <v-col cols="12" md="7">
              <v-file-input
                label="Seleccionar archivo CSV"
                accept=".csv"
                prepend-icon="mdi-file-delimited"
                :rules="[]"
                show-size
                clearable
                density="compact"
                @update:model-value="() => {}"
                @click:clear="() => {}"
                id="file-input"
              ></v-file-input>
            </v-col>

            <v-col cols="12" md="2">
              <v-btn size="large" variant="outlined" @click="handleFileUpload">
                Buscar archivo
              </v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn size="large" variant="outlined" @click="() => {}">
                Activar / desactivar comisiones
              </v-btn>
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <v-col cols="12" md="12">
              <v-data-table
                class="mt-4"
                :headers="tableHeaders"
                :items="[]"
                :loading="false"
                striped="odd"
              >
                <template #top>
                  <v-toolbar class="encabezado" flat>
                    <v-toolbar-title
                      >Solo los registros de esta tabla se
                      registrarán</v-toolbar-title
                    >
                    <v-spacer />
                  </v-toolbar>
                </template>
                <template #no-data> No hay datos disponibles </template>
                <!-- 
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
                  -->
              </v-data-table>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { useComisionesRateOnLine } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/comisiones_rate_on_line/useComisionesRateOnLine";

/* :model-value="formData['cveCriterioAsigCapacidad']"
@update:model-value="setFieldValue('cveCriterioAsigCapacidad', $event)"
:error-messages="showErrors ? formErrors['cveCriterioAsigCapacidad'] : undefined" 

v-model.number="porcentajeRetencion"
*/

const { tableHeaders, handleFileUpload } = useComisionesRateOnLine();
</script>
