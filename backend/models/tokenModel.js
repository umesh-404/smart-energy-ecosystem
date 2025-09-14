// Mock token model for development
// In production, this would connect to Supabase/PostgreSQL

class TokenModel {
  constructor() {
    this.tradeOffers = [];
    this.transactions = [];
    this.compensations = [];
    this.initializeMockData();
  }

  initializeMockData() {
    // Initialize mock trade offers
    this.tradeOffers = [
      {
        id: 1,
        seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        sellerName: 'Solar Farm Alpha',
        amount: 100,
        pricePerToken: 0.05,
        totalPrice: 5.0,
        location: 'Mumbai, India',
        timestamp: new Date('2025-01-13T10:30:00Z'),
        isActive: true
      },
      {
        id: 2,
        seller: '0x8ba1f109551bD432803012645Hac136c',
        sellerName: 'Wind Energy Co.',
        amount: 250,
        pricePerToken: 0.048,
        totalPrice: 12.0,
        location: 'Delhi, India',
        timestamp: new Date('2025-01-13T09:15:00Z'),
        isActive: true
      },
      {
        id: 3,
        seller: '0x1234567890123456789012345678901234567890',
        sellerName: 'Hydro Power Ltd.',
        amount: 75,
        pricePerToken: 0.052,
        totalPrice: 3.9,
        location: 'Bangalore, India',
        timestamp: new Date('2025-01-13T08:45:00Z'),
        isActive: true
      }
    ];

    // Initialize mock transactions
    this.transactions = [
      {
        id: 1,
        buyer: '0xabcdef1234567890abcdef1234567890abcdef12',
        seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        amount: 50,
        price: 2.5,
        timestamp: new Date('2025-01-12T14:30:00Z'),
        status: 'completed',
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
      },
      {
        id: 2,
        buyer: '0x9876543210987654321098765432109876543210',
        seller: '0x8ba1f109551bD432803012645Hac136c',
        amount: 100,
        price: 4.8,
        timestamp: new Date('2025-01-12T11:15:00Z'),
        status: 'completed',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      }
    ];

    // Initialize mock compensations
    this.compensations = [
      {
        id: 1,
        user: '0xabcdef1234567890abcdef1234567890abcdef12',
        outageId: 1,
        amount: 10,
        claimed: false,
        timestamp: new Date('2025-01-10T16:00:00Z')
      },
      {
        id: 2,
        user: '0x9876543210987654321098765432109876543210',
        outageId: 1,
        amount: 10,
        claimed: true,
        timestamp: new Date('2025-01-10T16:00:00Z')
      }
    ];
  }

  async getTradeOffers(filters = {}) {
    let offers = [...this.tradeOffers];

    // Apply filters
    if (filters.location) {
      offers = offers.filter(offer => 
        offer.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      offers = offers.filter(offer => offer.pricePerToken >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      offers = offers.filter(offer => offer.pricePerToken <= parseFloat(filters.maxPrice));
    }

    // Sort offers
    if (filters.sortBy === 'price') {
      offers.sort((a, b) => a.pricePerToken - b.pricePerToken);
    } else if (filters.sortBy === 'amount') {
      offers.sort((a, b) => b.amount - a.amount);
    } else {
      offers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return offers;
  }

  async createTradeOffer(offerData) {
    const newOffer = {
      id: this.tradeOffers.length + 1,
      ...offerData,
      timestamp: new Date(),
      isActive: true
    };

    this.tradeOffers.push(newOffer);
    return newOffer;
  }

  async getTransactionHistory(address, limit = 50, offset = 0) {
    const userTransactions = this.transactions.filter(tx => 
      tx.buyer.toLowerCase() === address.toLowerCase() || 
      tx.seller.toLowerCase() === address.toLowerCase()
    );

    return userTransactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(offset, offset + limit);
  }

  async getMarketplaceStats() {
    const activeOffers = this.tradeOffers.filter(offer => offer.isActive);
    const completedTransactions = this.transactions.filter(tx => tx.status === 'completed');
    const totalVolume = completedTransactions.reduce((sum, tx) => sum + tx.price, 0);

    return {
      totalOffers: activeOffers.length,
      totalTrades: completedTransactions.length,
      totalVolume: totalVolume,
      averagePrice: activeOffers.length > 0 ? 
        activeOffers.reduce((sum, offer) => sum + offer.pricePerToken, 0) / activeOffers.length : 0
    };
  }

  async getPendingCompensations(address) {
    return this.compensations.filter(comp => 
      comp.user.toLowerCase() === address.toLowerCase() && !comp.claimed
    );
  }

  async claimCompensation(address, outageId) {
    const compensation = this.compensations.find(comp => 
      comp.user.toLowerCase() === address.toLowerCase() && 
      comp.outageId === outageId && 
      !comp.claimed
    );

    if (compensation) {
      compensation.claimed = true;
      compensation.claimedAt = new Date();
      return compensation;
    }

    return null;
  }

  async addTransaction(transactionData) {
    const newTransaction = {
      id: this.transactions.length + 1,
      ...transactionData,
      timestamp: new Date(),
      status: 'pending'
    };

    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async updateTransactionStatus(txId, status, txHash = null) {
    const transaction = this.transactions.find(tx => tx.id === txId);
    if (transaction) {
      transaction.status = status;
      if (txHash) {
        transaction.txHash = txHash;
      }
      return transaction;
    }
    return null;
  }

  async addCompensation(compensationData) {
    const newCompensation = {
      id: this.compensations.length + 1,
      ...compensationData,
      timestamp: new Date(),
      claimed: false
    };

    this.compensations.push(newCompensation);
    return newCompensation;
  }

  async getCompensationStats() {
    const totalCompensations = this.compensations.length;
    const claimedCompensations = this.compensations.filter(comp => comp.claimed).length;
    const pendingCompensations = totalCompensations - claimedCompensations;
    const totalAmount = this.compensations.reduce((sum, comp) => sum + comp.amount, 0);

    return {
      totalCompensations,
      claimedCompensations,
      pendingCompensations,
      totalAmount
    };
  }
}

module.exports = new TokenModel();