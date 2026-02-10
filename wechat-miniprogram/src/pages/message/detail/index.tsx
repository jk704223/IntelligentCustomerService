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
  relatedActions?: Array<{
    id: string;
    name: string;
    type: 'view_customer' | 'view_ticket' | 'reply_customer';
    targetId: string;
  }>;
}

const MessageDetailPage: React.FC = () => {
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({ url: '/pages/login/index' });
      return;
    }

    // 获取消息ID
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const messageId = currentPage.options.id;

    // 模拟获取消息详情
    const fetchMessageDetail = async () => {
      setLoading(true);
      try {
        // 模拟网络请求
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟消息详情数据
        const mockMessages: Record<string, Message> = {
          'm001': {
            id: 'm001',
            title: '系统升级通知',
            content: '尊敬的服务商，我们将于2026年2月1日凌晨2:00-4:00进行系统升级维护，期间系统可能会短暂不可用，请提前做好准备。\n\n本次升级内容包括：\n1. 优化系统性能，提升响应速度\n2. 修复已知bug，增强系统稳定性\n3. 新增客户分析报表功能\n4. 改进工单处理流程\n\n如有任何疑问，请联系技术支持。',
            type: 'system',
            status: 'read',
            createdAt: '2026-01-30T00:00:00Z',
            relatedActions: []
          },
          'm002': {
            id: 'm002',
            title: '新工单通知',
            content: '您的客户客户A提交了新工单：系统登录失败，请及时处理。\n\n工单详情：\n- 工单号：t001\n- 提交时间：2026-01-29 10:00:00\n- 优先级：中等\n- 问题描述：尝试登录系统时提示账号或密码错误，但确认账号密码正确。',
            type: 'ticket',
            status: 'read',
            createdAt: '2026-01-29T10:00:00Z',
            customerId: 'c001',
            customerName: '客户A',
            ticketId: 't001',
            ticketTitle: '系统登录失败',
            relatedActions: [
              {
                id: 'action1',
                name: '查看工单详情',
                type: 'view_ticket',
                targetId: 't001'
              },
              {
                id: 'action2',
                name: '查看客户信息',
                type: 'view_customer',
                targetId: 'c001'
              }
            ]
          },
          'm003': {
            id: 'm003',
            title: '客户咨询提醒',
            content: '您的客户客户B有新的咨询：关于产品功能的使用方法，请及时回复。\n\n咨询内容：\n您好，我想了解一下如何使用系统中的批量导出功能，我们需要导出大量数据进行分析，希望能得到详细的操作指导。\n\n客户联系方式：\n- 联系人：张经理\n- 电话：13800138000\n- 邮箱：zhang@example.com',
            type: 'customer',
            status: 'read',
            createdAt: '2026-01-29T09:00:00Z',
            customerId: 'c002',
            customerName: '客户B',
            relatedActions: [
              {
                id: 'action1',
                name: '回复客户',
                type: 'reply_customer',
                targetId: 'c002'
              },
              {
                id: 'action2',
                name: '查看客户信息',
                type: 'view_customer',
                targetId: 'c002'
              }
            ]
          },
          'm004': {
            id: 'm004',
            title: '工单处理提醒',
            content: '您处理的工单"新员工培训需求"已由客户确认完成，工单状态已更新为已解决。\n\n工单详情：\n- 工单号：t003\n- 提交时间：2026-01-25 00:00:00\n- 完成时间：2026-01-28 15:00:00\n- 处理人：培训师A\n- 解决方案：已安排培训师进行系统使用培训，培训时间为2026年1月26日下午2点。培训已完成，员工反馈良好。',
            type: 'ticket',
            status: 'read',
            createdAt: '2026-01-28T15:00:00Z',
            customerId: 'c003',
            customerName: '客户C',
            ticketId: 't003',
            ticketTitle: '新员工培训需求',
            relatedActions: [
              {
                id: 'action1',
                name: '查看工单详情',
                type: 'view_ticket',
                targetId: 't003'
              },
              {
                id: 'action2',
                name: '查看客户信息',
                type: 'view_customer',
                targetId: 'c003'
              }
            ]
          },
          'm005': {
            id: 'm005',
            title: '服务质量评估',
            content: '尊敬的服务商，您的服务质量评估结果已出炉，请查看详情。\n\n评估周期：2026年1月1日 - 2026年1月31日\n\n评估结果：\n- 工单响应速度：95分\n- 问题解决率：98分\n- 客户满意度：92分\n- 综合评分：95分\n\n排名：在所有服务商中排名第3位\n\n评语：您的服务质量表现优秀，客户反馈良好，继续保持！',
            type: 'system',
            status: 'read',
            createdAt: '2026-01-28T10:00:00Z',
            relatedActions: []
          },
          'm006': {
            id: 'm006',
            title: '客户续费提醒',
            content: '您的客户客户D的服务将于30天后到期，请及时联系客户进行续费。\n\n客户信息：\n- 客户名称：客户D\n- 服务到期时间：2026年2月28日\n- 服务套餐：企业版\n- 联系人：李经理\n- 电话：13900139000\n\n续费优惠：\n- 续期1年：9折优惠\n- 续期2年：8折优惠\n- 续期3年：7折优惠',
            type: 'customer',
            status: 'read',
            createdAt: '2026-01-27T14:00:00Z',
            customerId: 'c004',
            customerName: '客户D',
            relatedActions: [
              {
                id: 'action1',
                name: '查看客户信息',
                type: 'view_customer',
                targetId: 'c004'
              }
            ]
          },
          'm007': {
            id: 'm007',
            title: '工单升级通知',
            content: '您提交的工单"系统卡顿问题"已升级至技术支持组处理，预计将在24小时内得到回复。\n\n工单详情：\n- 工单号：t005\n- 提交时间：2026-01-23 00:00:00\n- 升级时间：2026-01-27 10:00:00\n- 升级原因：系统持续卡顿，影响工作效率，需要紧急处理\n- 技术支持组联系人：王工程师\n- 联系电话：13700137000',
            type: 'ticket',
            status: 'read',
            createdAt: '2026-01-27T10:00:00Z',
            customerId: 'c005',
            customerName: '客户E',
            ticketId: 't005',
            ticketTitle: '系统卡顿问题升级',
            relatedActions: [
              {
                id: 'action1',
                name: '查看工单详情',
                type: 'view_ticket',
                targetId: 't005'
              },
              {
                id: 'action2',
                name: '查看客户信息',
                type: 'view_customer',
                targetId: 'c005'
              }
            ]
          },
          'm008': {
            id: 'm008',
            title: '新功能上线通知',
            content: '尊敬的服务商，我们新增了客户分析报表功能，您可以在后台查看详细的客户使用数据。\n\n功能介绍：\n1. 客户活跃度分析：查看客户登录频率、使用时长等数据\n2. 功能使用分析：了解客户使用各功能的频率和深度\n3. 问题分析：统计客户提交的问题类型和解决率\n4. 续费预测：基于客户使用情况预测续费可能性\n\n访问路径：后台管理 > 客户管理 > 客户分析报表\n\n如有任何疑问，请联系技术支持。',
            type: 'system',
            status: 'read',
            createdAt: '2026-01-26T00:00:00Z',
            relatedActions: []
          }
        };

        // 模拟获取消息详情
        const messageData = mockMessages[messageId as keyof typeof mockMessages];
        if (messageData) {
          setMessage(messageData);
        } else {
          wx.showToast({ title: '消息不存在', icon: 'none' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      } catch (error) {
        wx.showToast({ title: '获取消息详情失败', icon: 'none' });
      } finally {
        setLoading(false);
      }
    };

    fetchMessageDetail();
  }, []);

  const handleRelatedAction = (action: { type: string; targetId: string }) => {
    switch (action.type) {
      case 'view_customer':
        wx.navigateTo({ url: `/pages/customer/detail/index?id=${action.targetId}` });
        break;
      case 'view_ticket':
        wx.navigateTo({ url: `/pages/ticket/detail/index?id=${action.targetId}` });
        break;
      case 'reply_customer':
        wx.showModal({
          title: '回复客户',
          content: '确定要回复该客户吗？',
          success: (res) => {
            if (res.confirm) {
              wx.showToast({ title: '回复功能开发中', icon: 'none' });
            }
          }
        });
        break;
      default:
        break;
    }
  };

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

  if (loading) {
    return <div className="message-detail-container"><div className="loading">加载中...</div></div>;
  }

  if (!message) {
    return <div className="message-detail-container"><div className="empty">消息不存在</div></div>;
  }

  return (
    <div className="message-detail-container">
      {/* 消息头部 */}
      <div className="message-header-section">
        <div className="message-icon-large">
          {getTypeIcon(message.type)}
        </div>
        <h1 className="message-title">{message.title}</h1>
        <div className="message-meta">
          <span className={`message-type-tag ${getTypeClass(message.type)}`}>
            {getTypeText(message.type)}
          </span>
          <span className="message-time">
            {new Date(message.createdAt).toLocaleString()}
          </span>
        </div>
        {message.customerName && (
          <div className="message-customer-info">
            <span className="customer-label">客户:</span>
            <span className="customer-name">{message.customerName}</span>
          </div>
        )}
      </div>

      {/* 消息内容 */}
      <div className="message-content-section">
        <div className="message-content">
          <pre>{message.content}</pre>
        </div>
      </div>

      {/* 相关操作 */}
      {message.relatedActions && message.relatedActions.length > 0 && (
        <div className="message-actions-section">
          <h3 className="section-title">相关操作</h3>
          <div className="actions-list">
            {message.relatedActions.map(action => (
              <button
                key={action.id}
                className="action-button"
                onClick={() => handleRelatedAction(action)}
              >
                <span className="action-icon">
                  {action.type === 'view_customer' ? '👤' : 
                   action.type === 'view_ticket' ? '📋' : '💬'}
                </span>
                <span className="action-name">{action.name}</span>
                <span className="action-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => wx.navigateBack()}>
          返回消息列表
        </button>
      </div>
    </div>
  );
};

export default MessageDetailPage;