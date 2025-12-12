<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="4">
          <v-select
            v-model="otorgaPtu"
            :items="['SI', 'NO']"
            label="¿Otorga PTU?"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="metodoCalPTU"
            label="Método cálculo PTU"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="ptu"
            label="PTU"
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
            v-model="kPor"
            label="k"
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
            v-model="aniosArrastre"
            label="Años de arrastre"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="gastos"
            label="Gastos"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn>Guardar PTU</v-btn>
        </v-col>
      </v-row>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar"  >
          Guardar reaseguradora
        </v-btn>
      </v-col>
    </v-container>
  </form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const otorgaPtu = ref('')
  const metodoCalPTU = ref('')
  const ptu = ref('')
  const kPor = ref('')
  const aniosArrastre = ref('')
  const gastos = ref('')

</script>
