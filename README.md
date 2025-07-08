# Sentiment Swing Trader

An AI-powered sentiment analysis swing trading application that analyzes news and social media sentiment to execute simulated trades.

## Features

- **Sentiment Analysis**: Real-time analysis of news and social media sentiment
- **Mock Trading**: Paper trading with Alpaca sandbox API
- **Dashboard**: Portfolio overview, P&L tracking, and trade history
- **Automated Trading**: Daily buy/sell cycle based on sentiment scores
- **Risk Management**: Configurable risk tolerance and position limits

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Architecture

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Trading**: Alpaca Paper Trading API
- **Sentiment**: OpenAI GPT for sentiment analysis
- **News**: GNews API for financial news

## Trading Logic

1. **Morning (9:30 AM)**: Analyze sentiment of top 50 tickers
2. **Selection**: Pick top 3 most bullish stocks
3. **Execution**: Buy equal amounts of selected stocks
4. **Evening (3:59 PM)**: Sell all positions
5. **Logging**: Record P&L and trade history

## Project Structure

```
├── backend/          # Express.js API server
├── frontend/         # React.js web app
├── shared/           # Shared types and constants
└── docs/             # Documentation
```# sentiment-swing-trader
# sentiment-swing-trader
# sentiment-swing-trader
# sentiment-swing-trader
