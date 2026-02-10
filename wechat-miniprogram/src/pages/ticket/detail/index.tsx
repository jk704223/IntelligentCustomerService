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
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  resolution?: string;
  interactions?: Array<{
    id: string;
    type: 'system' | 'customer' | 'service_provider';
    content: string;
    createdAt: string;
    author: string;
  }>;
}

const TicketDetailPage: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' });
      return;
    }

    // 获取工单ID
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const ticketId = currentPage.options.id;

    // 模拟获取工单详情
    const fetchTicketDetail = async () => {
      setLoading(true);
      try {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟工单详情数据
        const mockTickets: Record<string, Ticket> = {
          't001': {
            id: 't001',
            customerId: 'c001',
            customerName: '客户A',
            title: '系统登录失败',
            content: '尝试登录系统时提示账号或密码错误，但确认账号密码正确。',
            type: 'system_issue',
            status: 'processing',
            escalationStatus: 'normal',
            priority: 'medium',
            createdAt: '2026-01-28T00:00:00Z',
            updatedAt: '2026-01-29T10:00:00Z',
            lastProcessor: '客服小王',
            assignee: '客服小王',
            interactions: [
              {
                id: 'i001',
                type: 'customer',
                content: '尝试登录系统时提示账号或密码错误，但确认账号密码正确。',
                createdAt: '2026-01-28T00:00:00Z',
                author: '客户A'
              },
              {
                id: 'i002',
                type: 'service_provider',
                content: '已收到您的问题，正在排查中。请确认您是否使用了正确的登录地址？',
                createdAt: '2026-01-28T09:00:00Z',
                author: '客服小王'
              },
              {
                id: 'i003',
                type: 'customer',
                content: '是的，使用的是公司提供的登录地址。',
                createdAt: '2026-01-28T10:00:00Z',
                author: '客户A'
              },
              {
                id: 'i004',
                type: 'service_provider',
                content: '已为您重置密码，请使用新密码登录。',
                createdAt: '2026-01-29T10:00:00Z',
                author: '客服小王'
              }
            ]
          },
          't002': {
            id: 't002',
            customerId: 'c002',
            customerName: '客户B',
            title: '产品功能建议',
            content: '希望增加批量导出数据的功能，目前每次只能导出一条记录。',
            type: 'product_suggestion',
            status: 'open',
            escalationStatus: 'normal',
            priority: 'low',
            createdAt: '2026-01-27T00:00:00Z',
            updatedAt: '2026-01-27T00:00:00Z',
            lastProcessor: '',
            interactions: [
              {
                id: 'i001',
                type: 'customer',
                content: '希望增加批量导出数据的功能，目前每次只能导出一条记录。',
                createdAt: '2026-01-27T00:00:00Z',
                author: '客户B'
              }
            ]
          },
          't003': {
            id: 't003',
            customerId: 'c003',
            customerName: '客户C',
            title: '新员工培训需求',
            content: '新入职了几位员工，需要安排系统使用培训。',
            type: 'training_implementation',
            status: 'resolved',
            escalationStatus: 'normal',
            priority: 'medium',
            createdAt: '2026-01-25T00:00:00Z',
            updatedAt: '2026-01-26T00:00:00Z',
            lastProcessor: '培训师A',
            resolution: '已安排培训师进行系统使用培训，培训时间为2026年1月26日下午2点。',
            interactions: [
              {
                id: 'i001',
                type: 'customer',
                content: '新入职了几位员工，需要安排系统使用培训。',
                createdAt: '2026-01-25T00:00:00Z',
                author: '客户C'
              },
              {
                id: 'i002',
                type: 'service_provider',
                content: '已收到您的培训需求，我们将安排培训师与您联系。',
                createdAt: '2026-01-25T09:00:00Z',
                author: '客服小张'
              },
              {
                id: 'i003',
                type: 'system',
                content: '培训已安排，培训师：培训师A，时间：2026年1月26日下午2点。',
                createdAt: '2026-01-25T10:00:00Z',
                author: '系统'
              },
              {
                id: 'i004',
                type: 'service_provider',
                content: '培训已完成，员工反馈良好。',
                createdAt: '2026-01-26T15:00:00Z',
                author: '培训师A'
              }
            ]
          },
          't004': {
            id: 't004',
            customerId: 'c004',
            customerName: '客户D',
            title: '续费优惠政策咨询',
            content: '想了解续费的优惠政策和流程。',
            type: 'renewal_question',
            status: 'resolved',
            escalationStatus: 'normal',
            priority: 'low',
            createdAt: '2026-01-24T00:00:00Z',
            updatedAt: '2026-01-25T00:00:00Z',
            lastProcessor: '客服小张',
            resolution: '已提供续费优惠政策详情，客户表示满意。',
            interactions: [
              {
                id: 'i001',
                type: 'customer',
                content: '想了解续费的优惠政策和流程。',
                createdAt: '2026-01-24T00:00:00Z',
                author: '客户D'
              },
              {
                id: 'i002',
                type: 'service_provider',
                content: '尊敬的客户，我们的续费优惠政策如下：1. 续期1年可享受9折优惠；2. 续期2年可享受8折优惠；3. 续期3年可享受7折优惠。续费流程：登录系统后台，点击"账户设置"-"续费管理"，选择续期时长并完成支付即可。',
                createdAt: '2026-01-24T10:00:00Z',
                author: '客服小张'
              },
              {
                id: 'i003',
                type: 'customer',
                content: '明白了，谢谢解答。',
                createdAt: '2026-01-25T00:00:00Z',
                author: '客户D'
              }
            ]
          },
          't005': {
            id: 't005',
            customerId: 'c005',
            customerName: '客户E',
            title: '系统卡顿问题升级',
            content: '系统持续卡顿，影响工作效率，需要紧急处理。',
            type: 'issue_escalation',
            status: 'processing',
            escalationStatus: 'escalated',
            priority: 'urgent',
            createdAt: '2026-01-23T00:00:00Z',
            updatedAt: '2026-01-24T00:00:00Z',
            lastProcessor: '客服主管',
            assignee: '技术支持组',
            interactions: [
              {
                id: 'i001',
                type: 'customer',
                content: '系统持续卡顿，影响工作效率，需要紧急处理。',
                createdAt: '2026-01-23T00:00:00Z',
                author: '客户E'
              },
              {
                id: 'i002',
                type: 'service_provider',
                content: '已收到您的问题，正在排查中。',
                createdAt: '2026-01-23T09:00:00Z',
                author: '客服小王'
              },
              {
                id: 'i003',
                type: 'system',
                content: '问题已升级至技术支持组处理。',
                createdAt: '2026-01-23T10:00:00Z',
                author: '系统'
              },
              {
                id: 'i004',
                type: 'service_provider',
                content: '技术支持组正在处理您的问题，我们会尽快给您回复。',
                createdAt: '2026-01-24T00:00:00Z',
                author: '客服主管'
              }
            ]
          },
          't006': {
            id: 't006',
            customerId: 'c006',
            customerName: '客户F',
            title: '客服响应速度慢',
            content: '提交工单后客服响应速度太慢，影响问题解决效率。',
            type: 'complaint',
            status: 'open',
            escalationStatus: 'normal',
            priority: 'medium',
            createdAt: '2026-01-22T00:00:00Z',
            updatedAt: '2026-01-22T00:00:00Z',
            lastProcessor: '',
            interactions: [
              {
                id: 'i001',
                type: 'customer',
                content: '提交工单后客服响应速度太慢，影响问题解决效率。',
                createdAt: '2026-01-22T00:00:00Z',
                author: '客户F'
              }
            ]
          }
        };

        // 模拟获取工单详情
        const ticketData = mockTickets[ticketId as keyof typeof mockTickets];
        if (ticketData) {
          setTicket(ticketData);
        } else {
          wx.showToast({ title: '工单不存在', icon: 'none' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      } catch (error) {
        wx.showToast({ title: '获取工单详情失败', icon: 'none' });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, []);

  const handleEscalateIssue = () => {
    wx.showModal({
      title: '问题升级',
      content: '确定要将此问题升级到PC端客服系统吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '问题已成功升级', icon: 'success' });
          // 模拟升级操作
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const handleAddComment = () => {
    if (!comment.trim()) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }

    wx.showToast({ title: '评论已提交', icon: 'success' });
    setComment('');
  };

  const handleResolveTicket = () => {
    wx.showModal({
      title: '解决工单',
      content: '确定要将此工单标记为已解决吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '工单已标记为已解决', icon: 'success' });
          // 模拟解决操作
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  };

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

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      default: return '';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return '低';
      case 'medium': return '中';
      case 'high': return '高';
      case 'urgent': return '紧急';
      default: return priority;
    }
  };

  if (loading) {
    return <div className="ticket-detail-container"><div className="loading">加载中...</div></div>;
  }

  if (!ticket) {
    return <div className="ticket-detail-container"><div className="empty">工单不存在</div></div>;
  }

  return (
    <div className="ticket-detail-container">
      {/* 工单基本信息 */}
      <div className="ticket-header-section">
        <div className="ticket-title-bar">
          <h2 className="ticket-title">{ticket.title}</h2>
          <div className={`ticket-status ${getStatusClass(ticket.status)}`}>
            {getStatusText(ticket.status)}
          </div>
        </div>
        <div className="ticket-meta-info">
          <div className="meta-item">
            <span className="meta-label">客户:</span>
            <span className="meta-value">{ticket.customerName}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">类型:</span>
            <span className="meta-value">{getTypeText(ticket.type)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">优先级:</span>
            <span className={`meta-value ${getPriorityClass(ticket.priority)}`}>
              {getPriorityText(ticket.priority)}
            </span>
          </div>
          {ticket.assignee && (
            <div className="meta-item">
              <span className="meta-label">负责人:</span>
              <span className="meta-value">{ticket.assignee}</span>
            </div>
          )}
          {ticket.lastProcessor && (
            <div className="meta-item">
              <span className="meta-label">处理人:</span>
              <span className="meta-value">{ticket.lastProcessor}</span>
            </div>
          )}
        </div>
        <div className="ticket-date-info">
          <div className="meta-item">
            <span className="meta-label">创建时间:</span>
            <span className="meta-value">{new Date(ticket.createdAt).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">更新时间:</span>
            <span className="meta-value">{new Date(ticket.updatedAt).toLocaleString()}</span>
          </div>
        </div>
        {ticket.escalationStatus === 'escalated' && (
          <div className="escalation-badge">
            <span className="escalation-icon">🚨</span>
            <span className="escalation-text">已升级至PC端客服系统</span>
          </div>
        )}
      </div>

      {/* 工单内容 */}
      <div className="ticket-content-section">
        <h3 className="section-title">问题描述</h3>
        <div className="ticket-content">
          <p>{ticket.content}</p>
        </div>
      </div>

      {/* 工单互动记录 */}
      {ticket.interactions && ticket.interactions.length > 0 && (
        <div className="ticket-interactions-section">
          <h3 className="section-title">互动记录</h3>
          <div className="interactions-list">
            {ticket.interactions.map(interaction => (
              <div key={interaction.id} className={`interaction-item ${interaction.type}`}>
                <div className="interaction-header">
                  <span className="interaction-author">{interaction.author}</span>
                  <span className="interaction-time">{new Date(interaction.createdAt).toLocaleString()}</span>
                  <span className={`interaction-type-tag ${interaction.type}`}>
                    {interaction.type === 'system' ? '系统' : 
                     interaction.type === 'customer' ? '客户' : '服务商'}
                  </span>
                </div>
                <div className="interaction-content">
                  <p>{interaction.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 解决方案 */}
      {ticket.resolution && (
        <div className="ticket-resolution-section">
          <h3 className="section-title">解决方案</h3>
          <div className="ticket-resolution">
            <p>{ticket.resolution}</p>
          </div>
        </div>
      )}

      {/* 添加评论 */}
      <div className="ticket-comment-section">
        <h3 className="section-title">添加评论</h3>
        <div className="comment-input-area">
          <textarea
            placeholder="请输入评论内容..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
            rows={4}
          />
          <button className="submit-comment-btn" onClick={handleAddComment}>
            提交评论
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="ticket-actions-section">
        <button className="action-button primary" onClick={handleAddComment}>
          回复客户
        </button>
        {ticket.status !== 'resolved' && (
          <button className="action-button secondary" onClick={handleResolveTicket}>
            标记为已解决
          </button>
        )}
        <button className="action-button danger" onClick={handleEscalateIssue}>
          问题升级
        </button>
      </div>
    </div>
  );
};

export default TicketDetailPage;