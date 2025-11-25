<template>
  <v-btn class="btn-agregar" @click="$emit('onModifyActive')">
    + {{ props.textButton ?? "Abrir Modal" }}
  </v-btn>

  <v-dialog v-model="props.isActive" max-width="500">
    <v-card :title="props.title ?? 'Titulo Modal'">
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-btn block text="Cerrar" @click="$emit('onModifyActive')"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    textButton?: string
    title?: string
    isActive: boolean
  }>()

  defineEmits<{ onModifyActive: [] }>()
</script>
