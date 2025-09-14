// Mock energy model for development
// In production, this would connect to Supabase/PostgreSQL

class EnergyModel {
  constructor() {
    this.energyData = new Map();
    this.batteryData = new Map();
    this.carbonCredits = new Map();
    this.initializeMockData();
  }

  initializeMockData() {
    // Initialize mock energy data for demo users
    const addresses = [
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      '0x8ba1f109551bD432803012645Hac136c',
      '0x1234567890123456789012345678901234567890'
    ];

    addresses.forEach(address => {
      const lowerAddress = address.toLowerCase();
      this.energyData.set(lowerAddress, this.generateMockEnergyData());
      this.batteryData.set(lowerAddress, this.generateMockBatteryData());
      this.carbonCredits.set(lowerAddress, this.generateMockCarbonCredits());
    });
  }

  generateMockEnergyData() {
    const data = [];
    const now = new Date();
    
    // Generate 24 hours of data
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      
      // Simulate realistic energy patterns
      let generation = 0;
      let consumption = 0;
      
      if (hour >= 6 && hour <= 18) {
        // Daytime - solar generation
        generation = 2 + Math.random() * 3; // 2-5 kWh
      }
      
      if (hour >= 6 && hour <= 9) {
        // Morning consumption
        consumption = 1.5 + Math.random() * 1;
      } else if (hour >= 18 && hour <= 22) {
        // Evening consumption
        consumption = 2 + Math.random() * 1.5;
      } else {
        // Night/low consumption
        consumption = 0.5 + Math.random() * 0.5;
      }
      
      data.push({
        timestamp: time.toISOString(),
        generation: parseFloat(generation.toFixed(2)),
        consumption: parseFloat(consumption.toFixed(2)),
        net: parseFloat((generation - consumption).toFixed(2))
      });
    }
    
    return data;
  }

  generateMockBatteryData() {
    return {
      capacity: 100, // kWh
      currentLevel: 75, // percentage
      currentEnergy: parseFloat((75 + Math.random() * 2 - 1).toFixed(2)), // kWh with 2 decimal places
      chargingRate: 5, // kW
      dischargingRate: 3, // kW
      efficiency: 0.95,
      lastUpdated: new Date().toISOString()
    };
  }

  generateMockCarbonCredits() {
    return {
      totalCredits: Math.floor(Math.random() * 200) + 50,
      creditsThisMonth: Math.floor(Math.random() * 20) + 5,
      renewablePercentage: 75 + Math.random() * 20,
      co2Saved: Math.floor(Math.random() * 1000) + 500, // kg CO2
      lastUpdated: new Date().toISOString()
    };
  }

  async getEnergyGeneration(address, period = '24h') {
    const data = this.energyData.get(address.toLowerCase());
    if (!data) return [];

    // Filter data based on period
    const now = new Date();
    let cutoffTime;
    
    switch (period) {
      case '1h':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return data.filter(entry => new Date(entry.timestamp) >= cutoffTime);
  }

  async getEnergyConsumption(address, period = '24h') {
    const data = this.energyData.get(address.toLowerCase());
    if (!data) return [];

    // Filter data based on period (same logic as generation)
    const now = new Date();
    let cutoffTime;
    
    switch (period) {
      case '1h':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return data.filter(entry => new Date(entry.timestamp) >= cutoffTime);
  }

  async generateSimulationData(address, duration = 24) {
    const simulationData = [];
    const now = new Date();
    
    for (let i = 0; i < duration; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = time.getHours();
      
      let generation = 0;
      let consumption = 0;
      
      if (hour >= 6 && hour <= 18) {
        generation = 2 + Math.random() * 3;
      }
      
      if (hour >= 6 && hour <= 9 || hour >= 18 && hour <= 22) {
        consumption = 1.5 + Math.random() * 1.5;
      } else {
        consumption = 0.5 + Math.random() * 0.5;
      }
      
      simulationData.push({
        timestamp: time.toISOString(),
        generation: parseFloat(generation.toFixed(2)),
        consumption: parseFloat(consumption.toFixed(2)),
        net: parseFloat((generation - consumption).toFixed(2))
      });
    }
    
    return simulationData;
  }

  async getBatteryStatus(address) {
    const batteryData = this.batteryData.get(address.toLowerCase());
    if (!batteryData) {
      return this.generateMockBatteryData();
    }
    
    // Simulate real-time updates
    const updatedData = { ...batteryData };
    updatedData.currentLevel = Math.max(0, Math.min(100, 
      batteryData.currentLevel + (Math.random() - 0.5) * 2
    ));
    updatedData.currentEnergy = (updatedData.currentLevel / 100) * updatedData.capacity;
    updatedData.lastUpdated = new Date().toISOString();
    
    return updatedData;
  }

  async getCarbonCredits(address) {
    const credits = this.carbonCredits.get(address.toLowerCase());
    if (!credits) {
      return this.generateMockCarbonCredits();
    }
    
    return credits;
  }

  async updateEnergyData(address, generation, consumption) {
    const data = this.energyData.get(address.toLowerCase()) || [];
    const now = new Date();
    
    data.push({
      timestamp: now.toISOString(),
      generation: parseFloat(generation.toFixed(2)),
      consumption: parseFloat(consumption.toFixed(2)),
      net: parseFloat((generation - consumption).toFixed(2))
    });
    
    // Keep only last 30 days of data
    const cutoffTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const filteredData = data.filter(entry => new Date(entry.timestamp) >= cutoffTime);
    
    this.energyData.set(address.toLowerCase(), filteredData);
    return filteredData;
  }
}

module.exports = new EnergyModel();