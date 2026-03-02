<script setup lang="ts">
const emit = defineEmits<{
  send: [text: string]
}>()

const messageText = ref('')
const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef')

const isEmpty = computed(() => {
  const textContent = messageText.value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .trim()
  return !textContent
})

function handleSend() {
  if (isEmpty.value)
    return

  emit('send', messageText.value.trim())
  messageText.value = ''

  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }

  nextTick(() => {
    textareaRef.value?.focus()
  })
}

function autoResize() {
  const textarea = textareaRef.value
  if (!textarea)
    return

  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
}

function focus() {
  textareaRef.value?.focus()
}

function insertMarkdown(wrapper: string) {
  const textarea = textareaRef.value
  if (!textarea)
    return

  const { selectionStart: start, selectionEnd: end } = textarea
  const text = messageText.value
  const selected = text.slice(start, end)

  messageText.value = selected
    ? `${text.slice(0, start)}${wrapper}${selected}${wrapper}${text.slice(end)}`
    : `${text.slice(0, start)}${wrapper}${wrapper}${text.slice(end)}`

  nextTick(() => {
    textarea.focus()
    const newPos = selected ? end + wrapper.length * 2 : start + wrapper.length
    textarea.setSelectionRange(newPos, newPos)
  })
}

function insertBold() {
  insertMarkdown('**')
}

function insertItalic() {
  insertMarkdown('*')
}

defineExpose({ focus })
</script>

<template>
  <form
    class="message-input"
    @submit.prevent="handleSend"
  >
    <textarea
      ref="textareaRef"
      v-model="messageText"
      class="message-input__field"
      :class="{ 'message-input__field--invalid': isEmpty }"
      rows="1"
      placeholder="Введите сообщение..."
      :aria-invalid="isEmpty"
      @keydown.enter.exact.prevent="handleSend"
      @input="autoResize"
    />
    <div class="message-input__formatting">
      <button
        type="button"
        class="message-input__format-btn"
        title="Жирный (Ctrl+B)"
        aria-label="Жирный текст"
        @click="insertBold"
      >
        <b>B</b>
      </button>
      <button
        type="button"
        class="message-input__format-btn"
        title="Курсив (Ctrl+I)"
        aria-label="Курсивный текст"
        @click="insertItalic"
      >
        <i>i</i>
      </button>
    </div>
    <button
      type="submit"
      class="message-input__button"
      :disabled="isEmpty"
      aria-label="Отправить сообщение"
    >
      <SendIcon />
    </button>
  </form>
</template>

<style scoped lang="scss">
.message-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: var(--color-surface);

  &__field {
    flex: 1;
    padding: 8px 16px;
    border: 1px solid var(--color-border);
    border-radius: 16px;
    font-family: inherit;
    font-size: 16px;
    line-height: 1.5;
    resize: none;
    min-height: 44px;
    max-height: 120px;
    background-color: var(--color-bg);
    color: var(--color-text);

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgb(37 99 235 / 0.4);
      border-color: var(--color-primary);
    }

    &::placeholder {
      color: var(--color-text-muted);
    }
  }

  &__formatting {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__format-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 16px;
    cursor: pointer;
    transition: all 150ms ease;
    flex-shrink: 0;

    &:hover {
      background-color: var(--color-surface);
      border-color: var(--color-primary);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgb(37 99 235 / 0.4);
    }

    b {
      font-weight: 700;
    }

    i {
      font-style: italic;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: white;
    cursor: pointer;
    transition: background-color 150ms ease;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      background-color: var(--color-primary-hover);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgb(37 99 235 / 0.4);
    }

    &:disabled {
      background-color: var(--color-text-muted);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>
