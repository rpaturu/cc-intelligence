import { useCallback, useRef } from 'react'

export interface ScrollApi {
  scrollToBottom: (behavior?: ScrollBehavior) => void
  scrollToStreamingMessage: () => void
  scrollToResearchFindings: () => void
}

export function useGuidedIntelligence(messagesEndRef: React.RefObject<HTMLDivElement | null>): ScrollApi {
  const lastStreamingSelectorRef = useRef<string>('[data-research-streaming="true"]')

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }, [messagesEndRef])

  const scrollToStreamingMessage = useCallback(() => {
    setTimeout(() => {
      const streamingElements = document.querySelectorAll(lastStreamingSelectorRef.current)
      if (streamingElements.length > 0) {
        const latest = streamingElements[streamingElements.length - 1] as HTMLElement
        const container = latest.closest('.research-message-container') as HTMLElement | null
        const target = container ?? latest
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
      } else {
        scrollToBottom()
      }
    }, 100)
  }, [scrollToBottom])

  const scrollToResearchFindings = useCallback(() => {
    setTimeout(() => {
      const findings = document.querySelectorAll('[data-research-findings="true"]')
      if (findings.length > 0) {
        const latest = findings[findings.length - 1] as HTMLElement
        const container = latest.closest('.research-message-container') as HTMLElement | null
        ;(container ?? latest).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      } else {
        scrollToBottom()
      }
    }, 100)
  }, [scrollToBottom])

  return { scrollToBottom, scrollToStreamingMessage, scrollToResearchFindings }
}


