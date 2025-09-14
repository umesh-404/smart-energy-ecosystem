#!/bin/bash

# Smart Energy Ecosystem - Deployment Script
echo "🚀 Smart Energy Ecosystem Deployment Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the project root directory"
    echo "   Expected structure:"
    echo "   smart-energy-ecosystem/"
    echo "   ├── frontend/"
    echo "   ├── backend/"
    echo "   ├── contracts/"
    echo "   ├── scripts/"
    echo "   └── deploy.sh"
    echo ""
    echo "   Current directory: $(pwd)"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit - Smart Energy Ecosystem'"
    echo "   git remote add origin https://github.com/umesh-404/smart-energy-ecosystem.git"
    echo "   git push -u origin main"
    exit 1
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Git repository is clean and ready for deployment"
echo ""
echo "📁 Project Structure Detected:"
echo "   ✅ frontend/ (React + Vite)"
echo "   ✅ backend/ (Node.js + Express)"
echo "   ✅ contracts/ (Solidity smart contracts)"
echo "   ✅ scripts/ (Deployment scripts)"
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://render.com and sign up/login"
echo "2. Create a new Web Service for the backend:"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory to 'backend'"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "3. Create a new Static Site for the frontend:"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory to 'frontend'"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: dist"
echo "   - Add VITE_API_URL environment variable"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo "🎉 Happy deploying!"