class AIService {
  constructor() {
    this.pricingHistory = [];
    this.demandPatterns = {};
    this.initializeMockData();
  }

  initializeMockData() {
    // Initialize with some mock pricing data
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      this.pricingHistory.push({
        timestamp: time.toISOString(),
        price: 0.045 + Math.random() * 0.01, // Price between 0.045-0.055 ETH
        demand: Math.random() * 100,
        supply: Math.random() * 100
      });
    }
  }

  // Get trade suggestions for a user
  async getTradeSuggestions(userAddress) {
    try {
      // Mock AI analysis based on current market conditions
      const currentPrice = this.pricingHistory[this.pricingHistory.length - 1].price;
      const avgPrice = this.pricingHistory.reduce((sum, data) => sum + data.price, 0) / this.pricingHistory.length;
      
      const suggestions = {
        recommendedAction: currentPrice > avgPrice ? 'sell' : 'buy',
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        reasoning: [
          'Current market price is ' + (currentPrice > avgPrice ? 'above' : 'below') + ' average',
          'Energy demand is ' + (Math.random() > 0.5 ? 'increasing' : 'decreasing'),
          'Weather forecast suggests ' + (Math.random() > 0.5 ? 'high' : 'low') + ' renewable generation'
        ],
        pricePrediction: {
          nextHour: currentPrice * (0.98 + Math.random() * 0.04),
          nextDay: currentPrice * (0.95 + Math.random() * 0.1),
          nextWeek: currentPrice * (0.9 + Math.random() * 0.2)
        },
        optimalAmount: Math.floor(Math.random() * 100) + 50, // 50-150 tokens
        riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
      };

      return suggestions;
    } catch (error) {
      console.error('Error getting trade suggestions:', error);
      throw error;
    }
  }

  // Get dynamic pricing data
  async getDynamicPricing(period = '24h') {
    try {
      const now = new Date();
      let dataPoints = 24; // Default to 24 hours
      
      if (period === '7d') {
        dataPoints = 168; // 7 days * 24 hours
      } else if (period === '30d') {
        dataPoints = 720; // 30 days * 24 hours
      }

      const pricingData = [];
      for (let i = dataPoints - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const basePrice = 0.045;
        const variation = Math.sin(i * 0.1) * 0.005 + Math.random() * 0.01;
        
        pricingData.push({
          timestamp: time.toISOString(),
          price: basePrice + variation,
          demand: 50 + Math.sin(i * 0.2) * 20 + Math.random() * 10,
          supply: 50 + Math.cos(i * 0.15) * 15 + Math.random() * 8,
          renewablePercentage: 60 + Math.random() * 30
        });
      }

      return {
        period,
        data: pricingData,
        currentPrice: pricingData[pricingData.length - 1].price,
        priceChange: pricingData.length > 1 ? 
          pricingData[pricingData.length - 1].price - pricingData[0].price : 0,
        volatility: this.calculateVolatility(pricingData)
      };
    } catch (error) {
      console.error('Error getting dynamic pricing:', error);
      throw error;
    }
  }

  // Predict energy demand for a location
  async predictEnergyDemand(location, timeframe = '24h') {
    try {
      const predictions = [];
      const hours = timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 720;
      
      for (let i = 0; i < hours; i++) {
        const time = new Date(Date.now() + i * 60 * 60 * 1000);
        const hour = time.getHours();
        
        // Simulate demand patterns based on time of day
        let baseDemand = 50;
        if (hour >= 6 && hour <= 9) baseDemand = 80; // Morning peak
        else if (hour >= 18 && hour <= 22) baseDemand = 90; // Evening peak
        else if (hour >= 23 || hour <= 5) baseDemand = 30; // Night low
        
        // Add some randomness and location-specific factors
        const locationFactor = location.toLowerCase().includes('mumbai') ? 1.2 : 1.0;
        const demand = baseDemand * locationFactor + Math.random() * 20 - 10;
        
        predictions.push({
          timestamp: time.toISOString(),
          predictedDemand: Math.max(0, demand),
          confidence: 0.7 + Math.random() * 0.2
        });
      }

      return {
        location,
        timeframe,
        predictions,
        averageDemand: predictions.reduce((sum, p) => sum + p.predictedDemand, 0) / predictions.length,
        peakDemand: Math.max(...predictions.map(p => p.predictedDemand))
      };
    } catch (error) {
      console.error('Error predicting energy demand:', error);
      throw error;
    }
  }

  // Get investment recommendations
  async getInvestmentRecommendations(userAddress) {
    try {
      const recommendations = [
        {
          type: 'microgrid',
          name: 'Solar Microgrid - Rural Maharashtra',
          location: 'Maharashtra, India',
          requiredTokens: 10000,
          currentProgress: 65,
          expectedROI: 12.5,
          riskLevel: 'medium',
          description: 'Community solar project with strong local support',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'wind',
          name: 'Wind Farm Expansion - Gujarat',
          location: 'Gujarat, India',
          requiredTokens: 25000,
          currentProgress: 40,
          expectedROI: 15.2,
          riskLevel: 'low',
          description: 'Proven wind energy site with existing infrastructure',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'hydro',
          name: 'Small Hydro Project - Himachal Pradesh',
          location: 'Himachal Pradesh, India',
          requiredTokens: 15000,
          currentProgress: 25,
          expectedROI: 18.7,
          riskLevel: 'high',
          description: 'High potential but requires environmental approvals',
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return {
        userAddress,
        recommendations,
        totalRecommendations: recommendations.length,
        averageROI: recommendations.reduce((sum, r) => sum + r.expectedROI, 0) / recommendations.length,
        riskAssessment: 'Based on your portfolio, we recommend a balanced approach with 60% low-risk, 30% medium-risk, and 10% high-risk investments.'
      };
    } catch (error) {
      console.error('Error getting investment recommendations:', error);
      throw error;
    }
  }

  // Calculate price volatility
  calculateVolatility(pricingData) {
    if (pricingData.length < 2) return 0;
    
    const prices = pricingData.map(d => d.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    
    return Math.sqrt(variance);
  }
}

module.exports = new AIService();