<script setup lang="ts">
const chatsStore = useChatsStore()
const route = useRoute()
const router = useRouter()

const hasActiveChat = computed(() => !!chatsStore.activeChatId)

function goBack() {
  chatsStore.setActiveChat(null)
  router.push('/')
}

watch(() => route.path, (path) => {
  if (path === '/') {
    chatsStore.setActiveChat(null)
  }
}, { immediate: true })

onMounted(() => {
  const params = route.params as { id?: string }
  const chatId = params.id ? Number(params.id) : null
  if (chatId && !Number.isNaN(chatId) && chatId > 0) {
    chatsStore.setActiveChat(chatId)
  }
})
</script>

<template>
  <div class="messenger-layout">
    <ChatList class="messenger-layout__sidebar" />
    <ChatWindow
      :show-back-button="hasActiveChat"
      class="messenger-layout__content"
      @back="goBack"
    />
  </div>
</template>

<style scoped lang="scss">
.messenger-layout {
  display: grid;
  grid-template-columns: clamp(280px, 30vw, 360px) 1fr;
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background-color: var(--color-bg);

  &__sidebar,
  &__content {
    overflow: hidden;
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;

    &__sidebar,
    &__content {
      display: none;
    }

    &:has(.chat-window--empty) &__sidebar,
    &:not(:has(.chat-window--empty)) &__content {
      display: flex;
    }
  }
}
</style>
