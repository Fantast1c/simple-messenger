import type { Chat, Message, User } from '~/types/chat'

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<Chat[]>([])
  const activeChatId = ref<number | null>(null)

  const activeChat = computed<Chat | undefined>(() => {
    if (!activeChatId.value)
      return undefined
    return chats.value.find(c => c.id === activeChatId.value)
  })

  const sortedChats = computed(() => {
    return [...chats.value].sort((a, b) => {
      const timeA = a.lastMessage?.timestamp ?? 0
      const timeB = b.lastMessage?.timestamp ?? 0
      return timeB - timeA
    })
  })

  function initializeChats(users: User[]) {
    chats.value = users.map(user => ({
      id: user.id,
      user,
      unreadCount: 0,
    }))
  }

  function markAsRead(chatId: number) {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.unreadCount = 0
    }
  }

  function setActiveChat(chatId: number | null) {
    activeChatId.value = chatId

    if (chatId !== null) {
      markAsRead(chatId)
    }
  }

  function updateLastMessage(chatId: number, message: Message) {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.lastMessage = message
    }
  }

  function incrementUnread(chatId: number) {
    if (activeChatId.value === chatId)
      return

    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.unreadCount++
    }
  }

  function getChatById(id: number): Chat | undefined {
    return chats.value.find(c => c.id === id)
  }

  return {
    chats,
    activeChatId,
    activeChat,
    sortedChats,
    initializeChats,
    setActiveChat,
    updateLastMessage,
    incrementUnread,
    markAsRead,
    getChatById,
  }
})
