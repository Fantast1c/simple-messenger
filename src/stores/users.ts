import type { JsonPlaceholderUser, User } from '~/types/chat'

const API_URL = 'https://jsonplaceholder.typicode.com/users'
const USER_COUNT = 5

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}?_limit=${USER_COUNT}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const data: JsonPlaceholderUser[] = await response.json()

      users.value = data.map(user => ({
        id: user.id,
        name: user.name,
        username: user.username,
        isOnline: Math.random() > 0.3,
      }))
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to fetch users:', err)
    }
    finally {
      isLoading.value = false
    }
  }

  const getUserById = (id: number): User | undefined => {
    return users.value.find(u => u.id === id)
  }

  const updateUserStatus = (id: number, isOnline: boolean) => {
    const user = users.value.find(u => u.id === id)
    if (user) {
      user.isOnline = isOnline
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    getUserById,
    updateUserStatus,
  }
})
