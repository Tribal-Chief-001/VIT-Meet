# 🚀 Quick Deployment Guide

## One-Click Deployment Options

### Option 1: Railway (Easiest - Recommended)

**Step 1: Click the button below**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/vit-random-video-chat)

**Step 2: Configure**
- Connect your GitHub account
- Select your repository
- Railway will auto-detect the settings

**Step 3: Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your app will be live!

---

### Option 2: Vercel + Railway (Best Performance)

**Frontend (Vercel)**:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vit-random-video-chat)

**Backend (Railway)**:
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/vit-random-video-chat)

---

### Option 3: Manual Deployment

#### Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Vercel + Railway

```bash
# Deploy frontend to Vercel
# 1. Go to vercel.com
# 2. Connect your GitHub repo
# 3. Deploy automatically

# Deploy backend to Railway
railway up
```

---

## 📋 Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Email validation works (@vitbhopal.ac.in)
- [ ] Chat interface loads
- [ ] Socket.io connects
- [ ] Video/audio permissions work
- [ ] Report system functions
- [ ] Mobile responsive

## 🔧 Environment Variables

For Railway deployment, these are automatically set:
```
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_SOCKET_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

For Vercel + Railway:
```
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

## 🎯 Live Demo

Once deployed, your app will be available at:
- **Railway**: `https://your-app-name.railway.app`
- **Vercel**: `https://your-app-name.vercel.app`

## 📞 Support

If you need help:
1. Check the main `README.md`
2. Review `DEPLOYMENT.md`
3. Open an issue on GitHub

---

**🎉 Your VIT Random Video Chat is ready for students!**