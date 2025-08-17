const http = require('http')
const { createVideoChatServer } = require('./src/lib/socket')

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Video Chat Server is running')
})

// Create video chat server
const videoChatServer = createVideoChatServer(server)

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Video chat server running on port ${PORT}`)
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

// Export for testing
module.exports = { server, videoChatServer }