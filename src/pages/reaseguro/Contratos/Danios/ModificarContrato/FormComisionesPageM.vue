<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-model="reaseguradora"
            :items="options"
            label="Reaseguradora"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-text-field
            v-model="limiteInf"
            label="Limite inferior"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="limiteSup"
            label="Limite superior"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="comisionDef"
            label="Comisión definitiva"
            max="100"
            min="0"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

      </v-row>
      <v-col class="text-center">
        <v-btn>Cargar comisiones</v-btn>
        <v-btn>Agregar comisión</v-btn>
      </v-col>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar" @click="dialog = true">
          Guardar comisiones
        </v-btn>
      </v-col>
      <br>
      <v-row class="d-flex justify-center align-center">
        <v-col class="text-center" md="5">
          <v-file-input label="Cargar archivo" />
          <v-btn>Desactivar <br> tabla</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </form>
  <div>
    <v-data-table :headers="headers" hide-default-footer :items="items" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'

  const reaseguradora = ref('')
  const limiteInf = ref('')
  const limiteSup = ref('')
  const comisionDef = ref('')

  const headers = [
    { title: 'Reaseguradora', value: 'reaseguradora', align: 'center' },
    { title: 'Limite inferior', value: 'participacion', align: 'center' },
    { title: 'Limite superior', value: 'otorgaPtu', align: 'center' },
    { title: 'Comisión definitiva', value: 'ptu', align: 'center' },
    { title: 'Activo', value: 'activo', align: 'center' },
    { title: 'Editar', value: 'editar', align: 'center' },
  ]
</script>
