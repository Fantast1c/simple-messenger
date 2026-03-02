<script setup lang="ts">
const usersStore = useUsersStore()
const chatsStore = useChatsStore()
const messagesStore = useMessagesStore()

async function initializeApp() {
  messagesStore.initializeFromStorage()

  await usersStore.fetchUsers()

  if (usersStore.users.length) {
    chatsStore.initializeChats(usersStore.users)
  }
}

onMounted(initializeApp)
</script>

<template>
  <div class="app">
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </div>
</template>

<style lang="scss">
.app {
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Scrollbar styling
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-strong);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}
</style>
