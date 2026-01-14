<template>
  <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000">
    {{ text }}
    <template v-slot:actions>
      <v-btn variant="text" @click="cerrarSnackbar"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSnackbar } from "@/stores/useSnackbar";

const snackbarStore = useSnackbar();
const { showSnackbar, text, snackbarColor } = storeToRefs(snackbarStore);
const { cerrarSnackbar } = snackbarStore;
</script>