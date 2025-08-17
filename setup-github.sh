#!/bin/bash

# GitHub Repository Setup Script for VIT Random Video Chat

echo "🚀 Setting up GitHub repository for VIT Random Video Chat..."

# Get repository name from user
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: vit-random-video-chat): " REPO_NAME
REPO_NAME=${REPO_NAME:-vit-random-video-chat}

echo "📋 Repository Details:"
echo "   Username: $GITHUB_USERNAME"
echo "   Repository: $REPO_NAME"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run this script from the project root."
    exit 1
fi

# Add remote origin
REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "🔗 Setting up remote: $REMOTE_URL"

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  Remote 'origin' already exists. Updating URL..."
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi

# Push to GitHub
echo "📤 Pushing code to GitHub..."
git push -u origin master

echo ""
echo "✅ GitHub repository setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Create the repository on GitHub: https://github.com/new"
echo "   - Repository name: $REPO_NAME"
echo "   - Make it Public"
echo "   - Don't initialize with README (we already have one)"
echo ""
echo "2. After creating the repository, run this script again"
echo ""
echo "3. Or create the repository first, then run:"
echo "   git push -u origin master"
echo ""
echo "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"