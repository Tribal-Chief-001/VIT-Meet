import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for waiting users (in production, use Redis or similar)
const waitingUsers = new Map<string, { email: string; timestamp: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json()
    
    // Validate email format
    const VIT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/
    if (!VIT_EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid VIT Bhopal email' }, { status: 400 })
    }

    if (action === 'join') {
      // Add user to waiting pool
      waitingUsers.set(email, { email, timestamp: Date.now() })
      
      // Check if there's another user waiting
      const otherUsers = Array.from(waitingUsers.entries()).filter(([key]) => key !== email)
      
      if (otherUsers.length > 0) {
        // Match with the first available user
        const [matchedEmail, matchedUser] = otherUsers[0]
        
        // Remove both users from waiting pool
        waitingUsers.delete(email)
        waitingUsers.delete(matchedEmail)
        
        // Generate a room name
        const roomName = `room-${Math.random().toString(36).substr(2, 9)}`
        
        return NextResponse.json({
          matched: true,
          roomName,
          partnerEmail: matchedEmail
        })
      }
      
      return NextResponse.json({
        matched: false,
        message: 'Waiting for a partner...'
      })
      
    } else if (action === 'leave') {
      // Remove user from waiting pool
      waitingUsers.delete(email)
      
      return NextResponse.json({
        success: true,
        message: 'Left waiting pool'
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Error in matchmaking:', error)
    return NextResponse.json({ error: 'Failed to process matchmaking' }, { status: 500 })
  }
}

export async function GET() {
  // Return current waiting count (for admin/debug purposes)
  return NextResponse.json({
    waitingCount: waitingUsers.size,
    waitingUsers: Array.from(waitingUsers.values())
  })
}