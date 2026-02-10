import React, { useEffect, useState } from 'react';
import './index.css';

interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  content: string;
  type: string;
  status: 'open' | 'processing' | 'resolved';
  escalationStatus: 'normal' | 'escalated';
  createdAt: string;
  updatedAt: string;
  lastProcessor: string;
}

const TicketListPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' });
      return;
    }

    // 模拟获取工单列表
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟工单数据
        const mockTickets: Ticket[] = [
          {
            id: 't001',
            customerId: 'c001',
            customerName: '客户A',
            title: '系统登录失败',
            content: '尝试登录系统时提示账号或密码错误，但确认账号密码正确。',
            type: 'system_issue',
            status: 'processing',
            escalationStatus: 'normal',
            createdAt: '2026-01-28T00:00:00Z',
            updatedAt: '2026-01-29T10:00:00Z',
            lastProcessor: '客服小王'
          },
          {
            id: 't002',
            customerId: 'c002',
            customerName: '客户B',
            title: '产品功能建议',
            content: '希望增加批量导出数据的功能，目前每次只能导出一条记录。',
            type: 'product_suggestion',
            status: 'open',
            escalationStatus: 'normal',
            createdAt: '2026-01-27T00:00:00Z',
            updatedAt: '2026-01-27T00:00:00Z',
            lastProcessor: ''
          },
          {
            id: 't003',
            customerId: 'c003',
            customerName: '客户C',
            title: '新员工培训需求',
            content: '新入职了几位员工，需要安排系统使用培训。',
            type: 'training_implementation',
            status: 'resolved',
            escalationStatus: 'normal',
            createdAt: '2026-01-25T00:00:00Z',
            updatedAt: '2026-01-26T00:00:00Z',
            lastProcessor: '培训师A'
          },
          {
            id: 't004',
            customerId: 'c004',
            customerName: '客户D',
            title: '续费优惠政策咨询',
            content: '想了解续费的优惠政策和流程。',
            type: 'renewal_question',
            status: 'resolved',
            escalationStatus: 'normal',
            createdAt: '2026-01-24T00:00:00Z',
            updatedAt: '2026-01-25T00:00:00Z',
            lastProcessor: '客服小张'
          },
          {
            id: 't005',
            customerId: 'c005',
            customerName: '客户E',
            title: '系统卡顿问题升级',
            content: '系统持续卡顿，影响工作效率，需要紧急处理。',
            type: 'issue_escalation',
            status: 'processing',
            escalationStatus: 'escalated',
            createdAt: '2026-01-23T00:00:00Z',
            updatedAt: '2026-01-24T00:00:00Z',
            lastProcessor: '客服主管'
          },
          {
            id: 't006',
            customerId: 'c006',
            customerName: '客户F',
            title: '客服响应速度慢',
            content: '提交工单后客服响应速度太慢，影响问题解决效率。',
            type: 'complaint',
            status: 'open',
            escalationStatus: 'normal',
            createdAt: '2026-01-22T00:00:00Z',
            updatedAt: '2026-01-22T00:00:00Z',
            lastProcessor: ''
          }
        ];

        setTickets(mockTickets);
      } catch (error) {
        wx.showToast({ title: '获取工单列表失败', icon: 'none' });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const navigateToTicketDetail = (id: string) => {
    wx.navigateTo({ url: `/pages/ticket/detail/index?id=${id}` });
  };

  const handleCreateTicket = () => {
    wx.showModal({
      title: '创建工单',
      content: '确定要创建新工单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '工单创建成功', icon: 'success' });
        }
      }
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesKeyword = ticket.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          ticket.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          ticket.customerName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
    return matchesKeyword && matchesStatus && matchesType;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open': return 'ticket-status-open';
      case 'processing': return 'ticket-status-processing';
      case 'resolved': return 'ticket-status-resolved';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '待处理';
      case 'processing': return '处理中';
      case 'resolved': return '已解决';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'system_issue': return '系统问题';
      case 'product_suggestion': return '产品建议';
      case 'training_implementation': return '培训实施';
      case 'renewal_question': return '续费咨询';
      case 'issue_escalation': return '问题升级';
      case 'complaint': return '投诉';
      default: return type;
    }
  };

  return (
    <div className="ticket-list-container">
      {/* 搜索和筛选 */}
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索工单标题、内容或客户名称"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-tabs">
          <div className="filter-tab-group">
            <span className="filter-label">状态:</span>
            <button
              className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              全部
            </button>
            <button
              className={`filter-tab ${statusFilter === 'open' ? 'active' : ''}`}
              onClick={() => setStatusFilter('open')}
            >
              待处理
            </button>
            <button
              className={`filter-tab ${statusFilter === 'processing' ? 'active' : ''}`}
              onClick={() => setStatusFilter('processing')}
            >
              处理中
            </button>
            <button
              className={`filter-tab ${statusFilter === 'resolved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('resolved')}
            >
              已解决
            </button>
          </div>
          <div className="filter-tab-group">
            <span className="filter-label">类型:</span>
            <button
              className={`filter-tab ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              全部
            </button>
            <button
              className={`filter-tab ${typeFilter === 'system_issue' ? 'active' : ''}`}
              onClick={() => setTypeFilter('system_issue')}
            >
              系统问题
            </button>
            <button
              className={`filter-tab ${typeFilter === 'product_suggestion' ? 'active' : ''}`}
              onClick={() => setTypeFilter('product_suggestion')}
            >
              产品建议
            </button>
            <button
              className={`filter-tab ${typeFilter === 'training_implementation' ? 'active' : ''}`}
              onClick={() => setTypeFilter('training_implementation')}
            >
              培训实施
            </button>
          </div>
        </div>
      </div>

      {/* 工单列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : filteredTickets.length === 0 ? (
        <div className="empty">
          <p>暂无工单数据</p>
        </div>
      ) : (
        <div className="ticket-list">
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              className="ticket-item"
              onClick={() => navigateToTicketDetail(ticket.id)}
            >
              <div className="ticket-header">
                <div className="ticket-title-section">
                  <h3 className="ticket-title">{ticket.title}</h3>
                  {ticket.escalationStatus === 'escalated' && (
                    <div className="escalation-badge">已升级</div>
                  )}
                </div>
                <div className={`ticket-status ${getStatusClass(ticket.status)}`}>
                  {getStatusText(ticket.status)}
                </div>
              </div>
              <div className="ticket-content">
                <p className="ticket-description">{ticket.content}</p>
              </div>
              <div className="ticket-meta">
                <div className="ticket-customer">
                  <span className="meta-label">客户:</span>
                  <span className="meta-value">{ticket.customerName}</span>
                </div>
                <div className="ticket-type">
                  <span className="meta-label">类型:</span>
                  <span className="meta-value">{getTypeText(ticket.type)}</span>
                </div>
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
      )}

      {/* 创建工单按钮 */}
      <div className="create-ticket-button">
        <button className="action-button primary" onClick={handleCreateTicket}>
          + 创建工单
        </button>
      </div>
    </div>
  );
};

export default TicketListPage;