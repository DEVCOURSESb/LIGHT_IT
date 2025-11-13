<template>
  <v-row>
    <v-col cols="3">
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
import { ref } from "vue";

/* definicion de emision de evento */
const emits = defineEmits<{
  onWrite: [searchValue: string];
}>();

/* declaracion de props a recibir */
const props = defineProps<{ initialValueSearch: string, placeholder: string }>();

/* prop inicial */
const search = ref(props.initialValueSearch);
const { placeholder } = props;

/* evento */
const onKeyPress = () => {
  emits("onWrite", search.value);
};
</script>
