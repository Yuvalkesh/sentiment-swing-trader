const Alpaca = require('@alpacahq/alpaca-trade-api');

class TradingService {
    constructor() {
        this.alpaca = new Alpaca({
            key: process.env.ALPACA_API_KEY,
            secret: process.env.ALPACA_SECRET_KEY,
            paper: true,
            usePolygon: false
        });
        
        this.portfolio = {
            cash: 100000, // Increased capital for swing trading
            positions: new Map(),
            totalValue: 100000,
            dailyPnL: 0,
            totalPnL: 0
        };
        
        this.trades = [];
        this.isMarketOpen = false;
    }

    async initialize() {
        try {
            const account = await this.alpaca.getAccount();
            this.portfolio.cash = parseFloat(account.cash);
            this.portfolio.totalValue = parseFloat(account.portfolio_value);
            console.log('Trading service initialized with Alpaca account:', {
                cash: this.portfolio.cash,
                totalValue: this.portfolio.totalValue
            });
        } catch (error) {
            console.log('Using mock trading mode due to API error:', error.message);
            this.portfolio.cash = 100000;
            this.portfolio.totalValue = 100000;
            console.log('Mock trading initialized with:', {
                cash: this.portfolio.cash,
                totalValue: this.portfolio.totalValue
            });
        }
    }

    async getMarketStatus() {
        try {
            const clock = await this.alpaca.getClock();
            this.isMarketOpen = clock.is_open;
            return {
                isOpen: clock.is_open,
                nextOpen: clock.next_open,
                nextClose: clock.next_close
            };
        } catch (error) {
            console.error('Error getting market status:', error.message);
            const now = new Date();
            const hour = now.getHours();
            const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
            this.isMarketOpen = isWeekday && hour >= 9 && hour < 16;
            return { isOpen: this.isMarketOpen };
        }
    }

    async getCurrentPrice(ticker) {
        try {
            const quote = await this.alpaca.getLatestTrade(ticker);
            return quote.Price || quote.price;
        } catch (error) {
            console.error(`Error getting price for ${ticker}:`, error.message);
            return 100 + Math.random() * 200;
        }
    }

    async calculatePositionSize(availableCash, numPositions) {
        // For swing trading, use more aggressive position sizing
        const maxRiskPerTrade = 0.1; // 10% max per trade
        const maxCashUsage = 0.8; // Use up to 80% of available cash
        
        const positionSize = Math.min(
            (availableCash * maxCashUsage) / numPositions,
            this.portfolio.totalValue * maxRiskPerTrade
        );
        return Math.floor(positionSize);
    }

    async buyStock(ticker, dollarAmount) {
        try {
            const price = await this.getCurrentPrice(ticker);
            const shares = Math.floor(dollarAmount / price);
            
            if (shares <= 0) {
                throw new Error('Insufficient funds for purchase');
            }

            const totalCost = shares * price;
            
            if (totalCost > this.portfolio.cash) {
                throw new Error('Insufficient cash for purchase');
            }

            const trade = {
                id: Date.now().toString(),
                ticker,
                type: 'BUY',
                shares,
                price,
                totalValue: totalCost,
                timestamp: new Date(),
                status: 'FILLED'
            };

            this.portfolio.cash -= totalCost;
            this.portfolio.positions.set(ticker, {
                shares,
                avgPrice: price,
                currentPrice: price,
                totalValue: totalCost,
                unrealizedPnL: 0
            });

            this.trades.push(trade);
            
            console.log(`BUY: ${shares} shares of ${ticker} at $${price}`);
            return trade;
            
        } catch (error) {
            console.error(`Error buying ${ticker}:`, error.message);
            throw error;
        }
    }

