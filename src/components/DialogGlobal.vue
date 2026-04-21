<template>
  <v-dialog
    v-model="dialog.visible"
    max-width="420"
    transition="dialog-top-transition"
    scrollable
  >
    <v-card class="rounded-lg overflow-hidden">

      <!-- TÍTULO -->
      <v-card-title class="text-h6 d-flex align-center justify-center py-4 px-6 text-center">
        <v-icon
          class="mr-2"
          :color="iconColor"
        >
          {{ iconName }}
        </v-icon>

        <span class="font-weight-medium">
          {{ dialog.title }}
        </span>
      </v-card-title>

      <!-- MENSAJE -->
      <v-card-text class="px-6 pb-2 text-center">
        <span
          v-if="dialog.message.includes('<br')"
          v-html="dialog.message"
        />
        <span v-else>
          {{ dialog.message }}
        </span>
      </v-card-text>

      <!-- ACCIONES -->
      <v-card-actions class="px-6 pb-6 pt-2 d-flex flex-column">

        <!-- CONFIRM -->
        <template v-if="dialog.type === DialogType.CONFIRM">
          <div class="w-100 d-flex align-center">
            <v-btn
              variant="text"
              color="grey"
              @click="dialog.cancelar"
            >
              Cancelar
            </v-btn>

            <v-spacer />

            <v-btn
              color="secondary"
              variant="elevated"
              @click="dialog.confirmar"
            >
              Confirmar
            </v-btn>
          </div>
        </template>

        <!-- NORMAL -->
        <template v-else>

          <!-- BOTÓN PRINCIPAL -->
          <v-btn
            block
            color="secondary"
            variant="elevated"
            @click="dialog.cerrar"
          >
            {{ dialog.ExtraAction ? 'Cancelar' : 'Aceptar' }}
          </v-btn>

          <!-- EXTRA ACTION -->
          <v-btn
            v-if="dialog.ExtraAction"
            block
            class="mt-3"
            color="secondary"
            variant="outlined"
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