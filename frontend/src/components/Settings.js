import React, { useState } from 'react';

const Settings = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <button 
          className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
          onClick={handleSave}
        >
          {saved ? '✅ Saved' : '💾 Save Settings'}
        </button>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>🤖 Trading Automation</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Auto Trading</div>
              <div className="setting-description">
                Enable automatic trading based on sentiment analysis
              </div>
            </div>
            <div className="setting-control">
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={localSettings.autoTrading}
                  onChange={() => handleToggle('autoTrading')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Trading Schedule</div>
              <div className="setting-description">
                Buy at 9:30 AM, Sell at 3:59 PM (Market Hours)
              </div>
            </div>
            <div className="setting-control">
              <span className="schedule-info">
                🕘 Morning: 9:30 AM ET<br />
                🕐 Evening: 3:59 PM ET
              </span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>💰 Risk Management</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Maximum Positions</div>
              <div className="setting-description">
                Maximum number of stocks to hold simultaneously
              </div>
            </div>
            <div className="setting-control">
              <span className="setting-value">3 stocks</span>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Position Size</div>
              <div className="setting-description">
                Equal weight allocation across selected stocks
              </div>
            </div>
            <div className="setting-control">
              <span className="setting-value">33.33% each</span>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Risk per Trade</div>
              <div className="setting-description">
                Maximum percentage of portfolio per trade
              </div>
            </div>
            <div className="setting-control">
              <span className="setting-value">30% max</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>📊 Sentiment Analysis</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Sentiment Sources</div>
              <div className="setting-description">
                Data sources for sentiment analysis
              </div>
            </div>
            <div className="setting-control">
              <div className="sources-list">
                <span className="source-item">📰 GNews API</span>
                <span className="source-item">🐦 Twitter API</span>
                <span className="source-item">🤖 OpenAI GPT</span>
              </div>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Analysis Frequency</div>
              <div className="setting-description">
                How often sentiment data is updated
              </div>
            </div>
            <div className="setting-control">
              <span className="setting-value">Every 5 minutes</span>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Ticker Universe</div>
              <div className="setting-description">
                Number of stocks analyzed for sentiment
              </div>
            </div>
            <div className="setting-control">
              <span className="setting-value">50 tickers</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>🔐 API Configuration</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">Trading Platform</div>
              <div className="setting-description">
                Connected brokerage for paper trading
              </div>
            </div>
            <div className="setting-control">
              <span className="setting-value">Alpaca (Paper)</span>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">API Status</div>
              <div className="setting-description">
                Current status of connected APIs
              </div>
            </div>
            <div className="setting-control">
              <div className="api-status">
                <span className="status-item connected">🟢 Alpaca</span>
                <span className="status-item connected">🟢 OpenAI</span>
                <span className="status-item connected">🟢 GNews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;