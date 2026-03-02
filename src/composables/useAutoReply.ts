import type { Message } from '~/types/chat'
import { MessageType } from '~/types/chat'

const REPLY_MIN_DELAY = 1000
const REPLY_MAX_DELAY = 2000

const REPLY_MESSAGE = 'Спасибо за сообщение!)'

export type ReplyCallback = (message: Message) => void

export function useAutoReply(onReply: ReplyCallback) {
  const pendingTimeouts = ref<Set<ReturnType<typeof setTimeout>>>(new Set())

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  function sendAutoReply(chatId: number, _senderId: number) {
    const delay = Math.random() * (REPLY_MAX_DELAY - REPLY_MIN_DELAY) + REPLY_MIN_DELAY

    const timeoutId = setTimeout(() => {
      const replyText = REPLY_MESSAGE

      const reply: Message = {
        id: generateId(),
        chatId,
        text: replyText,
        timestamp: Date.now(),
        type: MessageType.INCOMING,
        isRead: false,
      }

      onReply(reply)
      pendingTimeouts.value.delete(timeoutId)
    }, delay)

    pendingTimeouts.value.add(timeoutId)
  }

  onUnmounted(() => {
    pendingTimeouts.value.forEach((timeoutId) => {
      clearTimeout(timeoutId)
    })
    pendingTimeouts.value.clear()
  })

  return {
    sendAutoReply,
  }
}
