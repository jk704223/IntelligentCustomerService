import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          } 
        />
        <Route 
          path="/记账管理" 
          element={
            <AdminLayout>
              <div>
                <h1>记账管理</h1>
                <p>记账管理页面正在开发中...</p>
              </div>
            </AdminLayout>
          } 
        />
        <Route 
          path="/记物管理" 
          element={
            <AdminLayout>
              <div>
                <h1>记物管理</h1>
                <p>记物管理页面正在开发中...</p>
              </div>
            </AdminLayout>
          } 
        />
        <Route 
          path="/报表分析" 
          element={
            <AdminLayout>
              <div>
                <h1>报表分析</h1>
                <p>报表分析页面正在开发中...</p>
              </div>
            </AdminLayout>
          } 
        />
        <Route 
          path="/系统设置" 
          element={
            <AdminLayout>
              <div>
                <h1>系统设置</h1>
                <p>系统设置页面正在开发中...</p>
              </div>
            </AdminLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App
