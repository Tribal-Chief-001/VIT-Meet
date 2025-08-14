'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LiveKitService } from '@/lib/livekit'

export default function RoomPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('connecting')
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId as string

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const storedEmail = localStorage.getItem('vit-email')
    if (!storedEmail) {
      router.push('/')
      return
    }

    // Initialize LiveKit video chat
    initializeLiveKitChat()
    
    return () => {
      // Cleanup when component unmounts
      const liveKitInstance = (window as any).liveKitInstance
      if (liveKitInstance) {
        liveKitInstance.disconnect()
      }
    }
  }, [roomId, router])

  const initializeLiveKitChat = async () => {
    try {
      setStatus('connecting')
      
      // Get LiveKit token
      const storedEmail = localStorage.getItem('vit-email')
      const response = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: storedEmail,
          roomName: roomId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get LiveKit token')
      }

      const { token, url } = await response.json()
      
      // Create a new LiveKit service instance for this room
      const liveKitInstance = new LiveKitService()
      
      // Set up LiveKit event handlers
      liveKitInstance.onConnected(() => {
        setIsConnected(true)
        setStatus('connected')
      })

      liveKitInstance.onDisconnected(() => {
        setIsConnected(false)
        setStatus('disconnected')
        setError('Connection lost. Please try again.')
      })

      liveKitInstance.onTrackSubscribed((track, publication) => {
        if (track.kind === 'video' && remoteVideoRef.current) {
          track.attach(remoteVideoRef.current)
        } else if (track.kind === 'audio' && remoteVideoRef.current) {
          track.attach(remoteVideoRef.current)
        }
      })

      liveKitInstance.onTrackUnsubscribed((track, publication) => {
        track.detach()
      })

      // Initialize LiveKit connection
      await liveKitInstance.initialize({
        url,
        token,
        roomName: roomId
      })
      
      // Store the instance for later use
      ;(window as any).liveKitInstance = liveKitInstance
      
      // Set up local video
      const room = liveKitInstance.getRoom()
      if (room && localVideoRef.current) {
        const localParticipant = room.localParticipant
        const videoTrack = localParticipant.getTrack('video')
        const audioTrack = localParticipant.getTrack('audio')
        
        if (videoTrack) {
          videoTrack.attach(localVideoRef.current)
        }
        if (audioTrack) {
          audioTrack.attach(localVideoRef.current)
        }
      }
      
    } catch (err) {
      console.error('Failed to initialize LiveKit:', err)
      setError('Failed to connect to video chat. Please check your camera/microphone permissions.')
      setStatus('error')
    }
  }

  const toggleMute = async () => {
    try {
      const liveKitInstance = (window as any).liveKitInstance
      if (liveKitInstance) {
        await liveKitInstance.toggleAudio(!isMuted)
        setIsMuted(!isMuted)
      }
    } catch (err) {
      console.error('Failed to toggle audio:', err)
    }
  }

  const toggleVideo = async () => {
    try {
      const liveKitInstance = (window as any).liveKitInstance
      if (liveKitInstance) {
        await liveKitInstance.toggleVideo(!isVideoOff)
        setIsVideoOff(!isVideoOff)
      }
    } catch (err) {
      console.error('Failed to toggle video:', err)
    }
  }

  const skipPartner = () => {
    // Leave current room and go back to waiting
    const liveKitInstance = (window as any).liveKitInstance
    if (liveKitInstance) {
      liveKitInstance.disconnect()
    }
    router.push('/waiting')
  }

  const leaveCall = () => {
    // Clean up and go back to home
    const liveKitInstance = (window as any).liveKitInstance
    if (liveKitInstance) {
      liveKitInstance.disconnect()
    }
    localStorage.removeItem('vit-email')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">VIT Meet</h1>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status === 'connected' ? 'bg-green-100 text-green-800' : 
              status === 'connecting' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {status === 'connected' ? 'Connected' : 
               status === 'connecting' ? 'Connecting...' : 'Error'}
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Local Video */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {isVideoOff && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">Camera Off</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  You
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Remote Video */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {status === 'connecting' && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-400">Connecting to partner...</p>
                    </div>
                  </div>
                )}
                {status === 'connected' && !remoteVideoRef.current?.srcObject && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">Waiting for partner's video...</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Partner
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={toggleMute}
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
                className="flex items-center space-x-2"
                disabled={!isConnected}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMuted ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-5.5-8.5l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.5 15.5m0-10l4.707 4.707" />
                  )}
                </svg>
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </Button>

              <Button
                onClick={toggleVideo}
                variant={isVideoOff ? "destructive" : "secondary"}
                size="lg"
                className="flex items-center space-x-2"
                disabled={!isConnected}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isVideoOff ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  )}
                </svg>
                <span>{isVideoOff ? 'Turn On Camera' : 'Turn Off Camera'}</span>
              </Button>

              <Button
                onClick={skipPartner}
                variant="outline"
                size="lg"
                className="flex items-center space-x-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                disabled={!isConnected}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span>Skip Partner</span>
              </Button>

              <Button
                onClick={leaveCall}
                variant="destructive"
                size="lg"
                className="flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Leave Call</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>• Be respectful and maintain appropriate behavior</p>
          <p>• Press "Skip Partner" to connect with someone else</p>
          <p>• Your camera and microphone are only active during calls</p>
        </div>
      </div>
    </div>
  )
}