<template>
  <v-form>
    <v-container>
      <v-row >
        <v-col cols="12" md="4">
          <v-select
            v-model="detalles"
            :items="['Sí', 'No']"
            label="¿Detalles por operación / ramo?"
            :rules="[v => !!v || 'Detalles por operación / ramo requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="tipoOperacionRamo"
            :disabled="detalles === 'No'"
            label="Tipo operación / ramo"
            :rules="[v => !!v || 'Tipo operación / ramo requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="operacionRamo"
            :disabled="detalles === 'No'"
            label="Operación / ramo"
            :rules="[v => !!v || 'Operación / ramo requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="retencion"
            label="Retención"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% Retención requerida']"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="cesion"
            label="Cesión"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            :rules="[v => !!v || '% Cesión requerido']"
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
            v-model="montoRetencion"
            label="Monto retención"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            :rules="[v => !!v || 'Monto retención requerida']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="montoCesion"
            label="Monto cesión"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            :rules="[v => !!v || 'Monto cesión requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="capacidadContrato"
            label="Capacidad contrato"
            :rules="[v => !!v || 'Capacidad contrato requerido']"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="baseCesion"
            label="Base cesión"
            :rules="[v => !!v || 'Base cesión requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="monedaDetalle"
            label="Moneda detalles"
            :rules="[v => !!v || 'Moneda detalles requerido']"
            required
            variant="solo-filled"
          />
        </v-col>

      </v-row>
      <v-col class="text-center">
        <v-btn text="abrirAgregar" >Agregar detalles</v-btn>
      </v-col>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar"  >
          Guardar detalles
        </v-btn>
      </v-col>
    </v-container>
  </v-form>
  <div>
    <v-data-table :headers="headers" hide-default-footer  />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const detalles = ref('')
  const tipoOperacionRamo = ref('')
  const operacionRamo = ref('')

  const retencion = ref('')
  const cesion = ref('')
  const montoRetencion = ref('')
  const montoCesion = ref('')
  const capacidadContrato = ref('')
  const baseCesion = ref('')
  const monedaDetalle = ref('')

  const dialog = ref(false)

  watch(detalles, value => {
    if (value === 'No') {
      tipoOperacionRamo.value = ''
      operacionRamo.value = ''
    }
  })
  const headers = [
    { title: '¿Detalles por operación / ramo?',  key: 'detalles' },
    { title: 'Tipo operación / ramo',  key: 'tipoOperacion' },
    { title: 'Operación / ramo',  key: 'operacionRamo' },
    { title: '%Retención',  key: 'retencion' },
    { title: '%Cesión',  key: 'cesion' },
    { title: 'Monto retención',  key: 'montoR' },
    { title: 'Monto cesión',  key: 'montoC' },
    { title: 'Capacidad contrato',  key: 'capacidadC' },
    { title: 'Base cesión',  key: 'baseCesion' },
    { title: 'Moneda detalles',  key: 'monedaDetalles' },
    { title: 'Activo',  key: 'activo' },
    { title: 'Editar',  key: 'editar' },
  ]
</script>
