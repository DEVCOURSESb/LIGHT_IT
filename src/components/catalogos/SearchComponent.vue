<template>
  <v-row class="d-flex justify-end">
    <v-col cols="4">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        :label="`Buscar ${placeholder}`"
        variant="outlined"
        density="comfortable"
        hide-details
        @keyup="onKeyPress"
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
const search = ref(props.initialValueSearch);
const { placeholder } = props;

  /* evento */
  function onKeyPress () {
    emits('onWrite', search.value)
  }
</script>
