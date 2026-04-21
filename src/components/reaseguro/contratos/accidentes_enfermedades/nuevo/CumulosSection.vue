<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <!-- ! ROW — Campos de captura -->
          <v-row>
            <!-- OPERACIÓN / RAMO (solo si detallesOperRamo = SI y cumulosSI) -->
            <v-col cols="12" md="3" v-if="detallesOperRamo == 1">
              <v-select
                :items="operacionesRamosData"
                item-title="title"
                item-value="value"
                label="Operación / Ramo"
                variant="solo-filled"
                clearable
                :model-value="formData['cveOperRamoCumulo']"
                @update:model-value="setFieldValue('cveOperRamoCumulo', $event)"
                :error-messages="showErrors ? formErrors['cveOperRamoCumulo'] : undefined"
              />
            </v-col>

            <!-- NÚMERO DE CAPA (solo lectura, asignado automáticamente) -->
            <v-col cols="12" md="2">
              <v-text-field
                label="Número de capa"
                variant="solo-filled"
                :model-value="numCapa"
                readonly
              />
            </v-col>

            <!-- MONTO CÚMULO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Monto cúmulo"
                variant="solo-filled"
                :model-value="montoCumulo"
                @update:model-value="onInputMontoCumulo($event)"
                @blur="onBlurMontoCumulo"
                :error-messages="showErrors ? formErrors['montoCumulo'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW — Botones principales -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleAgregarCumulo">
              Agregar cúmulo
            </v-btn>
            <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleGuardarCumulos">
              Guardar cúmulos
            </v-btn>
          </v-row>

          <br /><br />

          <!-- ! ROW — Tabla principal -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                class="mt-2"
                :headers="tableHeaders"
                :items="dataTable"
                striped="odd"
              >
                <template #top>
                  <v-toolbar class="encabezado" flat>
                    <v-toolbar-title class="text-secondary">
                      Solo los registros de esta tabla se registrarán
                    </v-toolbar-title>
                    <v-spacer />
                  </v-toolbar>
                </template>

                <template #no-data>No hay datos disponibles</template>

                <!-- Operación/ramo: mostrar solo si aplica -->
                <template #item.descOperRamo="{ item }">
                  {{ item.descOperRamo || "—" }}
                </template>

                <template #item.montoCumulo="{ item }">
                  {{ item.montoCumulo != null
                      ? item.montoCumulo.toLocaleString("es-MX", { minimumFractionDigits: 2 })
                      : "—" }}
                </template>

                <template #item.cumuloActivo="{ item }">
                  <v-checkbox
                    :model-value="item.cumuloActivo"
                    @update:model-value="toggleRowActiva(item)"
                    hide-details
                    density="compact"
                  />
                </template>

                <template #item.editar="{ item }">
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
import { useCumulosSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/cumulos/useCumulosSection";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  montoCumulo,
  onInputMontoCumulo,
  onBlurMontoCumulo,
  detallesOperRamo,
  numCapa,
  operacionesRamosData,
  tableHeaders,
  dataTable,
  handleAgregarCumulo,
  handleGuardarCumulos,
  toggleRowActiva,
  editRow,
} = useCumulosSection();
</script>