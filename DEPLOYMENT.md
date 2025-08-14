# 🚀 Vercel Deployment Guide for VIT Meet

## **Step-by-Step Deployment Process**

### **1. Set Up LiveKit (Required)**

#### **Option A: LiveKit Cloud (Recommended)**
1. Go to [LiveKit Cloud](https://cloud.livekit.io)
2. Sign up for a free account
3. Create a new project
4. Copy your credentials:
   ```
   LiveKit Server URL: wss://your-project.livekit.cloud
   API Key: devkey_...
   API Secret: your-secret-key
   ```

#### **Option B: Self-Hosted LiveKit**
1. Deploy LiveKit server on your infrastructure
2. Ensure it's accessible via WebSocket (wss://)
3. Get your server URL and API credentials

### **2. Push Code to GitHub**

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: VIT Meet video chat platform"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `vit-meet` (or your preferred name)
   - Make it Public or Private
   - Don't initialize with README (we already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/your-username/vit-meet.git
   git branch -M main
   git push -u origin main
   ```

### **3. Deploy to Vercel**

#### **Method A: Automatic Deployment (Recommended)**

1. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Select your `vit-meet` repository
   - Click "Import"

2. **Configure Environment Variables**
   In the Vercel project settings, add these environment variables:
   
   ```
   # LiveKit Configuration
   LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=devkey_...
   LIVEKIT_API_SECRET=your-secret-key
   
   # Next.js Configuration
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your app will be live at `https://your-app-name.vercel.app`

#### **Method B: Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add LIVEKIT_URL
   vercel env add LIVEKIT_API_KEY
   vercel env add LIVEKIT_API_SECRET
   vercel env add NEXTAUTH_SECRET
   ```

### **4. Post-Deployment Configuration**

#### **Update Environment Variables in Vercel Dashboard**

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add all required variables:
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel URL)

4. **Redeploy** after adding variables

#### **Generate NEXTAUTH_SECRET**

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### **5. Test Your Deployment**

1. **Visit Your App**
   - Go to `https://your-app-name.vercel.app`
   - Test with a VIT email: `test@vitbhopal.ac.in`

2. **Test Video Chat**
   - Open two different browsers
   - Both should be able to connect and see each other

3. **Test All Features**
   - Email validation
   - Matchmaking
   - Video controls
   - Skip functionality

### **6. Domain Configuration (Optional)**

#### **Custom Domain**
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain (e.g., `vit-meet.yourdomain.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` to your custom domain

### **7. Monitoring and Maintenance**

#### **Vercel Analytics**
- Enable in Vercel dashboard
- Monitor performance and usage

#### **LiveKit Dashboard**
- Monitor active rooms and connections
- Track usage and costs

#### **Error Monitoring**
- Consider integrating Sentry or similar service
- Monitor for WebRTC connection issues

## **Troubleshooting Common Issues**

### **Issue 1: LiveKit Connection Failed**
**Solution:**
- Verify `LIVEKIT_URL` is correct (should start with `wss://`)
- Check API key and secret
- Ensure LiveKit server is running

### **Issue 2: Build Errors**
**Solution:**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Fix any TypeScript errors

### **Issue 3: Environment Variables Not Working**
**Solution:**
- Double-check variable names in Vercel dashboard
- Redeploy after changing variables
- Ensure variables are available in the correct environment

### **Issue 4: Video Not Working**
**Solution:**
- Check browser console for errors
- Verify HTTPS is enabled (required for WebRTC)
- Test camera/microphone permissions

## **Cost Considerations**

### **Vercel**
- Free tier: 100GB bandwidth, 6 serverless functions
- Pro tier: $20/month for more resources

### **LiveKit Cloud**
- Free tier: 50GB monthly bandwidth
- Paid plans start at $0.002/minute per participant

### **Estimated Monthly Costs**
- Low usage: Free tier sufficient
- Medium usage: ~$20-50/month
- High usage: ~$100+/month

## **Security Best Practices**

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use Vercel's environment variable management
   - Rotate API keys periodically

2. **CORS Configuration**
   - Ensure your LiveKit server allows your Vercel domain
   - Configure proper CORS headers if needed

3. **Rate Limiting**
   - Consider implementing rate limiting for API endpoints
   - Monitor for abuse patterns

4. **HTTPS**
   - Vercel provides automatic HTTPS
   - Ensure all connections use HTTPS

---

**🎉 Congratulations! Your VIT Meet application is now live on Vercel!**

Your students can now access the platform at your Vercel URL and start video chatting with fellow VIT Bhopal students.