<template>
  <v-dialog v-model="openDialog" transition="dialog-top-transition" width="auto">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ content }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="closeDialogLogin">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      dialogVisible: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:dialogVisible'],
    methods: {
      closeDialog () {
        this.$emit('update:dialogVisible', false)
      },
      closeDialogLogin () {
        this.$emit('update:dialogVisible', false)
        this.$router.push({ name: 'login' })
      },
    },
  }
</script>
