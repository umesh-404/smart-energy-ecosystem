import React, { createContext, useContext, useState } from 'react';
import ToastContainer from '../components/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title, message = null) => {
    addToast({
      type: 'success',
      title,
      message,
    });
  };

  const showError = (title, message = null) => {
    addToast({
      type: 'error',
      title,
      message,
      duration: 7000, // Longer duration for errors
    });
  };

  const showWarning = (title, message = null) => {
    addToast({
      type: 'warning',
      title,
      message,
    });
  };

  const showInfo = (title, message = null) => {
    addToast({
      type: 'info',
      title,
      message,
    });
  };

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};