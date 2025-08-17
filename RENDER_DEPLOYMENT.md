# Render Deployment Guide for VIT Random Video Chat

## Quick Setup

### 1. Connect Your Repository
- Go to [Render.com](https://render.com)
- Click "New +" 
- Select "Web Service"
- Choose "Build and deploy from a Git repository"
- Connect your GitHub account
- Select your `vit-random-video-chat` repository

### 2. Configure the Service
- **Name**: `vit-random-video-chat` (or your preferred name)
- **Region**: Choose the closest region to your users
- **Branch**: `main` (or your default branch)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:render`
- **Instance Type**: `Free` (or upgrade as needed)

### 3. Set Environment Variables
Add these environment variables in the Render dashboard:

```bash
NODE_ENV=production
PORT=10000
NEXT_PUBLIC_SOCKET_URL=https://your-service-name.onrender.com
```

**Important**: Replace `your-service-name` with your actual Render service name.

### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy your application
- Wait for the deployment to complete (this may take a few minutes)

## What's Happening

The application runs two services on Render:
1. **Next.js Frontend** (Port 10000) - The React UI application
2. **Socket.io Server** (Port 10000) - The WebRTC signaling server

The `start:render` script starts both services simultaneously:
- `node server-render.js` - Starts the Socket.io server
- `PORT=10000 next start` - Starts the Next.js frontend

## Troubleshooting

### Issue: "Video Chat Server is running" but no UI
**Cause**: Only the Socket.io server is running, not Next.js
**Solution**: 
1. Make sure the start command is `npm run start:render`
2. Check that both processes are running in the logs
3. Verify the environment variables are set correctly

### Issue: Build fails
**Solution**:
1. Check the build logs for specific errors
2. Ensure all dependencies are in package.json
3. Verify that TypeScript compilation succeeds

### Issue: Socket connections not working
**Solution**:
1. Verify `NEXT_PUBLIC_SOCKET_URL` is set to your Render service URL
2. Check that the Socket.io server is running
3. Ensure CORS is configured for Render domains

### Issue: Port conflicts
**Solution**:
1. Make sure `PORT` is set to `10000` (Render's default)
2. Check that no other services are using the same port

## Monitoring

### Check Render Logs
1. Go to your Render service dashboard
2. Click on the "Logs" tab
3. Look for these messages:
   - "VIT Random Video Chat server running on port 10000"
   - "Ready on http://localhost:10000" (or similar)

### Health Check
The application includes a health check at `/api/health` that should return:
```json
{"message":"Good!"}
```

## Testing the Deployment

1. **Open the URL**: Go to your Render service URL
2. **Check the UI**: You should see the VIT Random Video Chat landing page
3. **Test Email Validation**: Enter a VIT Bhopal email address
4. **Test Chat**: Try connecting to the video chat
5. **Verify Features**: Test reporting, guidelines, etc.

## Success Indicators

When deployment is successful, you should see:
- ✅ Build completes without errors
- ✅ Service shows as "Live" in Render dashboard
- ✅ Landing page loads at the Render URL
- ✅ Email validation works
- ✅ Video chat functionality works
- ✅ Socket connections established successfully

## Common Render-Specific Issues

### 1. Free Tier Limitations
- Render free tier has limited resources
- The application may sleep after inactivity
- First load might be slow (cold start)

### 2. Port Configuration
- Render uses port 10000 by default
- Both Next.js and Socket.io need to work together
- The `server-render.js` handles this configuration

### 3. Environment Variables
- `NEXT_PUBLIC_SOCKET_URL` must be the exact Render service URL
- Variables are case-sensitive
- Changes require redeployment

## Next Steps

1. **Deploy**: Push these changes and redeploy on Render
2. **Configure**: Set the correct environment variables
3. **Test**: Verify all functionality works
4. **Monitor**: Check logs for any issues
5. **Scale**: Upgrade to paid tier if needed for better performance

If you still encounter issues, check the Render logs and verify that both the Next.js frontend and Socket.io server are starting correctly.