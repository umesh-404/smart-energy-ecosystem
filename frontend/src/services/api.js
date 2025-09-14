// API service for connecting frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(token) {
    return this.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async verifyToken(token) {
    return this.request('/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async updateProfile(updateData, token) {
    return this.request('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData),
    });
  }

  async changePassword(passwordData, token) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData),
    });
  }

  // User endpoints
  async getUserProfile(address) {
    return this.request(`/users/profile/${address}`);
  }

  async createUserProfile(userData) {
    return this.request('/users/profile', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserProfile(address, updateData) {
    return this.request(`/users/profile/${address}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async getUserStats(address) {
    return this.request(`/users/stats/${address}`);
  }

  // Energy endpoints
  async getEnergyGeneration(address, period = '24h') {
    return this.request(`/energy/generation/${address}?period=${period}`);
  }

  async getEnergyConsumption(address, period = '24h') {
    return this.request(`/energy/consumption/${address}?period=${period}`);
  }

  async simulateEnergyData(address, duration = 24) {
    return this.request('/energy/simulate', {
      method: 'POST',
      body: JSON.stringify({ address, duration }),
    });
  }

  async getBatteryStatus(address) {
    return this.request(`/energy/battery/${address}`);
  }

  async getCarbonCredits(address) {
    return this.request(`/energy/carbon-credits/${address}`);
  }

  // Token endpoints
  async getTokenBalance(address) {
    return this.request(`/tokens/balance/${address}`);
  }

  async getTradeOffers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/tokens/offers?${queryParams}`);
  }

  async createTradeOffer(offerData) {
    return this.request('/tokens/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  async buyTokens(buyData) {
    return this.request('/tokens/buy', {
      method: 'POST',
      body: JSON.stringify(buyData),
    });
  }

  async getTransactionHistory(address, limit = 50, offset = 0) {
    return this.request(`/tokens/transactions/${address}?limit=${limit}&offset=${offset}`);
  }

  async getMarketplaceStats() {
    return this.request('/tokens/marketplace/stats');
  }

  async getPendingCompensations(address) {
    return this.request(`/tokens/compensations/${address}`);
  }

  async claimCompensation(claimData) {
    return this.request('/tokens/compensations/claim', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  }

  // AI endpoints
  async getTradeSuggestions(address) {
    return this.request(`/ai/suggestions/${address}`);
  }

  async getDynamicPricing(period = '24h') {
    return this.request(`/ai/pricing?period=${period}`);
  }

  async predictEnergyDemand(location, timeframe = '24h') {
    return this.request('/ai/predict', {
      method: 'POST',
      body: JSON.stringify({ location, timeframe }),
    });
  }

  async getInvestmentRecommendations(address) {
    return this.request(`/ai/recommendations/${address}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;