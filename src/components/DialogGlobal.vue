<template>
  <v-dialog
    v-model="dialog.visible"
    max-width="420"
    transition="dialog-top-transition"
  >
    <v-card>

      <!-- TÍTULO -->
      <v-card-title class="text-h6 d-flex align-center">
        <v-icon
          class="mr-2"
          :color="iconColor"
        >
          {{ iconName }}
        </v-icon>

        {{ dialog.title }}
      </v-card-title>

      <!-- MENSAJE -->
      <v-card-text class="text-center">
        <span
          v-if="dialog.message.includes('<br')"
          v-html="dialog.message"
        />
        <span v-else>
          {{ dialog.message }}
        </span>
      </v-card-text>

      <!-- ACCIONES -->
      <v-card-actions class="pa-4 d-flex flex-column ga-2">

        <!-- CONFIRM -->
        <template v-if="dialog.type === DialogType.CONFIRM">
          
          <v-btn
          color="primary"
          block
          @click="dialog.confirmar"
          >
          Confirmar
        </v-btn>
        <v-btn
          variant="text"
          color="grey"
          block
          @click="dialog.cancelar"
        >
          Cancelar
        </v-btn>
        </template>

        <!-- NORMAL -->
        <template v-else>

          <!-- BOTÓN PRINCIPAL -->
          <v-btn
            block
            :variant="dialog.ExtraAction ? 'text' : 'flat'"
            :color="dialog.ExtraAction ? 'grey' : 'primary'"
            @click="dialog.cerrar"
          >
            {{ dialog.ExtraAction ? 'Cancelar' : 'Aceptar' }}
          </v-btn>

          <!-- EXTRA ACTION -->
          <v-btn
            v-if="dialog.ExtraAction"
            block
            :color="dialog.ExtraAction.color || 'primary'"
            @click="handleExtraAction"
          >
            {{ dialog.ExtraAction.text }}
          </v-btn>

        </template>

      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDialog, DialogType } from '@/stores/general/dialogStore'

const dialog = useDialog()

const iconColor = computed(() => {
  if (dialog.type === DialogType.SUCCESS) return 'green'
  if (dialog.type === DialogType.ERROR) return 'red'
  if (dialog.ExtraAction) return 'primary'
  return 'primary'
})

const iconName = computed(() => {
  if (dialog.type === DialogType.SUCCESS) return 'mdi-check-circle'
  if (dialog.type === DialogType.ERROR) return 'mdi-alert-circle'
  if (dialog.ExtraAction) return 'mdi-help-circle'
  return 'mdi-information'
})

const handleExtraAction = () => {
  const shouldAutoClose = dialog.autoCloseExtraAction

  dialog.ExtraAction?.handler()

  if (shouldAutoClose) {
    dialog.cerrar()
  }
}
</script>