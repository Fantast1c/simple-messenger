<script setup lang="ts">
const chatsStore = useChatsStore()
const router = useRouter()
const { isMobile } = useMobile()

function handleSelect(chatId: number) {
  chatsStore.setActiveChat(chatId)

  if (isMobile.value) {
    router.push(`/chat/${chatId}`)
  }
}
</script>

<template>
  <aside
    id="chat-list"
    role="complementary"
    aria-label="Список чатов"
    class="chat-list"
  >
    <header class="chat-list__header">
      <h1 class="chat-list__title">
        Сообщения
      </h1>
    </header>

    <ul
      v-if="chatsStore.chats.length"
      role="list"
      aria-labelledby="chat-list-title"
      class="chat-list__items"
    >
      <ChatListItem
        v-for="chat in chatsStore.sortedChats"
        :key="chat.id"
        :chat="chat"
        :is-active="chat.id === chatsStore.activeChatId"
        @select="handleSelect"
      />
    </ul>

    <div
      v-else
      role="status"
      class="chat-list__empty"
    >
      Нет активных чатов
    </div>
  </aside>
</template>

<style scoped lang="scss">
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg);
  border-right: 1px solid var(--color-border);

  &__header {
    flex-shrink: 0;
    padding: 16px;
    border-bottom: 1px solid var(--color-border);
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
  }

  &__items {
    flex: 1;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__empty {
    padding: 32px;
    text-align: center;
    color: var(--color-text-secondary);
  }
}
</style>
