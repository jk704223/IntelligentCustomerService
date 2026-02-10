import React, { useEffect, useState } from 'react';
import './index.css';

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          region: '北京市朝阳区',
          level: '钻石服务商',
          joinDate: '2025-01-01',
          performance: {
            totalCustomers: 120,
            resolvedTickets: 350,
            customerSatisfaction: '95%'
          }
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
        region: '北京市朝阳区',
        level: '钻石服务商',
        joinDate: '2025-01-01',
        performance: {
          totalCustomers: 120,
          resolvedTickets: 350,
          customerSatisfaction: '95%'
        }
      });
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录信息
          wx.setStorageSync('token', '');
          wx.setStorageSync('userInfo', '');
          // 跳转到登录页
          wx.redirectTo({ url: '/pages/login/index' });
        }
      }
    });
  };

  const handleEditProfile = () => {
    wx.showToast({ title: '编辑资料功能开发中', icon: 'none' });
  };

  const handleChangePassword = () => {
    wx.showToast({ title: '修改密码功能开发中', icon: 'none' });
  };

  const handleContactSupport = () => {
    wx.showToast({ title: '联系客服功能开发中', icon: 'none' });
  };

  const handleAboutUs = () => {
    wx.showToast({ title: '关于我们功能开发中', icon: 'none' });
  };

  if (loading) {
    return <div className="profile-container"><div className="loading">加载中...</div></div>;
  }

  if (!userInfo) {
    return <div className="profile-container"><div className="empty">用户信息不存在</div></div>;
  }

  return (
    <div className="profile-container">
      {/* 用户信息卡片 */}
      <div className="user-info-card">
        <div className="user-avatar">
          <span className="avatar-text">{userInfo.name.charAt(0)}</span>
        </div>
        <div className="user-details">
          <h2 className="user-name">{userInfo.name}</h2>
          <p className="user-level">{userInfo.level}</p>
          <p className="user-contact">{userInfo.contactPerson} | {userInfo.phone}</p>
        </div>
        <button className="edit-profile-btn" onClick={handleEditProfile}>
          编辑资料
        </button>
      </div>

      {/* 个人信息 */}
      <div className="info-section">
        <h3 className="section-title">个人信息</h3>
        <div className="info-list">
          <div className="info-item">
            <span className="info-label">联系人</span>
            <span className="info-value">{userInfo.contactPerson}</span>
          </div>
          <div className="info-item">
            <span className="info-label">联系电话</span>
            <span className="info-value">{userInfo.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">邮箱</span>
            <span className="info-value">{userInfo.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">地区</span>
            <span className="info-value">{userInfo.region}</span>
          </div>
          <div className="info-item">
            <span className="info-label">加入时间</span>
            <span className="info-value">{userInfo.joinDate}</span>
          </div>
        </div>
      </div>

      {/* 业绩统计 */}
      {userInfo.performance && (
        <div className="performance-section">
          <h3 className="section-title">业绩统计</h3>
          <div className="performance-grid">
            <div className="performance-item">
              <div className="performance-number">{userInfo.performance.totalCustomers}</div>
              <div className="performance-label">客户总数</div>
            </div>
            <div className="performance-item">
              <div className="performance-number">{userInfo.performance.resolvedTickets}</div>
              <div className="performance-label">已解决工单</div>
            </div>
            <div className="performance-item">
              <div className="performance-number">{userInfo.performance.customerSatisfaction}</div>
              <div className="performance-label">客户满意度</div>
            </div>
          </div>
        </div>
      )}

      {/* 功能菜单 */}
      <div className="menu-section">
        <h3 className="section-title">功能菜单</h3>
        <div className="menu-list">
          <button className="menu-item" onClick={handleChangePassword}>
            <span className="menu-icon">🔒</span>
            <span className="menu-text">修改密码</span>
            <span className="menu-arrow">→</span>
          </button>
          <button className="menu-item" onClick={handleContactSupport}>
            <span className="menu-icon">📞</span>
            <span className="menu-text">联系客服</span>
            <span className="menu-arrow">→</span>
          </button>
          <button className="menu-item" onClick={handleAboutUs}>
            <span className="menu-icon">ℹ️</span>
            <span className="menu-text">关于我们</span>
            <span className="menu-arrow">→</span>
          </button>
        </div>
      </div>

      {/* 退出登录按钮 */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          退出登录
        </button>
      </div>

      {/* 版本信息 */}
      <div className="version-info">
        <p>版本号: v1.0.0</p>
        <p>© 2026 服务商小程序</p>
      </div>
    </div>
  );
};

export default ProfilePage;