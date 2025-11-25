<!-- components/catalogos/CrudTablePage.vue -->
<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center">
        {{ config.title }}
      </v-card-title>

      <v-card-text>
        <div class="d-flex justify-space-between align-center">
          <SearchComponent
            :initialValueSearch="search"
            @on-write="setSearch"
            :placeholder="config.searchPlaceholder"
          />

          <ModalComponent
            :text-button="config.addButtonText"
            :title="editingId ? config.editModalTitle || config.modalTitle : config.modalTitle"
            :is-active="activeModal"
            @onModifyActive="toggleModal"
          >
            <v-form :id="`modal-${config.entity}`" @submit.prevent="handleSubmit">
              <template v-for="field in visibleFields" :key="field.name">
                <v-text-field
                  v-if="field.type === 'text'"
                  :label="field.label"
                  :model-value="formData[field.name]"
                  @update:model-value="setFieldValue(field.name, $event)"
                  :error-messages="formErrors[field.name]"
                  :required="field.required"
                  density="comfortable"
                  class="mb-2"
                />
                <v-select
                  v-else-if="field.type === 'select'"
                  :items="field.items"
                  :label="field.label"
                  :model-value="formData[field.name]"
                  @update:model-value="setFieldValue(field.name, $event)"
                  :error-messages="formErrors[field.name]"
                  :required="field.required"
                  density="comfortable"
                  class="mb-2"
                />
                <v-text-field
                  v-else-if="field.type === 'number'"
                  :label="field.label"
                  :model-value="formData[field.name]"
                  @update:model-value="setFieldValue(field.name, $event)"
                  :error-messages="formErrors[field.name]"
                  :required="field.required"
                  type="number"
                  density="comfortable"
                  class="mb-2"
                />
              </template>
              
              <v-btn 
                class="mt-4" 
                type="submit" 
                block 
                :loading="loading"
                color="primary"
              >
                {{ editingId ? 'Actualizar' : 'Guardar' }}
              </v-btn>
            </v-form>
          </ModalComponent>
        </div>

        <v-data-table
          :headers="config.headers"
          :items="items"
          :search="search"
          :loading="loading"
          class="mt-4"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>{{ config.tableTitle }}</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon 
              size="small" 
              class="mr-2" 
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon 
              size="small" 
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-for="field in config.fields" :key="field.name" v-slot:[`item.${field.name}`]="{ item }">
            <slot :name="`item.${field.name}`" :item="item">
              {{ item[field.name] }}
            </slot>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import ModalComponent from "@/components/catalogos/ModalComponent.vue";
import SearchComponent from "@/components/catalogos/SearchComponent.vue";
import { useSearch } from "@/composables/catalogos/useSearch";
import { useCrudGeneric } from "@/composables/catalogos/useCrudGeneric";

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
  deleteItem,
  setFieldValue,
} = useCrudGeneric(props.config);

const visibleFields = computed(() =>
  props.config.fields.filter((field) => !field.hidden)
);
</script>