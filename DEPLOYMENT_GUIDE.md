# 🚀 FREE Vercel Deployment Guide

## Your APIs Ready:
✅ **Claude API**: [ADD_YOUR_CLAUDE_API_KEY_HERE]  
✅ **Alpaca Paper Trading**: [ADD_YOUR_ALPACA_KEY_HERE]  
✅ **NewsAPI**: [ADD_YOUR_NEWS_API_KEY_HERE]  

## What You Need To Do:

### Step 1: Get 2 FREE API Keys (2 minutes)
1. **Alpha Vantage** (real stock prices): https://www.alphavantage.co/support/#api-key
2. **Finnhub** (backup data): https://finnhub.io/register

### Step 2: Create GitHub Repository
1. Go to https://github.com
2. Create new repository: "sentiment-swing-trader"
3. Upload your project folder

### Step 3: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your "sentiment-swing-trader" repo
5. Set these build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: npm run build
   - **Output Directory**: build
6. Click "Deploy"

### Step 4: Deploy Backend to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Set **Root Directory**: backend
6. Add these Environment Variables:
   ```
   ANTHROPIC_API_KEY=your_claude_api_key_here
   ALPACA_API_KEY=your_alpaca_key_here
   ALPACA_SECRET_KEY=your_alpaca_secret_here
   NEWS_API_KEY=your_news_api_key_here
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
   FINNHUB_API_KEY=your_finnhub_key_here
   PORT=3001
   NODE_ENV=production
   ```
7. Click "Deploy"

### Step 5: Connect Frontend to Backend
1. Copy your Railway backend URL (e.g., https://your-app.railway.app)
2. In your frontend code, update the API URL
3. Redeploy frontend

## What You'll Get:
🌐 **Live URL**: your-app.vercel.app  
📊 **Real Stock Data**: Live prices from Alpha Vantage & Finnhub  
📰 **Real News**: Your NewsAPI pulling live financial news  
🤖 **AI Sentiment**: Claude analyzing real market sentiment  
📱 **Mobile Ready**: Works on all devices  
💰 **FREE**: No hosting costs to start  

## After Deployment:
- Your app will be live 24/7
- Real market data during trading hours
- Automated swing trading
- Professional dashboard accessible anywhere

## Need Help?
If you get stuck, I can help you with:
1. Setting up the GitHub repo
2. Configuring Vercel settings
3. Adding environment variables
4. Connecting frontend to backend

Ready to start? Which step do you want help with first?