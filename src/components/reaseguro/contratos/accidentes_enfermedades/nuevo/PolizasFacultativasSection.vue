<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Póliza Facultativa"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const handleSubmit = () => {
  console.log("send");
};
</script>
