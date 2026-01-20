<template>
  <div>
    <v-card-title class="d-flex align-center"> </v-card-title>

    <v-card-text>
      <v-row class="w-100">
        <v-col cols="4">
          <SearchComponent
            :initial-value-search="search"
            :placeholder="config?.searchPlaceholder ?? ''"
            @on-write="setSearch"
          />
        </v-col>

        <v-col cols="4" class="d-flex align-center justify-center">
          <h2>{{ config.title }}</h2>
        </v-col>

      </v-row>

      <v-data-table
        class="mt-4"
        :headers="config.headers"
        :items="items"
        :loading="loading"
        :search="search"
        striped="odd"
      >
        <template #top>
          <v-toolbar class="encabezado" flat>
            <v-toolbar-title>{{ config.tableTitle }}</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
        </template>

        <template #item.actions="{ item }">
          <v-icon class="edit" size="large" @click="editItem(item)">
            mdi-pencil
          </v-icon>
        </template>

        <!-- Renderizado condicional basado en displayType -->
        <template
          v-for="field in config.fields"
          :key="field.name"
          #[`item.${field.name}`]="{ item }"
        >
          <slot :item="item" :name="`item.${field.name}`">
            <!-- Checkbox disabled para campos booleanos -->
            <v-checkbox
              v-if="field.displayType === 'checkbox'"
              :model-value="getFieldValue(item, field)"
              disabled
              hide-details
              density="compact"
            />

            <!-- Default: texto simple -->
            <span v-else>
              {{ getFieldValue(item, field) }}
            </span>
          </slot>
        </template>
      </v-data-table>
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import ModalComponent from "@/components/catalogos/ModalComponent.vue";
import SearchComponent from "@/components/catalogos/SearchComponent.vue";
import { useCrudGeneric } from "@/composables/catalogos/useCrudGeneric";
import { useSearch } from "@/composables/catalogos/useSearch";

interface CrudConfig {
  entity: string;
  title: string;
  searchPlaceholder: string;
  addButtonText: string;
  modalTitle: string;
  editModalTitle?: string;
  tableTitle: string;
  headers: any[];
  fields: any[];
  validationSchema: any;
  apiActions: any;
}

const props = defineProps<{
  config: CrudConfig;
}>();

const { search, setSearch } = useSearch();

const {
  items,
  formData,
  formErrors,
  loading,
  activeModal,
  editingId,
  toggleModal,
  handleSubmit,
  editItem,
  setFieldValue,
} = useCrudGeneric(props.config);

const visibleFields = computed(() =>
  props.config.fields.filter((field) => !field.hidden)
);

// Helper para obtener valor del campo con transformación
const getFieldValue = (item: any, field: any) => {
  const apiKey = field.dataKey || field.name;
  let value = item[apiKey];

  if (field.transformFromAPI) {
    value = field.transformFromAPI(value);
  }

  return value;
};
</script>
