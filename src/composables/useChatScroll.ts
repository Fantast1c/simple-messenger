export function useChatScroll() {
  const messagesContainer = ref<HTMLElement | null>(null)
  const shouldAutoScroll = ref(true)

  function setScrollContainer(el: HTMLElement | null) {
    messagesContainer.value = el
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'auto',
      })
    }
  }

  function scrollToBottom(smooth = true, force = false) {
    if (!messagesContainer.value)
      return
    if (!force && !shouldAutoScroll.value)
      return

    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }

  function handleScroll() {
    if (!messagesContainer.value)
      return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50
    shouldAutoScroll.value = isNearBottom
  }

  return {
    messagesContainer,
    setScrollContainer,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
  }
}
