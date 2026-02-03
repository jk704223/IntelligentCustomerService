import React, { useState, useEffect } from 'react';
import { Input, Button, message, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// 添加全局样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes marquee {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `;
  document.head.appendChild(style);
}

interface Message {
  id: string;
  content: string | React.ReactNode;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface Ticket {
  id: string;
  title: string;
  content: string;
  status: 'open' | 'processing' | 'resolved';
  createdTime: Date;
  updatedTime: Date;
}

interface CustomerViewProps {
  addTicket: (ticket: {
    title: string;
    content: string;
    customerName: string;
    customerEmail: string;
    status: 'open' | 'processing' | 'resolved';
    type: 'system_issue' | 'product_suggestion' | 'training_implementation' | 'renewal_question' | 'issue_escalation' | 'complaint';
  }) => void;
  tickets?: Array<{
    id: string;
    title: string;
    content: string;
    status: 'open' | 'processing' | 'resolved';
    createdTime: Date;
    updatedTime: Date;
  }>;
}

const CustomerView: React.FC<CustomerViewProps> = ({ addTicket, tickets: propsTickets = [] }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '您好！我是智能客服助手，有什么可以帮助您的吗？\n\n请选择您当前遇到的问题类型：',
      type: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [currentIssueType, setCurrentIssueType] = useState<string>('');
  const [systemErrorInfo, setSystemErrorInfo] = useState({ menu: '', description: '' });
  const [productSuggestionInfo, setProductSuggestionInfo] = useState({ menu: '', description: '' });
  const [collectingInfo, setCollectingInfo] = useState(false);
  const [localTickets] = useState<Ticket[]>([]);
  const tickets = [...localTickets, ...propsTickets];
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [floatButtonPosition, setFloatButtonPosition] = useState(() => ({
    x: window.innerWidth - 92, // 视窗宽度减去按钮宽度和边距
    y: window.innerHeight - 92  // 视窗高度减去按钮高度和边距
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // 消息通知数据
  const [notifications] = useState([
    { id: '1', content: '系统将于2026年2月1日进行例行维护，维护时间为凌晨2:00-4:00' },
    { id: '2', content: '您的订阅将于2026年2月15日到期，请及时续费' },
    { id: '3', content: '新产品功能已上线，您可以在系统设置中查看详情' },
  ]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    const input = inputValue.trim();
    setInputValue('');

    if (collectingInfo) {
      handleInfoCollection(input);
    } else {
      handleIssueTypeSelection(input);
    }
  };

  const handleIssueTypeSelection = (input: string) => {
    switch (input) {
      case '投诉':
        handleComplaint();
        break;
      case '系统错误':
        startSystemErrorCollection();
        break;
      case '产品建议':
        startProductSuggestionCollection();
        break;
      case '续费咨询':
        handleRenewalQuestion();
        break;
      case '功能询问':
        handleFeatureQuestion();
        break;
      case '需要培训':
        handleTrainingRequest();
        break;
      case '软件口令':
        handleSoftwarePassword();
        break;
      case '历史工单':
        handleHistoricalTickets();
        break;
      case '变更主账号':
        handleChangeMainAccount();
        break;
      case '升级版本':
        handleUpgradeVersion();
        break;
      default:
        handleGeneralQuestion(input);
        break;
    }
  };

  const handleInfoCollection = (input: string) => {
    switch (currentIssueType) {
      case '系统错误':
        if (!systemErrorInfo.menu) {
          setSystemErrorInfo({ ...systemErrorInfo, menu: input });
          sendBotMessage('请详细描述您遇到的问题：');
        } else {
          setSystemErrorInfo({ ...systemErrorInfo, description: input });
          confirmSystemErrorInfo();
        }
        break;
      case '产品建议':
        if (!productSuggestionInfo.menu) {
          setProductSuggestionInfo({ ...productSuggestionInfo, menu: input });
          sendBotMessage('请详细描述您的建议：');
        } else {
          setProductSuggestionInfo({ ...productSuggestionInfo, description: input });
          confirmProductSuggestionInfo();
        }
        break;
      default:
        sendBotMessage('感谢您的回复，我们会尽快处理您的问题。');
        setCollectingInfo(false);
        setCurrentIssueType('');
        break;
    }
  };

  const handleComplaint = () => {
    addTicket({
      title: '客户投诉',
      content: '客户发起投诉，需要客服人员尽快处理。',
      customerName: '当前客户',
      customerEmail: 'customer@example.com',
      status: 'open',
      type: 'complaint',
    });
    sendBotMessage('感谢您的反馈，我们已经收到您的投诉并生成了工单，客服人员会尽快与您联系处理。');
  };

  const startSystemErrorCollection = () => {
    setCurrentIssueType('系统错误');
    setCollectingInfo(true);
    setSystemErrorInfo({ menu: '', description: '' });
    sendBotMessage('请告知您在哪个菜单遇到了系统错误：');
  };

  const confirmSystemErrorInfo = () => {
    const { menu, description } = systemErrorInfo;
    sendBotMessage(`请确认您的问题信息：\n菜单：${menu}\n问题描述：${description}\n\n如果信息正确，请回复"确认"，我们将为您生成工单。`);
    setTimeout(() => {
      createSystemErrorTicket();
    }, 2000);
  };

  const createSystemErrorTicket = () => {
    const { menu, description } = systemErrorInfo;
    addTicket({
      title: `系统错误：${menu}`,
      content: `菜单：${menu}\n问题描述：${description}`,
      customerName: '当前客户',
      customerEmail: 'customer@example.com',
      status: 'open',
      type: 'system_issue',
    });
    sendBotMessage('工单已生成，技术人员会尽快处理您的系统错误问题。');
    setCollectingInfo(false);
    setCurrentIssueType('');
  };

  const startProductSuggestionCollection = () => {
    setCurrentIssueType('产品建议');
    setCollectingInfo(true);
    setProductSuggestionInfo({ menu: '', description: '' });
    sendBotMessage('请告知您对哪个菜单有产品建议：');
  };

  const confirmProductSuggestionInfo = () => {
    const { menu, description } = productSuggestionInfo;
    sendBotMessage(`请确认您的建议信息：\n菜单：${menu}\n建议描述：${description}\n\n如果信息正确，请回复"确认"，我们将为您生成工单。`);
    setTimeout(() => {
      createProductSuggestionTicket();
    }, 2000);
  };

  const createProductSuggestionTicket = () => {
    const { menu, description } = productSuggestionInfo;
    addTicket({
      title: `产品建议：${menu}`,
      content: `菜单：${menu}\n建议描述：${description}`,
      customerName: '当前客户',
      customerEmail: 'customer@example.com',
      status: 'open',
      type: 'product_suggestion',
    });
    sendBotMessage('产品建议已生成工单，我们的产研部门会仔细评估您的建议。反馈可能没有那么快，当被采纳之后可在软件内产品建议内进行进度的查看。');
    setCollectingInfo(false);
    setCurrentIssueType('');
  };

  const handleRenewalQuestion = () => {
    sendBotMessage('您的当前订阅计划是企业版，到期日期为2026年2月15日。您可以在续费管理中查看详细信息并进行续费操作，当前价格为899/端口/年。');
  };

  const handleFeatureQuestion = () => {
    sendBotMessage('感谢您的咨询，我们的产品具有丰富的功能。您可以在帮助中心查看详细的功能介绍，或者直接描述您想了解的具体功能，我们会为您提供更详细的信息。');
  };

  const handleTrainingRequest = () => {
    addTicket({
      title: '培训需求',
      content: '客户提出培训需求，需要客服人员尽快联系处理。',
      customerName: '当前客户',
      customerEmail: 'customer@example.com',
      status: 'open',
      type: 'training_implementation',
    });
    sendBotMessage('感谢您的培训需求，我们已经收到并生成了培训工单，客服人员会尽快与您联系安排培训事宜。');
  };

  const handleSoftwarePassword = () => {
    sendBotMessage('关于软件口令，不同模块的操作指令如下：\n\n1. 清除软件数据：请在系统设置 -> 数据管理 -> 清除数据\n2. 开启严格产期模式：请在系统设置 -> 安全设置 -> 产期管理\n3. 其他模块：请联系客服获取具体操作指令\n\n请注意，这些操作可能会影响系统数据，请谨慎操作。');
    setTimeout(() => {
      sendBotMessage('请问我的回答对您有帮助吗？');
      showSatisfactionOptions();
    }, 1000);
  };

  const handleHistoricalTickets = () => {
    if (tickets.length === 0) {
      sendBotMessage('您暂无历史工单记录。');
    } else {
      // 定义工单表格列
      const ticketColumns: ColumnsType<any> = [
        {
          title: '工单ID',
          dataIndex: 'id',
          key: 'id',
          width: 60,
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          ellipsis: true,
          flex: 1,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 80,
          render: (status: string) => {
            const statusConfig: Record<string, string> = {
              open: '待处理',
              processing: '处理中',
              resolved: '已解决',
            };
            return statusConfig[status] || status;
          },
        },
        {
          title: '创建时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: 120,
          render: (time: Date) => time.toLocaleDateString(),
        },
      ];
      
      // 发送表格消息
      sendBotMessage(
        <div style={{ width: '100%' }}>
          <h4 style={{ margin: '0 0 12px 0' }}>历史工单记录</h4>
          <Table 
            columns={ticketColumns} 
            dataSource={tickets} 
            rowKey="id" 
            size="small"
            pagination={{ pageSize: 5 }}
            style={{ width: '100%' }}
          />
        </div>
      );
    }
  };

  const handleGeneralQuestion = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('登录') || lowerInput.includes('密码')) {
      sendBotMessage('关于登录问题，您可以尝试重置密码，或者检查账号是否正确。如果问题仍然存在，我们会为您创建工单并安排技术人员处理。');
      setTimeout(() => {
        sendBotMessage('请问我的回答对您有帮助吗？');
        showSatisfactionOptions();
      }, 1000);
    } else if (lowerInput.includes('功能') || lowerInput.includes('需求')) {
      if (lowerInput.includes('如何使用') || lowerInput.includes('怎么用')) {
        sendBotMessage('关于您咨询的功能使用方法，您可以按照以下步骤操作：\n1. 登录系统后进入对应模块\n2. 点击相关功能按钮\n3. 根据系统提示完成操作\n\n如果您需要更详细的指导，我们提供了完整的使用文档。');
        setTimeout(() => {
          sendBotMessage('请问我的回答对您有帮助吗？');
          showSatisfactionOptions();
        }, 1000);
      } else {
        sendBotMessage('感谢您的功能建议，我们会将您的需求记录下来并提交给产品团队评估。您可以在工单系统中查看需求的处理进度。');
        setTimeout(() => {
          sendBotMessage('请问我的回答对您有帮助吗？');
          showSatisfactionOptions();
        }, 1000);
      }
    } else if (lowerInput.includes('培训') || lowerInput.includes('使用')) {
      sendBotMessage('我们提供详细的产品使用文档和视频教程，您可以在帮助中心查看。如果需要个性化培训，请告知我们您的具体需求。');
      setTimeout(() => {
        sendBotMessage('请问我的回答对您有帮助吗？');
        showSatisfactionOptions();
      }, 1000);
    } else if (lowerInput.includes('续费') || lowerInput.includes('账单')) {
      sendBotMessage('您的当前订阅计划是企业版，到期日期为2026年2月15日。您可以在续费管理中查看详细信息并进行续费操作。');
      setTimeout(() => {
        sendBotMessage('请问我的回答对您有帮助吗？');
        showSatisfactionOptions();
      }, 1000);
    } else if (lowerInput.includes('错误') || lowerInput.includes('bug')) {
      sendBotMessage('很抱歉给您带来不便，请详细描述错误情况，我们会为您创建技术工单并尽快解决问题。');
    } else if (lowerInput.includes('满意')) {
      sendBotMessage('很高兴能够帮到您！如果您还有其他问题，随时可以咨询我。');
    } else if (lowerInput.includes('转人工')) {
      sendBotMessage('正在为您转接人工客服，请稍候...');
      setTimeout(() => {
        sendBotMessage('人工客服已接通，您可以详细描述您的问题。');
      }, 2000);
    } else {
      sendBotMessage('感谢您的咨询，我是智能客服助手，有什么可以帮助您的吗？您可以咨询系统问题、功能需求、培训要求或续费相关问题。');
    }
  };

  const showSatisfactionOptions = () => {
    sendBotMessage('请回复以下选项：\n1. 满意\n2. 转人工');
  };

  const sendBotMessage = (content: string) => {
    const botReply: Message = {
      id: (Date.now() + 1).toString(),
      content: content,
      type: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botReply]);
  };

  const handleRenew = () => {
    addTicket({
      title: '客户主动续费',
      content: '客户申请续费服务，需要客服人员尽快联系处理。',
      customerName: '当前客户',
      customerEmail: 'customer@example.com',
      status: 'open',
      type: 'renewal_question',
    });
    message.success('已成功生成续费工单，我们的客服人员将尽快与您联系！');
  };

  const handleScreenshot = () => {
    // 模拟截图功能
    setInputValue(prev => prev + ' [截图内容]');
    message.success('已截取当前软件操作页面');
  };

  const handleChangeMainAccount = () => {
    addTicket({
      title: '变更主账号',
      content: '客户申请变更主账号，需要客服人员尽快联系处理。',
      customerName: '当前客户',
      customerEmail: 'customer@example.com',
      status: 'open',
      type: 'issue_escalation',
    });
    sendBotMessage('感谢您的申请，我们已经收到您的变更主账号请求并生成了工单，客服人员会尽快与您联系处理。');
  };

  const handleUpgradeVersion = () => {
    addTicket({
      title: '升级版本',
      content: '客户申请升级版本，需要客服人员尽快联系处理。',
      customerName: '当前客户',
      customerEmail: 'customer@example.com',
      status: 'open',
      type: 'product_suggestion',
    });
    sendBotMessage('感谢您的申请，我们已经收到您的升级版本请求并生成了工单，客服人员会尽快与您联系处理。');
  };

  // 拖拽功能处理函数
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - floatButtonPosition.x,
      y: e.clientY - floatButtonPosition.y
    });
    // 添加全局鼠标事件监听
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // 限制在视窗内
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;
    
    setFloatButtonPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
    // 移除全局鼠标事件监听
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 左侧软件展示区域 */}
        <div style={{ 
          flex: 1, 
          borderRight: '1px solid #e8e8e8', 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#fff',
          width: isExpanded ? '70%' : '100%',
          transition: 'width 0.3s ease'
        }}>
          <div style={{ flex: 1, padding: 0, overflow: 'auto' }}>
              <img 
                src="https://file-boss.boogcloud.com/NKB/1.png" 
                alt="软件操作界面" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
          </div>
          
          {/* 下方问题类型选择 */}
          {isExpanded && (
            <div style={{ 
              height: '20vh', 
              minHeight: '220px', 
              padding: 16, 
              borderTop: '1px solid #e8e8e8', 
              backgroundColor: '#fff', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('系统错误');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  系统错误
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('产品建议');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  产品建议
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('续费咨询');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  续费咨询
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('功能询问');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  功能询问
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('投诉');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  投诉
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('需要培训');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  需要培训
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('软件口令');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  软件口令
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('历史工单');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  历史工单
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('变更主账号');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  变更主账号
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('升级版本');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  升级版本
                </Button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="请输入您的问题..."
                  onPressEnter={handleSendMessage}
                  style={{ flex: 1, height: 32 }}
                />
                <Button type="default" onClick={handleScreenshot} style={{ height: 32, padding: '0 16px' }}>
                  截图
                </Button>
                <Button type="primary" onClick={handleSendMessage} style={{ height: 32, padding: '0 16px' }}>
                  发送
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 右侧聊天区域 */}
        {isExpanded && (
          <div style={{ 
            width: '30%', 
            minWidth: 400, 
            borderLeft: '1px solid #e8e8e8', 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: '#fafafa',
            transition: 'all 0.3s ease',
            opacity: 1,
            transform: 'translateX(0)'
          }}>
            <div style={{ padding: 16, borderBottom: '1px solid #e8e8e8', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>智能客服</h3>
                <Input
                  placeholder="搜索会话记录..."
                  style={{ width: 200 }}
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                />
              </div>
              {/* 消息轮播 */}
              <div style={{ 
                backgroundColor: '#f0f8ff', 
                border: '1px solid #e1f5fe', 
                borderRadius: 4, 
                padding: 12,
                marginBottom: 12,
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div 
                  style={{ 
                    display: 'flex',
                    animation: 'marquee 15s linear infinite',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '200%'
                  }}
                >
                  {notifications.map(notification => (
                    <span key={notification.id} style={{ marginRight: '30px', color: '#1890ff' }}>
                      {notification.content}
                    </span>
                  ))}
                  {/* 重复一遍通知，实现无缝滚动 */}
                  {notifications.map(notification => (
                    <span key={`${notification.id}-copy`} style={{ marginRight: '30px', color: '#1890ff' }}>
                      {notification.content}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16, borderBottom: '1px solid #e8e8e8' }}>
              {messages
                .filter(message => {
                  if (!searchKeyword.trim()) return true;
                  if (typeof message.content === 'string') {
                    return message.content.toLowerCase().includes(searchKeyword.toLowerCase());
                  }
                  return false;
                })
                .map(message => (
                <div key={message.id} style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: message.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  {typeof message.content === 'string' ? (
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      wordWrap: 'break-word',
                      backgroundColor: message.type === 'user' ? '#1890ff' : '#f0f0f0',
                      color: message.type === 'user' ? 'white' : '#333',
                      borderBottomRightRadius: message.type === 'user' ? '4px' : '18px',
                      borderBottomLeftRadius: message.type === 'user' ? '18px' : '4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>{message.content}</div>
                  ) : (
                    <div style={{
                      width: '100%',
                      maxWidth: '90%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>{message.content}</div>
                  )}
                  <div style={{ fontSize: 12, color: '#999', marginTop: 6, marginLeft: message.type === 'user' ? 0 : '12px', marginRight: message.type === 'user' ? '12px' : 0 }}>
                    {message.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 下方输入区域 */}
            <div style={{ padding: 16, borderTop: '1px solid #e8e8e8', backgroundColor: '#fff' }}>
              {/* 问题类型按钮 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('系统错误');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  系统错误
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('产品建议');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  产品建议
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('变更主账号');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  变更主账号
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('升级版本');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  软件升级
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setInputValue('需要培训');
                    handleSendMessage();
                  }}
                  style={{ padding: '4px 12px', fontWeight: 'bold' }}
                >
                  培训实施
                </Button>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder="请输入您的问题..."
                  onPressEnter={handleSendMessage}
                  style={{ flex: 1, height: 32 }}
                />
                <Button type="default" onClick={handleScreenshot} style={{ height: 32, padding: '0 16px' }}>
                  截图
                </Button>
                <Button type="primary" onClick={handleSendMessage} style={{ height: 32, padding: '0 16px' }}>
                  发送
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 圆形悬浮框 */}
      <div 
        style={{
          position: 'fixed',
          left: floatButtonPosition.x,
          top: floatButtonPosition.y,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: isDragging ? 'grabbing' : 'pointer',
          boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          fontSize: 18,
          fontWeight: 'bold',
          userSelect: 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseDown={handleMouseDown}
        title={isExpanded ? '收起客服' : '展开客服'}
      >
        {isExpanded ? '收起' : '客服'}
      </div>
    </div>
  );
};

export default CustomerView;