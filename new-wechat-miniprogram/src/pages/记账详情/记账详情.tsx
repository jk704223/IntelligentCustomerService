import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navigation from '../../components/Navigation';
import './记账详情.css';

function AccountDetailPage() {
  const navigate = useNavigate();
  const { getAccountById, deleteAccount } = useApp();
  const [searchParams] = useSearchParams();
  const [accountData, setAccountData] = useState<any>(null);

  // 获取记账记录ID
  const accountId = searchParams.get('id') || '1';

  useEffect(() => {
    // 获取记账记录数据
    const account = getAccountById(parseInt(accountId));
    if (account) {
      setAccountData(account);
    }
  }, [accountId, getAccountById]);

  if (!accountData) {
    return (
      <div className="account-detail-page">
        <div className="header">
          <div className="header-left" onClick={() => navigate('/记账')}>
            <span className="back-icon">←</span>
          </div>
          <h1>记账详情</h1>
          <div className="header-right"></div>
        </div>
        <div className="loading">加载中...</div>
        <Navigation activeTab="account" />
      </div>
    );
  }

  const handleDelete = () => {
    // 删除记账记录
    deleteAccount(accountData.id);
    // 跳转到首页
    navigate('/');
  };

  return (
    <div className="account-detail-page">
      <div className="header">
        <div className="header-left" onClick={() => navigate('/记账')}>
          <span className="back-icon">←</span>
        </div>
        <h1>记账详情</h1>
        <div className="header-right"></div>
      </div>

      <div className="detail-content">
        <div className="amount-section">
          <span className="amount-label">金额</span>
          <span className="amount-value">¥{accountData.amount.toFixed(2)}</span>
        </div>

        <div className="info-section">
          <div className="info-item">
            <span className="info-label">分类</span>
            <span className="info-value">{accountData.category}</span>
          </div>
          <div className="info-item">
            <span className="info-label">记账来源</span>
            <span className="info-value">{accountData.source}</span>
          </div>
          <div className="info-item">
            <span className="info-label">日期</span>
            <span className="info-value">{accountData.date}</span>
          </div>
          <div className="info-item">
            <span className="info-label">备注</span>
            <span className="info-value">{accountData.remark}</span>
          </div>
          <div className="info-item">
            <span className="info-label">创建时间</span>
            <span className="info-value">{accountData.createdAt}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn edit-btn">编辑</button>
          <button className="action-btn delete-btn" onClick={handleDelete}>删除</button>
        </div>
      </div>

      <Navigation activeTab="account" />
    </div>
  );
}

export default AccountDetailPage;