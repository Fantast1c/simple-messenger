<script setup lang="ts">
import type { Chat } from '~/types/chat'

interface Props {
  showBackButton?: boolean
}

const { showBackButton = false } = defineProps<Props>()

const emit = defineEmits<{
  back: []
}>()

const chatsStore = useChatsStore()
const messagesStore = useMessagesStore()
const usersStore = useUsersStore()

const messageListRef = useTemplateRef<HTMLElement>('messageListRef')
const inputRef = useTemplateRef<{ focus: () => void }>('inputRef')

const { setScrollContainer, scrollToBottom, handleScroll } = useChatScroll()

const activeChat = computed(() => chatsStore.activeChat)
const messages = computed(() => {
  if (!activeChat.value)
    return []
  return messagesStore.getMessagesByChatId(activeChat.value.id)
})

const chatPartner = computed(() => {
  if (!activeChat.value)
    return null
  return usersStore.getUserById(activeChat.value.user.id)
})

const statusText = computed(() => {
  if (!chatPartner.value)
    return ''
  return chatPartner.value.isOnline ? 'онлайн' : 'оффлайн'
})

const partnerName = computed(() => chatPartner.value?.name ?? '')

function handleSend(text: string) {
  if (!activeChat.value || !text.trim())
    return
  messagesStore.sendWithReply(activeChat.value.id, text)
  scrollMessagesToBottom(true)
}

function onChatActivated(chat: Chat) {
  messagesStore.generateHistory(chat.id)
  messagesStore.markAllAsRead(chat.id)
  nextTick(() => {
    setScrollContainer(messageListRef.value)
    scrollToBottom(false)
    inputRef.value?.focus()
  })
}

function scrollMessagesToBottom(force = false) {
  nextTick(() => {
    scrollToBottom(true, force)
  })
}

function onMessagesChange() {
  scrollMessagesToBottom(true)
}

watch(activeChat, (chat: Chat | undefined) => {
  if (chat) {
    onChatActivated(chat)
  }
}, { immediate: true })

watch(messages, onMessagesChange, { deep: true, flush: 'post' })
</script>

<template>
  <section
    id="chat-window"
    role="region"
    aria-label="Окно чата"
    class="chat-window"
    :class="{ 'chat-window--empty': !activeChat }"
  >
    <template v-if="activeChat && chatPartner">
      <header class="chat-header">
        <div class="chat-header__user">
          <button
            v-if="showBackButton"
            class="chat-header__back"
            aria-label="Назад к чатам"
            @click="emit('back')"
          >
            <BackIcon />
          </button>
          <OnlineIndicator :is-online="chatPartner.isOnline" />
          <div class="chat-header__info">
            <h2 class="chat-header__name">
              {{ chatPartner.name }}
            </h2>
            <span
              class="chat-header__status"
              aria-live="polite"
            >
              {{ statusText }}
            </span>
          </div>
        </div>
      </header>

      <div
        ref="messageListRef"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        class="chat-messages"
        @scroll="handleScroll"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-wrapper"
        >
          <MessageBubble
            :message="message"
            :user-name="partnerName"
          />
        </div>
      </div>

      <div class="chat-input-area">
        <MessageInput
          ref="inputRef"
          @send="handleSend"
        />
      </div>
    </template>

    <div
      v-else
      role="status"
      aria-label="Выберите чат"
      class="chat-window__empty"
    >
      <p>Выберите чат, чтобы начать общение</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg);
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);

  &__user {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__name {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__status {
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  &__back {
    background: none;
    border: none;
    font-size: 20px;
    color: var(--color-text);
    cursor: pointer;
    padding: 4px 8px;
    margin-right: 4px;
    border-radius: 4px;

    &:hover {
      background: var(--color-surface-hover);
    }
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.chat-input-area {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.chat-window__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: 16px;
  text-align: center;
  padding: 32px;
}

@media (prefers-reduced-motion: reduce) {
  .chat-messages {
    scroll-behavior: auto;
  }
}
</style>
