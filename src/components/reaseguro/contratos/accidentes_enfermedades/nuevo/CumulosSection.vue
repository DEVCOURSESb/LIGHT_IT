<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">
          <!-- !ROW -->
          <v-row>
            <!-- NUMERO DE CAPA -->
            <v-col cols="12" md="2">
              <v-text-field
                label="Número de capa"
                variant="solo-filled"
                readonly
              />
            </v-col>
            <!-- MONTO CÚMULO -->
            <v-col cols="12" md="2">
              <v-text-field
                label="Monto cúmulo"
                variant="solo-filled"
                readonly
              />
            </v-col>
          </v-row>
          <!-- !ROW -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="() => {}">
              Agregar cúmulo
            </v-btn>
            <v-btn
              size="large"
              variant="outlined"
              class="btn-guardar"
              @click="() => {}"
            >
              Guardar cúmulo
            </v-btn>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { useCumulosSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/cumulos/useCumulosSection";
const {} = useCumulosSection();
</script>
