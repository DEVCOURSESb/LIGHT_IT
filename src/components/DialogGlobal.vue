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
        <span v-if="dialog.message.includes('<br')" v-html="dialog.message"></span>
        <span v-else>{{ dialog.message }}</span>
      </v-card-text>

      <!-- ACCIONES -->
      <v-card-actions class="pa-4">

        <!-- CONFIRM -->
        <template v-if="dialog.type === DialogType.CONFIRM">
          <v-btn
            variant="text"
            color="grey"
            @click="dialog.cancelar"
          >
            Cancelar
          </v-btn>

          <v-spacer />

          <v-btn
            color="primary"
            @click="dialog.confirmar"
          >
            Confirmar
          </v-btn>
        </template>

        <!-- NORMAL (SUCCESS / ERROR / INFO) -->
        <template v-else>
          <v-btn
            block
            color="primary"
            @click="dialog.cerrar"
          >
            Aceptar
          </v-btn>

          <v-btn
            v-if="dialog.ExtraAction"
            block
            class="mt-2"
            :color="dialog.ExtraAction.color || 'secondary'"
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
import { useDialog, DialogType } from '@/stores/dialogStore'

const dialog = useDialog()

const iconColor = computed(() => {
  if (dialog.type === DialogType.SUCCESS) return 'green'
  if (dialog.type === DialogType.ERROR) return 'red'
  return 'primary'
})

const iconName = computed(() => {
  if (dialog.type === DialogType.SUCCESS) return 'mdi-check-circle'
  if (dialog.type === DialogType.ERROR) return 'mdi-alert-circle'
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
