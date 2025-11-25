<template>
  <v-row class="d-flex justify-end">
    <v-col cols="4">
      <v-text-field
        v-model="search"
        class="search"
        density="compact"
        hide-details
        label="Buscar intermediario"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @keydown="onKeyPress"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const emits = defineEmits<{
    onWrite: [searchValue: string]
  }>()

  const props = defineProps<{ initialValueSearch: string, placeholder: string }>()

  /* prop inicial */
  const search = ref(props.initialValueSearch)

  /* evento */
  function onKeyPress () {
    emits('onWrite', search.value)
  }
</script>
