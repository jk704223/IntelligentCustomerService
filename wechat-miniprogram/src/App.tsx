import { useState, useEffect } from 'react';
import './App.css';

// 模拟微信小程序API
if (typeof window !== 'undefined' && !window.wx) {
  (window as any).wx = {
    getStorageSync: (key: string) => {
      return localStorage.getItem(key);
    },
    setStorageSync: (key: string, value: any) => {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    },
    redirectTo: (options: { url: string }) => {
      window.location.hash = options.url.replace('/pages', '');
    },
    navigateTo: (options: { url: string }) => {
      window.location.hash = options.url.replace('/pages', '');
    },
    switchTab: (options: { url: string }) => {
      window.location.hash = options.url.replace('/pages', '');
    },
    navigateBack: () => {
      window.history.back();
    },
    showToast: (options: { title: string; icon?: string }) => {
      alert(options.title);
    },
    showModal: (options: { title: string; content: string; success: (res: { confirm: boolean }) => void }) => {
      const confirm = window.confirm(`${options.title}\n${options.content}`);
      options.success({ confirm });
    },
    getCurrentPages: () => {
      return [{
        options: {
          id: window.location.hash.split('?id=')[1] || ''
        }
      }];
    }
  };
}

// 导入页面组件
import LoginPage from './pages/login/index';
import HomePage from './pages/index/index';
import CustomerListPage from './pages/customer/list/index';
import CustomerDetailPage from './pages/customer/detail/index';
import TicketListPage from './pages/ticket/list/index';
import TicketDetailPage from './pages/ticket/detail/index';
import MessageListPage from './pages/message/list/index';
import MessageDetailPage from './pages/message/detail/index';
import ProfilePage from './pages/profile/index';

// 模拟路由系统
interface Route {
  path: string;
  component: React.FC;
  exact?: boolean;
}

const routes: Route[] = [
  { path: '/login', component: LoginPage, exact: true },
  { path: '/', component: HomePage, exact: true },
  { path: '/customer/list', component: CustomerListPage },
  { path: '/customer/detail', component: CustomerDetailPage },
  { path: '/ticket/list', component: TicketListPage },
  { path: '/ticket/detail', component: TicketDetailPage },
  { path: '/message/list', component: MessageListPage },
  { path: '/message/detail', component: MessageDetailPage },
  { path: '/profile', component: ProfilePage },
];

// 处理/pages路径前缀
const handlePathWithPrefix = (path: string) => {
  return path.replace('/pages', '');
};

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    // 初始检查
    checkLoginStatus();

    // 监听localStorage变化
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    // 模拟路由变化
    const handleHashChange = () => {
      const path = window.location.hash.substring(1) || '/';
      setCurrentPath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('storage', handleStorageChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 找到匹配的路由
  const getCurrentComponent = () => {
    // 如果未登录，重定向到登录页
    if (!isLoggedIn && currentPath !== '/login') {
      return <LoginPage />;
    }

    // 处理路径前缀
    const normalizedPath = handlePathWithPrefix(currentPath);

    // 找到匹配的路由
    for (const route of routes) {
      if (route.exact) {
        if (route.path === normalizedPath) {
          return <route.component />;
        }
      } else {
        if (normalizedPath.startsWith(route.path)) {
          return <route.component />;
        }
      }
    }

    // 默认显示登录页
    return <LoginPage />;
  };

  return (
    <div className="app-container">
      {getCurrentComponent()}
    </div>
  );
}

export default App;
