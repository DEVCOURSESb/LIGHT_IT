<template>
  <v-tabs v-model="activeTab" align-tabs="center" color="primary">
    <v-tab value="tab-1">Generales</v-tab>
    <v-tab value="tab-2" v-if="isTypeProporcional">Detalles Proporcionales</v-tab>
    <v-tab value="tab-3" v-if="isFacultativo">Pólizas Facultativas</v-tab>
    <v-tab value="tab-4">Reaseguradores</v-tab>
    <v-tab value="tab-5" v-if="haveComisionEscalonada">Comisiones / Rate on line</v-tab>
    <v-tab value="tab-6">Coberturas</v-tab>
    <v-tab value="tab-7" v-if="tipoContrato == 3">Excedentes</v-tab>
    <v-tab value="tab-8" v-if="haveCumulos">Cúmulos</v-tab>
    <v-tab value="tab-9" v-if="isTypeProporcional">Tarifa</v-tab>
    <v-tab value="tab-10" v-if="haveProporcionDias">Proporción de prima</v-tab>
    <v-tab value="tab-11" v-if="!isTypeProporcional">Reinstalaciones</v-tab>
    <v-tab value="tab-12">Intermediarios</v-tab>
    <v-tab value="tab-13" v-if="haveCorretajeEscalonado">Corretaje</v-tab>
    <v-tab value="tab-14">Administración</v-tab>
  </v-tabs>
</template>
<script lang="ts" setup>
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";

const useAEStore = useContratoAEStore();
const { activeTab, isTypeProporcional, isFacultativo, haveComisionEscalonada, tipoContrato, haveCumulos, haveProporcionDias, haveCorretajeEscalonado } = storeToRefs(useAEStore);
</script>
