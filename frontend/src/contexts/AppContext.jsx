import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

// Initial state
const initialState = {
  user: {
    address: null,
    profile: null,
    stats: null,
    isConnected: false,
  },
  energy: {
    generation: [],
    consumption: [],
    battery: null,
    carbonCredits: null,
  },
  tokens: {
    balance: 0,
    offers: [],
    transactions: [],
    compensations: [],
  },
  ai: {
    suggestions: null,
    pricing: null,
    recommendations: null,
  },
  loading: {
    user: false,
    energy: false,
    tokens: false,
    ai: false,
  },
  error: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_USER_STATS: 'SET_USER_STATS',
  SET_ENERGY_DATA: 'SET_ENERGY_DATA',
  SET_BATTERY_STATUS: 'SET_BATTERY_STATUS',
  SET_CARBON_CREDITS: 'SET_CARBON_CREDITS',
  SET_TOKEN_BALANCE: 'SET_TOKEN_BALANCE',
  SET_TRADE_OFFERS: 'SET_TRADE_OFFERS',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_COMPENSATIONS: 'SET_COMPENSATIONS',
  SET_AI_SUGGESTIONS: 'SET_AI_SUGGESTIONS',
  SET_AI_PRICING: 'SET_AI_PRICING',
  SET_AI_RECOMMENDATIONS: 'SET_AI_RECOMMENDATIONS',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading,
        },
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: {
          ...state.user,
          address: action.payload.address,
          isConnected: !!action.payload.address,
        },
      };

    case ActionTypes.SET_USER_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.payload,
        },
      };

    case ActionTypes.SET_USER_STATS:
      return {
        ...state,
        user: {
          ...state.user,
          stats: action.payload,
        },
      };

    case ActionTypes.SET_ENERGY_DATA:
      return {
        ...state,
        energy: {
          ...state.energy,
          generation: action.payload.generation || state.energy.generation,
          consumption: action.payload.consumption || state.energy.consumption,
        },
      };

    case ActionTypes.SET_BATTERY_STATUS:
      return {
        ...state,
        energy: {
          ...state.energy,
          battery: action.payload,
        },
      };

    case ActionTypes.SET_CARBON_CREDITS:
      return {
        ...state,
        energy: {
          ...state.energy,
          carbonCredits: action.payload,
        },
      };

    case ActionTypes.SET_TOKEN_BALANCE:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          balance: action.payload,
        },
      };

    case ActionTypes.SET_TRADE_OFFERS:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          offers: action.payload,
        },
      };

    case ActionTypes.SET_TRANSACTIONS:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          transactions: action.payload,
        },
      };

    case ActionTypes.SET_COMPENSATIONS:
      return {
        ...state,
        tokens: {
          ...state.tokens,
          compensations: action.payload,
        },
      };

    case ActionTypes.SET_AI_SUGGESTIONS:
      return {
        ...state,
        ai: {
          ...state.ai,
          suggestions: action.payload,
        },
      };

    case ActionTypes.SET_AI_PRICING:
      return {
        ...state,
        ai: {
          ...state.ai,
          pricing: action.payload,
        },
      };

    case ActionTypes.SET_AI_RECOMMENDATIONS:
      return {
        ...state,
        ai: {
          ...state.ai,
          recommendations: action.payload,
        },
      };

    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setLoading: (type, loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { type, loading } });
    },

    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },

    setUser: (address) => {
      dispatch({ type: ActionTypes.SET_USER, payload: { address } });
    },

    // API actions
    loadUserProfile: async (address) => {
      try {
        actions.setLoading('user', true);
        const response = await apiService.getUserProfile(address);
        dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('user', false);
      }
    },

    loadUserStats: async (address) => {
      try {
        actions.setLoading('user', true);
        const response = await apiService.getUserStats(address);
        dispatch({ type: ActionTypes.SET_USER_STATS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('user', false);
      }
    },

    loadEnergyData: async (address, period = '24h') => {
      try {
        actions.setLoading('energy', true);
        const [generation, consumption] = await Promise.all([
          apiService.getEnergyGeneration(address, period),
          apiService.getEnergyConsumption(address, period),
        ]);
        
        dispatch({
          type: ActionTypes.SET_ENERGY_DATA,
          payload: {
            generation: generation.data,
            consumption: consumption.data,
          },
        });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('energy', false);
      }
    },

    loadBatteryStatus: async (address) => {
      try {
        actions.setLoading('energy', true);
        const response = await apiService.getBatteryStatus(address);
        dispatch({ type: ActionTypes.SET_BATTERY_STATUS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('energy', false);
      }
    },

    loadCarbonCredits: async (address) => {
      try {
        actions.setLoading('energy', true);
        const response = await apiService.getCarbonCredits(address);
        dispatch({ type: ActionTypes.SET_CARBON_CREDITS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('energy', false);
      }
    },

    loadTokenBalance: async (address) => {
      try {
        actions.setLoading('tokens', true);
        // Use fallback address if none provided
        const walletAddress = address || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
        const response = await apiService.getTokenBalance(walletAddress);
        dispatch({ type: ActionTypes.SET_TOKEN_BALANCE, payload: response.data.balanceFormatted });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('tokens', false);
      }
    },

    loadTradeOffers: async (filters = {}) => {
      try {
        actions.setLoading('tokens', true);
        const response = await apiService.getTradeOffers(filters);
        dispatch({ type: ActionTypes.SET_TRADE_OFFERS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('tokens', false);
      }
    },

    loadTransactions: async (address, limit = 50, offset = 0) => {
      try {
        actions.setLoading('tokens', true);
        const response = await apiService.getTransactionHistory(address, limit, offset);
        dispatch({ type: ActionTypes.SET_TRANSACTIONS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('tokens', false);
      }
    },

    loadCompensations: async (address) => {
      try {
        actions.setLoading('tokens', true);
        const response = await apiService.getPendingCompensations(address);
        dispatch({ type: ActionTypes.SET_COMPENSATIONS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('tokens', false);
      }
    },

    loadAISuggestions: async (address) => {
      try {
        actions.setLoading('ai', true);
        const response = await apiService.getTradeSuggestions(address);
        dispatch({ type: ActionTypes.SET_AI_SUGGESTIONS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('ai', false);
      }
    },

    loadAIPricing: async (period = '24h') => {
      try {
        actions.setLoading('ai', true);
        const response = await apiService.getDynamicPricing(period);
        dispatch({ type: ActionTypes.SET_AI_PRICING, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('ai', false);
      }
    },

    loadAIRecommendations: async (address) => {
      try {
        actions.setLoading('ai', true);
        const response = await apiService.getInvestmentRecommendations(address);
        dispatch({ type: ActionTypes.SET_AI_RECOMMENDATIONS, payload: response.data });
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading('ai', false);
      }
    },

    // Initialize user data
    initializeUser: async (address) => {
      // Use fallback address if none provided
      const walletAddress = address || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      actions.setUser(walletAddress);
      await Promise.all([
        actions.loadUserProfile(walletAddress),
        actions.loadUserStats(walletAddress),
        actions.loadEnergyData(walletAddress),
        actions.loadBatteryStatus(walletAddress),
        actions.loadCarbonCredits(walletAddress),
        actions.loadTokenBalance(walletAddress),
        actions.loadTradeOffers(),
        actions.loadTransactions(walletAddress),
        actions.loadCompensations(walletAddress),
        actions.loadAISuggestions(walletAddress),
        actions.loadAIPricing(),
        actions.loadAIRecommendations(walletAddress),
      ]);
    },

    // Buy tokens
    buyTokens: async (buyData) => {
      try {
        actions.setLoading('tokens', true);
        // Ensure buyer address is set and use correct field name
        const buyerAddress = buyData.buyerAddress || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
        const buyDataForAPI = {
          buyer: buyerAddress,
          offerId: buyData.offerId,
          amount: buyData.amount
        };
        const response = await apiService.buyTokens(buyDataForAPI);
        // Refresh token balance and trade offers after purchase
        await Promise.all([
          actions.loadTokenBalance(buyerAddress),
          actions.loadTradeOffers(),
        ]);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading('tokens', false);
      }
    },

    // Simulate energy data
    simulateEnergyData: async (address, duration = 24) => {
      try {
        actions.setLoading('energy', true);
        const response = await apiService.simulateEnergyData(address, duration);
        // Refresh energy data after simulation
        await Promise.all([
          actions.loadEnergyData(address),
          actions.loadBatteryStatus(address),
          actions.loadCarbonCredits(address),
        ]);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading('energy', false);
      }
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;