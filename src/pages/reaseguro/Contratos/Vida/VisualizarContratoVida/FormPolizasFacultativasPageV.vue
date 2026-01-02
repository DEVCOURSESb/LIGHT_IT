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
            readonly
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
            readonly
            variant="solo-filled"
          />
        </v-col>
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
    { title: 'Póliza',  key: 'poliza' },
    { title: 'Renovación',  key: 'renovacion' },
  ]
</script>
