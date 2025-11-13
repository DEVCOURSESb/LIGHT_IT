<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center"> Intermediarios </v-card-title>

      <v-card-text>
        <div class="d-flex justify-space-between align-center">
          <SearchComponent
            :initialValueSearch="search"
            @on-write="setSearch"
            placeholder="intermediarios"
          />

          <ModalComponent
            text-button="Agregar intermediario"
            title="Agregar nuevo intermediario"
            :is-active="activeModal"
            @onModifyActive="changeActiveModal"
          >
            <v-form id="modalIntermediario" @submit.prevent="submit">
              <div class="d-none">
                <v-text-field
                v-model="id.value.value"
              ></v-text-field>
              </div>
              <v-text-field
                label="Clave"
                v-model="clave.value.value"
                :error-messages="clave.errorMessage.value"
                required
              ></v-text-field>
              <v-text-field
                label="Nombre"
                v-model="nombre.value.value"
                :error-messages="nombre.errorMessage.value"
                required
              ></v-text-field>
              <v-select
                :items="itemsSelect"
                density="comfortable"
                label="Activo"
                v-model="activo.value.value"
                :error-messages="activo.errorMessage.value"
                required
              ></v-select>
              <v-btn class="mt-2" type="submit" block>Guardar</v-btn>
            </v-form>
          </ModalComponent>
        </div>

        <v-data-table
          :headers="headers"
          :items="intermediarios"
          :search="search"
          class="mt-4"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de Intermediarios</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import ModalComponent from "@/components/catalogos/ModalComponent.vue";
import SearchComponent from "@/components/catalogos/SearchComponent.vue";
import { useIntermediarios } from "@/composables/catalogos/useIntermediarios";
import { useSearch } from "@/composables/catalogos/useSearch";

const { headers, intermediarios, id, clave, nombre, activo, itemsSelect, submit, editItem, deleteItem, activeModal, changeActiveModal } = useIntermediarios();
const { search, setSearch } = useSearch();

</script>
