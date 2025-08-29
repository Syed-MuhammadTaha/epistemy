'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SessionRefreshProps {
  sessionId: string
  isProcessing: boolean
}

export function SessionRefresh({ sessionId, isProcessing }: SessionRefreshProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isProcessing) return

    // Poll the session status every 30 seconds instead of 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/session/${sessionId}/status`)
        if (response.ok) {
          const { status } = await response.json()
          
          // If processing is complete, refresh the page
          if (status === 'completed') {
            router.refresh()
          }
        }
      } catch (error) {
        console.error('Failed to check session status:', error)
      }
    }, 30000) // Changed from 5000 to 30000 (30 seconds)

    return () => clearInterval(interval)
  }, [sessionId, isProcessing, router])

  // This component doesn't render anything visible
  return null
}
