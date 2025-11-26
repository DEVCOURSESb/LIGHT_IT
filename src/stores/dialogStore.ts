import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialog = defineStore('dialog', () => {
  const visible = ref(false)
  const title = ref('')
  const message = ref('')
  const type = ref('info') // success, error, info

  function show (opts: { title?: string, message?: string, type?: string }) {
    title.value = opts.title ?? ''
    message.value = opts.message ?? ''
    type.value = opts.type ?? 'info'
    visible.value = true
  }

  function cerrar () {
    visible.value = false
  }

  return {
    visible,
    title,
    message,
    type,
    show,
    cerrar,
  }
})
