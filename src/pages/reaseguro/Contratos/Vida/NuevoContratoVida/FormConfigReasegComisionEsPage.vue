<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="4"
        >
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
        <v-col cols="12" md="4">
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
        <v-col cols="12" md="4">
          <v-text-field
            v-model="comisionDef"
            label="Comisión definitiva"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-row>
      <v-col class="text-center">
        <v-btn>Cargar comisiones</v-btn>
        <v-btn>Agregar comisión</v-btn>
      </v-col>
    </v-row>
    <br>
    <v-col class="text-center">
      <v-btn class="btn-guardar" @click="dialog = true">
        Guardar
        <br> comisiones
      </v-btn>
    </v-col>
    <br>
    <v-row class="d-flex justify-center align-center">
      <v-col class="text-center" md="5">
        <v-file-input label="Cargar archivo" />
        <v-btn>Borrar <br> tabla</v-btn>
      </v-col>
    </v-row>
    <br>
    <div>
      <v-row class="d-flex justify-center align-center">
        <v-col>
          <v-data-table :headers="headers" hide-default-footer />
        </v-col>
      </v-row>
    </div>
  </form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const limiteInf = ref('')
  const limiteSup = ref('')
  const comisionDef = ref('')

  const headers = [
    { title: 'Tipo de cobertura', value: 'tipoCobertura', align: 'center' },
    { title: 'Limite inf (% siniestralidad)', value: 'limiteInf', align: 'center' },
    { title: 'Limite sup (% siniestralidad)', value: 'limiteSup', align: 'center' },
    { title: '% Comisión definitiva', value: 'comisionDef', align: 'center' },
    { title: 'Modificar', value: 'modificar', align: 'center' },
    { title: 'Borrar', value: 'borrar', align: 'center' },
  ]

</script>
