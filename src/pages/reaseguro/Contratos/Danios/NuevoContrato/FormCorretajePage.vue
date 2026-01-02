<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="intermediario"
            label="Intermediario"
            :rules="[v => !!v || 'Intermediario requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="reaseguradora"
            class="selectForm"
            label="Reaseguradora"
            :rules="[v => !!v || 'Reaseguradora requerida']"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row >
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="limiteInf"
            label="Limite inferior"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || 'Limite inferior requerido']"
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
            :rules="[v => !!v || 'Limite superior requerido']"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="corretajeDef"
            label="Corretaje definitivo"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || 'Corretaje definitivo requerido']"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="montoCorretajeDef"
            label="Monto corretaje definitivo"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            :rules="[v => !!v || 'Monto corretaje definitivo requerido']"
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
        <v-btn class="btn-guardar"  >
          Guardar corretaje
        </v-btn>
      </v-col>
      <v-col class="text-center">
        <v-btn color="#73D7D9"  >
          Crear contrato
        </v-btn>
      </v-col>
      <br>
      <v-row >
        <v-col class="text-center" md="5">
          <v-file-input
            label="Cargar archivo"
            :rules="[v => !!v || 'Archivo requerido']"
            required
            variant="solo-filled"
          />
          <v-btn>Desactivar <br> tabla</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <div>
    <v-data-table :headers="headers" hide-default-footer  />
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
    { title: 'Intermediario',  key: 'intermediario' },
    { title: 'Reaseguradora',  key: 'reaseguradora' },
    { title: 'Limite inferior',  key: 'limiteInf' },
    { title: 'Limite Superior',  key: 'limiteSup' },
    { title: '% Corretaje definitivo',  key: 'corretajeDeg' },
    { title: 'Monto corretaje definitivo',  key: 'montoCorreDeg' },
    { title: 'Activo',  key: 'activo' },
    { title: 'Editar',  key: 'editar' },
  ]
</script>
