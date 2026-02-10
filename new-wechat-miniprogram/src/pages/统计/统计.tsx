import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Navigation from '../../components/Navigation';
import './统计.css';

function StatPage() {
  const { getTotalExpense, getCategoryStats, getSourceStats, getItemStats } = useApp();
  const [statData, setStatData] = useState({
    totalExpense: 0,
    categoryStats: [],
    sourceStats: [],
    itemStats: {
      totalItems: 0,
      expiringItems: 0,
      totalValue: 0
    }
  });

  useEffect(() => {
    // 页面加载时获取统计数据
    updateStatData();
  }, [getTotalExpense, getCategoryStats, getSourceStats, getItemStats]);

  const updateStatData = () => {
    const totalExpense = getTotalExpense();
    const categoryStats = getCategoryStats();
    const sourceStats = getSourceStats();
    const itemStats = getItemStats();

    setStatData({
      totalExpense,
      categoryStats,
      sourceStats,
      itemStats
    });
  };

  return (
    <div className="stat-page">
      <div className="header">
        <h1>统计</h1>
      </div>

      <div className="stat-content">
        <div className="expense-summary">
          <h2>消费总览</h2>
          <div className="total-expense">
            <span className="expense-label">本月总支出</span>
            <span className="expense-value">¥{statData.totalExpense.toFixed(2)}</span>
          </div>
        </div>

        <div className="category-stat">
          <h3>分类统计</h3>
          <div className="category-list">
            {statData.categoryStats.length > 0 ? (
              statData.categoryStats.map((item, index) => (
                <div key={index} className="category-item">
                  <span className="category-name">{item.category}</span>
                  <div className="category-bar">
                    <div 
                      className="category-progress" 
                      style={{ 
                        width: `${(item.amount / statData.totalExpense) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="category-amount">¥{item.amount.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>暂无分类数据</p>
              </div>
            )}
          </div>
        </div>

        <div className="source-stat">
          <h3>来源统计</h3>
          <div className="source-list">
            {statData.sourceStats.length > 0 ? (
              statData.sourceStats.map((item, index) => (
                <div key={index} className="source-item">
                  <span className="source-name">{item.source}</span>
                  <span className="source-amount">¥{item.amount.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>暂无来源数据</p>
              </div>
            )}
          </div>
        </div>

        <div className="item-stat">
          <h3>物品统计</h3>
          <div className="item-stats-grid">
            <div className="item-stat-item">
              <span className="item-stat-value">{statData.itemStats.totalItems}</span>
              <span className="item-stat-label">总物品数</span>
            </div>
            <div className="item-stat-item">
              <span className="item-stat-value expiring">{statData.itemStats.expiringItems}</span>
              <span className="item-stat-label">即将过期</span>
            </div>
            <div className="item-stat-item">
              <span className="item-stat-value">¥{statData.itemStats.totalValue.toFixed(2)}</span>
              <span className="item-stat-label">总价值</span>
            </div>
          </div>
        </div>
      </div>

      <Navigation activeTab="stat" />
    </div>
  );
}

export default StatPage;