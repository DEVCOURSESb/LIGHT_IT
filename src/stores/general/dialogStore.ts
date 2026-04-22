import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum DialogType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  CONFIRM = 'confirm'
}

interface Action {
  text: string
  handler: () => void
  color?: string
}

interface ShowProps {
  title: string
  message: string
  type?: DialogType
  ExtraAction?: Action
  autoCloseExtraAction?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

export const useDialog = defineStore('dialog', () => {
  const visible = ref(false)
  const title = ref('')
  const message = ref('')
  const type = ref<DialogType>(DialogType.INFO)

  const ExtraAction = ref<Action | undefined>(undefined)
  const autoCloseExtraAction = ref(true)

  const onConfirm = ref<(() => void) | null>(null)
  const onCancel = ref<(() => void) | null>(null)

  function show(opts: ShowProps) {
    title.value = opts.title
    message.value = opts.message
    type.value = opts.type ?? DialogType.INFO
    ExtraAction.value = opts.ExtraAction

    onConfirm.value = opts.onConfirm ?? null
    onCancel.value = opts.onCancel ?? null

    autoCloseExtraAction.value = opts.autoCloseExtraAction ?? true

    visible.value = true
  }

  function confirmar() {
    onConfirm.value?.()
    cerrar()
  }

  function cancelar() {
    onCancel.value?.()
    cerrar()
  }

  function cerrar() {
    visible.value = false
    onConfirm.value = null
    onCancel.value = null
    ExtraAction.value = undefined
  }

  return {
    visible,
    title,
    message,
    type,
    ExtraAction,
    autoCloseExtraAction,
    show,
    confirmar,
    cancelar,
    cerrar,
    onCancel,
    onConfirm,
  }
})
