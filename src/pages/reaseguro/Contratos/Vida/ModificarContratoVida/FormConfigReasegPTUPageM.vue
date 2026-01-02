<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="otorgaPtu"
            :items="['SI', 'NO']"
            label="¿Otorga PTU?"
            :rules="[v => !!v || 'Otorga PTU requerido']"
            required
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="metodoCalPTU"
            label="Método cálculo PTU"
            :rules="[v => !!v || 'Método de cálculo PTU requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="ptu"
            label="PTU"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% PTU requerido']"
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
            v-model="kPor"
            label="k"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% k requerido']"
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
            v-model="aniosArrastre"
            label="Años de arrastre"
            :rules="[v => !!v || 'Años de arrastre requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="gastos"
            label="Gastos"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% Gastos requerido']"
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
  </v-form>
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
