import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import IndexPage from './pages/index/index';
import AccountPage from './pages/记账/记账';
import AccountDetailPage from './pages/记账详情/记账详情';
import ItemPage from './pages/记物/记物';
import ItemDetailPage from './pages/记物详情/记物详情';
import StatPage from './pages/统计/统计';
import SettingsPage from './pages/设置/设置';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/记账" element={<AccountPage />} />
            <Route path="/记账详情" element={<AccountDetailPage />} />
            <Route path="/记物" element={<ItemPage />} />
            <Route path="/记物详情" element={<ItemDetailPage />} />
            <Route path="/统计" element={<StatPage />} />
            <Route path="/设置" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;