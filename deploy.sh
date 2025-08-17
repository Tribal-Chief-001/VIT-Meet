#!/bin/bash

# VIT Random Video Chat - Railway Deployment Script

echo "🚀 Deploying VIT Random Video Chat to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

# Check if project is linked to Railway
if [ ! -f ".railway/project.json" ]; then
    echo "🔗 Linking project to Railway..."
    railway init
fi

# Build the application
echo "📦 Building the application..."
npm run build

# Deploy to Railway
echo "🚂 Deploying to Railway..."
railway up

# Get the deployment URL
echo "🌐 Getting deployment URL..."
RAILWAY_URL=$(railway status | grep -o 'https://[^ ]*' | head -1)

if [ -n "$RAILWAY_URL" ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: $RAILWAY_URL"
    echo ""
    echo "📋 Next steps:"
    echo "1. Visit your Railway dashboard: https://railway.app"
    echo "2. Add environment variables if needed"
    echo "3. Test your application"
    echo "4. Share with VIT Bhopal students!"
else
    echo "⚠️  Deployment completed, but couldn't get URL automatically"
    echo "🌐 Please check your Railway dashboard for the deployment URL"
fi

echo ""
echo "🎉 Happy chatting!"