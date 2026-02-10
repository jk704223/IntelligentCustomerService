import React, { useEffect, useState } from 'react';
import './index.css';

interface Message {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'customer' | 'ticket';
  status: 'unread' | 'read';
  createdAt: string;
  customerId?: string;
  customerName?: string;
  ticketId?: string;
  ticketTitle?: string;
}

const MessageListPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' });
      return;
    }

    // 模拟获取消息列表
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟消息数据
        const mockMessages: Message[] = [
          {
            id: 'm001',
            title: '系统升级通知',
            content: '尊敬的服务商，我们将于2026年2月1日凌晨2:00-4:00进行系统升级维护，期间系统可能会短暂不可用，请提前做好准备。',
            type: 'system',
            status: 'unread',
            createdAt: '2026-01-30T00:00:00Z'
          },
          {
            id: 'm002',
            title: '新工单通知',
            content: '您的客户客户A提交了新工单：系统登录失败，请及时处理。',
            type: 'ticket',
            status: 'unread',
            createdAt: '2026-01-29T10:00:00Z',
            customerId: 'c001',
            customerName: '客户A',
            ticketId: 't001',
            ticketTitle: '系统登录失败'
          },
          {
            id: 'm003',
            title: '客户咨询提醒',
            content: '您的客户客户B有新的咨询：关于产品功能的使用方法，请及时回复。',
            type: 'customer',
            status: 'unread',
            createdAt: '2026-01-29T09:00:00Z',
            customerId: 'c002',
            customerName: '客户B'
          },
          {
            id: 'm004',
            title: '工单处理提醒',
            content: '您处理的工单"新员工培训需求"已由客户确认完成，工单状态已更新为已解决。',
            type: 'ticket',
            status: 'read',
            createdAt: '2026-01-28T15:00:00Z',
            customerId: 'c003',
            customerName: '客户C',
            ticketId: 't003',
            ticketTitle: '新员工培训需求'
          },
          {
            id: 'm005',
            title: '服务质量评估',
            content: '尊敬的服务商，您的服务质量评估结果已出炉，请查看详情。',
            type: 'system',
            status: 'read',
            createdAt: '2026-01-28T10:00:00Z'
          },
          {
            id: 'm006',
            title: '客户续费提醒',
            content: '您的客户客户D的服务将于30天后到期，请及时联系客户进行续费。',
            type: 'customer',
            status: 'read',
            createdAt: '2026-01-27T14:00:00Z',
            customerId: 'c004',
            customerName: '客户D'
          },
          {
            id: 'm007',
            title: '工单升级通知',
            content: '您提交的工单"系统卡顿问题"已升级至技术支持组处理，预计将在24小时内得到回复。',
            type: 'ticket',
            status: 'read',
            createdAt: '2026-01-27T10:00:00Z',
            customerId: 'c005',
            customerName: '客户E',
            ticketId: 't005',
            ticketTitle: '系统卡顿问题升级'
          },
          {
            id: 'm008',
            title: '新功能上线通知',
            content: '尊敬的服务商，我们新增了客户分析报表功能，您可以在后台查看详细的客户使用数据。',
            type: 'system',
            status: 'read',
            createdAt: '2026-01-26T00:00:00Z'
          }
        ];

        setMessages(mockMessages);
      } catch (error) {
        wx.showToast({ title: '获取消息列表失败', icon: 'none' });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const navigateToMessageDetail = (id: string) => {
    // 标记消息为已读
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === id ? { ...msg, status: 'read' } : msg
      )
    );
    wx.navigateTo({ url: `/pages/message/detail/index?id=${id}` });
  };

  const handleMarkAllAsRead = () => {
    wx.showModal({
      title: '标记全部已读',
      content: '确定要将所有消息标记为已读吗？',
      success: (res) => {
        if (res.confirm) {
          setMessages(prevMessages =>
            prevMessages.map(msg => ({ ...msg, status: 'read' }))
          );
          wx.showToast({ title: '已全部标记为已读', icon: 'success' });
        }
      }
    });
  };

  const filteredMessages = messages.filter(message => {
    const matchesKeyword = message.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          message.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          (message.customerName && message.customerName.toLowerCase().includes(searchKeyword.toLowerCase()));
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    return matchesKeyword && matchesType;
  });

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'system': return 'message-type-system';
      case 'customer': return 'message-type-customer';
      case 'ticket': return 'message-type-ticket';
      default: return '';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'system': return '系统通知';
      case 'customer': return '客户消息';
      case 'ticket': return '工单通知';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return '📢';
      case 'customer': return '👤';
      case 'ticket': return '📋';
      default: return '📄';
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => msg.status === 'unread').length;
  };

  return (
    <div className="message-list-container">
      {/* 头部操作栏 */}
      <div className="message-header">
        <h1 className="page-title">消息通知</h1>
        {getUnreadCount() > 0 && (
          <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
            全部已读
          </button>
        )}
      </div>

      {/* 搜索和筛选 */}
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索消息标题、内容或客户名称"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            全部
          </button>
          <button
            className={`filter-tab ${typeFilter === 'system' ? 'active' : ''}`}
            onClick={() => setTypeFilter('system')}
          >
            系统通知
          </button>
          <button
            className={`filter-tab ${typeFilter === 'customer' ? 'active' : ''}`}
            onClick={() => setTypeFilter('customer')}
          >
            客户消息
          </button>
          <button
            className={`filter-tab ${typeFilter === 'ticket' ? 'active' : ''}`}
            onClick={() => setTypeFilter('ticket')}
          >
            工单通知
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="empty">
          <p>暂无消息</p>
        </div>
      ) : (
        <div className="message-list">
          {filteredMessages.map(message => (
            <div
              key={message.id}
              className={`message-item ${message.status === 'unread' ? 'unread' : ''} ${getTypeClass(message.type)}`}
              onClick={() => navigateToMessageDetail(message.id)}
            >
              <div className="message-icon">
                {getTypeIcon(message.type)}
                {message.status === 'unread' && (
                  <div className="unread-badge">●</div>
                )}
              </div>
              <div className="message-content">
                <div className="message-header-row">
                  <h3 className="message-title">{message.title}</h3>
                  <span className={`message-type-tag ${getTypeClass(message.type)}`}>
                    {getTypeText(message.type)}
                  </span>
                </div>
                <p className="message-preview">{message.content}</p>
                {message.customerName && (
                  <div className="message-customer">
                    <span className="customer-label">客户:</span>
                    <span className="customer-name">{message.customerName}</span>
                  </div>
                )}
                <div className="message-footer">
                  <span className="message-time">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageListPage;