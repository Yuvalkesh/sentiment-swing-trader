require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const WebSocket = require('ws');
const http = require('http');

const SentimentService = require('./services/sentimentService');
const TradingService = require('./services/tradingService');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sentimentService = new SentimentService();
const tradingService = new TradingService();

app.use(cors());
app.use(express.json());

let clients = [];
let lastSentimentData = [];
let isAutoTradingEnabled = true;

wss.on('connection', (ws) => {
    clients.push(ws);
    console.log('Client connected');
    
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
    });
});

function broadcast(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

app.get('/api/sentiment', async (req, res) => {
    try {
        const tickers = sentimentService.getTopTickers();
        const sentimentData = await sentimentService.analyzeBatch(tickers);
        lastSentimentData = sentimentData;
        
        res.json({
            success: true,
            data: sentimentData,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Error getting sentiment data:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/sentiment/:ticker', async (req, res) => {
    try {
        const { ticker } = req.params;
        const sentimentData = await sentimentService.getTickerSentiment(ticker.toUpperCase());
        
        res.json({
            success: true,
            data: sentimentData
        });
    } catch (error) {
        console.error(`Error getting sentiment for ${ticker}:`, error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/portfolio', async (req, res) => {
    try {
        await tradingService.updatePortfolio();
        const portfolio = tradingService.getPortfolio();
        const metrics = tradingService.getPerformanceMetrics();
        
        res.json({
            success: true,
            data: {
                portfolio,
                metrics
            }
        });
    } catch (error) {
        console.error('Error getting portfolio:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/trades', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const trades = tradingService.getTrades(limit);
        
        res.json({
            success: true,
            data: trades
        });
    } catch (error) {
        console.error('Error getting trades:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/market-status', async (req, res) => {
    try {
        const status = await tradingService.getMarketStatus();
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        console.error('Error getting market status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/trade/execute', async (req, res) => {
    try {
        if (!isAutoTradingEnabled) {
            return res.status(400).json({
                success: false,
                error: 'Auto trading is disabled'
            });
        }

        const topTickers = lastSentimentData.slice(0, 3);
        const trades = await tradingService.executeDailyTrading(topTickers);
        
        broadcast({
            type: 'TRADE_EXECUTED',
            data: trades
        });
        
        res.json({
            success: true,
            data: trades
        });
    } catch (error) {
        console.error('Error executing trades:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const { autoTrading } = req.body;
        
        if (typeof autoTrading === 'boolean') {
            isAutoTradingEnabled = autoTrading;
        }
        
        res.json({
            success: true,
            data: {
                autoTrading: isAutoTradingEnabled
            }
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/settings', (req, res) => {
    res.json({
        success: true,
        data: {
            autoTrading: isAutoTradingEnabled
        }
    });
});

// Morning trading routine - 9:30 AM ET on weekdays
cron.schedule('30 9 * * 1-5', async () => {
    console.log('🌅 Running automated morning trading routine...');
    if (isAutoTradingEnabled) {
        try {
            console.log('📊 Analyzing sentiment for swing trading...');
            const tickers = sentimentService.getTopTickers();
            const sentimentData = await sentimentService.analyzeBatch(tickers);
            lastSentimentData = sentimentData;
            
            // Filter for bullish stocks and take top 10
            const bullishStocks = sentimentData.filter(stock => stock.score > 0).slice(0, 10);
            console.log(`🔥 Found ${bullishStocks.length} bullish stocks for trading`);
            
            const trades = await tradingService.executeDailyTrading(bullishStocks);
            
            broadcast({
                type: 'MORNING_TRADES',
                data: trades,
                message: `Morning trades executed: ${trades.length} positions opened`
            });
            
            console.log(`✅ Morning trading routine complete: ${trades.length} positions opened`);
        } catch (error) {
            console.error('❌ Error in morning trading routine:', error);
        }
    } else {
        console.log('⏸️ Auto-trading disabled, skipping morning routine');
    }
});

// Evening trading routine - 3:59 PM ET on weekdays
cron.schedule('59 15 * * 1-5', async () => {
    console.log('🌆 Running automated evening trading routine...');
    if (isAutoTradingEnabled) {
        try {
            const trades = await tradingService.sellAllPositions();
            
            broadcast({
                type: 'EVENING_TRADES',
                data: trades,
                message: `Evening trades executed: ${trades.length} positions closed`
            });
            
            console.log(`✅ Evening trading routine complete: ${trades.length} positions closed`);
        } catch (error) {
            console.error('❌ Error in evening trading routine:', error);
        }
    } else {
        console.log('⏸️ Auto-trading disabled, skipping evening routine');
    }
});

// Demo trading routine - every 2 minutes for testing (remove in production)
cron.schedule('*/2 * * * *', async () => {
    if (isAutoTradingEnabled && process.env.NODE_ENV === 'development') {
        console.log('🧪 Running demo trading cycle...');
        try {
            // Quick sentiment check and trade cycle
            const tickers = sentimentService.getTopTickers().slice(0, 20); // Analyze fewer for demo
            const sentimentData = await sentimentService.analyzeBatch(tickers);
            lastSentimentData = sentimentData;
            
            const bullishStocks = sentimentData.filter(stock => stock.score > 2).slice(0, 5);
            
            if (bullishStocks.length > 0) {
                const trades = await tradingService.executeDailyTrading(bullishStocks);
                
                broadcast({
                    type: 'DEMO_TRADES',
                    data: trades,
                    message: `Demo cycle: ${trades.length} trades executed`
                });
                
                console.log(`🚀 Demo cycle complete: ${trades.length} positions`);
            }
        } catch (error) {
            console.error('Demo trading error:', error.message);
        }
    }
});

cron.schedule('*/5 * * * *', async () => {
    try {
        await tradingService.updatePortfolio();
        const portfolio = tradingService.getPortfolio();
        
        broadcast({
            type: 'PORTFOLIO_UPDATE',
            data: portfolio
        });
    } catch (error) {
        console.error('Error updating portfolio:', error);
    }
});

async function startServer() {
    try {
        await tradingService.initialize();
        
        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('WebSocket server running');
            console.log('Scheduled trading routines active');
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();