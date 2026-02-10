import React, { useState } from 'react';
import { Layout, Menu, Button, Badge } from 'antd';
import { 
  DashboardOutlined, 
  BookOutlined, 
  AppstoreOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

const { Header, Sider, Content } = Layout;

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // 处理登出逻辑
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: '/记账管理',
      icon: <BookOutlined />,
      label: <Link to="/记账管理">记账管理</Link>,
    },
    {
      key: '/记物管理',
      icon: <AppstoreOutlined />,
      label: <Link to="/记物管理">记物管理</Link>,
    },
    {
      key: '/报表分析',
      icon: <BarChartOutlined />,
      label: <Link to="/报表分析">报表分析</Link>,
    },
    {
      key: '/系统设置',
      icon: <SettingOutlined />,
      label: <Link to="/系统设置">系统设置</Link>,
    },
  ];

  return (
    <div className="admin-layout">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        className={`admin-sider ${collapsed ? 'admin-sider-collapsed' : ''}`}
      >
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: collapsed ? '16px' : '18px', textAlign: 'center' }}>
            {collapsed ? '记账' : '记账管理系统'}
          </h2>
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <div className={`admin-content ${collapsed ? 'admin-content-collapsed' : ''}`}>
        <Header className="admin-header">
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={toggleCollapse}
          />
          <div className="user-info">
            <Badge count={5}>
              <span className="bell-icon">🔔</span>
            </Badge>
            <span>管理员</span>
            <Button 
              type="primary" 
              danger 
              size="small" 
              onClick={handleLogout}
              className="logout-btn"
            >
              退出
            </Button>
          </div>
        </Header>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', minHeight: 'calc(100vh - 112px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;