<template>
  <v-dialog
    v-model="dialog.visible"
    max-width="420"
    transition="dialog-top-transition"
  >
    <v-card>
      <v-card-title class="text-h6 d-flex align-center">
        <v-icon
          class="mr-2"
          :color="dialog.type === 'success'
            ? 'green'
            : dialog.type === 'error'
              ? 'red'
              : 'primary'"
        >
          {{
            dialog.type === 'success'
              ? 'mdi-check-circle' :
                dialog.type === 'error'
                  ? 'mdi-alert-circle' :
                    'mdi-information'
          }}
        </v-icon>
        {{ dialog.title }}
      </v-card-title>

      <v-card-text>
        {{ dialog.message }}
      </v-card-text>

      <v-card-actions>
        <v-btn block color="primary" @click="dialog.cerrar()">
          Aceptar
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useDialog } from '@/stores/dialogStore'
  const dialog = useDialog()
</script>
