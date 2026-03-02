import type { Message } from '~/types/chat'
import { MessageType } from '~/types/chat'
import { useChatsStore } from './chats'

const SAMPLE_MESSAGES = [
  'Привет! Как дела?',
  'Пойдем на собеседование',
  'Отлично, спасибо! А у тебя?',
  'Работаю над проектом',
  'Звучит интересно!',
  'Да, довольно сложно',
  'У тебя получится!',
  'Спасибо за поддержку',
  'Всегда пожалуйста)',
  'Когда увидимся?',
  'Тестовое задание оно такое',
  'Думаю да, давай в субботу',
  'Отлично, договорились',
  '1000 откликов на вакансию?',
  'Может в том же мите?',
  'Хорошая идея',
  'Во сколько?',
  'Давай в 15:00',
  'Пойдёт, буду там',
  'Супер, до встречи!',
  'Пока!',
  'Мой проект хорош?',
  'Да, очень!',
]

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

function getRandomMessage(): string {
  return SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)]
}

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref<Record<number, Message[]>>({})
  const storage = useLocalStorage()

  const getMessagesByChatId = computed(() => {
    return (chatId: number): Message[] => {
      return messages.value[chatId] ?? []
    }
  })

  function initializeFromStorage() {
    const saved = storage.load() as Record<number, Message[]> | null
    if (saved) {
      messages.value = saved
    }
  }

  function generateHistory(chatId: number, count: number = 25) {
    if (messages.value[chatId]?.length)
      return

    const history: Message[] = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000

    for (let i = 0; i < count; i++) {
      const isIncoming = i % 2 === 0
      history.push({
        id: generateId(),
        chatId,
        type: isIncoming ? MessageType.INCOMING : MessageType.OUTGOING,
        text: getRandomMessage(),
        timestamp: now - Math.random() * 7 * dayMs,
        isRead: true,
      })
    }

    history.sort((a, b) => a.timestamp - b.timestamp)
    messages.value[chatId] = history
  }

  function sendMessage(chatId: number, text: string) {
    const chatMessages = messages.value[chatId] ?? []

    const newMessage: Message = {
      id: generateId(),
      chatId,
      type: MessageType.OUTGOING,
      text,
      timestamp: Date.now(),
      isRead: true,
    }

    chatMessages.push(newMessage)
    messages.value[chatId] = chatMessages

    const chatsStore = useChatsStore()
    chatsStore.updateLastMessage(chatId, newMessage)

    return newMessage
  }

  function receiveMessage(chatId: number, message: Message) {
    const chatMessages = messages.value[chatId] ?? []
    chatMessages.push(message)
    messages.value[chatId] = chatMessages

    const chatsStore = useChatsStore()
    chatsStore.updateLastMessage(chatId, message)
    if (chatsStore.activeChatId !== chatId) {
      chatsStore.incrementUnread(chatId)
    }
  }

  function markAllAsRead(chatId: number) {
    const chatMessages = messages.value[chatId]
    if (!chatMessages)
      return

    for (const msg of chatMessages) {
      if (msg.type === MessageType.INCOMING) {
        msg.isRead = true
      }
    }
  }

  const { sendAutoReply } = useAutoReply((reply) => {
    receiveMessage(reply.chatId, reply)
  })

  function sendWithReply(chatId: number, text: string) {
    sendMessage(chatId, text)
    const chatsStore = useChatsStore()
    const chat = chatsStore.chats.find(c => c.id === chatId)
    if (chat) {
      sendAutoReply(chatId, chat.user.id)
    }
  }

  useAutoSave(messages, 1000)

  return {
    messages,
    getMessagesByChatId,
    initializeFromStorage,
    generateHistory,
    sendMessage,
    receiveMessage,
    sendWithReply,
    markAllAsRead,
  }
})
