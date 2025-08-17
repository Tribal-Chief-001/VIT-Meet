const http = require('http')
const next = require('next')
const { Server } = require('socket.io')

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

// Video chat server logic
const waitingUsers = []
const activePairings = new Map()
const userPairings = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join', ({ email }) => {
    if (!email.endsWith('@vitbhopal.ac.in')) {
      socket.emit('joinError', { message: 'Invalid email domain' })
      return
    }

    const user = {
      id: socket.id,
      email,
      socket
    }

    console.log(`User ${email} joined with socket ${socket.id}`)
    
    waitingUsers.push(user)
    findMatch(user)
    
    socket.emit('joinSuccess', { userId: socket.id })
  })

  socket.on('findPartner', () => {
    const user = waitingUsers.find(u => u.id === socket.id)
    if (user) {
      console.log(`User ${user.email} is looking for a partner`)
      findMatch(user)
    }
  })

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

  socket.on('endChat', () => {
    console.log(`User ${socket.id} ended chat`)
    endChat(socket.id)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    handleUserDisconnect(socket.id)
  })

  socket.on('report', ({ userId, reason }) => {
    console.log(`User ${socket.id} reported user ${userId} for: ${reason}`)
    handleReport(socket.id, userId, reason)
  })
})

function findMatch(user) {
  if (userPairings.has(user.id)) return

  const partnerIndex = waitingUsers.findIndex(u => 
    u.id !== user.id && 
    !userPairings.has(u.id) &&
    u.email !== user.email
  )

  if (partnerIndex !== -1) {
    const partner = waitingUsers.splice(partnerIndex, 1)[0]
    
    const userIndex = waitingUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      waitingUsers.splice(userIndex, 1)
    }

    createPairing(user, partner)
  } else {
    console.log(`No partner found for ${user.email}, keeping in waiting list`)
  }
}

function createPairing(user1, user2) {
  const pairingId = `${user1.id}-${user2.id}`
  const pairing = {
    user1,
    user2,
    createdAt: new Date()
  }

  activePairings.set(pairingId, pairing)
  userPairings.set(user1.id, pairingId)
  userPairings.set(user2.id, pairingId)

  console.log(`Created pairing between ${user1.email} and ${user2.email}`)

  user1.socket.emit('matched', { user: { id: user2.id, email: user2.email } })
  user2.socket.emit('matched', { user: { id: user1.id, email: user1.email } })
}

function endChat(userId) {
  const pairingId = userPairings.get(userId)
  if (!pairingId) return

  const pairing = activePairings.get(pairingId)
  if (!pairing) return

  const otherUserId = pairing.user1.id === userId ? pairing.user2.id : pairing.user1.id
  pairing.user1.socket.emit('partnerDisconnected')
  pairing.user2.socket.emit('partnerDisconnected')

  activePairings.delete(pairingId)
  userPairings.delete(pairing.user1.id)
  userPairings.delete(pairing.user2.id)

  if (waitingUsers.findIndex(u => u.id === pairing.user1.id) === -1) {
    waitingUsers.push(pairing.user1)
  }
  if (waitingUsers.findIndex(u => u.id === pairing.user2.id) === -1) {
    waitingUsers.push(pairing.user2)
  }

  console.log(`Ended pairing between ${pairing.user1.email} and ${pairing.user2.email}`)
}

function handleUserDisconnect(userId) {
  const waitingIndex = waitingUsers.findIndex(u => u.id === userId)
  if (waitingIndex !== -1) {
    waitingUsers.splice(waitingIndex, 1)
  }

  endChat(userId)
}

function handleReport(reporterId, reportedUserId, reason) {
  console.log(`Report received: ${reason}`)
  endChat(reportedUserId)
}

function getStats() {
  return {
    waitingUsers: waitingUsers.length,
    activePairings: activePairings.size,
    totalUsers: waitingUsers.length + (activePairings.size * 2)
  }
}

// Start the server
app.prepare().then(() => {
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
    console.log(`> Socket.IO server running on port ${port}`)
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`> Render URL: ${process.env.RENDER_EXTERNAL_URL || 'Not set'}`)
    console.log(`> Server stats:`, getStats())
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

module.exports = { server, app, io }