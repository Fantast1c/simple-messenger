<script setup lang="ts">
import type { ChatListItemProps } from '~/types/chat'

const props = defineProps<ChatListItemProps>()
const emit = defineEmits<{
  select: [chatId: number]
}>()

const router = useRouter()

const formattedTime = computed(() => {
  if (!props.chat.lastMessage)
    return ''
  const date = new Date(props.chat.lastMessage.timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
})

const previewText = computed(() => {
  if (!props.chat.lastMessage)
    return 'Начните общение...'
  return props.chat.lastMessage.text.slice(0, 50)
})

const pluralRules = new Intl.PluralRules('ru')
const unreadLabel = computed(() => {
  if (!props.chat.unreadCount)
    return ''
  const rule = pluralRules.select(props.chat.unreadCount)
  const forms: Record<Intl.LDMLPluralRule, string> = {
    one: 'сообщение',
    few: 'сообщения',
    many: 'сообщений',
    other: 'сообщений',
    two: 'сообщения',
    zero: 'сообщений',
  }
  return `${props.chat.unreadCount} непрочитанных ${forms[rule]}`
})

function handleClick() {
  router.push(`/chat/${props.chat.id}`)
  emit('select', props.chat.id)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    router.push(`/chat/${props.chat.id}`)
    emit('select', props.chat.id)
  }
}
</script>

<template>
  <li
    role="listitem"
    class="chat-item"
    :class="{ 'chat-item--active': isActive }"
    :aria-current="isActive ? 'true' : undefined"
  >
    <div
      :aria-label="`Чат ${chat.user.name}`"
      tabindex="0"
      class="chat-item__content"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <div
        class="chat-item__avatar"
        :aria-label="`Аватар ${chat.user.name}`"
      >
        {{ chat.user.name.charAt(0).toUpperCase() }}
      </div>

      <div class="chat-item__info">
        <div class="chat-item__header">
          <span class="chat-item__name">
            {{ chat.user.name }}
          </span>
          <OnlineIndicator :is-online="chat.user.isOnline" />
        </div>

        <p class="chat-item__preview">
          {{ previewText }}
        </p>
      </div>

      <div class="chat-item__meta">
        <time
          v-if="formattedTime"
          class="chat-item__time"
        >
          {{ formattedTime }}
        </time>
        <span
          v-if="chat.unreadCount"
          class="chat-item__badge"
          :aria-label="unreadLabel"
        >
          {{ chat.unreadCount }}
        </span>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.chat-item {
  border-bottom: 1px solid var(--color-border);

  &--active {
    background-color: var(--color-surface);
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    cursor: pointer;
    transition: background-color 150ms ease;

    &:hover {
      background-color: var(--color-surface-hover);
    }

    &:focus-visible {
      outline: none;
      box-shadow: inset 0 0 0 2px var(--color-primary);
    }
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: white;
    font-size: 18px;
    font-weight: 500;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  &__name {
    font-weight: 500;
    color: var(--color-text);
  }

  &__preview {
    margin: 0;
    font-size: 14px;
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  &__time {
    font-size: 14px;
    color: var(--color-text-muted);
  }

  &__badge {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background-color: var(--color-primary);
    color: white;
    font-size: 12px;
    font-weight: 500;
  }
}
</style>
