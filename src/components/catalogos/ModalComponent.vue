<template>
  <v-btn @click="$emit('onModifyActive')" color="surface-variant">
    {{ props.textButton ?? "Abrir Modal" }}
  </v-btn>

  <v-dialog max-width="500" v-model="props.isActive">
    <v-card :title="props.title ?? 'Titulo Modal'">
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-btn text="Cerrar" @click="$emit('onModifyActive')" block></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>

const props = defineProps<{
  textButton?: string;
  title?: string;
  isActive: boolean;
}>();

defineEmits<{ onModifyActive: [] }>();
</script>
