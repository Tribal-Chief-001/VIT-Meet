# VIT Random Video Chat

A modern random video chat platform exclusively for VIT Bhopal students. Connect with fellow students through secure, anonymous video conversations.

## 🌟 Features

### Core Functionality
- 🔐 **Email Verification**: Only @vitbhopal.ac.in email addresses allowed
- 🎥 **Video Chat**: High-quality peer-to-peer video calling
- 🎤 **Audio Chat**: Clear audio communication
- 🔀 **Random Matching**: Intelligent algorithm to pair users randomly
- 🔄 **Quick Switch**: Easily find new chat partners

### User Experience
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, intuitive interface with shadcn/ui components
- ⚡ **Real-time**: Instant connections with WebRTC technology
- 🔒 **Privacy**: No data storage beyond email verification
- 🛡️ **Security**: Built-in reporting system for inappropriate behavior

### Safety & Moderation
- 🚩 **Report System**: Easy-to-use reporting for violations
- 📋 **Community Guidelines**: Clear rules and expectations
- 🔧 **Moderation**: Automated and manual moderation tools
- 🚫 **Content Filtering**: Prevention of inappropriate content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- VIT Bhopal email address (@vitbhopal.ac.in)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vit-random-video-chat.git
   cd vit-random-video-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   # Run both Next.js and Socket.io servers
   npm run dev
   
   # Or run separately
   npm run dev:next  # Next.js development server
   npm run dev:server  # Socket.io server
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Socket.io Server: http://localhost:3001

## 📁 Project Structure

```
vit-random-video-chat/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main landing page
│   │   ├── chat/
│   │   │   └── page.tsx         # Chat interface
│   │   ├── guidelines/
│   │   │   └── page.tsx         # Community guidelines
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       └── socket.ts            # Socket.io server logic
├── server.ts                    # Socket.io server entry point
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern React component library
- **Socket.io Client** - Real-time communication
- **WebRTC** - Peer-to-peer video/audio
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Socket.io** - Real-time bidirectional communication
- **WebRTC** - Peer-to-peer media streaming
- **STUN Servers** - NAT traversal for WebRTC

### Development Tools
- **ESLint** - Code linting
- **tsx** - TypeScript execution
- **nodemon** - Auto-restart development server

## 🎯 How It Works

### User Flow
1. **Landing Page**: User enters @vitbhopal.ac.in email
2. **Email Verification**: System validates email domain
3. **Chat Interface**: User is taken to the video chat interface
4. **Find Partner**: User clicks "Start Chatting" to find a random partner
5. **Video Chat**: Once matched, users can video chat with controls
6. **End Chat**: Users can end chat and find new partners or exit

### Technical Flow
1. **Socket.io Connection**: Client connects to real-time server
2. **User Registration**: User joins with email verification
3. **Matching Algorithm**: Server finds available users and pairs them
4. **WebRTC Signaling**: Server exchanges connection details between peers
5. **Peer Connection**: Direct video/audio connection established
6. **Chat Management**: Server handles disconnections and re-matching

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Socket.io Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Production URL (when deployed)
NEXT_PUBLIC_SOCKET_URL=https://your-app-url.com
```

### Customization
- **Stun Servers**: Modify ICE servers in `src/lib/socket.ts`
- **Port Configuration**: Change ports in `package.json` scripts
- **UI Themes**: Customize with Tailwind CSS classes

## 🚀 Deployment

### Development Deployment
```bash
# Build the application
npm run build

# Start production servers
npm run start
```

### Production Deployment
The application can be deployed to various platforms:

#### 1. **Vercel** (Recommended for Next.js)
- Connect your GitHub repository to Vercel
- Configure environment variables
- Deploy automatically on push

#### 2. **Railway** (Full-stack deployment)
- Deploy both frontend and backend
- Free tier available
- Easy configuration

#### 3. **Render** (Alternative to Railway)
- Similar to Railway
- Good free tier
- Simple setup

#### 4. **Heroku** (Classic option)
- Requires buildpacks for both Next.js and Node.js
- Free tier available

### Deployment Notes
- The Socket.io server runs on port 3001 by default
- Next.js runs on port 3000 by default
- In production, both services need to be deployed
- Use environment variables for configuration

## 📱 Browser Support

- ✅ **Chrome** 60+
- ✅ **Firefox** 55+
- ✅ **Safari** 11+
- ✅ **Edge** 79+
- ✅ **Mobile Chrome** 60+
- ✅ **Mobile Safari** 11+

## 🔒 Security Features

### Email Verification
- Only @vitbhopal.ac.in email addresses are accepted
- No password storage - email verification only
- Anonymous chat sessions

### Privacy Protection
- No recording of video/audio calls
- No storage of personal information
- Temporary session data only

### Content Moderation
- User reporting system
- Automated violation detection
- Community guidelines enforcement
- Temporary and permanent bans for violations

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Use TypeScript for type safety
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VIT Bhopal** - For inspiring this platform
- **Next.js Team** - For the amazing framework
- **shadcn/ui** - For the beautiful components
- **Socket.io** - For real-time communication
- **WebRTC** - For peer-to-peer technology

## 📞 Support

For support, questions, or to report issues:

- **Email**: support@vitrandomchat.com
- **GitHub Issues**: Create an issue in the repository
- **Discord**: Join our community server

## 🌐 Live Demo

Check out the live demo: [https://vit-random-video-chat.vercel.app](https://vit-random-video-chat.vercel.app)

---

Built with ❤️ for VIT Bhopal students