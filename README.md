# 🎥 VIT Meet – Randomized Video Chat for VIT Bhopal Students

A secure, real-time video chat platform exclusively for VIT Bhopal students. Connect randomly with fellow students through peer-to-peer video calls.

## ✨ Features

- 🔒 **Email Filter Access** - Only VIT Bhopal students with `@vitbhopal.ac.in` emails can join
- 🎲 **Random Matching** - Get paired with random VIT students for video chats
- 🎥 **Real-time Video Chat** - High-quality WebRTC video calls with audio
- ⏭️ **Skip Functionality** - Leave current call and find a new partner instantly
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔐 **Privacy Focused** - Anonymous chats with no personal data storage
- 🚀 **Vercel Ready** - Fully deployable on Vercel with managed services

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible UI components
- **LiveKit Client** - Real-time WebRTC communication

### Backend & Services
- **LiveKit** - Managed WebRTC signaling and infrastructure
- **Next.js API Routes** - Serverless backend for matchmaking
- **Vercel** - Deployment platform with edge functions

### Security
- **Email Validation** - Regex-based VIT email verification
- **Environment Variables** - Secure API key management
- **Local Storage** - Client-side email persistence

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- VIT Bhopal email address for testing
- LiveKit account (for production deployment)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd vit-meet
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your LiveKit credentials:
```env
LIVEKIT_URL=wss://your-livekit-server.example.com
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### 1. Email Verification
- Users enter their VIT Bhopal email address
- System validates with regex: `^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$`
- Valid emails are stored in localStorage for future sessions

### 2. Matchmaking
- Users join a waiting pool for random matching
- System pairs two available users automatically
- Matched users are directed to a private video room

### 3. Video Chat
- WebRTC-powered peer-to-peer video calls
- Real-time audio and video communication
- Users can mute/unmute and toggle camera
- Skip button to find a new partner

### 4. Security Features
- Only verified VIT Bhopal emails can access the platform
- API keys secured through Vercel environment variables
- No personal data stored on servers
- Anonymous chat interactions

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── livekit/              # LiveKit token generation
│   │   └── matchmaking/          # User matching logic
│   ├── room/[roomId]/            # Video chat room
│   ├── waiting/                  # Matchmaking waiting room
│   └── page.tsx                  # Email validation
├── components/                   # React components
│   └── ui/                      # shadcn/ui components
├── hooks/                       # Custom React hooks
└── lib/                         # Utilities
    ├── livekit.ts               # LiveKit service
    ├── socket.ts                # Socket.io utilities
    └── utils.ts                 # Helper functions
```

## 🔧 Configuration

### LiveKit Setup
1. Create a LiveKit account at [livekit.io](https://livekit.io)
2. Set up a LiveKit server or use LiveKit Cloud
3. Configure your server URL and API keys in `.env.local`

### Vercel Deployment
1. Push your code to a Git repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard:
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
4. Deploy automatically on every push

## 🎨 Available Pages

### `/` - Email Validation
- VIT email input with regex validation
- Error handling for invalid emails
- Redirects to waiting room on success

### `/waiting` - Matchmaking
- Real-time waiting status
- Animated search indicator
- Waiting time counter
- Stop searching functionality

### `/room/[roomId]` - Video Chat
- Local and remote video displays
- Mute/unmute controls
- Camera toggle
- Skip and leave call buttons
- Connection status indicators

## 🔒 Security Considerations

- **Email Validation**: Strict regex pattern for VIT Bhopal emails
- **API Security**: All sensitive data in environment variables
- **No Data Storage**: Only uses localStorage for email persistence
- **Anonymous Chats**: No personal information exchanged
- **WebRTC Security**: Peer-to-peer encrypted connections

## 🚀 Production Deployment

### Vercel Requirements
- Ensure all environment variables are set in Vercel
- Configure domain settings
- Set up proper CORS for LiveKit connections
- Enable HTTPS for secure WebRTC

### LiveKit Configuration
- Use LiveKit Cloud for managed service
- Configure proper TURN/STUN servers
- Set up room management and user limits
- Monitor usage and scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **VIT Bhopal** - For the student community
- **LiveKit** - For the amazing WebRTC infrastructure
- **Vercel** - For the excellent deployment platform
- **shadcn/ui** - For the beautiful UI components

---

Built with ❤️ for VIT Bhopal students. Connect anonymously, chat safely! 🎓
