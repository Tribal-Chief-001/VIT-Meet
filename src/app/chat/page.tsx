'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  User,
  RotateCcw,
  Flag,
  X,
  Shield
} from 'lucide-react'
import io, { Socket } from 'socket.io-client'
import Link from 'next/link'
import { getSocketUrl } from '@/lib/socket-client'

interface ChatUser {
  id: string
  email: string
}

export default function ChatPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [remoteUser, setRemoteUser] = useState<ChatUser | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [localUser, setLocalUser] = useState<ChatUser | null>(null)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    // Get user email from localStorage
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      // Redirect back to home if no email
      window.location.href = '/'
      return
    }

    // Initialize socket connection
    socketRef.current = io(getSocketUrl(), {
      transports: ['websocket', 'polling']
    })
    
    const socket = socketRef.current
    
    socket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to server')
      
      // Join with email
      socket.emit('join', { email: userEmail })
      setLocalUser({
        id: socket.id,
        email: userEmail
      })
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from server')
    })

    socket.on('joinSuccess', ({ userId }) => {
      console.log('Successfully joined with userId:', userId)
    })

    socket.on('joinError', ({ message }) => {
      console.error('Join error:', message)
      // Handle join error (e.g., invalid email)
      alert(message)
      window.location.href = '/'
    })

    socket.on('matched', (data: { user: ChatUser }) => {
      console.log('Matched with user:', data.user)
      setRemoteUser(data.user)
      setIsSearching(false)
      // Initiate WebRTC connection
      initiateWebRTCConnection()
    })

    socket.on('partnerDisconnected', () => {
      console.log('Partner disconnected')
      setRemoteUser(null)
      // Reset peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    })

    // WebRTC signaling handlers
    socket.on('offer', async ({ from, sdp }) => {
      console.log('Received offer from:', from)
      await handleOffer(from, sdp)
    })

    socket.on('answer', async ({ from, sdp }) => {
      console.log('Received answer from:', from)
      await handleAnswer(from, sdp)
    })

    socket.on('ice-candidate', async ({ from, candidate }) => {
      console.log('Received ICE candidate from:', from)
      await handleIceCandidate(from, candidate)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
    }
  }, [])

  const initiateWebRTCConnection = () => {
    if (!socketRef.current || !remoteUser) return

    console.log('Initiating WebRTC connection with:', remoteUser.id)
    
    // Initialize WebRTC peer connection
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.lgoogle.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    })

    const peerConnection = peerConnectionRef.current

    // Add local media stream
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
      })
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to:', remoteUser.id)
        socketRef.current?.emit('ice-candidate', {
          candidate: event.candidate,
          to: remoteUser.id
        })
      }
    }

    // Handle remote media stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote track')
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState)
      if (peerConnection.connectionState === 'failed') {
        console.error('WebRTC connection failed')
        // Try to reconnect
        setTimeout(() => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
            peerConnectionRef.current = null
          }
          initiateWebRTCConnection()
        }, 2000)
      }
    }

    // Create and send offer
    peerConnection.createOffer()
      .then(offer => {
        console.log('Created offer, setting local description')
        return peerConnection.setLocalDescription(offer)
      })
      .then(() => {
        console.log('Sending offer to:', remoteUser.id)
        socketRef.current?.emit('offer', {
          sdp: peerConnection.localDescription,
          to: remoteUser.id
        })
      })
      .catch(error => {
        console.error('Error creating offer:', error)
      })
  }

  const handleOffer = async (from: string, sdp: any) => {
    if (!peerConnectionRef.current) {
      // Initialize peer connection for answer
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      })

      const peerConnection = peerConnectionRef.current

      // Add local media stream
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream)
        })
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            candidate: event.candidate,
            to: from
          })
        }
      }

      // Handle remote media stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState)
      }
    }

    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
      console.log('Set remote description from offer')
      
      const answer = await peerConnectionRef.current.createAnswer()
      console.log('Created answer')
      
      await peerConnectionRef.current.setLocalDescription(answer)
      console.log('Set local description for answer')
      
      socketRef.current?.emit('answer', {
        sdp: peerConnectionRef.current.localDescription,
        to: from
      })
      console.log('Sent answer to:', from)
    } catch (error) {
      console.error('Error handling offer:', error)
    }
  }

  const handleAnswer = async (from: string, sdp: any) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp))
      console.log('Set remote description from answer')
    } catch (error) {
      console.error('Error handling answer:', error)
    }
  }

  const handleIceCandidate = async (from: string, candidate: any) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
      console.log('Added ICE candidate from:', from)
    } catch (error) {
      console.error('Error adding ICE candidate:', error)
    }
  }

  const handleReport = async () => {
    if (!socketRef.current || !remoteUser || !reportReason.trim()) return

    setIsSubmittingReport(true)
    try {
      socketRef.current.emit('report', {
        userId: remoteUser.id,
        reason: reportReason
      })
      
      // Close the dialog and reset form
      setShowReportDialog(false)
      setReportReason('')
      
      // End the chat after reporting
      setTimeout(() => {
        endChat()
      }, 1000)
    } catch (error) {
      console.error('Error submitting report:', error)
    } finally {
      setIsSubmittingReport(false)
    }
  }

  const startSearch = () => {
    if (!socketRef.current) return
    
    console.log('Starting search for partner')
    setIsSearching(true)
    socketRef.current.emit('findPartner')
  }

  const endChat = () => {
    if (socketRef.current) {
      console.log('Ending chat')
      socketRef.current.emit('endChat')
    }
    setRemoteUser(null)
    setIsSearching(false)
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks()
      tracks.forEach(track => {
        if (track.kind === 'video') {
          track.enabled = !track.enabled
        }
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleMic = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks()
      tracks.forEach(track => {
        if (track.kind === 'audio') {
          track.enabled = !track.enabled
        }
      })
      setIsMicOn(!isMicOn)
    }
  }

  const findNewPartner = () => {
    endChat()
    setTimeout(startSearch, 500) // Small delay to ensure proper cleanup
  }

  const initializeMedia = async () => {
    try {
      console.log('Initializing media devices')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        console.log('Media devices initialized successfully')
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Unable to access camera/microphone. Please ensure you have granted the necessary permissions.')
    }
  }

  useEffect(() => {
    initializeMedia()
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-white text-xl font-bold">VIT Random Video Chat</h1>
          <Link href="/guidelines" className="text-gray-300 hover:text-white text-sm flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Guidelines
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Local Video */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  You
                </div>
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <VideoOff className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Remote Video */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {remoteUser ? (
                  <>
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      <User className="h-3 w-3 inline mr-1" />
                      {remoteUser.email.replace('@vitbhopal.ac.in', '')}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    {isSearching ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">Finding someone to chat with...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <User className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Ready to start chatting</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          {remoteUser ? (
            <>
              <Button
                onClick={toggleVideo}
                variant="secondary"
                size="icon"
                className={`h-12 w-12 ${!isVideoOn ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={toggleMic}
                variant="secondary"
                size="icon"
                className={`h-12 w-12 ${!isMicOn ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={findNewPartner}
                variant="outline"
                size="icon"
                className="h-12 w-12 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={() => setShowReportDialog(true)}
                variant="outline"
                size="icon"
                className="h-12 w-12 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Flag className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={endChat}
                variant="destructive"
                size="icon"
                className="h-12 w-12"
              >
                <Phone className="h-5 w-5 rotate-135" />
              </Button>
            </>
          ) : (
            <Button
              onClick={startSearch}
              disabled={isSearching || !isConnected}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Start Chatting'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Community Guidelines Notice */}
      <div className="bg-gray-700 p-2 text-center">
        <p className="text-gray-300 text-xs">
          Please be respectful and follow community guidelines. Inappropriate behavior may result in being banned.
        </p>
      </div>

      {/* Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Report User</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReportDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Please let us know why you're reporting this user. This will end your current chat.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="reportReason" className="text-sm font-medium">
                  Reason for reporting
                </label>
                <textarea
                  id="reportReason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReportDialog(false)}
                  disabled={isSubmittingReport}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReport}
                  disabled={isSubmittingReport || !reportReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}