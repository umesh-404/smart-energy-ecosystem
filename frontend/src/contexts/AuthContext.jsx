import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
    case ActionTypes.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case ActionTypes.LOGIN_FAILURE:
    case ActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }, []);

  // Verify token with backend
  const verifyToken = async (token) => {
    try {
      const response = await apiService.verifyToken(token);
      if (response.success) {
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: {
            user: response.data.user,
            token
          }
        });
      } else {
        localStorage.removeItem('authToken');
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: ActionTypes.LOGIN_START });
      
      const response = await apiService.login(email, password);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user, token }
        });
        
        return { success: true, user };
      } else {
        dispatch({
          type: ActionTypes.LOGIN_FAILURE,
          payload: response.error || 'Login failed'
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.REGISTER_START });
      
      const response = await apiService.register(userData);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        dispatch({
          type: ActionTypes.REGISTER_SUCCESS,
          payload: { user, token }
        });
        
        return { success: true, user };
      } else {
        dispatch({
          type: ActionTypes.REGISTER_FAILURE,
          payload: response.error || 'Registration failed'
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({
        type: ActionTypes.REGISTER_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (state.token) {
        await apiService.logout(state.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem('authToken');
      
      dispatch({ type: ActionTypes.LOGOUT });
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    try {
      const response = await apiService.updateProfile(updateData, state.token);
      
      if (response.success) {
        dispatch({
          type: ActionTypes.UPDATE_USER,
          payload: response.data
        });
        return { success: true, user: response.data };
      } else {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: response.error || 'Profile update failed'
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiService.changePassword(
        { currentPassword, newPassword },
        state.token
      );
      
      if (response.success) {
        return { success: true };
      } else {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: response.error || 'Password change failed'
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.message || 'Password change failed';
      dispatch({
        type: ActionTypes.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Set loading
  const setLoading = (loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  };

  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    setLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;