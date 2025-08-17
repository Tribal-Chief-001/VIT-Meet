const http = require('http')
const next = require('next')
const { Server } = 'socket.io'

// Determine environment
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 10000

// Initialize Next.js
const app = next({ dev, port })
const handler = app.getRequestHandler()

// Create HTTP server
const server = http.createServer(async (req, res) => {
  try {
    // Handle health check
    if (req.url === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: "Good!" }))
      return
    }
    
    // Handle all other requests with Next.js
    await handler(req, res)
  } catch (err) {
    console.error('Error occurred handling', req.url, err)
    res.statusCode = 500
    res.end('internal server error')
  }
})

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.RENDER_EXTERNAL_URL || 'https://vit-meet.onrender.com'] 
      : ['http://localhost:3000'],
    methods: ['GET', 'POST']
  }
})

// User interface
interface User {
  id: string
  email: string
  socket: any
}

// Pairing interface
interface Pairing {
  user1: User
  user2: User
  createdAt: Date
}

class VideoChatServer {
  private io: Server
  private waitingUsers: User[] = []
  private activePairings: Map<string, Pairing> = new Map()
  private userPairings: Map<string, string> = new Map() // Maps user ID to pairing ID

  constructor(socketServer: Server) {
    this.io = socketServer
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Handle user joining with email
      socket.on('join', ({ email }) => {
        if (!email.endsWith('@vitbhopal.ac.in')) {
          socket.emit('joinError', { message: 'Invalid email domain' })
          return
        }

        const user: User = {
          id: socket.id,
          email,
          socket
        }

        console.log(`User ${email} joined with socket ${socket.id}`)
        
        // Add to waiting users
        this.waitingUsers.push(user)
        
        // Try to find a match
        this.findMatch(user)
        
        // Confirm join
        socket.emit('joinSuccess', { userId: socket.id })
      })

      // Handle finding partner
      socket.on('findPartner', () => {
        const user = this.waitingUsers.find(u => u.id === socket.id)
        if (user) {
          console.log(`User ${user.email} is looking for a partner`)
          this.findMatch(user)
        }
      })

      // Handle WebRTC signaling
      socket.on('offer', ({ to, sdp }) => {
        console.log(`Offer from ${socket.id} to ${to}`)
        socket.to(to).emit('offer', { from: socket.id, sdp })
      })

      socket.on('answer', ({ to, sdp }) => {
        console.log(`Answer from ${socket.id} to ${to}`)
        socket.to(to).emit('answer', { from: socket.id, sdp })
      })

      socket.on('ice-candidate', ({ to, candidate }) => {
        console.log(`ICE candidate from ${socket.id} to ${to}`)
        socket.to(to).emit('ice-candidate', { from: socket.id, candidate })
      })

      // Handle ending chat
      socket.on('endChat', () => {
        console.log(`User ${socket.id} ended chat`)
        this.endChat(socket.id)
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        this.handleUserDisconnect(socket.id)
      })

      // Handle reporting inappropriate behavior
      socket.on('report', ({ userId, reason }) => {
        console.log(`User ${socket.id} reported user ${userId} for: ${reason}`)
        this.handleReport(socket.id, userId, reason)
      })
    })
  }

  private findMatch(user: User) {
    // Don't match if already in a pairing
    if (this.userPairings.has(user.id)) {
      return
    }

    // Find a suitable partner
    const partnerIndex = this.waitingUsers.findIndex(u => 
      u.id !== user.id && 
      !this.userPairings.has(u.id) &&
      u.email !== user.email // Prevent matching with same email
    )

    if (partnerIndex !== -1) {
      const partner = this.waitingUsers.splice(partnerIndex, 1)[0]
      
      // Remove user from waiting list
      const userIndex = this.waitingUsers.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        this.waitingUsers.splice(userIndex, 1)
      }

      // Create pairing
      this.createPairing(user, partner)
    } else {
      console.log(`No partner found for ${user.email}, keeping in waiting list`)
    }
  }

  private createPairing(user1: User, user2: User) {
    const pairingId = `${user1.id}-${user2.id}`
    const pairing: Pairing = {
      user1,
      user2,
      createdAt: new Date()
    }

    // Store pairing
    this.activePairings.set(pairingId, pairing)
    this.userPairings.set(user1.id, pairingId)
    this.userPairings.set(user2.id, pairingId)

    console.log(`Created pairing between ${user1.email} and ${user2.email}`)

    // Notify both users
    user1.socket.emit('matched', { user: { id: user2.id, email: user2.email } })
    user2.socket.emit('matched', { user: { id: user1.id, email: user1.email } })
  }

  private endChat(userId: string) {
    const pairingId = this.userPairings.get(userId)
    if (!pairingId) return

    const pairing = this.activePairings.get(pairingId)
    if (!pairing) return

    // Notify both users
    const otherUserId = pairing.user1.id === userId ? pairing.user2.id : pairing.user1.id
    pairing.user1.socket.emit('partnerDisconnected')
    pairing.user2.socket.emit('partnerDisconnected')

    // Clean up
    this.activePairings.delete(pairingId)
    this.userPairings.delete(pairing.user1.id)
    this.userPairings.delete(pairing.user2.id)

    // Add users back to waiting list if they want
    if (this.waitingUsers.findIndex(u => u.id === pairing.user1.id) === -1) {
      this.waitingUsers.push(pairing.user1)
    }
    if (this.waitingUsers.findIndex(u => u.id === pairing.user2.id) === -1) {
      this.waitingUsers.push(pairing.user2)
    }

    console.log(`Ended pairing between ${pairing.user1.email} and ${pairing.user2.email}`)
  }

  private handleUserDisconnect(userId: string) {
    // Remove from waiting users
    const waitingIndex = this.waitingUsers.findIndex(u => u.id === userId)
    if (waitingIndex !== -1) {
      this.waitingUsers.splice(waitingIndex, 1)
    }

    // End any active chat
    this.endChat(userId)
  }

  private handleReport(reporterId: string, reportedUserId: string, reason: string) {
    console.log(`Report received: ${reason}`)
    
    // Here you would typically:
    // 1. Log the report to a database
    // 2. Send notification to moderators
    // 3. Potentially ban the reported user temporarily
    
    // For now, just end the chat
    this.endChat(reportedUserId)
  }

  // Get server statistics
  public getStats() {
    return {
      waitingUsers: this.waitingUsers.length,
      activePairings: this.activePairings.size,
      totalUsers: this.waitingUsers.length + (this.activePairings.size * 2)
    }
  }
}

// Create video chat server instance
const videoChatServer = new VideoChatServer(io)

// Start the server
app.prepare().then(() => {
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
    console.log(`> Socket.IO server running on port ${port}`)
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`> Render URL: ${process.env.RENDER_EXTERNAL_URL || 'Not set'}`)
    console.log(`> Server stats:`, videoChatServer.getStats())
  })
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

module.exports = { server, app, io, videoChatServer }