import React, { useEffect, useState } from 'react';
import './index.css';

interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  region: string;
  softwareVersion: string;
  portCount: number;
  status: 'active' | 'expiring' | 'expired';
  usageScore: number;
  unresolvedIssues: number;
  lastActiveTime: string;
  expiryDate: string;
}

const CustomerListPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' });
      return;
    }

    // 模拟获取客户列表
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟客户数据
        const mockCustomers: Customer[] = [
          {
            id: 'c001',
            name: '客户A',
            contactPerson: '李四',
            phone: '13987654321',
            email: 'customer@example.com',
            region: '上海市浦东新区',
            softwareVersion: '专业版',
            portCount: 50,
            status: 'active',
            usageScore: 85,
            unresolvedIssues: 2,
            lastActiveTime: '2026-01-29T10:00:00Z',
            expiryDate: '2026-12-31T00:00:00Z'
          },
          {
            id: 'c002',
            name: '客户B',
            contactPerson: '王五',
            phone: '13812345678',
            email: 'customer2@example.com',
            region: '北京市朝阳区',
            softwareVersion: '企业版',
            portCount: 100,
            status: 'expiring',
            usageScore: 90,
            unresolvedIssues: 0,
            lastActiveTime: '2026-01-28T15:30:00Z',
            expiryDate: '2026-02-15T00:00:00Z'
          },
          {
            id: 'c003',
            name: '客户C',
            contactPerson: '赵六',
            phone: '13712345678',
            email: 'customer3@example.com',
            region: '广州市天河区',
            softwareVersion: '标准版',
            portCount: 20,
            status: 'expired',
            usageScore: 75,
            unresolvedIssues: 1,
            lastActiveTime: '2026-01-25T09:00:00Z',
            expiryDate: '2026-01-30T00:00:00Z'
          },
          {
            id: 'c004',
            name: '客户D',
            contactPerson: '孙七',
            phone: '13612345678',
            email: 'customer4@example.com',
            region: '深圳市南山区',
            softwareVersion: '专业版',
            portCount: 30,
            status: 'active',
            usageScore: 80,
            unresolvedIssues: 0,
            lastActiveTime: '2026-01-29T14:00:00Z',
            expiryDate: '2026-12-31T00:00:00Z'
          },
          {
            id: 'c005',
            name: '客户E',
            contactPerson: '周八',
            phone: '13512345678',
            email: 'customer5@example.com',
            region: '杭州市西湖区',
            softwareVersion: '行业版',
            portCount: 80,
            status: 'active',
            usageScore: 95,
            unresolvedIssues: 3,
            lastActiveTime: '2026-01-29T16:00:00Z',
            expiryDate: '2026-12-31T00:00:00Z'
          }
        ];

        setCustomers(mockCustomers);
      } catch (error) {
        wx.showToast({ title: '获取客户列表失败', icon: 'none' });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const navigateToCustomerDetail = (id: string) => {
    wx.navigateTo({ url: `/pages/customer/detail/index?id=${id}` });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesKeyword = customer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          customer.contactPerson.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          customer.phone.includes(searchKeyword);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'expiring': return 'status-expiring';
      case 'expired': return 'status-expired';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'expiring': return '即将到期';
      case 'expired': return '已过期';
      default: return status;
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return 'high';
    if (score >= 75) return 'medium';
    return 'low';
  };

  return (
    <div className="customer-list-container">
      {/* 搜索和筛选 */}
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索客户名称、联系人或电话"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            全部
          </button>
          <button
            className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            活跃
          </button>
          <button
            className={`filter-tab ${statusFilter === 'expiring' ? 'active' : ''}`}
            onClick={() => setStatusFilter('expiring')}
          >
            即将到期
          </button>
          <button
            className={`filter-tab ${statusFilter === 'expired' ? 'active' : ''}`}
            onClick={() => setStatusFilter('expired')}
          >
            已过期
          </button>
        </div>
      </div>

      {/* 客户列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="empty">
          <p>暂无客户数据</p>
        </div>
      ) : (
        <div className="customer-list">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className="customer-item"
              onClick={() => navigateToCustomerDetail(customer.id)}
            >
              <div className="customer-header">
                <div className="customer-name">{customer.name}</div>
                <div className={`customer-status ${getStatusClass(customer.status)}`}>
                  {getStatusText(customer.status)}
                </div>
              </div>
              <div className="customer-info">
                <div className="info-row">
                  <span className="info-label">联系人:</span>
                  <span className="info-value">{customer.contactPerson}</span>
                  <span className="info-label">电话:</span>
                  <span className="info-value">{customer.phone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">软件版本:</span>
                  <span className="info-value">{customer.softwareVersion}</span>
                  <span className="info-label">开通端口:</span>
                  <span className="info-value">{customer.portCount} 个</span>
                </div>
                <div className="info-row">
                  <span className="info-label">使用评分:</span>
                  <div className={`score-badge ${getScoreLevel(customer.usageScore)}`}>
                    {customer.usageScore}
                  </div>
                  {customer.unresolvedIssues > 0 && (
                    <div className="issue-badge">
                      {customer.unresolvedIssues} 个未解决问题
                    </div>
                  )}
                </div>
              </div>
              <div className="customer-footer">
                <span className="last-active">
                  最后活跃: {new Date(customer.lastActiveTime).toLocaleDateString()}
                </span>
                <span className="expiry-date">
                  到期: {new Date(customer.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerListPage;