<template>
  <v-row class="d-flex justify-end">
    <v-col cols="4">
      <v-text-field
        v-model="search"
        density="compact"
        hide-details
        :label="`Buscar ${placeholder}`"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
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
  const search = ref(props.initialValueSearch)
  const { placeholder } = props

  /* evento */
  function onKeyPress () {
    // eslint-disable-next-line vue/custom-event-name-casing
    emits('onWrite', search.value)
  }
</script>
