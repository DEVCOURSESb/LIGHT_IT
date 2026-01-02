<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="poliza"
            label="Póliza"
            :rules="[v => !!v || 'Póliza requerida']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-select
            v-model="renovacion"
            class="selectForm"
            label="Renovación"
            :rules="[v => !!v || 'Renovación requerida']"
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
  </v-form>
  <div>
    <v-row >
      <v-col>
        <v-data-table :headers="headers1" hide-default-footer  />
      </v-col>
    </v-row>
  </div>
  <v-col class="text-center">
    <v-btn class="btn-guardar" >
      Actualizar pólizas
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
