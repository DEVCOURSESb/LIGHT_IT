<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="poliza"
            :items="options"
            label="Póliza"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
        >
          <v-select
            v-model="renovacion"
            class="selectForm"
            :items="options"
            label="Renovación"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-btn
          class="ma-2"
          color="indigo"
          icon="mdi mdi-plus"
          max-height="30px"
          max-width="30px"
        />
      </v-row>
      <v-spacer />
      <br>
    </v-container>
  </form>
  <div>
    <v-row class="d-flex justify-center align-center">
      <v-col>
        <v-data-table v-if="tipoContrato === 'EXCEDENTE POR CAPAS'" :headers="headers1" hide-default-footer :items="items" />
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" >
      Guardar pólizas
    </v-btn>
  </v-col>
</template>

<script lang="ts"setup>
  import { ref } from 'vue'
  const subramo = ref('')
  const idContrato = ref('')
  const inicioContrato = ref('')
  const finContrato = ref('')
  const tipoReaseguro = ref('')
  const tipoContrato = ref('')
  const formaContractual = ref('')
  const criterioCobertura = ref('')
  const negociosCubiertos = ref('')
  const moneda = ref('')
  const cesion = ref('')

  const headers1 = [
    { title: 'Detalle de Capa', value: 'detalleCapa', align: 'center' },
    { title: 'Retención Propia capa N', value: 'retencionC', align: 'center' },
    { title: 'Techo Capa N', value: 'techoC', align: 'center' },
    { title: 'Modificar', value: 'techoC', align: 'center' },
    { title: 'Borrar', value: 'techoC', align: 'center' },
  ]
</script>
