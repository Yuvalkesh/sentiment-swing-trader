# 🚀 Deploy Your Sentiment Swing Trader

## Quick Deploy Options

### Option 1: Vercel + Railway (FREE to start)

#### Step 1: Deploy Frontend to Vercel
1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repo
4. Set build settings:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
5. Deploy!

#### Step 2: Deploy Backend to Railway
1. Go to https://railway.app
2. Connect GitHub repo
3. Select the `backend` folder
4. Add environment variables:
   ```
   ANTHROPIC_API_KEY=your_key
   ALPACA_API_KEY=your_key
   ALPACA_SECRET_KEY=your_secret
   NEWS_API_KEY=your_key
   ALPHA_VANTAGE_API_KEY=get_free_key
   FINNHUB_API_KEY=get_free_key
   PORT=3001
   ```
5. Deploy!

### Option 2: Heroku (One Platform)

#### Deploy to Heroku
1. Install Heroku CLI
2. Run these commands:
   ```bash
   heroku create your-app-name
   heroku config:set ANTHROPIC_API_KEY=your_key
   heroku config:set ALPACA_API_KEY=your_key
   heroku config:set ALPACA_SECRET_KEY=your_secret
   heroku config:set NEWS_API_KEY=your_key
   heroku config:set ALPHA_VANTAGE_API_KEY=get_free_key
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

## Get Free API Keys for Real Data

### 1. Alpha Vantage (Free 500 calls/day)
- Go to: https://www.alphavantage.co/support/#api-key
- Sign up for free API key
- Add to env: `ALPHA_VANTAGE_API_KEY=your_key`

### 2. Finnhub (Free 60 calls/minute)
- Go to: https://finnhub.io/register
- Get free API key
- Add to env: `FINNHUB_API_KEY=your_key`

### 3. IEX Cloud (Free 50k calls/month)
- Go to: https://iexcloud.io/pricing
- Sign up for free tier
- Add to env: `IEX_CLOUD_TOKEN=your_token`

## Real Data Features

### Real-Time Prices
- Live stock prices from multiple sources
- Automatic fallback if one API fails
- Market hours detection

### Real News Sentiment
- Live financial news from Alpha Vantage
- Company-specific news from Finnhub
- Real sentiment analysis with Claude AI

### Production Features
- PostgreSQL database for persistence
- WebSocket for real-time updates
- Automated trading at market hours
- Error handling and monitoring

## Environment Variables Needed

```bash
# Core APIs
ANTHROPIC_API_KEY=sk-ant-api03-...
ALPACA_API_KEY=PK4M0ATSSXE76ZJ7UPDD
ALPACA_SECRET_KEY=e4DAe9OzBOa2kcgUhlhUuCMNOfhctituoNtbWBv3
NEWS_API_KEY=8d1996c8-b1ae-47c0-afe5-d6ad9e1694ae

# Real Market Data (Get these for free)
ALPHA_VANTAGE_API_KEY=your_free_key
FINNHUB_API_KEY=your_free_key
IEX_CLOUD_TOKEN=your_free_token

# Database (Auto-generated on platforms)
DATABASE_URL=postgresql://...

# Server
PORT=3001
NODE_ENV=production
```

## Quick Start Commands

### For Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Update backend URL in frontend to your Railway URL
```

### For Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
```

### For Heroku:
```bash
# Install Heroku CLI
# Then deploy full app
heroku create sentiment-trader-live
git push heroku main
```

## What You'll Get

✅ **Live Public URL** (e.g., sentiment-trader.vercel.app)  
✅ **Real Stock Prices** from multiple data sources  
✅ **Real Financial News** with sentiment analysis  
✅ **24/7 Automated Trading** during market hours  
✅ **PostgreSQL Database** for data persistence  
✅ **Professional Dashboard** accessible anywhere  

## Recommended: Start with Vercel + Railway

This gives you:
- **FREE hosting** to start
- **Real market data** 
- **Easy scaling** when you grow
- **Professional URLs**
- **Automatic deployments** from GitHub

Would you like me to help you deploy to any of these platforms?