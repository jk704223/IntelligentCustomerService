import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navigation from '../../components/Navigation';
import './记物详情.css';

function ItemDetailPage() {
  const navigate = useNavigate();
  const { getItemById, deleteItem } = useApp();
  const [searchParams] = useSearchParams();
  const [itemData, setItemData] = useState<any>(null);
  const [expiryDate, setExpiryDate] = useState('');

  // 获取物品记录ID
  const itemId = searchParams.get('id') || '1';

  useEffect(() => {
    // 获取物品记录数据
    const item = getItemById(parseInt(itemId));
    if (item) {
      setItemData(item);
      // 计算预计过期日期
      calculateExpiryDate(item);
    }
  }, [itemId, getItemById]);

  const calculateExpiryDate = (item: any) => {
    const date = new Date(item.purchaseDate);
    if (item.usageUnit === '天') {
      date.setDate(date.getDate() + item.usagePeriod);
    } else if (item.usageUnit === '周') {
      date.setDate(date.getDate() + item.usagePeriod * 7);
    } else if (item.usageUnit === '月') {
      date.setMonth(date.getMonth() + item.usagePeriod);
    } else if (item.usageUnit === '年') {
      date.setFullYear(date.getFullYear() + item.usagePeriod);
    }
    setExpiryDate(date.toISOString().split('T')[0]);
  };

  const handleDelete = () => {
    // 删除物品记录
    if (itemData) {
      deleteItem(itemData.id);
      // 跳转到首页
      navigate('/');
    }
  };

  if (!itemData) {
    return (
      <div className="item-detail-page">
        <div className="header">
          <div className="header-left" onClick={() => navigate('/记物')}>
            <span className="back-icon">←</span>
          </div>
          <h1>记物详情</h1>
          <div className="header-right"></div>
        </div>
        <div className="loading">加载中...</div>
        <Navigation activeTab="item" />
      </div>
    );
  }

  return (
    <div className="item-detail-page">
      <div className="header">
        <div className="header-left" onClick={() => navigate('/记物')}>
          <span className="back-icon">←</span>
        </div>
        <h1>记物详情</h1>
        <div className="header-right"></div>
      </div>

      <div className="detail-content">
        <div className="name-section">
          <h2>{itemData.name}</h2>
        </div>

        <div className="info-section">
          <div className="info-item">
            <span className="info-label">购买日期</span>
            <span className="info-value">{itemData.purchaseDate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">使用周期</span>
            <span className="info-value">{itemData.usagePeriod} {itemData.usageUnit}</span>
          </div>
          <div className="info-item">
            <span className="info-label">预计过期日期</span>
            <span className="info-value expiry-date">{expiryDate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">购买价格</span>
            <span className="info-value">¥{itemData.purchasePrice.toFixed(2)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">备注</span>
            <span className="info-value">{itemData.remark}</span>
          </div>
          <div className="info-item">
            <span className="info-label">创建时间</span>
            <span className="info-value">{itemData.createdAt}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn edit-btn">编辑</button>
          <button className="action-btn delete-btn" onClick={handleDelete}>删除</button>
        </div>
      </div>

      <Navigation activeTab="item" />
    </div>
  );
}

export default ItemDetailPage;