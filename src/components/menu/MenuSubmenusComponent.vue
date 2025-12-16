<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text">
        {{ menuTitle }}
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="item in listItems"
        :key="item.name"
        :to="`/${prefixPath}/${item.name}`"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
defineProps<{
  listItems: Array<{ name: string; title: string }>;
  prefixPath: string;
  menuTitle: string;
}>();
</script>
