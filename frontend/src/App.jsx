import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Crowdfunding from './pages/Crowdfunding';
import OutageCompensation from './pages/OutageCompensation';
import Wallet from './pages/Wallet';
import DynamicPricing from './pages/DynamicPricing';
import AISuggestions from './pages/AISuggestions';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden">
                <Navbar />
                <main className="w-full">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/crowdfunding" element={<Crowdfunding />} />
                    <Route path="/compensation" element={<OutageCompensation />} />
                    <Route path="/pricing" element={<DynamicPricing />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/ai-suggestions" element={<AISuggestions />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
