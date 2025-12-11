<template>
  <form>
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="3">
          <v-select
            v-model="detalles"
            :items="['Sí', 'No']"
            label="¿Detalles por operación / ramo?"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="tipoOperacionRamo"
            :disabled="detalles === 'No'"
            :items="optionsOperacion"
            label="Tipo operación / ramo"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="operacionRamo"
            :disabled="detalles === 'No'"
            :items="optionsRamo"
            label="Operación / ramo"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="retencion"
            label="Retención"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-percent-outline"
            required
            suffix="%"
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-model="cesion"
            label="Cesión"
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
            v-model="montoRetencion"
            label="Monto retención"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="montoCesion"
            label="Monto cesión"
            prepend-icon=""
            prepend-inner-icon="mdi mdi-currency-usd"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="capacidadContrato"
            label="Capacidad contrato"
            required
            type="number"
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="baseCesion"
            label="Base cesión"
            required
            variant="solo-filled"
          />
        </v-col>

        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="monedaDetalle"
            label="Moneda detalles"
            required
            variant="solo-filled"
          />
        </v-col>

      </v-row>
      <v-col class="text-center">
        <v-btn text="abrirAgregar" @click="dialogComponent=true">Agregar detalles</v-btn>
      </v-col>
      <v-spacer />
      <br>
      <v-col class="text-center">
        <v-btn class="btn-guardar" @click="dialog = true">
          Guardar detalles
        </v-btn>
      </v-col>
    </v-container>
  </form>
  <div>
    <v-data-table :headers="headers" hide-default-footer :items="items" />
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
    { title: '¿Detalles por operación / ramo?', value: 'detalles', align: 'center' },
    { title: 'Tipo operación / ramo', value: 'tipoOperacion', align: 'center' },
    { title: 'Operación / ramo', value: 'operacionRamo', align: 'center' },
    { title: '%Retención', value: 'retencion', align: 'center' },
    { title: '%Cesión', value: 'cesion', align: 'center' },
    { title: 'Monto retención', value: 'montoR', align: 'center' },
    { title: 'Monto cesión', value: 'montoC', align: 'center' },
    { title: 'Capacidad contrato', value: 'capacidadC', align: 'center' },
    { title: 'Base cesión', value: 'baseCesion', align: 'center' },
    { title: 'Moneda detalles', value: 'monedaDetalles', align: 'center' },
    { title: 'Activo', value: 'activo', align: 'center' },
    { title: 'Editar', value: 'editar', align: 'center' },
  ]
</script>
