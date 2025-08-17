# Railway Deployment Guide for VIT Random Video Chat

## Quick Setup

### 1. Connect Your Repository
- Go to [Railway.app](https://railway.app)
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `vit-random-video-chat` repository

### 2. Configure Environment Variables
Railway will automatically detect the Node.js application. Add these environment variables:

```bash
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_SOCKET_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

### 3. Build Settings
The `railway.toml` file will automatically configure:
- Build command: `npm install && npm run build`
- Start command: `npm run start:railway`
- Health check: `/api/health`

### 4. Deployment
- Railway will automatically deploy your application
- The frontend will be available at: `https://your-app.railway.app`
- The Socket.io server will run on port 3001

## Troubleshooting

### Common Issues

1. **Port Conflict Error**
   - Make sure the PORT environment variable is set to 3001
   - The start script uses `server-railway.js` which handles Railway's environment

2. **Build Failures**
   - Ensure all dependencies are in package.json
   - Check that the build command completes successfully
   - Verify that TypeScript files compile correctly

3. **Socket Connection Issues**
   - Verify that `NEXT_PUBLIC_SOCKET_URL` is set to `${{RAILWAY_PUBLIC_DOMAIN}}`
   - Check that the Socket.io server is running on port 3001
   - Ensure CORS is properly configured for Railway domains

4. **Health Check Failures**
   - Make sure the `/api/health` endpoint is accessible
   - Check that both Next.js and Socket.io servers are running

### Monitoring

- Check Railway logs for any errors
- Monitor the health check status
- Verify that both services are running correctly

## Architecture

The application runs two services on Railway:
1. **Next.js Frontend** (Port 3000) - The React application
2. **Socket.io Server** (Port 3001) - The WebRTC signaling server

The `server-railway.js` file is specifically configured for Railway's environment and handles the production setup.

## Success Indicators

When deployment is successful, you should see:
- ✅ Build completes without errors
- ✅ Health check passes
- ✅ Both services are running
- ✅ Application is accessible at the Railway URL
- ✅ Socket connections work properly

## Testing the Deployment

1. Open the Railway URL in your browser
2. Enter a VIT Bhopal email address
3. Verify that you can connect to the chat
4. Test video/audio functionality
5. Check that reporting features work

If you encounter any issues, check the Railway logs and verify the environment variables are correctly set.