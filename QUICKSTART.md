# 🚀 Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - OpenAI (required)
  - Alpaca (recommended for paper trading)
  - GNews API (recommended for news sentiment)
  - Twitter API (optional for social sentiment)

## Installation

1. **Clone and setup**:
   ```bash
   node setup.js
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the application**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Getting API Keys

### OpenAI API Key (Required)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to `.env` as `OPENAI_API_KEY`

### Alpaca Paper Trading (Recommended)
1. Sign up at https://alpaca.markets/
2. Go to Paper Trading section
3. Generate API keys
4. Add to `.env` as `ALPACA_API_KEY` and `ALPACA_SECRET_KEY`

### GNews API (Recommended)
1. Sign up at https://gnews.io/
2. Get your API token
3. Add to `.env` as `NEWS_API_KEY`

### Twitter API (Optional)
1. Apply for Twitter Developer account
2. Create a new app
3. Get Bearer Token
4. Add to `.env` as `TWITTER_BEARER_TOKEN`

## Usage

### Dashboard
- View portfolio balance and performance
- See top sentiment picks
- Execute manual trades
- Monitor daily P&L

### Trading
- Automatic trading at 9:30 AM and 3:59 PM (ET)
- Manual trade execution
- Paper trading only (no real money)

### Sentiment Analysis
- Real-time analysis of 50+ stocks
- News and social media sentiment
- Bullish/bearish scoring (-10 to +10)

### Settings
- Toggle auto-trading on/off
- View API connection status
- Monitor trading schedule

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Check your API keys in `.env`
   - Verify API key permissions
   - Check rate limits

2. **Trading Errors**:
   - Ensure Alpaca keys are for paper trading
   - Check market hours (9:30 AM - 4:00 PM ET)
   - Verify sufficient virtual balance

3. **Frontend Issues**:
   - Clear browser cache
   - Check developer console for errors
   - Ensure backend is running

### Support

For issues and questions:
- Check the main README.md
- Review API documentation
- Verify environment configuration

## Next Steps

1. **Test the system** with paper trading
2. **Monitor performance** over several days
3. **Adjust settings** based on results
4. **Add more data sources** for better sentiment analysis

Happy trading! 🎯📈