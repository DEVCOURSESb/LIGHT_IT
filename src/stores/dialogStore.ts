import { defineStore } from 'pinia'
import { ref } from 'vue'


enum DialogType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

interface action {
  text: string;
  handler: () => any;
  color?: string;
}

interface ShowProps { 
  title: string;
  message: string;
  type: DialogType
  ExtraAction?: action;
}

export const useDialog = defineStore('dialog', () => {
  const visible = ref(false)
  const title = ref('')
  const message = ref('')
  const type = ref<DialogType>(DialogType.INFO)

  function show (opts: ShowProps) {
    title.value = opts.title ?? ''
    message.value = opts.message ?? ''
    type.value = opts.type ?? DialogType.INFO
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
