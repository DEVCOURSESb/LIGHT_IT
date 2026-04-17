<template>
  <v-window v-model="activeTab">
    <v-window-item value="tab-1">
      <generales-section />
    </v-window-item>
    <v-window-item value="tab-2" v-show="isTypeProporcional">
      <detalles-proporcionales-section />
    </v-window-item>
    <v-window-item value="tab-3" v-show="isFacultativo">
      <polizas-facultativas-section />
    </v-window-item>
    <v-window-item value="tab-4">
      <reaseguradores-section />
    </v-window-item>
    <v-window-item value="tab-5" v-show="haveComisionEscalonada">
      <comisiones-rate-on-line-section />
    </v-window-item>
    <v-window-item value="tab-6">
      <coberturas-section />
    </v-window-item>
    <v-window-item value="tab-7" v-show="tipoContrato == 3">
      <excedentes-section />
    </v-window-item>
    <v-window-item value="tab-8" v-show="haveCumulos">
      <cumulos-section />
    </v-window-item>
    <v-window-item value="tab-9" v-show="isTypeProporcional">
      <tarifa-section />
    </v-window-item>
    <v-window-item value="tab-10" v-show="haveProporcionDias">
      <proporcion-prima-section />
    </v-window-item>
    <v-window-item value="tab-11" v-show="!isTypeProporcional">
      <reinstalaciones-section />
    </v-window-item>
    <v-window-item value="tab-12">
      <intermediarios-section />
    </v-window-item>
    <v-window-item value="tab-13" v-show="haveCorretajeEscalonado">
      <corretaje-section />
    </v-window-item>
    <v-window-item value="tab-14">
      <administracion-section />
    </v-window-item>
  </v-window>
</template>
<script lang="ts" setup>
import { useContratoAEStore } from "@/stores/reaseguro/contratos/accidentesEnfermedadesStore";
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
const { activeTab, isTypeProporcional, isFacultativo, haveComisionEscalonada, tipoContrato, haveCumulos, haveProporcionDias, haveCorretajeEscalonado } = storeToRefs(useAEStore);
</script>
