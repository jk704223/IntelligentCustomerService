import React, { useState } from 'react';
import './index.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      wx.showToast({ title: '请输入账号密码', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      const userInfo = {
        id: 'sp001',
        name: '服务商A',
        contactPerson: '张三',
        phone: '13812345678',
        email: 'service@example.com',
        region: '北京市朝阳区'
      };

      // 存储登录信息
      wx.setStorageSync('token', token);
      wx.setStorageSync('userInfo', userInfo);

      // 跳转到首页
      window.location.hash = '/';
      window.location.reload();
    } catch (error) {
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <h1>服务商小程序</h1>
          <p>登录管理您的客户</p>
        </div>
        <div className="form-item">
          <input
            type="text"
            placeholder="请输入账号"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-item">
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
        <div className="form-footer">
          <a href="#" className="link">忘记密码</a>
          <a href="#" className="link">注册</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;