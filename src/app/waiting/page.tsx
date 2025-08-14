'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WaitingPage() {
  const [isSearching, setIsSearching] = useState(false)
  const [status, setStatus] = useState('ready')
  const [error, setError] = useState('')
  const [waitingTime, setWaitingTime] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem('vit-email')
    if (!storedEmail) {
      router.push('/')
      return
    }
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSearching) {
      interval = setInterval(() => {
        setWaitingTime(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSearching])

  const startSearching = async () => {
    setIsSearching(true)
    setStatus('searching')
    setError('')
    setWaitingTime(0)

    try {
      const storedEmail = localStorage.getItem('vit-email')
      if (!storedEmail) {
        router.push('/')
        return
      }

      // Join matchmaking pool
      const response = await fetch('/api/matchmaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: storedEmail,
          action: 'join'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to join matchmaking pool')
      }

      const data = await response.json()

      if (data.matched) {
        // Successfully matched with someone
        router.push(`/room/${data.roomName}`)
      } else {
        // Still waiting, poll for matches
        pollForMatch(storedEmail)
      }
    } catch (err) {
      setError('Failed to start searching. Please try again.')
      setIsSearching(false)
      setStatus('ready')
    }
  }

  const pollForMatch = async (email: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/matchmaking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            action: 'join'
          })
        })

        if (!response.ok) {
          throw new Error('Failed to poll for match')
        }

        const data = await response.json()

        if (data.matched) {
          clearInterval(pollInterval)
          router.push(`/room/${data.roomName}`)
        }
      } catch (err) {
        console.error('Error polling for match:', err)
      }
    }, 3000) // Poll every 3 seconds

    // Store interval ID for cleanup
    ;(window as any).matchmakingPoll = pollInterval
  }

  const stopSearching = async () => {
    try {
      const storedEmail = localStorage.getItem('vit-email')
      if (storedEmail) {
        // Leave matchmaking pool
        await fetch('/api/matchmaking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: storedEmail,
            action: 'leave'
          })
        })
      }

      // Clear polling interval
      if ((window as any).matchmakingPoll) {
        clearInterval((window as any).matchmakingPoll)
      }

      setIsSearching(false)
      setStatus('ready')
      setWaitingTime(0)
    } catch (err) {
      console.error('Error stopping search:', err)
    }
  }

  const formatWaitingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Finding a Match</h1>
          <p className="text-gray-600">
            {status === 'searching' ? 'Looking for someone to chat with...' : 'Ready to start chatting'}
          </p>
        </div>
        <div className="px-8 pb-8 text-center space-y-6">
          {status === 'searching' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  We're searching for another VIT student to connect you with...
                </p>
                <div className="text-lg font-semibold text-blue-600">
                  Waiting time: {formatWaitingTime(waitingTime)}
                </div>
              </div>
            </div>
          )}
          
          {status === 'ready' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                Click the button below to start searching for a chat partner
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-3">
            {status === 'ready' ? (
              <button 
                onClick={startSearching} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Start Searching
              </button>
            ) : (
              <button 
                onClick={stopSearching} 
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
              >
                Stop Searching
              </button>
            )}
            
            <button 
              onClick={() => {
                stopSearching()
                localStorage.removeItem('vit-email')
                router.push('/')
              }} 
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Change Email
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-6 space-y-1">
            <p>• All chats are anonymous and private</p>
            <p>• Be respectful and follow community guidelines</p>
            <p>• You can skip to a new partner at any time</p>
            <p>• Average wait time: 1-3 minutes</p>
          </div>
        </div>
      </div>
    </div>
  )
}