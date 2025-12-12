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
        <v-data-table :headers="headers1" hide-default-footer  />
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
  const poliza = ref('')
  const renovacion = ref('')

  const headers1 = [
    { title: 'Detalle de Capa',  key: 'detalleCapa' },
    { title: 'Retención Propia capa N',  key: 'retencionC' },
    { title: 'Techo Capa N',  key: 'techoC' },
    { title: 'Modificar',  key: 'techoC' },
    { title: 'Borrar',  key: 'techoC' },
  ]
</script>
