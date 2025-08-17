# 🚀 Deployment Guide

This guide will help you deploy the VIT Random Video Chat application to free hosting platforms.

## 📋 Prerequisites

- ✅ GitHub repository set up
- ✅ All code committed to GitHub
- ✅ Node.js 18+ installed locally
- ✅ npm or yarn package manager

## 🎯 Deployment Options

### Option 1: Vercel + Railway (Recommended)

This approach uses Vercel for the Next.js frontend and Railway for the Socket.io backend.

#### Step 1: Deploy Frontend to Vercel

1. **Sign up for Vercel**: https://vercel.com
   - Use your GitHub account for easy integration

2. **Create new project**:
   - Click "New Project"
   - Select your `vit-random-video-chat` repository
   - Click "Import"

3. **Configure project**:
   - **Framework Preset**: Next.js (detected automatically)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.railway.app
   ```
   *(We'll get the backend URL after deploying to Railway)*

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the Vercel URL (e.g., `https://vit-random-video-chat.vercel.app`)

#### Step 2: Deploy Backend to Railway

1. **Sign up for Railway**: https://railway.app
   - Use your GitHub account

2. **Create new project**:
   - Click "New Project"
   - Select your `vit-random-video-chat` repository
   - Click "Deploy Now"

3. **Configure service**:
   - **Build Command**: `npm install`
   - **Start Command**: `node server-production.js`
   - **Environment Variables**:
     ```
     PORT=3001
     NODE_ENV=production
     ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the Railway URL (e.g., `https://vit-random-video-chat-production.up.railway.app`)

#### Step 3: Update Environment Variables

1. **Go back to Vercel**:
   - Navigate to your project
   - Go to "Settings" → "Environment Variables"
   - Update `NEXT_PUBLIC_SOCKET_URL` with your Railway URL

2. **Redeploy Vercel**:
   - The changes will automatically trigger a redeploy

#### Step 4: Test the Deployment

1. **Visit your Vercel URL**
2. **Test the application**:
   - Enter a @vitbhopal.ac.in email
   - Try to start a chat
   - Verify the Socket.io connection works

---

### Option 2: Railway (Full-stack)

Deploy both frontend and backend to Railway in a single service.

#### Step 1: Deploy to Railway

1. **Sign up for Railway**: https://railway.app
   - Use your GitHub account

2. **Create new project**:
   - Click "New Project"
   - Select your `vit-random-video-chat` repository
   - Click "Deploy Now"

3. **Configure service**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=3001
     NEXT_PUBLIC_SOCKET_URL=${{RAILWAY_PUBLIC_DOMAIN}}
     ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

#### Step 2: Test the Deployment

1. **Visit your Railway URL**
2. **Test all features**:
   - Landing page loads
   - Email verification works
   - Chat interface loads
   - Socket.io connection established

---

### Option 3: Render (Alternative to Railway)

#### Step 1: Deploy to Render

1. **Sign up for Render**: https://render.com
   - Use your GitHub account

2. **Create Web Service**:
   - Click "New +"
   - Select "Web Service"
   - Choose your `vit-random-video-chat` repository
   - Configure:
     - **Name**: `vit-random-video-chat`
     - **Region**: Choose nearest to your users
     - **Branch**: `master`
     - **Runtime**: Node 18
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   NEXT_PUBLIC_SOCKET_URL=${{RENDER_EXTERNAL_URL}}
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

#### Step 2: Test the Deployment

1. **Visit your Render URL**
2. **Test all functionality**

---

### Option 4: Heroku (Classic Option)

#### Step 1: Prepare for Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

#### Step 2: Create Heroku App

1. **Create app**:
   ```bash
   heroku create vit-random-video-chat
   ```

