<script setup lang="ts">
import type { MessageBubbleProps } from '~/types/chat'
import { MessageType } from '~/types/chat'

const props = defineProps<MessageBubbleProps>()

const isIncoming = computed(() => props.message.type === MessageType.INCOMING)

const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

const author = computed(() =>
  isIncoming.value ? props.userName : 'Вы',
)

const formattedText = computed(() => {
  return props.message.text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
})

const isoTimestamp = computed(() =>
  new Date(props.message.timestamp).toISOString(),
)
</script>

<template>
  <article
    class="message"
    :class="{
      'message--incoming': isIncoming,
      'message--outgoing': !isIncoming,
    }"
    :aria-label="`Сообщение от ${author}, ${formattedTime}`"
  >
    <div class="message__bubble">
      <p
        class="message__text"
        v-html="formattedText"
      />
      <time
        class="message__time"
        :datetime="isoTimestamp"
      >
        {{ formattedTime }}
      </time>
    </div>
  </article>
</template>

<style scoped lang="scss">
.message {
  display: flex;
  animation: messageAppear 200ms ease-out;

  &__bubble {
    padding: 8px 16px;
    border-radius: 8px;
    position: relative;
  }

  &__text {
    line-height: 1.5;

    strong {
      font-weight: 600;
    }

    em {
      font-style: italic;
    }
  }

  &__time {
    font-size: 14px;
    color: var(--color-text-secondary);
    display: block;
    text-align: right;
  }

  &--incoming {
    justify-content: flex-start;

    .message__bubble {
      background-color: var(--color-message-in);
      border: 1px solid var(--color-border);
      border-bottom-left-radius: 4px;
    }
  }

  &--outgoing {
    justify-content: flex-end;
    margin-left: auto;

    .message__bubble {
      background-color: var(--color-message-out);
      border: 1px solid var(--color-border);
      border-bottom-right-radius: 4px;
    }
  }
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .message {
    animation: none;
  }
}
</style>
