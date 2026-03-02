const STORAGE_KEY = 'messenger-messages'

export function useLocalStorage() {
  function save(data: unknown): boolean {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(STORAGE_KEY, serialized)
      return true
    }
    catch (error) {
      console.error('Failed to save to localStorage:', error)
      return false
    }
  }

  function load(): unknown | null {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY)
      if (!serialized)
        return null
      return JSON.parse(serialized)
    }
    catch (error) {
      console.error('Failed to load from localStorage:', error)
      return null
    }
  }

  return {
    save,
    load,
  }
}

export function useAutoSave(data: Ref<unknown>, delay: number = 1000) {
  const storage = useLocalStorage()

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  watch(
    data,
    () => {
      if (timeoutId)
        clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        storage.save(toValue(data))
      }, delay)
    },
    { deep: true, flush: 'post' },
  )

  onUnmounted(() => {
    if (timeoutId)
      clearTimeout(timeoutId)
  })
}
