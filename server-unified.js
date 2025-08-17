const http = require('http')
const next = require('next')
const { Server } = require('socket.io')
const { createVideoChatServer } = require('./src/lib/socket')

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

// Create video chat server
const videoChatServer = createVideoChatServer(server)

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

module.exports = { server, app, io }