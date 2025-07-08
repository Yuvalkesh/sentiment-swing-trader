import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, RefreshCw, Play, BarChart3, Trophy, Target, Briefcase, ArrowUpRight, ArrowDownRight, Users, MessageCircle, Zap } from 'lucide-react';

const ModernDashboard = ({ portfolio, sentimentData, onExecuteTrade, onRefreshSentiment, isLoading }) => {
  if (!portfolio) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const { portfolio: portfolioData, metrics } = portfolio;

  const getSentimentColor = (score) => {
    if (score > 5) return 'bg-green-500';
    if (score > 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSentimentLabel = (score) => {
    if (score > 5) return 'Bullish';
    if (score > 0) return 'Neutral';
    return 'Bearish';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Trading Dashboard</h2>
        <p className="text-slate-600">Monitor your portfolio performance and sentiment-driven trading opportunities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Portfolio Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Portfolio Summary</h3>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Paper Trading
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">Total Portfolio Value</div>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                ${portfolioData.totalValue.toLocaleString()}
              </div>
              <div className="flex items-center justify-center space-x-2">
                {portfolioData.dailyPnL >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`font-medium ${portfolioData.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(portfolioData.dailyPnL).toFixed(2)}
                </span>
                <span className="text-slate-500">Today</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Available Cash</span>
              </div>
              <div className="text-xl font-bold text-slate-800">
                ${portfolioData.cash.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Total Return</span>
              </div>
              <div className={`text-xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.totalReturn}%
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Performance Metrics</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-slate-50 rounded-lg p-4 mb-3">
                <TrendingUp className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-slate-800">{metrics.totalTrades}</div>
              </div>
              <div className="text-sm text-slate-600">Total Trades</div>
            </div>
            <div className="text-center">
              <div className="bg-slate-50 rounded-lg p-4 mb-3">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{metrics.winRate}%</div>
              </div>
              <div className="text-sm text-slate-600">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="bg-slate-50 rounded-lg p-4 mb-3">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{metrics.winningTrades}</div>
              </div>
              <div className="text-sm text-slate-600">Winning Trades</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Positions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Current Positions</h3>
          </div>
          
          {portfolioData.positions && portfolioData.positions.length > 0 ? (
            <div className="space-y-4">
              {portfolioData.positions.map((position) => (
                <div key={position.ticker} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <span className="text-sm font-bold text-blue-600">{position.ticker}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{position.shares} shares</div>
                      <div className="text-sm text-slate-500">Avg: ${position.avgPrice.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-slate-800">
                      ${position.totalValue.toFixed(2)}
                    </div>
                    <div className={`text-sm font-medium ${position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-slate-100 rounded-full p-6 mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-medium text-slate-600 mb-2">No current positions</h4>
              <p className="text-slate-500 text-center">Execute trades to see positions here</p>
            </div>
          )}
        </div>

        {/* Top Sentiment Picks */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Top Sentiment Picks</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onRefreshSentiment}
                disabled={isLoading?.sentiment}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading?.sentiment ? 'animate-spin' : ''}`} />
                <span>Refresh Sentiment</span>
              </button>
              <button 
                onClick={onExecuteTrade}
                disabled={isLoading?.trading}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>Execute Trade</span>
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {sentimentData && sentimentData.length > 0 ? (
              sentimentData.slice(0, 5).map((stock, index) => (
                <div key={stock.ticker} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-lg">{stock.ticker}</div>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{stock.newsCount} news</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{stock.twitterCount} social</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getSentimentColor(stock.score)}`}></div>
                      <span className="text-sm font-medium text-slate-600">{getSentimentLabel(stock.score)}</span>
                      <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-lg">
                        <span className="text-sm font-bold">{stock.score > 0 ? '+' : ''}{stock.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-slate-100 rounded-full p-6 mb-4">
                  <Zap className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-medium text-slate-600 mb-2">Loading sentiment data...</h4>
                <p className="text-slate-500 text-center">Analyzing market sentiment from news and social media</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;