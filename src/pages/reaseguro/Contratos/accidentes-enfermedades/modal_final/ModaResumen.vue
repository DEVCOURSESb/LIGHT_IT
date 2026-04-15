<template>
  <v-dialog v-model="showModal" max-width="1400px" scrollable>
    <v-card>
      <v-card-title class="text-h6 bg-primary text-white d-flex align-center">
        RESUMEN NUEVO CONTRATO ACCIDENTES Y ENFERMEDADES!!!
      </v-card-title>

      <v-card-text style="background-color: #f5f5f5; height: 80vh">
        <v-row>
          <v-col cols="12">
            <h1>Generales</h1>
            <v-data-table
              class="mt-2"
              :headers="generalesContratoHeaders"
              :items="generalesItems"
              striped="odd"
            >
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn variant="outlined" @click="sendToService">Confirmar</v-btn>
        <v-btn variant="outlined" @click="closeModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { computed } from "vue";
import { tablesHaders } from "./tablesHeaders";
const showModal = defineModel<boolean>({ default: false });

const { generales, obtenerPayloadBackend } = useContratoAEStore();

const { generalesContratoHeaders } = tablesHaders();

const generalesItems = computed(() => {
  const { CAE_MONEDA_CONTRATO, CAE_OPERACION_RAMO, ...rest } = generales;


  /* const dataToShow = [ rest ].map( (row) => {
    return {
      ...row,
      fechaInicioContrato: 
      */
    //} 
    return []
  });

const sendToService = () => {
  console.log(obtenerPayloadBackend());
};

const closeModal = () => {
  showModal.value = false;
};
</script>
