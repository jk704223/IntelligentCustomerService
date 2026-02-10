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
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
  serviceProviderId: string;
  serviceProviderName: string;
  usageScore: number;
  usageScoreDetails: {
    loginFrequency: number;
    featureUsage: number;
    dataInput: number;
    trainingCompletion: number;
  };
  unresolvedIssues: number;
  lastActiveTime: string;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: string;
  title: string;
  content: string;
  type: string;
  status: 'open' | 'processing' | 'resolved';
  createdAt: string;
  updatedAt: string;
  lastProcessor: string;
}

const CustomerDetailPage: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' });
      return;
    }

    // 获取客户ID
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const customerId = currentPage.options?.id || 'c001'; // 默认使用c001作为演示

    // 模拟获取客户详情
    const fetchCustomerDetail = async () => {
      setLoading(true);
      try {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟客户详情数据
        const mockCustomer: Customer = {
          id: customerId,
          name: '客户A',
          contactPerson: '李四',
          phone: '13987654321',
          email: 'customer@example.com',
          region: '上海市浦东新区',
          softwareVersion: '专业版',
          portCount: 50,
          purchaseDate: '2025-01-01T00:00:00Z',
          expiryDate: '2026-12-31T00:00:00Z',
          status: 'active',
          serviceProviderId: 'sp001',
          serviceProviderName: '服务商A',
          usageScore: 85,
          usageScoreDetails: {
            loginFrequency: 90,
            featureUsage: 80,
            dataInput: 85,
            trainingCompletion: 95
          },
          unresolvedIssues: 2,
          lastActiveTime: '2026-01-29T10:00:00Z',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2026-01-29T10:00:00Z'
        };

        setCustomer(mockCustomer);

        // 模拟工单数据
        const mockTickets: Ticket[] = [
          {
            id: 't001',
            title: '系统登录失败',
            content: '尝试登录系统时提示账号或密码错误，但确认账号密码正确。',
            type: 'system_issue',
            status: 'processing',
            createdAt: '2026-01-28T00:00:00Z',
            updatedAt: '2026-01-29T10:00:00Z',
            lastProcessor: '客服小王'
          },
          {
            id: 't002',
            title: '产品功能建议',
            content: '希望增加批量导出数据的功能，目前每次只能导出一条记录。',
            type: 'product_suggestion',
            status: 'open',
            createdAt: '2026-01-27T00:00:00Z',
            updatedAt: '2026-01-27T00:00:00Z',
            lastProcessor: ''
          },
          {
            id: 't003',
            title: '新员工培训需求',
            content: '新入职了几位员工，需要安排系统使用培训。',
            type: 'training_implementation',
            status: 'resolved',
            createdAt: '2026-01-25T00:00:00Z',
            updatedAt: '2026-01-26T00:00:00Z',
            lastProcessor: '培训师A'
          }
        ];

        setTickets(mockTickets);
      } catch (error) {
        wx.showToast({ title: '获取客户详情失败', icon: 'none' });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetail();
  }, []);

  const navigateToTicketDetail = (id: string) => {
    wx.navigateTo({ url: `/pages/ticket/detail/index?id=${id}` });
  };

  const handleCreateTicket = () => {
    wx.navigateTo({ url: `/pages/ticket/list/index?customerId=${customer?.id}` });
  };

  const handleContactCustomer = () => {
    if (customer) {
      wx.makePhoneCall({ phoneNumber: customer.phone });
    }
  };

  const handleEscalateIssue = () => {
    wx.showModal({
      title: '问题升级',
      content: '确定要将该客户的问题升级到更高层级的支持吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '问题已升级', icon: 'success' });
        }
      }
    });
  };

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

  const getTicketStatusClass = (status: string) => {
    switch (status) {
      case 'open': return 'ticket-status-open';
      case 'processing': return 'ticket-status-processing';
      case 'resolved': return 'ticket-status-resolved';
      default: return '';
    }
  };

  const getTicketStatusText = (status: string) => {
    switch (status) {
      case 'open': return '待处理';
      case 'processing': return '处理中';
      case 'resolved': return '已解决';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!customer) {
    return <div className="error">客户信息加载失败</div>;
  }

  return (
    <div className="customer-detail-container">
      {/* 客户基本信息 */}
      <div className="customer-basic-info">
        <div className="info-header">
          <h1 className="customer-name">{customer.name}</h1>
          <div className={`status-badge ${getStatusClass(customer.status)}`}>
            {getStatusText(customer.status)}
          </div>
        </div>
        <div className="info-content">
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">联系人:</span>
              <span className="info-value">{customer.contactPerson}</span>
            </div>
            <div className="info-item">
              <span className="info-label">电话:</span>
              <span className="info-value phone">{customer.phone}</span>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item">
              <span className="info-label">邮箱:</span>
              <span className="info-value">{customer.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">所在地区:</span>
              <span className="info-value">{customer.region}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 软件信息 */}
      <div className="software-info">
        <h2 className="section-title">软件信息</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-label">软件版本</div>
            <div className="info-card-value">{customer.softwareVersion}</div>
          </div>
          <div className="info-card">
            <div className="info-card-label">开通端口</div>
            <div className="info-card-value">{customer.portCount} 个</div>
          </div>
          <div className="info-card">
            <div className="info-card-label">购买日期</div>
            <div className="info-card-value">{new Date(customer.purchaseDate).toLocaleDateString()}</div>
          </div>
          <div className="info-card">
            <div className="info-card-label">到期日期</div>
            <div className="info-card-value">{new Date(customer.expiryDate).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* 使用深度评分 */}
      <div className="usage-score">
        <h2 className="section-title">使用深度评分</h2>
        <div className="score-overview">
          <div className={`total-score ${getScoreLevel(customer.usageScore)}`}>
            {customer.usageScore}
          </div>
          <div className="score-label">总分</div>
        </div>
        <div className="score-details">
          <div className="score-item">
            <span className="score-name">登录频率</span>
            <div className="score-bar">
              <div 
                className="score-progress high"
                style={{ width: `${customer.usageScoreDetails.loginFrequency}%` }}
              ></div>
            </div>
            <span className="score-value">{customer.usageScoreDetails.loginFrequency}</span>
          </div>
          <div className="score-item">
            <span className="score-name">功能使用</span>
            <div className="score-bar">
              <div 
                className="score-progress medium"
                style={{ width: `${customer.usageScoreDetails.featureUsage}%` }}
              ></div>
            </div>
            <span className="score-value">{customer.usageScoreDetails.featureUsage}</span>
          </div>
          <div className="score-item">
            <span className="score-name">数据输入</span>
            <div className="score-bar">
              <div 
                className="score-progress medium"
                style={{ width: `${customer.usageScoreDetails.dataInput}%` }}
              ></div>
            </div>
            <span className="score-value">{customer.usageScoreDetails.dataInput}</span>
          </div>
          <div className="score-item">
            <span className="score-name">培训完成</span>
            <div className="score-bar">
              <div 
                className="score-progress high"
                style={{ width: `${customer.usageScoreDetails.trainingCompletion}%` }}
              ></div>
            </div>
            <span className="score-value">{customer.usageScoreDetails.trainingCompletion}</span>
          </div>
        </div>
      </div>

      {/* 历史工单 */}
      <div className="ticket-section">
        <div className="section-header">
          <h2 className="section-title">历史工单</h2>
          {customer.unresolvedIssues > 0 && (
            <div className="unresolved-badge">
              {customer.unresolvedIssues} 个未解决问题
            </div>
          )}
        </div>
        <div className="ticket-list">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className="ticket-item"
              onClick={() => navigateToTicketDetail(ticket.id)}
            >
              <div className="ticket-header">
                <h3 className="ticket-title">{ticket.title}</h3>
                <div className={`ticket-status ${getTicketStatusClass(ticket.status)}`}>
                  {getTicketStatusText(ticket.status)}
                </div>
              </div>
              <div className="ticket-content">
                <p className="ticket-description">{ticket.content}</p>
              </div>
              <div className="ticket-footer">
                <span className="ticket-date">
                  创建: {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                {ticket.lastProcessor && (
                  <span className="ticket-processor">
                    处理人: {ticket.lastProcessor}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="action-buttons">
        <button className="action-button primary" onClick={handleCreateTicket}>
          创建工单
        </button>
        <button className="action-button secondary" onClick={handleContactCustomer}>
          联系客户
        </button>
        <button className="action-button danger" onClick={handleEscalateIssue}>
          问题升级
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailPage;