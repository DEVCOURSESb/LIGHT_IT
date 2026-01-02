<template>
  <v-form>
    <v-container>
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
            v-model="comisionDef"
            label="Comisión definitiva"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || 'Comisión definitiva requerida']"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-row>
      <v-col class="text-center">
        <v-btn>Cargar comisiones</v-btn>
        <v-btn>Agregar comisión</v-btn>
      </v-col>
    </v-row>
    <br>
    <v-col class="text-center">
      <v-btn class="btn-guardar"  >
        Guardar
        <br> comisiones
      </v-btn>
    </v-col>
    <br>
    <v-row >
      <!--Para esta opcion en la parte de FormConfigReasegGeneralPage dentro de tipo de cobertura
      si se selecciona la opción de Variable se aparece este formulario para cargar un archivo CSV -->
      <v-col class="text-center" md="5">
        <v-file-input
          label="Cargar archivo"
          :rules="[v => !!v || 'Archivo CSV requerido']"
          required
          variant="solo-filled"
           />
        <v-btn>Borrar <br> tabla</v-btn>
      </v-col>
    </v-row>
    <br>
    <div>
      <v-row >
        <v-col>
          <v-data-table :headers="headers" hide-default-footer />
        </v-col>
      </v-row>
    </div>
  </v-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const limiteInf = ref('')
  const limiteSup = ref('')
  const comisionDef = ref('')

  const headers = [
    { title: 'Tipo de cobertura',  key: 'tipoCobertura' },
    { title: 'Limite inf (% siniestralidad)',  key: 'limiteInf' },
    { title: 'Limite sup (% siniestralidad)',  key: 'limiteSup' },
    { title: '% Comisión definitiva',  key: 'comisionDef' },
    { title: 'Modificar',  key: 'modificar' },
    { title: 'Borrar',  key: 'borrar' },
  ]

</script>
