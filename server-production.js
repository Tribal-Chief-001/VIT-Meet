const http = require('http')
const { createVideoChatServer } = require('./dist/lib/socket')

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('VIT Random Video Chat Server is running')
})

// Create video chat server
const videoChatServer = createVideoChatServer(server)

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`VIT Random Video Chat server running on port ${PORT}`)
  console.log('Environment:', process.env.NODE_ENV || 'development')
  console.log('Server stats:', videoChatServer.getStats())
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