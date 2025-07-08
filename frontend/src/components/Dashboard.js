import React from 'react';

const Dashboard = ({ portfolio, sentimentData, onExecuteTrade, onRefreshSentiment }) => {
  if (!portfolio) {
    return <div className="loading">Loading portfolio...</div>;
  }

  const { portfolio: portfolioData, metrics } = portfolio;

  const getStatusColor = (value) => {
    if (value > 0) return '#10b981';
    if (value < 0) return '#ef4444';
    return '#6b7280';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Trading Dashboard</h1>
        <div className="dashboard-status">
          <div className="status-indicator">
            <div className="status-dot active"></div>
            <span>Live Trading</span>
          </div>
          <div className="last-update">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card portfolio-summary">
          <div className="card-header">
            <h2>💰 Portfolio Summary</h2>
            <div className="portfolio-badge">
              <span className="badge-label">Paper Trading</span>
            </div>
          </div>
          <div className="portfolio-stats">
            <div className="stat-large">
              <span className="stat-label">Total Portfolio Value</span>
              <span className="stat-value-large">${portfolioData.totalValue.toLocaleString()}</span>
              <div className="stat-change">
                <span className={`change-indicator ${portfolioData.dailyPnL >= 0 ? 'positive' : 'negative'}`}>
                  {portfolioData.dailyPnL >= 0 ? '↗' : '↘'} ${Math.abs(portfolioData.dailyPnL).toFixed(2)}
                </span>
                <span className="change-label">Today</span>
              </div>
            </div>
            
            <div className="stats-row">
              <div className="stat">
                <span className="stat-label">💵 Available Cash</span>
                <span className="stat-value">${portfolioData.cash.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">📈 Total Return</span>
                <span className={`stat-value ${metrics.totalReturn >= 0 ? 'positive' : 'negative'}`}>
                  {metrics.totalReturn}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card performance-metrics">
          <h2>📊 Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-content">
                <span className="metric-value">{metrics.totalTrades}</span>
                <span className="metric-label">Total Trades</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🎯</div>
              <div className="metric-content">
                <span className="metric-value success">{metrics.winRate}%</span>
                <span className="metric-label">Win Rate</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">🏆</div>
              <div className="metric-content">
                <span className="metric-value">{metrics.winningTrades}</span>
                <span className="metric-label">Winning Trades</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card current-positions">
          <h2>📈 Current Positions</h2>
          {portfolioData.positions.length > 0 ? (
            <div className="positions-list">
              {portfolioData.positions.map((position) => (
                <div key={position.ticker} className="position-item">
                  <div className="position-left">
                    <div className="position-ticker">{position.ticker}</div>
                    <div className="position-shares">{position.shares} shares</div>
                  </div>
                  <div className="position-center">
                    <div className="position-price">
                      <span className="price-label">Avg:</span>
                      <span className="price-value">${position.avgPrice.toFixed(2)}</span>
                    </div>
                    <div className="position-current">
                      <span className="price-label">Current:</span>
                      <span className="price-value">${position.currentPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="position-right">
                    <div className={`position-pnl ${position.unrealizedPnL >= 0 ? 'positive' : 'negative'}`}>
                      {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                    </div>
                    <div className="position-value">
                      ${position.totalValue.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-positions">
              <div className="no-positions-icon">💼</div>
              <div className="no-positions-text">No current positions</div>
              <div className="no-positions-subtitle">Execute trades to see positions here</div>
            </div>
          )}
        </div>

        <div className="card sentiment-preview">
          <h2>🔥 Top Sentiment Picks</h2>
          <div className="sentiment-actions">
            <button 
              className="btn btn-primary"
              onClick={onRefreshSentiment}
            >
              🔄 Refresh Sentiment
            </button>
            <button 
              className="btn btn-success"
              onClick={onExecuteTrade}
            >
              ⚡ Execute Trade
            </button>
          </div>
          {sentimentData.length > 0 ? (
            <div className="sentiment-list">
              {sentimentData.slice(0, 5).map((item, index) => (
                <div key={item.ticker} className="sentiment-item-enhanced">
                  <div className="sentiment-rank">
                    <span className="rank-number">#{index + 1}</span>
                  </div>
                  <div className="sentiment-info">
                    <div className="sentiment-ticker-large">{item.ticker}</div>
                    <div className="sentiment-sources">
                      📰 {item.newsCount} news • 🐦 {item.twitterCount} social
                    </div>
                  </div>
                  <div className="sentiment-score-large">
                    <span className={`score-large ${item.score >= 0 ? 'positive' : 'negative'}`}>
                      {item.score > 0 ? '+' : ''}{item.score}
                    </span>
                    <div className="score-bar">
                      <div 
                        className={`score-fill ${item.score >= 0 ? 'positive' : 'negative'}`}
                        style={{ width: `${Math.abs(item.score) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-sentiment">
              <div className="loading-spinner"></div>
              <div className="loading-text">Analyzing market sentiment...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;