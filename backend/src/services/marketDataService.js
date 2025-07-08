const axios = require('axios');

class MarketDataService {
    constructor() {
        this.alphaVantageKey = process.env.ALPHA_VANTAGE_API_KEY;
        this.finnhubKey = process.env.FINNHUB_API_KEY;
        this.iexToken = process.env.IEX_CLOUD_TOKEN;
    }

    async getCurrentPrice(ticker) {
        // Try multiple data sources for real prices
        try {
            // Try Alpha Vantage first
            if (this.alphaVantageKey) {
                const price = await this.getAlphaVantagePrice(ticker);
                if (price) return price;
            }

            // Try Finnhub as backup
            if (this.finnhubKey) {
                const price = await this.getFinnhubPrice(ticker);
                if (price) return price;
            }

            // Try IEX Cloud as third option
            if (this.iexToken) {
                const price = await this.getIEXPrice(ticker);
                if (price) return price;
            }

            // Fallback to mock data
            return this.getMockPrice(ticker);
        } catch (error) {
            console.error(`Error getting price for ${ticker}:`, error.message);
            return this.getMockPrice(ticker);
        }
    }

    async getAlphaVantagePrice(ticker) {
        try {
            const response = await axios.get('https://www.alphavantage.co/query', {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: ticker,
                    apikey: this.alphaVantageKey
                },
                timeout: 10000
            });

            const quote = response.data['Global Quote'];
            if (quote && quote['05. price']) {
                return parseFloat(quote['05. price']);
            }
            return null;
        } catch (error) {
            console.warn(`Alpha Vantage error for ${ticker}:`, error.message);
            return null;
        }
    }

    async getFinnhubPrice(ticker) {
        try {
            const response = await axios.get('https://finnhub.io/api/v1/quote', {
                params: {
                    symbol: ticker,
                    token: this.finnhubKey
                },
                timeout: 10000
            });

            if (response.data && response.data.c) {
                return parseFloat(response.data.c); // Current price
            }
            return null;
        } catch (error) {
            console.warn(`Finnhub error for ${ticker}:`, error.message);
            return null;
        }
    }

    async getIEXPrice(ticker) {
        try {
            const response = await axios.get(`https://cloud.iexapis.com/stable/stock/${ticker}/quote`, {
                params: {
                    token: this.iexToken
                },
                timeout: 10000
            });

            if (response.data && response.data.latestPrice) {
                return parseFloat(response.data.latestPrice);
            }
            return null;
        } catch (error) {
            console.warn(`IEX Cloud error for ${ticker}:`, error.message);
            return null;
        }
    }

    getMockPrice(ticker) {
        // Generate realistic mock prices based on ticker
        const basePrices = {
            'AAPL': 175, 'GOOGL': 2800, 'MSFT': 415, 'AMZN': 3200, 'TSLA': 250,
            'META': 480, 'NVDA': 875, 'NFLX': 450, 'AMD': 140, 'INTC': 50
        };
        
        const basePrice = basePrices[ticker] || 100;
        const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
        return basePrice * (1 + variance);
    }

    async getMarketNews(ticker) {
        try {
            // Try Alpha Vantage news
            if (this.alphaVantageKey) {
                const news = await this.getAlphaVantageNews(ticker);
                if (news.length > 0) return news;
            }

            // Try Finnhub news
            if (this.finnhubKey) {
                const news = await this.getFinnhubNews(ticker);
                if (news.length > 0) return news;
            }

            return [];
        } catch (error) {
            console.error(`Error getting news for ${ticker}:`, error.message);
            return [];
        }
    }

    async getAlphaVantageNews(ticker) {
        try {
            const response = await axios.get('https://www.alphavantage.co/query', {
                params: {
                    function: 'NEWS_SENTIMENT',
                    tickers: ticker,
                    apikey: this.alphaVantageKey,
                    limit: 10
                },
                timeout: 15000
            });

            if (response.data && response.data.feed) {
                return response.data.feed.map(article => ({
                    title: article.title,
                    summary: article.summary,
                    url: article.url,
                    source: article.source,
                    publishedAt: article.time_published,
                    sentiment: article.overall_sentiment_label,
                    sentimentScore: parseFloat(article.overall_sentiment_score || 0)
                }));
            }
            return [];
        } catch (error) {
            console.warn(`Alpha Vantage news error for ${ticker}:`, error.message);
            return [];
        }
    }

    async getFinnhubNews(ticker) {
        try {
            const toDate = new Date();
            const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
            
            const response = await axios.get('https://finnhub.io/api/v1/company-news', {
                params: {
                    symbol: ticker,
                    from: fromDate.toISOString().split('T')[0],
                    to: toDate.toISOString().split('T')[0],
                    token: this.finnhubKey
                },
                timeout: 15000
            });

            if (response.data && Array.isArray(response.data)) {
                return response.data.slice(0, 10).map(article => ({
                    title: article.headline,
                    summary: article.summary,
                    url: article.url,
                    source: article.source,
                    publishedAt: new Date(article.datetime * 1000).toISOString(),
                    image: article.image
                }));
            }
            return [];
        } catch (error) {
            console.warn(`Finnhub news error for ${ticker}:`, error.message);
            return [];
        }
    }

    async getMarketStatus() {
        try {
            if (this.alphaVantageKey) {
                // Check if US market is open
                const now = new Date();
                const marketOpen = new Date();
                marketOpen.setHours(9, 30, 0, 0); // 9:30 AM
                const marketClose = new Date();
                marketClose.setHours(16, 0, 0, 0); // 4:00 PM
                
                const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
                const isMarketHours = now >= marketOpen && now <= marketClose;
                
                return {
                    isOpen: isWeekday && isMarketHours,
                    nextOpen: isWeekday ? (now > marketClose ? this.getNextBusinessDay(now, 9, 30) : marketOpen) : this.getNextBusinessDay(now, 9, 30),
                    nextClose: isWeekday && now < marketClose ? marketClose : null
                };
            }
            
            return { isOpen: false };
        } catch (error) {
            console.error('Error getting market status:', error.message);
            return { isOpen: false };
        }
    }

    getNextBusinessDay(date, hour = 9, minute = 30) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(hour, minute, 0, 0);
        
        // Skip weekends
        while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
            nextDay.setDate(nextDay.getDate() + 1);
        }
        
        return nextDay;
    }
}

module.exports = MarketDataService;