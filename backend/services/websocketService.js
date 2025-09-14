// WebSocket service for real-time updates
const WebSocket = require('ws');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Set();
    this.updateInterval = null;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });
    
    this.wss.on('connection', (ws) => {
      console.log('🔌 New WebSocket connection established');
      this.clients.add(ws);
      
      ws.on('close', () => {
        console.log('🔌 WebSocket connection closed');
        this.clients.delete(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    // Start real-time updates
    this.startRealTimeUpdates();
  }

  startRealTimeUpdates() {
    // Send updates every 5 seconds
    this.updateInterval = setInterval(() => {
      this.broadcastRealTimeData();
    }, 5000);
  }

  broadcastRealTimeData() {
    if (this.clients.size === 0) return;

    const realTimeData = {
      type: 'realtime_update',
      timestamp: new Date().toISOString(),
      data: {
        energyGeneration: this.generateRandomEnergyData(),
        marketPrices: this.generateMarketPrices(),
        systemStats: this.generateSystemStats(),
        notifications: this.generateNotifications()
      }
    };

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(realTimeData));
      }
    });
  }

  generateRandomEnergyData() {
    return {
      solar: Math.floor(Math.random() * 100) + 50,
      wind: Math.floor(Math.random() * 80) + 30,
      hydro: Math.floor(Math.random() * 60) + 20,
      total: Math.floor(Math.random() * 200) + 100
    };
  }

  generateMarketPrices() {
    return {
      energyToken: (Math.random() * 0.02 + 0.03).toFixed(4),
      carbonCredits: (Math.random() * 10 + 5).toFixed(2),
      demand: Math.floor(Math.random() * 100) + 50
    };
  }

  generateSystemStats() {
    return {
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      totalTransactions: Math.floor(Math.random() * 10000) + 5000,
      networkHashRate: Math.floor(Math.random() * 1000000) + 500000
    };
  }

  generateNotifications() {
    const notifications = [
      "New energy trading opportunity detected!",
      "Carbon credit reward earned: +5 credits",
      "Market price alert: Energy tokens up 12%",
      "Outage compensation processed successfully",
      "New microgrid project funding milestone reached"
    ];
    
    return Math.random() > 0.7 ? notifications[Math.floor(Math.random() * notifications.length)] : null;
  }

  broadcast(type, data) {
    const message = {
      type,
      timestamp: new Date().toISOString(),
      data
    };

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.wss.close();
  }
}

module.exports = new WebSocketService();