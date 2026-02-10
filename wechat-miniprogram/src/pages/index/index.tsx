import React, { useEffect, useState } from 'react';
import './index.css';

const IndexPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState({
    pendingTickets: 5,
    unreadMessages: 3,
    totalCustomers: 120,
    activeCustomers: 95,
    ticketResolutionRate: '85%'
  });

  useEffect(() => {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' });
      return;
    }

    // 获取用户信息
    const storedUserInfo = wx.getStorageSync('userInfo');
    if (storedUserInfo) {
      try {
        // 尝试解析JSON字符串
        const parsedUserInfo = typeof storedUserInfo === 'string' ? JSON.parse(storedUserInfo) : storedUserInfo;
        setUserInfo(parsedUserInfo);
      } catch (error) {
        // 如果解析失败，使用默认用户信息
        setUserInfo({
          id: 'sp001',
          name: '服务商A',
          contactPerson: '张三',
          phone: '13812345678',
          email: 'service@example.com',
          region: '北京市朝阳区'
        });
      }
    } else {
      // 如果没有存储用户信息，使用默认用户信息
      setUserInfo({
        id: 'sp001',
        name: '服务商A',
        contactPerson: '张三',
        phone: '13812345678',
        email: 'service@example.com',
        region: '北京市朝阳区'
      });
    }
  }, []);

  const navigateTo = (url: string) => {
    wx.navigateTo({ url });
  };

  const navigateToTab = (url: string) => {
    wx.switchTab({ url });
  };

  if (!userInfo) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="index-container">
      {/* 顶部用户信息 */}
      <div className="user-info">
        <div className="user-avatar">
          <span className="avatar-text">{userInfo.name.charAt(0)}</span>
        </div>
        <div className="user-details">
          <h2>{userInfo.name}</h2>
          <p>{userInfo.contactPerson} | {userInfo.region}</p>
        </div>
      </div>

      {/* 状态卡片 */}
      <div className="status-cards">
        <div className="status-card" onClick={() => navigateTo('/pages/ticket/list')}>
          <div className="status-content">
            <div className="status-number">{dashboardData.pendingTickets}</div>
            <div className="status-label">待处理工单</div>
          </div>
          <div className="status-icon pending"></div>
        </div>
        <div className="status-card" onClick={() => navigateTo('/pages/message/list')}>
          <div className="status-content">
            <div className="status-number">{dashboardData.unreadMessages}</div>
            <div className="status-label">未读消息</div>
          </div>
          <div className="status-icon message"></div>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="quick-actions">
        <div className="action-title">快捷操作</div>
        <div className="action-grid">
          <div className="action-item" onClick={() => navigateTo('/pages/customer/list')}>
            <div className="action-icon customer">
              <span className="icon-text">客</span>
            </div>
            <div className="action-label">客户管理</div>
          </div>
          <div className="action-item" onClick={() => navigateTo('/pages/ticket/list')}>
            <div className="action-icon ticket">
              <span className="icon-text">工</span>
            </div>
            <div className="action-label">工单管理</div>
          </div>
          <div className="action-item" onClick={() => navigateTo('/pages/message/list')}>
            <div className="action-icon msg">
              <span className="icon-text">消</span>
            </div>
            <div className="action-label">消息中心</div>
          </div>
          <div className="action-item" onClick={() => navigateTo('/pages/profile')}>
            <div className="action-icon profile">
              <span className="icon-text">我</span>
            </div>
            <div className="action-label">个人中心</div>
          </div>
        </div>
      </div>

      {/* 数据概览 */}
      <div className="data-overview">
        <div className="overview-title">数据概览</div>
        <div className="overview-grid">
          <div className="overview-item">
            <div className="overview-number">{dashboardData.totalCustomers}</div>
            <div className="overview-label">客户总数</div>
          </div>
          <div className="overview-item">
            <div className="overview-number">{dashboardData.activeCustomers}</div>
            <div className="overview-label">活跃客户</div>
          </div>
          <div className="overview-item">
            <div className="overview-number">{dashboardData.ticketResolutionRate}</div>
            <div className="overview-label">工单处理率</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;