    async sellStock(ticker) {
        try {
            const position = this.portfolio.positions.get(ticker);
            if (!position) {
                throw new Error(`No position found for ${ticker}`);
            }

            const currentPrice = await this.getCurrentPrice(ticker);
            const totalValue = position.shares * currentPrice;
            const pnl = totalValue - (position.shares * position.avgPrice);

            const trade = {
                id: Date.now().toString(),
                ticker,
                type: 'SELL',
                shares: position.shares,
                price: currentPrice,
                totalValue,
                pnl,
                timestamp: new Date(),
                status: 'FILLED'
            };

            this.portfolio.cash += totalValue;
            this.portfolio.positions.delete(ticker);
            this.trades.push(trade);
            
            console.log(`SELL: ${position.shares} shares of ${ticker} at $${currentPrice} (P&L: $${pnl.toFixed(2)})`);
            return trade;
            
        } catch (error) {
            console.error(`Error selling ${ticker}:`, error.message);
            throw error;
        }
    }

    async updatePortfolio() {
        let totalPositionValue = 0;
        
        for (const [ticker, position] of this.portfolio.positions) {
            const currentPrice = await this.getCurrentPrice(ticker);
            position.currentPrice = currentPrice;
            position.totalValue = position.shares * currentPrice;
            position.unrealizedPnL = position.totalValue - (position.shares * position.avgPrice);
            totalPositionValue += position.totalValue;
        }

        this.portfolio.totalValue = this.portfolio.cash + totalPositionValue;
        
        const dayStart = new Date();
        dayStart.setHours(0, 0, 0, 0);
        
        const todaysTrades = this.trades.filter(trade => 
            trade.timestamp >= dayStart && trade.type === 'SELL'
        );
        
        this.portfolio.dailyPnL = todaysTrades.reduce((sum, trade) => 
            sum + (trade.pnl || 0), 0
        );
    }

    async executeDailyTrading(topTickers) {
        console.log('🌅 Starting daily swing trading execution...');
        
        await this.updatePortfolio();
        
        // Sell existing positions first
        await this.sellAllPositions();
        
        // Select top bullish stocks for swing trading
        const availableCash = this.portfolio.cash;
        const numPositions = Math.min(10, topTickers.length); // Trade up to 10 positions
        const positionSize = await this.calculatePositionSize(availableCash, numPositions);
        
        console.log(`💰 Available cash: $${availableCash.toLocaleString()}`);
        console.log(`📊 Executing ${numPositions} swing trades at $${positionSize.toLocaleString()} each`);
        
        const buyTrades = [];
        for (let i = 0; i < numPositions; i++) {
            const ticker = topTickers[i];
            if (ticker && ticker.ticker && ticker.score > 0) { // Only buy bullish stocks
                try {
                    console.log(`📈 Buying ${ticker.ticker} (sentiment: +${ticker.score})`);
                    const trade = await this.buyStock(ticker.ticker, positionSize);
                    buyTrades.push(trade);
                    
                    // Add small delay to avoid overwhelming APIs
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`❌ Failed to buy ${ticker.ticker}:`, error.message);
                }
            }
        }
        
        await this.updatePortfolio();
        console.log(`✅ Daily trading complete: ${buyTrades.length} positions opened`);
        return buyTrades;
    }

    async sellAllPositions() {
        console.log('🌆 Selling all swing trading positions...');
        const sellTrades = [];
        
        for (const ticker of this.portfolio.positions.keys()) {
            try {
                console.log(`📉 Selling ${ticker}`);
                const trade = await this.sellStock(ticker);
                sellTrades.push(trade);
                
                // Add small delay between sells
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`❌ Failed to sell ${ticker}:`, error.message);
            }
        }
        
        console.log(`✅ Evening trading complete: ${sellTrades.length} positions closed`);
        return sellTrades;
    }

    getPortfolio() {
        return {
            ...this.portfolio,
            positions: Array.from(this.portfolio.positions.entries()).map(([ticker, position]) => ({
                ticker,
                ...position
            }))
        };
    }

    getTrades(limit = 50) {
        return this.trades
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    getPerformanceMetrics() {
        const totalTrades = this.trades.length;
        const winningTrades = this.trades.filter(trade => trade.pnl > 0).length;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        
        return {
            totalTrades,
            winningTrades,
            winRate: winRate.toFixed(2),
            dailyPnL: this.portfolio.dailyPnL,
            totalPnL: this.portfolio.totalPnL,
            totalReturn: ((this.portfolio.totalValue - 10000) / 10000 * 100).toFixed(2)
        };
    }
}

module.exports = TradingService;