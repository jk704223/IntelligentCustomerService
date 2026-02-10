import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  activeTab: string;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab }) => {
  return (
    <nav className="navigation">
      <Link to="/" className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}>
        <div className="nav-icon home-icon"></div>
        <span>首页</span>
      </Link>
      <Link to="/记账" className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}>
        <div className="nav-icon account-icon"></div>
        <span>记账</span>
      </Link>
      <Link to="/记物" className={`nav-item ${activeTab === 'item' ? 'active' : ''}`}>
        <div className="nav-icon item-icon"></div>
        <span>记物</span>
      </Link>
      <Link to="/统计" className={`nav-item ${activeTab === 'stat' ? 'active' : ''}`}>
        <div className="nav-icon stat-icon"></div>
        <span>统计</span>
      </Link>
      <Link to="/设置" className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
        <div className="nav-icon settings-icon"></div>
        <span>设置</span>
      </Link>
    </nav>
  );
};

export default Navigation;