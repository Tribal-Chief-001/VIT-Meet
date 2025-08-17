const http = require('http')
const { createVideoChatServer } = require('./src/lib/socket')

// Create HTTP server
const server = http.createServer((req, res) => {
  // For Render health checks, serve the Next.js app
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: "Good!" }))
    return
  }
  
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('VIT Random Video Chat Server is running')
})

// Create video chat server
const videoChatServer = createVideoChatServer(server)

// Get port from Render environment or default to 10000
const PORT = process.env.PORT || 10000

// Start server
server.listen(PORT, () => {
  console.log(`VIT Random Video Chat server running on port ${PORT}`)
  console.log('Environment:', process.env.NODE_ENV || 'development')
  console.log('Server stats:', videoChatServer.getStats())
  console.log('Render External URL:', process.env.RENDER_EXTERNAL_URL || 'Not set')
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

// Export for testing
module.exports = { server, videoChatServer }