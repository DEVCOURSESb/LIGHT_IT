<template>
  <v-app-bar app class="text-white" color="#003c71" elevation="4">
    <div class="d-flex align-center ml-4" style="width: 150px; cursor: pointer;" @click="goHome">
      <v-img contain max-height="50" src="/src/assets/logo/latino-seguros-logo-blanco.png" />
    </div>

    <v-spacer />

    <div class="d-flex align-center gap-2">
      <v-btn rounded="xl" :to="{ name: 'home' }" variant="text">
        <v-icon start>mdi-home</v-icon>
        Inicio
      </v-btn>

      <Administracion />
      <CatalogosDropdown />
      <Reaseguro />
    </div>
    <v-spacer />

    <v-btn v-bind="openDialog" class="mr-4" rounded="xl" :to="{ name: 'login' }" variant="text">
      <v-icon start>mdi-logout</v-icon>
      Salir
    </v-btn>
    <DialogComponent
      v-model:dialog-visible="fal"
      content="Este es el contenido del diálogo."
      title="Título del Diálogo"
      @update:dialog-visible="false"
    />
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import Administracion from './administracion/Administracion.vue'
  import CatalogosDropdown from './catalogos/CatalogosDropdown.vue'
  import DialogComponent from './DialogComponent.vue'
  import Reaseguro from './reaseguro/Reaseguro.vue'

  const router = useRouter()

  function goHome() {
    router.push({ name: 'home' })
  }

</script>
