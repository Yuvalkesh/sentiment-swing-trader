class Database {
    constructor() {
        this.portfolio = {
            id: 1,
            cash: 10000,
            totalValue: 10000,
            dailyPnL: 0,
            totalPnL: 0,
            lastUpdated: new Date()
        };
        
        this.trades = [];
        this.sentimentHistory = [];
        this.settings = {
            autoTrading: true,
            maxPositions: 3,
            riskPerTrade: 0.3,
            tradingSchedule: {
                buyTime: '09:30',
                sellTime: '15:59'
            }
        };
    }

    async savePortfolio(portfolio) {
        this.portfolio = {
            ...this.portfolio,
            ...portfolio,
            lastUpdated: new Date()
        };
        return this.portfolio;
    }

    async getPortfolio() {
        return this.portfolio;
    }

    async saveTrade(trade) {
        const tradeWithId = {
            ...trade,
            id: Date.now().toString(),
            createdAt: new Date()
        };
        this.trades.unshift(tradeWithId);
        return tradeWithId;
    }

    async getTrades(limit = 50) {
        return this.trades.slice(0, limit);
    }

    async saveSentimentData(sentimentData) {
        const sentimentEntry = {
            id: Date.now().toString(),
            data: sentimentData,
            timestamp: new Date()
        };
        this.sentimentHistory.unshift(sentimentEntry);
        
        if (this.sentimentHistory.length > 100) {
            this.sentimentHistory = this.sentimentHistory.slice(0, 100);
        }
        
        return sentimentEntry;
    }

    async getSentimentHistory(limit = 10) {
        return this.sentimentHistory.slice(0, limit);
    }

    async saveSettings(settings) {
        this.settings = {
            ...this.settings,
            ...settings,
            lastUpdated: new Date()
        };
        return this.settings;
    }

    async getSettings() {
        return this.settings;
    }

    async clearData() {
        this.portfolio = {
            id: 1,
            cash: 10000,
            totalValue: 10000,
            dailyPnL: 0,
            totalPnL: 0,
            lastUpdated: new Date()
        };
        this.trades = [];
        this.sentimentHistory = [];
        return true;
    }

    async getStatistics() {
        const totalTrades = this.trades.length;
        const buyTrades = this.trades.filter(t => t.type === 'BUY');
        const sellTrades = this.trades.filter(t => t.type === 'SELL');
        
        const totalPnL = sellTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
        const winningTrades = sellTrades.filter(t => t.pnl > 0).length;
        const losingTrades = sellTrades.filter(t => t.pnl < 0).length;
        
        return {
            totalTrades,
            buyTrades: buyTrades.length,
            sellTrades: sellTrades.length,
            totalPnL,
            winningTrades,
            losingTrades,
            winRate: sellTrades.length > 0 ? (winningTrades / sellTrades.length) * 100 : 0,
            avgPnL: sellTrades.length > 0 ? totalPnL / sellTrades.length : 0,
            lastTradeDate: totalTrades > 0 ? this.trades[0].createdAt : null
        };
    }
}

const database = new Database();

module.exports = database;