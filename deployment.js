// Deployment configuration for VIT Random Video Chat

const config = {
  // Application Information
  app: {
    name: 'VIT Random Video Chat',
    description: 'A modern random video chat platform for VIT Bhopal students',
    version: '1.0.0',
    author: 'VIT Bhopal Students'
  },

  // Environment Configuration
  env: {
    development: {
      frontendUrl: 'http://localhost:3000',
      backendUrl: 'http://localhost:3001',
      socketUrl: 'http://localhost:3001'
    },
    production: {
      frontendUrl: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
      backendUrl: process.env.BACKEND_URL || 'https://your-backend.railway.app',
      socketUrl: process.env.SOCKET_URL || 'https://your-backend.railway.app'
    }
  },

  // Deployment Platforms
  platforms: {
    vercel: {
      name: 'Vercel',
      type: 'frontend',
      buildCommand: 'npm run build',
      outputDirectory: '.next',
      installCommand: 'npm install',
      environmentVariables: {
        'NEXT_PUBLIC_SOCKET_URL': '${{SOCKET_URL}}'
      },
      domains: {
        production: 'your-app.vercel.app'
      }
    },
    railway: {
      name: 'Railway',
      type: 'fullstack',
      buildCommand: 'npm install && npm run build',
      startCommand: 'npm start',
      environmentVariables: {
        'NODE_ENV': 'production',
        'PORT': '3001',
        'NEXT_PUBLIC_SOCKET_URL': '${{RAILWAY_PUBLIC_DOMAIN}}'
      }
    },
    render: {
      name: 'Render',
      type: 'fullstack',
      buildCommand: 'npm install && npm run build',
      startCommand: 'npm start',
      environmentVariables: {
        'NODE_ENV': 'production',
        'PORT': '10000',
        'NEXT_PUBLIC_SOCKET_URL': '${{RENDER_EXTERNAL_URL}}'
      }
    },
    heroku: {
      name: 'Heroku',
      type: 'fullstack',
      buildpacks: [
        'heroku/nodejs'
      ],
      buildCommand: 'npm install && npm run build',
      startCommand: 'npm start',
      environmentVariables: {
        'NODE_ENV': 'production',
        'NEXT_PUBLIC_SOCKET_URL': '${{HEROKU_APP_URL}}'
      }
    }
  },

  // Database Configuration (if needed in future)
  database: {
    type: 'none', // Currently no database needed
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  },

  // Security Configuration
  security: {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-app.vercel.app', 'https://your-backend.railway.app']
        : ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "wss:", "https:"],
          mediaSrc: ["'self'", "blob:"],
          objectSrc: ["'none'"],
          childSrc: ["'self'"],
          workerSrc: ["'self'"],
          frameSrc: ["'none'"]
        }
      }
    }
  },

  // WebRTC Configuration
  webrtc: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  },

  // Monitoring and Logging
  monitoring: {
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    enableSentry: false, // Can be enabled in future
    enableAnalytics: false // Can be enabled in future
  }
}

module.exports = config