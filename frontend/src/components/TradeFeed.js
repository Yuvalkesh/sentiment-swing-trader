import React from 'react';

const TradeFeed = ({ trades }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getTradeIcon = (type) => {
    return type === 'BUY' ? '✅' : '❌';
  };

  const getTradeColor = (type) => {
    return type === 'BUY' ? 'buy' : 'sell';
  };

  return (
    <div className="trade-feed">
      <div className="trade-feed-header">
        <h2>📈 Trade History</h2>
        <div className="trade-stats">
          <span className="trade-count">{trades.length} total trades</span>
        </div>
      </div>

      <div className="trades-container">
        {trades.length > 0 ? (
          <div className="trades-list">
            {trades.map((trade) => (
              <div key={trade.id} className={`trade-item ${getTradeColor(trade.type)}`}>
                <div className="trade-icon">
                  {getTradeIcon(trade.type)}
                </div>
                
                <div className="trade-info">
                  <div className="trade-primary">
                    <span className="trade-action">{trade.type}</span>
                    <span className="trade-ticker">{trade.ticker}</span>
                    <span className="trade-shares">{trade.shares} shares</span>
                  </div>
                  
                  <div className="trade-secondary">
                    <span className="trade-price">@ {formatCurrency(trade.price)}</span>
                    <span className="trade-total">Total: {formatCurrency(trade.totalValue)}</span>
                    {trade.pnl && (
                      <span className={`trade-pnl ${trade.pnl >= 0 ? 'positive' : 'negative'}`}>
                        P&L: {formatCurrency(trade.pnl)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="trade-timestamp">
                  {formatTime(trade.timestamp)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-trades">
            <div className="no-trades-icon">📊</div>
            <div className="no-trades-text">No trades yet</div>
            <div className="no-trades-subtitle">
              Execute your first trade from the dashboard
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeFeed;