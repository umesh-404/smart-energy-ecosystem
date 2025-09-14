# 🚀 Smart Energy Ecosystem - Render Deployment Guide

This guide will help you deploy the Smart Energy Ecosystem to Render.com for free.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Git Repository**: Push your code to GitHub

## 📁 Project Structure

Your project has the following structure:
```
smart-energy-ecosystem/
├── frontend/           # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/            # Node.js + Express backend
│   ├── src/
│   ├── package.json
│   └── server.js
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment and utility scripts
├── artifacts/          # Hardhat compilation artifacts
├── cache/              # Hardhat cache
├── ignition/           # Hardhat deployment scripts
├── test/               # Test files
├── simulation/         # Simulation data
├── deploy.sh           # Deployment script
├── DEPLOYMENT.md       # This file
├── hardhat.config.ts   # Hardhat configuration
├── .env                # Environment variables
└── .gitignore          # Git ignore file
```

## 🔧 Pre-Deployment Setup

### 1. Run the Deployment Script

From your project root directory (`smart-energy-ecosystem/`):

**On Windows (Git Bash):**
```bash
./deploy.sh
```

**On Windows (PowerShell):**
```powershell
# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "Git not initialized. Please run:"
    Write-Host "git init"
    Write-Host "git add ."
    Write-Host "git commit -m 'Initial commit - Smart Energy Ecosystem'"
    Write-Host "git remote add origin https://github.com/umesh-404/smart-energy-ecosystem.git"
    Write-Host "git push -u origin main"
    exit 1
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "You have uncommitted changes. Please commit them first:"
    Write-Host "git add ."
    Write-Host "git commit -m 'Prepare for deployment'"
    Write-Host "git push"
    exit 1
}

Write-Host "Git repository is clean and ready for deployment"
```

### 2. What Gets Deployed

**✅ Folders that WILL be deployed:**
- `frontend/` → Deployed as Static Site on Render
- `backend/` → Deployed as Web Service on Render
- `contracts/` → Included in repository (for reference)
- `scripts/` → Included in repository (for reference)
- `deploy.sh` → Deployment script
- `DEPLOYMENT.md` → This guide

**❌ Folders that will NOT be deployed (ignored by .gitignore):**
- `node_modules/` → Dependencies (installed during build)
- `artifacts/` → Hardhat compilation artifacts
- `cache/` → Hardhat cache
- `ignition/` → Hardhat deployment artifacts
- `.env` → Environment variables (set in Render dashboard)

### 3. Manual Git Setup (if needed)

```bash
# Initialize git if not already done
git init

# Add all files (this will include frontend, backend, contracts, etc.)
git add .

# Commit changes
git commit -m "Initial commit - Smart Energy Ecosystem"

# Add your GitHub repository as remote
git remote add origin https://github.com/umesh-404/smart-energy-ecosystem.git

# Push to GitHub
git push -u origin main
```

## 🌐 Deploy Backend to Render

### Step 1: Create Backend Service

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
2. **Click "New +"** → **"Web Service"**
3. **Connect Repository**: Select your GitHub repository
4. **Configure Service**:
   - **Name**: `smart-energy-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=https://smart-energy-frontend.onrender.com
```

**Important**: 
- Generate a strong JWT_SECRET (you can use: `openssl rand -base64 32`)
- Update CORS_ORIGIN after deploying frontend

### Step 3: Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes)
3. **Note the URL**: `https://smart-energy-backend.onrender.com`

## 🎨 Deploy Frontend to Render

### Step 1: Create Frontend Service

1. **Go to Render Dashboard**
2. **Click "New +"** → **"Static Site"**
3. **Connect Repository**: Select your GitHub repository
4. **Configure Service**:
   - **Name**: `smart-energy-frontend`
   - **Environment**: `Static Site`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 2: Environment Variables

Add this environment variable:

```
VITE_API_URL=https://smart-energy-backend.onrender.com/api
```

### Step 3: Deploy Frontend

1. **Click "Create Static Site"**
2. **Wait for deployment** (5-10 minutes)
3. **Note the URL**: `https://smart-energy-frontend.onrender.com`

## 🔄 Update CORS Configuration

After both services are deployed:

1. **Go to Backend Service** in Render dashboard
2. **Environment Tab**
3. **Update CORS_ORIGIN** to your frontend URL:
   ```
   CORS_ORIGIN=https://smart-energy-frontend.onrender.com
   ```
4. **Redeploy** the backend service

## 🧪 Test Your Deployment

### 1. Test Backend
```bash
curl https://smart-energy-backend.onrender.com/api/health
```

### 2. Test Frontend
- Visit: `https://smart-energy-frontend.onrender.com`
- Try the demo login:
  - **Email**: `contact@solarfarmalpha.com`
  - **Password**: `password123`

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure CORS_ORIGIN matches your frontend URL exactly
   - Redeploy backend after updating CORS_ORIGIN

2. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

3. **Environment Variables**:
   - Double-check all environment variables are set correctly
   - Ensure no typos in variable names

4. **Slow Loading**:
   - Render free tier has cold starts
   - Consider upgrading to paid plan for better performance

## 📊 Monitoring

### Render Dashboard Features:
- **Logs**: View real-time application logs
- **Metrics**: Monitor CPU, memory, and response times
- **Deployments**: View deployment history
- **Environment**: Manage environment variables

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret
2. **CORS**: Restrict CORS to your frontend domain only
3. **Environment Variables**: Never commit secrets to git
4. **HTTPS**: Render provides HTTPS by default

## 🚀 Going Live

Once deployed, your Smart Energy Ecosystem will be available at:
- **Frontend**: `https://smart-energy-frontend.onrender.com`
- **Backend API**: `https://smart-energy-backend.onrender.com/api`

## 📱 Features Available

✅ **Authentication System** (Login/Register)
✅ **Energy Dashboard** with real-time data
✅ **Marketplace** for energy token trading
✅ **Crowdfunding** for renewable energy projects
✅ **Outage Compensation** system
✅ **Dynamic Pricing** with AI insights
✅ **Wallet Integration** with MetaMask
✅ **AI-Powered Suggestions**
✅ **Settings & Profile Management**
✅ **Dark/Light Mode**
✅ **Responsive Design**

## 🎯 Demo Credentials

- **Email**: `contact@solarfarmalpha.com`
- **Password**: `password123`

## 📞 Support

If you encounter any issues:
1. Check Render deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for frontend errors

---

**🎉 Congratulations! Your Smart Energy Ecosystem is now live on the internet!**