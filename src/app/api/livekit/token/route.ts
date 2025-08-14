import { NextRequest, NextResponse } from 'next/server'

// This would normally use LiveKit server SDK, but for now we'll simulate the functionality
// In a real implementation, you would use:
// import { AccessToken } from 'livekit-server-sdk'

export async function POST(request: NextRequest) {
  try {
    const { email, roomName } = await request.json()
    
    // Validate email format
    const VIT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/
    if (!VIT_EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid VIT Bhopal email' }, { status: 400 })
    }

    // In a real implementation, this would generate a LiveKit token
    // For now, we'll return a mock token
    const mockToken = `mock-token-${Math.random().toString(36).substr(2, 9)}`
    
    return NextResponse.json({
      token: mockToken,
      url: process.env.LIVEKIT_URL || 'wss://your-livekit-server',
      roomName: roomName || `room-${Math.random().toString(36).substr(2, 9)}`
    })
  } catch (error) {
    console.error('Error generating LiveKit token:', error)
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}