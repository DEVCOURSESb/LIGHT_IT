<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="5">
          <v-select
            v-model="asignacionCoberturas"
            :items="['POR REASEGURADOR', 'POR CONTRATO']"
            label="Asignación de coberturas"
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <v-select
            v-model="reaseguradora"
            class="selectForm"
            :disabled="asignacionCoberturas === 'POR CONTRATO'"
            label="Reaseguradora"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <v-select
            v-model="operacionRamoCober"
            class="selectForm"
            label="Operación / ramo coberturas"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="5">
          <v-select
            v-model="coberturas"
            class="selectForm"
            label="Coberturas"
            required
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-col class="text-center">
        <v-btn>Agregar cobertura</v-btn>
      </v-col>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar">
          Guardar coberturas
        </v-btn>
      </v-col>
    </v-container>
  </form>
  <div>
    <v-data-table :headers="headers" hide-default-footer  />
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const asignacionCoberturas = ref('')
  const reaseguradora = ref('')
  const operacionRamoCober = ref('')
  const coberturas = ref('')

  watch(asignacionCoberturas, value => {
    if (value === 'POR CONTRATO') {
      reaseguradora.value = ''
    }
  })

  const headers = [
    { title: 'Asignación de coberturas',  key: 'asignacionCoberturas' },
    { title: 'Reaseguradora',  key: 'reaseguradora' },
    { title: 'Operación / ramo coberturas',  key: 'operacionRamoC' },
    { title: 'Ver coberturas',  key: 'verCoberturas' },
    { title: 'Editar',  key: 'editar' },
  ]
</script>
