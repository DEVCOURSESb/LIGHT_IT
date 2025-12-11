<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-model="intermediario"
            :items="options"
            label="Intermediario"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="reaseguradora"
            class="selectForm"
            :items="options"
            label="Reaseguradora"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="3"
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
            v-model="corretajeDef"
            label="Corretaje definitivo"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="montoCorretajeDef"
            label="Monto corretaje definitivo"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-col class="text-center">
        <v-btn>Cargar corretaje</v-btn>
        <v-btn>Agregar corretaje</v-btn>
      </v-col>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar" @click="dialog = true">
          Guardar corretaje
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn color="#73D7D9" @click="dialog = true">
          Crear contrato
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

  const intermediario = ref('')
  const reaseguradora = ref('')
  const limiteInf = ref('')
  const limiteSup = ref('')
  const corretajeDef = ref('')
  const montoCorretajeDef = ref('')

  const headers = [
    { title: 'Intermediario', value: 'intermediario', align: 'center' },
    { title: 'Reaseguradora', value: 'reaseguradora', align: 'center' },
    { title: 'Limite inferior', value: 'limiteInf', align: 'center' },
    { title: 'Limite Superior', value: 'limiteSup', align: 'center' },
    { title: '% Corretaje definitivo', value: 'corretajeDeg', align: 'center' },
    { title: 'Monto corretaje definitivo', value: 'montoCorreDeg', align: 'center' },
    { title: 'Activo', value: 'activo', align: 'center' },
    { title: 'Editar', value: 'editar', align: 'center' },
  ]
</script>
