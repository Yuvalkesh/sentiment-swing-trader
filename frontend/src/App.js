import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Settings as SettingsIcon, RefreshCw, Play, Pause, BarChart3, Trophy, Target, Briefcase, ArrowUpRight, ArrowDownRight, Clock, Users, MessageCircle, Zap } from 'lucide-react';
import ModernDashboard from './components/ModernDashboard';
import TradeFeed from './components/TradeFeed';
import SentimentChart from './components/SentimentChart';
import Settings from './components/Settings';
import NotificationContainer from './components/Notification';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [settings, setSettings] = useState({ autoTrading: true });
  const [ws, setWs] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState({
    portfolio: false,
    trades: false,
    sentiment: false,
    trading: false
  });
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001');
    
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'PORTFOLIO_UPDATE':
          setPortfolio(message.data);
          break;
        case 'TRADE_EXECUTED':
          addNotification(`Trade executed: ${message.data.length} trades completed`, 'success');
          fetchTrades();
          fetchPortfolio();
          break;
        case 'MORNING_TRADES':
          addNotification(`Morning trading: ${message.data.length} positions opened`, 'success');
          fetchTrades();
          fetchPortfolio();
          break;
        case 'EVENING_TRADES':
          addNotification(`Evening trading: ${message.data.length} positions closed`, 'info');
          fetchTrades();
          fetchPortfolio();
          break;
        default:
          break;
      }
    };
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
      addNotification('Connected to trading server', 'success');
    };
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      addNotification('Connection to trading server lost', 'warning');
    };
    
    websocket.onerror = () => {
      setConnectionStatus('error');
      addNotification('Connection error - retrying...', 'error');
    };
    
    setWs(websocket);
    
    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchPortfolio(),
        fetchTrades(),
        fetchSentiment(),
        fetchSettings()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setIsLoading(prev => ({ ...prev, portfolio: true }));
      const response = await fetch('http://localhost:3001/api/portfolio');
      const data = await response.json();
      if (data.success) {
        setPortfolio(data.data);
      } else {
        addNotification('Failed to fetch portfolio data', 'error');
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      addNotification('Error connecting to server', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, portfolio: false }));
    }
  };

  const fetchTrades = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/trades');
      const data = await response.json();
      if (data.success) {
        setTrades(data.data);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const fetchSentiment = async () => {
    try {
      setIsLoading(prev => ({ ...prev, sentiment: true }));
      addNotification('Refreshing sentiment analysis...', 'info');
      const response = await fetch('http://localhost:3001/api/sentiment');
      const data = await response.json();
      if (data.success) {
        setSentimentData(data.data.slice(0, 10));
        addNotification('Sentiment analysis updated', 'success');
      } else {
        addNotification('Failed to fetch sentiment data', 'error');
      }
    } catch (error) {
      console.error('Error fetching sentiment:', error);
      addNotification('Error fetching sentiment data', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, sentiment: false }));
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const executeTrade = async () => {
    try {
      setIsLoading(prev => ({ ...prev, trading: true }));
      addNotification('Executing trades based on sentiment analysis...', 'info');
      
      const response = await fetch('http://localhost:3001/api/trade/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        addNotification(`Successfully executed ${data.data.length} trades!`, 'success');
        fetchTrades();
        fetchPortfolio();
      } else {
        addNotification(data.error || 'Failed to execute trades', 'error');
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      addNotification('Error executing trades', 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, trading: false }));
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ModernDashboard 
            portfolio={portfolio} 
            sentimentData={sentimentData}
            onExecuteTrade={executeTrade}
            onRefreshSentiment={fetchSentiment}
            isLoading={isLoading}
          />
        );
      case 'trades':
        return <TradeFeed trades={trades} />;
      case 'sentiment':
        return <SentimentChart sentimentData={sentimentData} />;
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={updateSettings} />;
      default:
        return null;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Sentiment Swing Trader</h1>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                      <span className="text-slate-600">{getConnectionStatusText()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <nav className="flex items-center space-x-1">
                <button 
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'dashboard' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Dashboard
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'trades' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setActiveTab('trades')}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Trades
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'sentiment' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setActiveTab('sentiment')}
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Sentiment
                </button>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'settings' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <SettingsIcon className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoading.sentiment && (
                <div className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Refreshing sentiment analysis...</span>
                </div>
              )}
              
              {connectionStatus === 'error' && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-800">Connection error - retrying...</span>
                </div>
              )}
              
              {connectionStatus === 'connected' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Live Trading</span>
                  <span className="text-xs text-slate-500">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </div>
      
      <NotificationContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  );
}

export default App;