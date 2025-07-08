const cron = require('node-cron');
const SentimentService = require('./sentimentService');
const TradingService = require('./tradingService');

class SchedulerService {
    constructor() {
        this.sentimentService = new SentimentService();
        this.tradingService = new TradingService();
        this.isEnabled = true;
        this.jobs = [];
    }

    start() {
        console.log('Starting scheduler service...');
        
        const morningJob = cron.schedule('30 9 * * 1-5', async () => {
            console.log('🌅 Running morning trading routine...');
            await this.runMorningTrading();
        }, {
            scheduled: false,
            timezone: 'America/New_York'
        });

        const eveningJob = cron.schedule('59 15 * * 1-5', async () => {
            console.log('🌆 Running evening trading routine...');
            await this.runEveningTrading();
        }, {
            scheduled: false,
            timezone: 'America/New_York'
        });

        const updateJob = cron.schedule('*/5 * * * *', async () => {
            console.log('🔄 Updating portfolio...');
            await this.updatePortfolio();
        }, {
            scheduled: false
        });

        this.jobs = [morningJob, eveningJob, updateJob];
        
        if (this.isEnabled) {
            this.jobs.forEach(job => job.start());
        }
    }

    async runMorningTrading() {
        if (!this.isEnabled) return;
        
        try {
            console.log('Analyzing market sentiment...');
            const tickers = this.sentimentService.getTopTickers();
            const sentimentData = await this.sentimentService.analyzeBatch(tickers);
            
            console.log('Executing morning trades...');
            const topTickers = sentimentData.slice(0, 3);
            const trades = await this.tradingService.executeDailyTrading(topTickers);
            
            console.log(`✅ Morning trading complete: ${trades.length} trades executed`);
            return trades;
        } catch (error) {
            console.error('❌ Error in morning trading:', error.message);
            throw error;
        }
    }

    async runEveningTrading() {
        if (!this.isEnabled) return;
        
        try {
            console.log('Selling all positions...');
            const trades = await this.tradingService.sellAllPositions();
            
            console.log(`✅ Evening trading complete: ${trades.length} positions sold`);
            return trades;
        } catch (error) {
            console.error('❌ Error in evening trading:', error.message);
            throw error;
        }
    }

    async updatePortfolio() {
        if (!this.isEnabled) return;
        
        try {
            await this.tradingService.updatePortfolio();
            return this.tradingService.getPortfolio();
        } catch (error) {
            console.error('❌ Error updating portfolio:', error.message);
            throw error;
        }
    }

    enable() {
        this.isEnabled = true;
        this.jobs.forEach(job => job.start());
        console.log('📅 Scheduler enabled');
    }

    disable() {
        this.isEnabled = false;
        this.jobs.forEach(job => job.stop());
        console.log('⏹️ Scheduler disabled');
    }

    getStatus() {
        return {
            enabled: this.isEnabled,
            jobs: this.jobs.length,
            nextRun: {
                morning: '09:30 AM ET (Mon-Fri)',
                evening: '03:59 PM ET (Mon-Fri)',
                update: 'Every 5 minutes'
            }
        };
    }

    destroy() {
        this.jobs.forEach(job => job.destroy());
        this.jobs = [];
        console.log('🗑️ Scheduler destroyed');
    }
}

module.exports = SchedulerService;