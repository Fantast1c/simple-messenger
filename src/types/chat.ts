export interface User {
  id: number
  name: string
  username: string
  isOnline: boolean
}

export enum MessageType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

export interface Message {
  id: string
  chatId: number
  type: MessageType
  text: string
  timestamp: number
  isRead: boolean
}

export interface Chat {
  id: number
  user: User
  lastMessage?: Message
  unreadCount: number
}

export interface ChatListItemProps {
  chat: Chat
  isActive: boolean
}

export interface MessageBubbleProps {
  message: Message
  userName: string
}

export interface JsonPlaceholderUser {
  id: number
  name: string
  username: string
  email: string
}
