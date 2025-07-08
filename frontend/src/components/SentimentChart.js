import React from 'react';

const SentimentChart = ({ sentimentData }) => {
  const maxScore = Math.max(...sentimentData.map(item => Math.abs(item.score)), 10);
  
  const getBarWidth = (score) => {
    return (Math.abs(score) / maxScore) * 100;
  };

  const getScoreColor = (score) => {
    if (score > 5) return 'very-positive';
    if (score > 0) return 'positive';
    if (score < -5) return 'very-negative';
    if (score < 0) return 'negative';
    return 'neutral';
  };

  const formatLastUpdated = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="sentiment-chart">
      <div className="sentiment-header">
        <h2>🔥 Sentiment Analysis</h2>
        <div className="sentiment-legend">
          <div className="legend-item">
            <div className="legend-color very-positive"></div>
            <span>Very Bullish (5+)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color positive"></div>
            <span>Bullish (0-5)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color neutral"></div>
            <span>Neutral (0)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color negative"></div>
            <span>Bearish (0 to -5)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color very-negative"></div>
            <span>Very Bearish (-5+)</span>
          </div>
        </div>
      </div>

      <div className="sentiment-container">
        {sentimentData.length > 0 ? (
          <div className="sentiment-list">
            {sentimentData.map((item, index) => (
              <div key={item.ticker} className="sentiment-row">
                <div className="sentiment-rank">#{index + 1}</div>
                
                <div className="sentiment-ticker">
                  <span className="ticker-symbol">{item.ticker}</span>
                </div>
                
                <div className="sentiment-bar-container">
                  <div className="sentiment-bar">
                    <div 
                      className={`sentiment-fill ${getScoreColor(item.score)}`}
                      style={{ width: `${getBarWidth(item.score)}%` }}
                    ></div>
                  </div>
                  <div className="sentiment-score">
                    {item.score > 0 ? '+' : ''}{item.score}
                  </div>
                </div>
                
                <div className="sentiment-details">
                  <div className="sentiment-sources">
                    📰 {item.newsCount} news • 🐦 {item.twitterCount} tweets
                  </div>
                  <div className="sentiment-explanation">
                    {item.explanation}
                  </div>
                  <div className="sentiment-updated">
                    Updated: {formatLastUpdated(item.lastUpdated)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-sentiment-data">
            <div className="no-sentiment-icon">📊</div>
            <div className="no-sentiment-text">Loading sentiment data...</div>
            <div className="no-sentiment-subtitle">
              Analyzing market sentiment from news and social media
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentChart;