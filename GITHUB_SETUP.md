# GitHub Repository Setup Guide

## 🚀 Setting Up Your GitHub Repository

### Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account
3. **Click "New repository** (or go to https://github.com/new)
4. **Fill in repository details**:
   - **Repository name**: `vit-random-video-chat`
   - **Description**: `A modern random video chat platform for VIT Bhopal students`
   - **Visibility**: **Public** (free hosting requires public repos)
   - **Don't** initialize with README (we already have one)
   - **Don't** add .gitignore (we already have one)
   - **Don't** add license (we'll add MIT later)

5. **Click "Create repository"**

### Step 2: Connect Your Local Repository

After creating the repository on GitHub, run these commands in your terminal:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/vit-random-video-chat.git

# Push your code to GitHub
git push -u origin master
```

### Step 3: Verify the Setup

1. **Visit your repository**: https://github.com/YOUR_USERNAME/vit-random-video-chat
2. **Check that all files are there**
3. **Verify the README.md looks good**

### Step 4: Prepare for Deployment

Now that your code is on GitHub, you can deploy it to free hosting platforms.

## 🌐 Free Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Frontend Deployment**:
1. **Go to Vercel**: https://vercel.com
2. **Sign up** with your GitHub account
3. **Click "New Project"**
4. **Select your repository**: `vit-random-video-chat`
5. **Configure**:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
   ```

7. **Deploy**

**Backend Deployment** (Socket.io Server):
You'll need to deploy the Socket.io server separately. Options:
- **Railway**: Free tier, easy Node.js deployment
- **Render**: Free tier, good for Node.js apps
- **Heroku**: Free tier, requires some configuration

### Option 2: Railway (Full-stack)

**Deploy both frontend and backend**:

1. **Go to Railway**: https://railway.app
2. **Sign up** with your GitHub account
3. **Click "New Project"**
4. **Select your repository**: `vit-random-video-chat`
5. **Configure**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables as needed

### Option 3: Render (Alternative to Railway)

1. **Go to Render**: https://render.com
2. **Sign up** with your GitHub account
3. **Create two services**:
   - **Web Service** (Next.js frontend)
   - **Web Service** (Socket.io backend)

### Option 4: Heroku (Classic Option)

1. **Go to Heroku**: https://heroku.com
2. **Sign up** and create two apps:
   - One for Next.js frontend
   - One for Socket.io backend

## 🔧 Environment Variables Setup

For production deployment, you'll need these environment variables:

```env
# Socket.io Server URL
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com

# For the backend server (if needed)
PORT=3001
NODE_ENV=production
```

## 📋 Deployment Checklist

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Choose deployment platform
- [ ] Set up environment variables
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Test the deployed application
- [ ] Set up custom domain (optional)

## 🎯 Post-Deployment Testing

After deployment, test these features:

1. **Landing Page**: Loads properly
2. **Email Verification**: Accepts @vitbhopal.ac.in emails
3. **Chat Interface**: Loads correctly
4. **Socket.io Connection**: Connects to backend
5. **Video/Audio**: Works in different browsers
6. **Report System**: Functions properly
7. **Community Guidelines**: Page loads

## 🚀 Next Steps

1. **Deploy to your chosen platform**
2. **Test thoroughly**
3. **Share with VIT Bhopal students**
4. **Monitor performance and user feedback**
5. **Iterate based on feedback**

---

Need help? Check the main README.md or open an issue on GitHub!