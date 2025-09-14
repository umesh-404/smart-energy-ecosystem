// Mock user model for development
// In production, this would connect to Supabase/PostgreSQL

class UserModel {
  constructor() {
    this.users = new Map();
    this.initializeMockData();
  }

  initializeMockData() {
    // Add some mock users with authentication data
    this.users.set('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', {
      id: 1,
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      name: 'Solar Farm Alpha',
      email: 'contact@solarfarmalpha.com',
      password: '$2b$12$5TX8esRSdTGLc3tRWyygsej3Y5CB4BRn/4v7/MNFpBOrITGj6.CFC', // 'password123'
      location: 'Mumbai, India',
      userType: 'producer',
      createdAt: new Date('2024-01-01'),
      isActive: true,
      lastLogin: null,
      stats: {
        totalEnergyGenerated: 15420.5,
        totalEnergyConsumed: 3200.2,
        totalTokensEarned: 12220.3,
        totalCarbonCredits: 89
      }
    });

    this.users.set('0x8ba1f109551bD432803012645Hac136c', {
      id: 2,
      address: '0x8ba1f109551bD432803012645Hac136c',
      name: 'Wind Energy Co.',
      email: 'info@windenergy.com',
      password: '$2b$12$5TX8esRSdTGLc3tRWyygsej3Y5CB4BRn/4v7/MNFpBOrITGj6.CFC', // 'password123'
      location: 'Delhi, India',
      userType: 'producer',
      createdAt: new Date('2024-02-15'),
      isActive: true,
      lastLogin: null,
      stats: {
        totalEnergyGenerated: 22300.8,
        totalEnergyConsumed: 4500.1,
        totalTokensEarned: 17800.7,
        totalCarbonCredits: 156
      }
    });

    this.users.set('0x1234567890123456789012345678901234567890', {
      id: 3,
      address: '0x1234567890123456789012345678901234567890',
      name: 'Green Power Ltd.',
      email: 'hello@greenpower.com',
      password: '$2b$12$5TX8esRSdTGLc3tRWyygsej3Y5CB4BRn/4v7/MNFpBOrITGj6.CFC', // 'password123'
      location: 'Bangalore, India',
      userType: 'both',
      createdAt: new Date('2024-03-10'),
      isActive: true,
      lastLogin: null,
      stats: {
        totalEnergyGenerated: 8750.3,
        totalEnergyConsumed: 12000.5,
        totalTokensEarned: 750.8,
        totalCarbonCredits: 45
      }
    });
  }

  async getUserByAddress(address) {
    // Try both original and lowercase versions
    return this.users.get(address) || this.users.get(address.toLowerCase()) || null;
  }

  async getUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email && user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async getUserById(id) {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  async createUser(userData) {
    const userId = Math.max(...Array.from(this.users.values()).map(u => u.id || 0)) + 1;
    const user = {
      id: userId,
      ...userData,
      address: userData.address ? userData.address.toLowerCase() : null,
      createdAt: new Date(),
      isActive: true,
      lastLogin: null,
      stats: {
        totalEnergyGenerated: 0,
        totalEnergyConsumed: 0,
        totalTokensEarned: 0,
        totalCarbonCredits: 0
      }
    };

    if (user.address) {
      this.users.set(user.address, user);
    } else {
      // For users without wallet address, use email as key
      this.users.set(user.email.toLowerCase(), user);
    }
    return user;
  }

  async updateUser(identifier, updateData) {
    let user = null;
    
    // Handle both address and ID updates
    if (typeof identifier === 'string') {
      user = this.users.get(identifier) || this.users.get(identifier.toLowerCase());
    } else if (typeof identifier === 'number') {
      user = await this.getUserById(identifier);
    }
    
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };

    // Update in the map
    if (updatedUser.address) {
      this.users.set(updatedUser.address, updatedUser);
    } else if (updatedUser.email) {
      this.users.set(updatedUser.email.toLowerCase(), updatedUser);
    }
    
    return updatedUser;
  }

  async getUserStats(address) {
    const user = this.users.get(address) || this.users.get(address.toLowerCase());
    if (!user) return null;

    return {
      address: user.address,
      name: user.name,
      userType: user.userType,
      location: user.location,
      stats: user.stats,
      memberSince: user.createdAt,
      isActive: user.isActive
    };
  }

  async getAllUsers() {
    return Array.from(this.users.values());
  }

  async getUsersByType(userType) {
    return Array.from(this.users.values()).filter(user => user.userType === userType);
  }

  async deleteUser(address) {
    return this.users.delete(address.toLowerCase());
  }
}

module.exports = new UserModel();