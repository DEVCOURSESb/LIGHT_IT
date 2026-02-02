<template>
  <v-window v-model="activeTab">
    <generales-section />
    <detalles-proporcionales-section />
    <polizas-facultativas-section />
    <reaseguradores-section />
    <comisiones-rate-on-line-section />
    <coberturas-section />
    <excedentes-section />
    <cumulos-section />
    <tarifa-section />
    <proporcion-prima-section />
    <reinstalaciones-section />
    <intermediarios-section />
    <corretaje-section />
    <administracion-section />
  </v-window>
</template>
<script lang="ts" setup>
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";

import GeneralesSection from "./GeneralesSection.vue";
import DetallesProporcionalesSection from "./DetallesProporcionalesSection.vue";
import PolizasFacultativasSection from "./PolizasFacultativasSection.vue";
import ReaseguradoresSection from "./ReaseguradoresSection.vue";
import ComisionesRateOnLineSection from "./ComisionesRateOnLineSection.vue";
import CoberturasSection from "./CoberturasSection.vue";
import ExcedentesSection from "./ExcedentesSection.vue";
import CumulosSection from "./CumulosSection.vue";
import TarifaSection from "./TarifaSection.vue";
import ProporcionPrimaSection from "./ProporcionPrimaSection.vue";
import ReinstalacionesSection from "./ReinstalacionesSection.vue";
import IntermediariosSection from "./IntermediariosSection.vue";
import CorretajeSection from "./CorretajeSection.vue";
import AdministracionSection from "./AdministracionSection.vue";
const useAEStore = useContratoAEStore();
const { activeTab } = storeToRefs(useAEStore);
</script>
