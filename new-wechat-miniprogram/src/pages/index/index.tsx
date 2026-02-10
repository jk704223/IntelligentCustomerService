import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navigation from '../../components/Navigation';
import './index.css';

function IndexPage() {
  const { getRecentAccounts, getExpiringItems } = useApp();
  const [recentAccounts, setRecentAccounts] = useState<any[]>([]);
  const [expiringItems, setExpiringItems] = useState<any[]>([]);

  useEffect(() => {
    // 页面加载时获取数据
    console.log('小程序首页加载');
    updateData();
  }, [getRecentAccounts, getExpiringItems]);

  const updateData = () => {
    // 获取最近的记账记录
    const recent = getRecentAccounts(3);
    setRecentAccounts(recent);

    // 获取即将过期的物品
    const expiring = getExpiringItems(30);
    // 计算剩余天数
    const itemsWithDaysLeft = expiring.map(item => {
      const purchaseDate = new Date(item.purchaseDate);
      const expiryDate = new Date(purchaseDate);
      if (item.usageUnit === '天') {
        expiryDate.setDate(expiryDate.getDate() + item.usagePeriod);
      } else if (item.usageUnit === '周') {
        expiryDate.setDate(expiryDate.getDate() + item.usagePeriod * 7);
      } else if (item.usageUnit === '月') {
        expiryDate.setMonth(expiryDate.getMonth() + item.usagePeriod);
      } else if (item.usageUnit === '年') {
        expiryDate.setFullYear(expiryDate.getFullYear() + item.usagePeriod);
      }
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        ...item,
        daysLeft: diffDays,
        expiryDate: expiryDate.toISOString().split('T')[0]
      };
    });
    setExpiringItems(itemsWithDaysLeft);
  };

  return (
    <div className="index-page">
      <div className="header">
        <h1>简易记账</h1>
      </div>

      <div className="quick-actions">
        <Link to="/记账" className="action-card">
          <div className="action-icon account-icon">记</div>
          <span>记账</span>
        </Link>
        <Link to="/记物" className="action-card">
          <div className="action-icon item-icon">物</div>
          <span>记物</span>
        </Link>
        <Link to="/统计" className="action-card">
          <div className="action-icon stat-icon">统</div>
          <span>统计</span>
        </Link>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>最近记账</h2>
          <Link to="/记账" className="more-link">更多</Link>
        </div>
        <div className="recent-list">
          {recentAccounts.length > 0 ? (
            recentAccounts.map((account) => (
              <div key={account.id} className="recent-item">
                <div className="item-info">
                  <span className="item-category">{account.category}</span>
                  <span className="item-date">{account.date}</span>
                  <span className="item-source">{account.source}</span>
                </div>
                <span className="item-amount">¥{account.amount.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>暂无记账记录</p>
            </div>
          )}
        </div>
      </div>

      <div className="expiring-section">
        <div className="section-header">
          <h2>即将过期物品</h2>
          <Link to="/记物" className="more-link">更多</Link>
        </div>
        <div className="expiring-list">
          {expiringItems.length > 0 ? (
            expiringItems.map((item) => (
              <div key={item.id} className="expiring-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-days">{item.daysLeft}天后过期</span>
                </div>
                <span className="item-expiry">{item.expiryDate}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>暂无即将过期物品</p>
            </div>
          )}
        </div>
      </div>

      <Navigation activeTab="home" />
    </div>
  );
}

export default IndexPage;