2. **Add buildpacks**:
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set NEXT_PUBLIC_SOCKET_URL=https://vit-random-video-chat.herokuapp.com
   ```

#### Step 3: Deploy to Heroku

1. **Push to Heroku**:
   ```bash
   git push heroku master
   ```

2. **Open the app**:
   ```bash
   heroku open
   ```

#### Step 4: Scale Dynos

1. **Scale web dyno**:
   ```bash
   heroku ps:scale web=1
   ```

---

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOCKET_URL` | URL of the Socket.io server | `https://your-backend.railway.app` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FRONTEND_URL` | Frontend URL (for CORS) | Auto-detected |
| `BACKEND_URL` | Backend URL (for CORS) | Auto-detected |

---

## 🧪 Testing Your Deployment

### Checklist

- [ ] Landing page loads correctly
- [ ] Email validation accepts @vitbhopal.ac.in
- [ ] Chat interface loads without errors
- [ ] Socket.io connection establishes
- [ ] Video/audio permissions work
- [ ] Report system functions
- [ ] Community guidelines page loads
- [ ] Responsive design works on mobile

### Testing Tools

1. **Browser Console**: Check for JavaScript errors
2. **Network Tab**: Verify Socket.io connection
3. **Mobile Testing**: Test on different screen sizes
4. **Cross-browser**: Test on Chrome, Firefox, Safari

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Socket.io Connection Failed
**Problem**: "Connection failed" or "Disconnected" status
**Solution**:
- Check `NEXT_PUBLIC_SOCKET_URL` environment variable
- Verify backend server is running
- Check CORS configuration
- Ensure ports are open and accessible

#### 2. WebRTC Connection Issues
**Problem**: Video/audio not working
**Solution**:
- Check browser permissions for camera/microphone
- Verify STUN servers are accessible
- Test on different networks (some block WebRTC)
- Check firewall settings

#### 3. Build Failures
**Problem**: Deployment fails during build
**Solution**:
- Check build logs for specific errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility
- Check for TypeScript errors

#### 4. Environment Variables Not Working
**Problem**: Configuration not applied
**Solution**:
- Double-check variable names
- Restart the service after changes
- Check platform-specific variable syntax
- Verify no typos in values

### Debug Commands

```bash
# Check build logs
npm run build

# Test locally in production mode
npm run build && npm start

# Check environment variables
node -e "console.log(process.env)"
```

---

## 📈 Monitoring and Analytics

### Free Monitoring Options

1. **Vercel Analytics**: Built-in analytics for Vercel deployments
2. **Railway Logs**: Built-in logging for Railway services
3. **Render Metrics**: Free tier monitoring on Render
4. **UptimeRobot**: Free uptime monitoring (https://uptimerobot.com)

### Health Check Endpoint

The application includes a health check endpoint:
```
GET /health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 🔄 Continuous Deployment

### Automatic Deployments

Most platforms support automatic deployments when you push to GitHub:

1. **Vercel**: Automatic on push to main branch
2. **Railway**: Automatic on push to main branch
3. **Render**: Automatic on push to main branch
4. **Heroku**: Manual or automatic via GitHub integration

### Deployment Scripts

Add these to your `package.json` for easy deployment:

```json
{
  "scripts": {
    "deploy:vercel": "vercel --prod",
    "deploy:railway": "railway up",
    "deploy:render": "render deploy",
    "deploy:heroku": "git push heroku master"
  }
}
```

---

## 🎯 Production Best Practices

### Security

1. **Environment Variables**: Never commit sensitive data
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Restrict to your domains only
4. **Rate Limiting**: Implement to prevent abuse
5. **Input Validation**: Validate all user inputs

### Performance

1. **Caching**: Implement browser caching
2. **CDN**: Use CDN for static assets
3. **Optimization**: Optimize images and assets
4. **Monitoring**: Monitor performance metrics

### Reliability

1. **Health Checks**: Implement health check endpoints
2. **Logging**: Set up proper logging
3. **Error Handling**: Handle errors gracefully
4. **Backups**: Regular backups if using database

---

## 🎉 Congratulations!

Your VIT Random Video Chat application is now deployed and ready for students to use! 

### Next Steps

1. **Share with VIT Bhopal students**
2. **Monitor usage and performance**
3. **Gather feedback and improve**
4. **Scale as needed**

### Support

If you encounter any issues:
- Check the troubleshooting section
- Review platform documentation
- Open an issue on GitHub

---

Happy chatting! 🎥🎤