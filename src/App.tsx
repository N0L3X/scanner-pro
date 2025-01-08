import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NetworkScanner from './pages/NetworkScanner';
import Auth from './components/Auth';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/" element={<NetworkScanner />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;