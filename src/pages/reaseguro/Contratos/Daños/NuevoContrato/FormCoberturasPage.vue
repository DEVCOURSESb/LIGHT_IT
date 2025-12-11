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
            :items="options"
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
            :items="options"
            label="Operación / ramo coberturas"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="5">
          <v-select
            v-model="coberturas"
            class="selectForm"
            :items="options"
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
        <v-btn class="btn-guardar" @click="dialog = true">
          Guardar coberturas
        </v-btn>
      </v-col>
    </v-container>
  </form>
  <div>
    <v-data-table :headers="headers" hide-default-footer :items="items" />
  </div>
</template>
<script setup>
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
    { title: 'Asignación de coberturas', value: 'asignacionCoberturas', align: 'center' },
    { title: 'Reaseguradora', value: 'reaseguradora', align: 'center' },
    { title: 'Operación / ramo coberturas', value: 'operacionRamoC', align: 'center' },
    { title: 'Ver coberturas', value: 'verCoberturas', align: 'center' },
    { title: 'Editar', value: 'editar', align: 'center' },
  ]
</script>
