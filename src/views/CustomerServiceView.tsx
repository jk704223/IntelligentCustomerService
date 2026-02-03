import React, { useState, useEffect } from 'react';
import { Button, Card, List, Badge, Input, Select, Tag, Modal, message, Popover, notification } from 'antd';
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

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

const { TextArea } = Input;

interface Ticket {
  id: string;
  title: string;
  content: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'processing' | 'resolved';
  type: 'system_issue' | 'product_suggestion' | 'training_implementation' | 'renewal_question' | 'issue_escalation' | 'complaint';
  createdTime: Date;
  updatedTime: Date;
  lastProcessor: string;
  lastProcessTime: Date;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  nextBillingDate: Date;
  status: 'active' | 'expiring' | 'expired';
  purchasePort: number;
  lastActiveTime: Date;
  complaintCount: number;
  tags: string[];
  归属类型: '公司' | '服务商';
  归属人: string;
  所在地区: string;
  customerType: 'KA' | 'non-KA';
  manufacturers: string[];
  remainingPoints?: number;
  valueAddedModules: string[];
}

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'service';
  timestamp: Date;
}

interface CustomerServiceViewProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const CustomerServiceView: React.FC<CustomerServiceViewProps> = ({ tickets, setTickets }) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('chat');
  const [inputValue, setInputValue] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(true); // 默认收起菜单

  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13812345678',
      plan: '订阅版',
      nextBillingDate: new Date('2026-02-15'),
      status: 'active',
      purchasePort: 100,
      lastActiveTime: new Date('2026-01-29T10:00:00'),
      complaintCount: 2,
      tags: ['重要客户', '技术导向', '高价值'],
      归属类型: '公司',
      归属人: '销售小王',
      所在地区: '北京市朝阳区',
      customerType: 'KA',
      manufacturers: ['农夫', '雪花'],
      valueAddedModules: ['小程序', '勤商', '多组织核算'],
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      phone: '13987654321',
      plan: '行业版',
      nextBillingDate: new Date('2026-01-30'),
      status: 'expiring',
      purchasePort: 50,
      lastActiveTime: new Date('2026-01-28T15:30:00'),
      complaintCount: 1,
      tags: ['成长型', '价格敏感'],
      归属类型: '服务商',
      归属人: '服务商A',
      所在地区: '上海市浦东新区',
      customerType: 'non-KA',
      manufacturers: [],
      valueAddedModules: ['小程序', '返利'],
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      phone: '13711223344',
      plan: '专业版',
      nextBillingDate: new Date('2026-03-10'),
      status: 'active',
      purchasePort: 20,
      lastActiveTime: new Date('2026-01-27T09:15:00'),
      complaintCount: 0,
      tags: ['新客户', '潜力客户'],
      归属类型: '公司',
      归属人: '销售小李',
      所在地区: '广州市天河区',
      customerType: 'KA',
      manufacturers: ['大窑', '新希望'],
      remainingPoints: 150,
      valueAddedModules: ['小程序', '勤商', '现金牛', 'WMS'],
    },
    {
      id: '4',
      name: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13655667788',
      plan: '订阅版',
      nextBillingDate: new Date('2026-02-05'),
      status: 'expiring',
      purchasePort: 150,
      lastActiveTime: new Date('2026-01-29T11:20:00'),
      complaintCount: 3,
      tags: ['重要客户', '服务导向'],
      归属类型: '服务商',
      归属人: '服务商B',
      所在地区: '深圳市南山区',
      customerType: 'non-KA',
      manufacturers: [],
      valueAddedModules: ['勤商', '多组织核算', '返利'],
    },
  ]);

  const [customerMessages, setCustomerMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        content: '您好！我是智能客服助手，有什么可以帮助您的吗？',
        sender: 'service',
        timestamp: new Date('2026-01-29T10:00:00'),
      },
      {
        id: '2',
        content: '我的系统登录失败了，提示账号或密码错误',
        sender: 'customer',
        timestamp: new Date('2026-01-29T10:01:00'),
      },
      {
        id: '3',
        content: '您可以尝试重置密码，或者检查账号是否正确。如果问题仍然存在，我们会为您创建工单并安排技术人员处理。',
        sender: 'service',
        timestamp: new Date('2026-01-29T10:02:00'),
      },
    ],
    '2': [
      {
        id: '1',
        content: '您好！欢迎使用智能客服系统，有什么可以帮助您的吗？',
        sender: 'service',
        timestamp: new Date('2026-01-29T09:30:00'),
      },
      {
        id: '2',
        content: '我们公司想了解一下产品的最新功能和定价',
        sender: 'customer',
        timestamp: new Date('2026-01-29T09:31:00'),
      },
      {
        id: '3',
        content: '非常感谢您的关注！我们最新版本增加了AI智能分析和自动化工作流功能，定价方面根据端口数量有所不同，您可以参考我们的官网或者联系销售获取详细方案。',
        sender: 'service',
        timestamp: new Date('2026-01-29T09:33:00'),
      },
    ],
    '3': [
      {
        id: '1',
        content: '您好！我是您的专属客服，有什么可以帮助您的吗？',
        sender: 'service',
        timestamp: new Date('2026-01-29T11:15:00'),
      },
      {
        id: '2',
        content: '我们需要安排一次产品使用培训，新入职了几位员工',
        sender: 'customer',
        timestamp: new Date('2026-01-29T11:16:00'),
      },
      {
        id: '3',
        content: '没问题！我们可以为您安排线上或线下培训，请问您希望在什么时间进行？大概有多少人参加？',
        sender: 'service',
        timestamp: new Date('2026-01-29T11:18:00'),
      },
    ],
    '4': [
      {
        id: '1',
        content: '您好！欢迎回来，有什么可以帮助您的吗？',
        sender: 'service',
        timestamp: new Date('2026-01-29T14:20:00'),
      },
      {
        id: '2',
        content: '我们的订阅快到期了，想了解一下续费的优惠政策',
        sender: 'customer',
        timestamp: new Date('2026-01-29T14:21:00'),
      },
      {
        id: '3',
        content: '感谢您的支持！我们为老客户提供续费优惠，根据您的订阅时长和端口数量，最高可享受8折优惠。我可以为您生成一个续费方案，请稍等。',
        sender: 'service',
        timestamp: new Date('2026-01-29T14:23:00'),
      },
    ],
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0]);
  const [messages, setMessages] = useState<Message[]>(customerMessages[selectedCustomer.id]);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [customerInitiatedTimes, setCustomerInitiatedTimes] = useState<Record<string, Date>>({
    '1': new Date(Date.now() - 1000 * 60 * 5), // 5分钟前
    '2': new Date(Date.now() - 1000 * 60 * 12), // 12分钟前
    '3': new Date(Date.now() - 1000 * 60 * 3), // 3分钟前
    '4': new Date(Date.now() - 1000 * 60 * 8), // 8分钟前
  });
  const [handoverModalVisible, setHandoverModalVisible] = useState(false);
  const [selectedHandoverPerson, setSelectedHandoverPerson] = useState<string>('');
  const [handoverReason, setHandoverReason] = useState<string>('');
  const [handoverPersons] = useState([
    { value: 'cs1', label: '客服A' },
    { value: 'cs2', label: '客服B' },
    { value: 'cs3', label: '客服C' },
    { value: 'cs4', label: '客服D' },
    { value: 'cs5', label: '客服E' },
  ]);
  
  // 客户咨询人角色状态
  const [customerRoles, setCustomerRoles] = useState<Record<string, string>>({
    '1': '老板',
    '2': '内勤',
    '3': '业务员',
    '4': '财务',
  });
  
  // 当前选中的客户角色
  const [currentCustomerRole, setCurrentCustomerRole] = useState<string>('老板');
  
  // 通知系统
  interface Notification {
    id: string;
    title: string;
    content: string;
    timestamp: Date;
    read: boolean;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '工单状态更新',
      content: '系统问题工单 #1 已被标记为处理中',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: '2',
      title: '新工单分配',
      content: '您有一个新的产品建议工单等待处理',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
    },
    {
      id: '3',
      title: '客户消息',
      content: '张三发送了一条新消息',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      read: true,
    },
  ]);
  
  const addNotification = (title: string, content: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      content,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // 显示通知弹窗
    notification.info({
      message: title,
      description: content,
      duration: 4.5,
    });
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  const [assignedTickets, setAssignedTickets] = useState<Array<{
    id: string;
    customerId: string;
    title: string;
    assignedTime: Date;
    deadline: Date;
  }>>([
    {
      id: '1',
      customerId: '1',
      title: '系统错误工单',
      assignedTime: new Date(),
      deadline: new Date(Date.now() + 1000 * 60 * 30), // 30分钟后
    },
    {
      id: '2',
      customerId: '3',
      title: '产品建议工单',
      assignedTime: new Date(),
      deadline: new Date(Date.now() + 1000 * 60 * 60), // 1小时后
    },
  ]);
  
  // 培训记录数据
  const [trainingRecords, setTrainingRecords] = useState<Array<{
    id: string;
    customerId: string;
    title: string;
    trainer: string;
    trainingDate: Date;
    trainingType: '线上' | '线下';
    duration: number; // 小时
    participants: number;
    status: '已完成' | '待进行' | '进行中';
  }>>([
    {
      id: '1',
      customerId: '1',
      title: '系统基础操作培训',
      trainer: '培训师A',
      trainingDate: new Date('2026-01-15'),
      trainingType: '线上',
      duration: 2,
      participants: 5,
      status: '已完成',
    },
    {
      id: '2',
      customerId: '1',
      title: '高级功能使用培训',
      trainer: '培训师B',
      trainingDate: new Date('2026-02-10'),
      trainingType: '线下',
      duration: 4,
      participants: 8,
      status: '待进行',
    },
    {
      id: '3',
      customerId: '3',
      title: '新员工入职培训',
      trainer: '培训师A',
      trainingDate: new Date('2026-01-20'),
      trainingType: '线上',
      duration: 3,
      participants: 6,
      status: '已完成',
    },
    {
      id: '4',
      customerId: '4',
      title: '系统操作培训',
      trainer: '培训师C',
      trainingDate: new Date('2026-01-25'),
      trainingType: '线上',
      duration: 2,
      participants: 4,
      status: '进行中',
    },
  ]);
  
  // 培训记录填写状态
  const [trainingFormVisible, setTrainingFormVisible] = useState(false);
  const [newTrainingRecord, setNewTrainingRecord] = useState({
    title: '',
    trainer: '',
    trainingDate: new Date(),
    trainingType: '线上' as '线上' | '线下',
    duration: 2,
    participants: 5,
    status: '待进行' as '已完成' | '待进行' | '进行中',
  });
  
  // 会话小结弹窗状态
  const [sessionSummaryVisible, setSessionSummaryVisible] = useState(false);
  const [completedTickets, setCompletedTickets] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const [searchKeyword, setSearchKeyword] = useState('');

  // 计算高亮客户数
  const getHighlightedCustomersCount = () => {
    return customers.filter(customer => {
      const initiatedTime = customerInitiatedTimes[customer.id] || new Date();
      const timeSinceInitiated = Date.now() - initiatedTime.getTime();
      const hasOver5MinutesNoResponse = timeSinceInitiated > 1000 * 60 * 5;
      const customerAssignedTickets = assignedTickets.filter(ticket => ticket.customerId === customer.id);
      const hasTicketLessThan30Minutes = customerAssignedTickets.some(ticket => {
        const timeLeftSec = timeLeft[ticket.id] || 0;
        return timeLeftSec < 1000 * 60 * 30;
      });
      return hasOver5MinutesNoResponse || hasTicketLessThan30Minutes;
    }).length;
  };

  // 计算客户重要性级别
  const getCustomerImportanceLevel = (customer: Customer) => {
    const initiatedTime = customerInitiatedTimes[customer.id] || new Date();
    const timeSinceInitiated = Date.now() - initiatedTime.getTime();
    const hasOver5MinutesNoResponse = timeSinceInitiated > 1000 * 60 * 5;
    const customerAssignedTickets = assignedTickets.filter(ticket => ticket.customerId === customer.id);
    const hasTicketLessThan30Minutes = customerAssignedTickets.some(ticket => {
      const timeLeftSec = timeLeft[ticket.id] || 0;
      return timeLeftSec < 1000 * 60 * 30;
    });
    
    // 重要性级别计算
    if (hasOver5MinutesNoResponse || hasTicketLessThan30Minutes || customer.complaintCount > 3) {
      return 'high'; // 高重要性
    } else if (customer.purchasePort > 10 || customer.customerType === 'KA') {
      return 'medium'; // 中等重要性
    } else {
      return 'low'; // 低重要性
    }
  };

  // 根据重要性级别获取背景色
  const getImportanceBackgroundColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#fff1f0'; // 红色背景
      case 'medium':
        return '#f6ffed'; // 绿色背景
      case 'low':
      default:
        return '#ffffff'; // 白色背景
    }
  };

  // 当选中客户变化时，更新消息列表和当前角色
  useEffect(() => {
    setMessages(customerMessages[selectedCustomer.id] || []);
    setCurrentCustomerRole(customerRoles[selectedCustomer.id] || '老板');
  }, [selectedCustomer, customerMessages, customerRoles]);

  // 计算剩余处理时间
  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft: Record<string, number> = {};
      assignedTickets.forEach(ticket => {
        const now = new Date();
        const timeLeftMs = ticket.deadline.getTime() - now.getTime();
        newTimeLeft[ticket.id] = Math.max(0, Math.floor(timeLeftMs / 1000));
      });
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [assignedTickets]);

  // 格式化时间为分:秒
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算时间差并格式化为分:秒
  const getTimeSinceInMinutesSeconds = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    return formatTime(diffSeconds);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'service',
      timestamp: new Date(),
    };
    
    // 更新当前消息列表
    setMessages([...messages, newMessage]);
    
    // 更新对应客户的消息记录
    setCustomerMessages(prev => ({
      ...prev,
      [selectedCustomer.id]: [...(prev[selectedCustomer.id] || []), newMessage],
    }));
    
    setInputValue('');

    // 模拟客户回复
    setTimeout(() => {
      const customerReply: Message = {
        id: (Date.now() + 1).toString(),
        content: '好的，我明白了，谢谢！',
        sender: 'customer',
        timestamp: new Date(),
      };
      
      // 更新当前消息列表
      setMessages(prev => [...prev, customerReply]);
      
      // 更新对应客户的消息记录
      setCustomerMessages(prev => ({
        ...prev,
        [selectedCustomer.id]: [...(prev[selectedCustomer.id] || []), customerReply],
      }));
    }, 2000);
  };

  const handleHandoverClick = () => {
    setHandoverModalVisible(true);
  };

  const handleSaveHandover = () => {
    if (!selectedHandoverPerson) {
      message.error('请选择交接人员');
      return;
    }
    if (!handoverReason) {
      message.error('请填写交接原因');
      return;
    }
    
    // 模拟交接请求发送
    message.success(`已发送交接请求给${handoverPersons.find(p => p.value === selectedHandoverPerson)?.label}，等待对方同意`);
    setHandoverModalVisible(false);
    setSelectedHandoverPerson('');
    setHandoverReason('');
  };

  const handleSaveTraining = () => {
    if (!newTrainingRecord.title.trim()) {
      message.error('请填写培训记录标题');
      return;
    }
    
    // 保存培训记录
    setTrainingRecords(prev => [...prev, {
      id: Date.now().toString(),
      customerId: selectedCustomer.id,
      title: newTrainingRecord.title,
      trainer: newTrainingRecord.trainer,
      trainingDate: newTrainingRecord.trainingDate,
      trainingType: newTrainingRecord.trainingType,
      duration: newTrainingRecord.duration,
      participants: newTrainingRecord.participants,
      status: newTrainingRecord.status,
    }]);
    
    // 创建培训工单
    if (setTickets) {
      setTickets(prev => [...prev, {
        id: Date.now().toString(),
        title: `培训实施：${newTrainingRecord.title}`,
        content: `客户：${selectedCustomer.name}\n培训标题：${newTrainingRecord.title}\n培训类型：${newTrainingRecord.trainingType}\n培训日期：${newTrainingRecord.trainingDate.toLocaleDateString()}\n培训时长：${newTrainingRecord.duration}小时\n参与人数：${newTrainingRecord.participants}人\n培训状态：${newTrainingRecord.status}`,
        customerName: selectedCustomer.name,
        customerEmail: selectedCustomer.email || 'customer@example.com',
        status: 'open',
        type: 'training_implementation',
        createdTime: new Date(),
        updatedTime: new Date(),
        lastProcessor: '当前客服',
        lastProcessTime: new Date(),
      }]);
    }
    
    message.success(`培训记录已保存：${selectedCustomer.name}`);
    setTrainingFormVisible(false);
    setNewTrainingRecord({
      title: '',
      trainer: '',
      trainingDate: new Date(),
      trainingType: '线上',
      duration: 2,
      participants: 5,
      status: '待进行',
    });
  };

  const handleFinishSession = () => {
    // 打开会话小结弹窗
    setCompletedTickets([]);
    setSessionNotes('');
    setSessionSummaryVisible(true);
  };
  
  const handleSaveSessionSummary = () => {
    // 保存会话小结
    if (setTickets) {
      // 更新选中的工单状态为已完成
      setTickets(prev => prev.map(ticket => {
        if (completedTickets.includes(ticket.id)) {
          return {
            ...ticket,
            status: 'resolved' as const,
            updatedTime: new Date(),
            lastProcessTime: new Date(),
          };
        }
        return ticket;
      }));
    }
    
    // 发送会话小结消息
    sendBotMessage(`感谢您的咨询，以下是本次会话的小结：\n\n${sessionNotes || '1. 处理了客户的问题\n2. 提供了相应的解决方案'}\n\n请问客户的问题是否得到解决？`);
    
    // 关闭弹窗
    setSessionSummaryVisible(false);
  };

  const sendBotMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content: content,
      sender: 'service' as const,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setCustomerMessages(prev => ({
      ...prev,
      [selectedCustomer.id]: [...(prev[selectedCustomer.id] || []), newMessage],
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左侧菜单 - 可收起展开 */}
        <div style={{ 
          width: menuCollapsed ? 48 : 200, 
          backgroundColor: '#f0f2f5', 
          borderRight: '1px solid #e8e8e8', 
          padding: menuCollapsed ? 8 : 16, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* 菜单展开/收起按钮 */}
          <Button 
            type="text" 
            icon={menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            style={{ marginBottom: menuCollapsed ? 16 : 24 }}
          />
          
          {/* 智能客服按钮 */}
          {!menuCollapsed && (
            <div style={{ marginBottom: 24, width: '100%' }}>
              <Button 
                type={selectedMenu === 'chat' ? 'primary' : 'default'} 
                style={{ width: '100%', position: 'relative' }} 
                onClick={() => setSelectedMenu('chat')}
              >
                智能客服
                <span style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-8px', 
                  backgroundColor: '#ff4d4f', 
                  color: 'white', 
                  borderRadius: '10px', 
                  width: '20px', 
                  height: '20px', 
                  fontSize: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  {getHighlightedCustomersCount()}
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* 右侧内容区域 */}
        <div style={{ flex: 1, padding: '10px 10px 80px 20px', overflow: 'auto' }}>
          {selectedMenu === 'chat' && (
            <div style={{ display: 'flex', gap: 16, height: '100%', flexWrap: 'wrap' }}>
              {/* 左侧客户列表区域 */}
              <div style={{ width: '200px', minWidth: '200px', border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: '#333' }}>客户列表</h4>
                  <span style={{ fontSize: 12, color: '#999' }}>共 {customers.length} 个</span>
                </div>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
                  <Input 
                    placeholder="搜索客户名称" 
                    size="small" 
                    style={{ width: '100%' }}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
                  <List
                    size="small"
                    dataSource={customers.filter(customer => 
                      customer.name.toLowerCase().includes(searchKeyword.toLowerCase())
                    ).sort((a, b) => {
                      // 优先显示有人工接入的客户
                      const aHasTicket = assignedTickets.some(t => t.customerId === a.id);
                      const bHasTicket = assignedTickets.some(t => t.customerId === b.id);
                      if (aHasTicket && !bHasTicket) return -1;
                      if (!aHasTicket && bHasTicket) return 1;
                      // 按照接入时间正序显示
                      const aTime = customerInitiatedTimes[a.id] || new Date();
                      const bTime = customerInitiatedTimes[b.id] || new Date();
                      return aTime.getTime() - bTime.getTime();
                    })}
                    renderItem={customer => {
                      // 检查是否有分配的工单
                      const customerAssignedTickets = assignedTickets.filter(ticket => ticket.customerId === customer.id);
                      // 检查是否需要高亮
                      const initiatedTime = customerInitiatedTimes[customer.id] || new Date();
                      const timeSinceInitiated = Date.now() - initiatedTime.getTime();
                      const hasOver5MinutesNoResponse = timeSinceInitiated > 1000 * 60 * 5;
                      const hasTicketLessThan30Minutes = customerAssignedTickets.some(ticket => {
                        const timeLeftSec = timeLeft[ticket.id] || 0;
                        return timeLeftSec < 1000 * 60 * 30;
                      });
                      const needHighlight = hasOver5MinutesNoResponse || hasTicketLessThan30Minutes;
                      
                      return (
                        <List.Item 
                          style={{ 
                            cursor: 'pointer', 
                            marginBottom: 8, 
                            borderRadius: 4, 
                            padding: '10px 8px',
                            backgroundColor: selectedCustomer.id === customer.id ? '#f0f8ff' : getImportanceBackgroundColor(getCustomerImportanceLevel(customer)),
                            color: '#333',
                            border: selectedCustomer.id === customer.id ? '1px solid #1890ff' : (needHighlight ? '1px solid #faad14' : '1px solid #f0f0f0'),
                            boxShadow: needHighlight ? '0 2px 8px rgba(250, 173, 20, 0.1)' : 'none'
                          }}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <List.Item.Meta
                            title={
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 13 }}>{customer.name}</span>
                                {customerAssignedTickets.length > 0 && (
                                  <Badge count={customerAssignedTickets.length} style={{ backgroundColor: '#1890ff', fontSize: 10 }} />
                                )}
                              </div>
                            }
                            description={
                              <div>
                                <div style={{ fontSize: 11, color: '#666', marginBottom: 3 }}>
                                  {customer.所在地区.split('市')[0]} · 
                                  <span style={{ color: '#1890ff' }}>
                                    {customerRoles[customer.id] || '未知'}
                                  </span>
                                </div>
                                <div style={{ fontSize: 10, color: hasOver5MinutesNoResponse ? '#ff4d4f' : '#999' }}>
                                  接入: {getTimeSinceInMinutesSeconds(initiatedTime)}
                                </div>
                                {customerAssignedTickets.length > 0 && (
                                  <div style={{ fontSize: 10, color: '#ff4d4f', marginTop: 3 }}>
                                    {customerAssignedTickets.map(ticket => (
                                      <div key={ticket.id} style={{ color: (timeLeft[ticket.id] || 0) < 1000 * 60 * 30 ? '#ff4d4f' : '#ff4d4f', fontSize: 9 }}>
                                        {ticket.title} - 剩余: {formatTime(timeLeft[ticket.id] || 0)}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            }
                          />
                          <Badge 
                            status={customer.status === 'active' ? 'success' : customer.status === 'expiring' ? 'warning' : 'error'} 
                            text={customer.status === 'active' ? '活跃' : customer.status === 'expiring' ? '即将到期' : '已过期'} 
                            style={{ fontSize: 9 }}
                          />
                        </List.Item>
                      );
                    }}
                  />
                </div>
              </div>
              
              {/* 中间聊天区域 - 优先占用剩余空间 */}
              <div style={{ flex: 1, minWidth: '300px', border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ padding: 10, borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#333' }}>
                  <h4 style={{ margin: 0, fontSize: 14, color: '#333' }}>智能客服 - {selectedCustomer.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Select
                      style={{ width: 120, fontSize: 12 }}
                      defaultValue="老板"
                      value={currentCustomerRole}
                      onChange={(value) => {
                        setCurrentCustomerRole(value);
                        setCustomerRoles(prev => ({
                          ...prev,
                          [selectedCustomer.id]: value
                        }));
                      }}
                      options={[
                        { value: '老板', label: '老板' },
                        { value: '内勤', label: '内勤' },
                        { value: '业务员', label: '业务员' },
                        { value: '财务', label: '财务' },
                      ]}
                      size="small"
                    />
                  </div>
                </div>
                {/* 轮播消息通知 */}
                {notifications.length > 0 && (
                  <div style={{ 
                    backgroundColor: '#f0f8ff', 
                    borderBottom: '1px solid #e8e8e8', 
                    padding: '6px 12px',
                    overflow: 'hidden',
                    position: 'relative',
                    fontSize: 12
                  }}>
                    <div 
                      style={{ 
                        display: 'flex',
                        animation: 'marquee 15s linear infinite',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {notifications.map(notification => (
                        <span key={notification.id} style={{ marginRight: '20px', color: '#1890ff' }}>
                          {notification.title}: {notification.content}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="chat-messages" style={{ flex: 1, overflow: 'auto', padding: 12, borderBottom: '1px solid #e8e8e8', minHeight: 0 }}>
                  {messages.map(message => (
                    <div key={message.id} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: message.sender === 'customer' ? 'flex-start' : 'flex-end' }}>
                      <div style={{ 
                        maxWidth: '70%', 
                        padding: '10px 14px', 
                        borderRadius: '16px', 
                        wordWrap: 'break-word',
                        backgroundColor: message.sender === 'customer' ? '#f0f0f0' : '#1890ff',
                        color: message.sender === 'customer' ? '#333' : 'white',
                        borderBottomRightRadius: message.sender === 'customer' ? '16px' : '4px',
                        borderBottomLeftRadius: message.sender === 'customer' ? '4px' : '16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        fontSize: 13
                      }}>{message.content}</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 4, marginLeft: message.sender === 'customer' ? '10px' : 0, marginRight: message.sender === 'customer' ? 0 : '10px' }}>
                        {message.sender === 'customer' ? '客户' : '客服'} · {message.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {/* 问题解决反馈按钮 */}
                  {messages.length > 0 && messages[messages.length - 1].content.includes('请问客户的问题是否得到解决？') && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, padding: 12, borderTop: '1px solid #f0f0f0' }}>
                      <Button 
                        type="default" 
                        size="small"
                        onClick={() => {
                          sendBotMessage('感谢您的反馈，很高兴能够帮到您！');
                          setTimeout(() => {
                            sendBotMessage('请对本次服务进行评价：\n1. 满意\n2. 一般\n3. 不满意');
                          }, 1000);
                        }}
                      >
                        👍 问题已解决
                      </Button>
                      <Button 
                        type="default" 
                        size="small"
                        onClick={() => {
                          sendBotMessage('感谢您的反馈，我们会继续努力改进服务质量。');
                          setTimeout(() => {
                            sendBotMessage('请对本次服务进行评价：\n1. 满意\n2. 一般\n3. 不满意');
                          }, 1000);
                        }}
                      >
                        👎 问题未解决
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* 问题类型按钮 */}
                <div style={{ padding: '6px 12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => {
                      // 变更主账号工单
                      setInputValue('客户需要变更主账号');
                      if (setTickets) {
                        setTickets(prev => [...prev, {
                          id: Date.now().toString(),
                          title: '变更主账号',
                          content: `客户：${selectedCustomer.name}\n需求：变更主账号`,
                          customerName: selectedCustomer.name,
                          customerEmail: selectedCustomer.email || 'customer@example.com',
                          status: 'open',
                          type: 'system_issue',
                          createdTime: new Date(),
                          updatedTime: new Date(),
                          lastProcessor: '',
                          lastProcessTime: new Date(),
                        }]);
                      }
                    }}
                  >
                    变更主账号
                  </Button>
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => {
                      // 版本升级工单
                      setInputValue('客户需要版本升级');
                      if (setTickets) {
                        setTickets(prev => [...prev, {
                          id: Date.now().toString(),
                          title: '版本升级',
                          content: `客户：${selectedCustomer.name}\n需求：版本升级`,
                          customerName: selectedCustomer.name,
                          customerEmail: selectedCustomer.email || 'customer@example.com',
                          status: 'open',
                          type: 'product_suggestion',
                          createdTime: new Date(),
                          updatedTime: new Date(),
                          lastProcessor: '',
                          lastProcessTime: new Date(),
                        }]);
                      }
                    }}
                  >
                    版本升级
                  </Button>
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => {
                      // 培训实施工单
                      setInputValue('客户需要培训实施');
                      if (setTickets) {
                        setTickets(prev => [...prev, {
                          id: Date.now().toString(),
                          title: '培训实施',
                          content: `客户：${selectedCustomer.name}\n需求：培训实施`,
                          customerName: selectedCustomer.name,
                          customerEmail: selectedCustomer.email || 'customer@example.com',
                          status: 'open',
                          type: 'training_implementation',
                          createdTime: new Date(),
                          updatedTime: new Date(),
                          lastProcessor: '',
                          lastProcessTime: new Date(),
                        }]);
                      }
                    }}
                  >
                    培训实施
                  </Button>
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => {
                      // 系统问题工单
                      setInputValue('客户遇到系统问题');
                      if (setTickets) {
                        setTickets(prev => [...prev, {
                          id: Date.now().toString(),
                          title: '系统问题',
                          content: `客户：${selectedCustomer.name}\n需求：系统问题`,
                          customerName: selectedCustomer.name,
                          customerEmail: selectedCustomer.email || 'customer@example.com',
                          status: 'open',
                          type: 'system_issue',
                          createdTime: new Date(),
                          updatedTime: new Date(),
                          lastProcessor: '',
                          lastProcessTime: new Date(),
                        }]);
                      }
                    }}
                  >
                    系统问题
                  </Button>
                  <Button 
                    type="primary" 
                    size="small" 
                    onClick={() => {
                      // 产品建议工单
                      setInputValue('客户有产品建议');
                      if (setTickets) {
                        setTickets(prev => [...prev, {
                          id: Date.now().toString(),
                          title: '产品建议',
                          content: `客户：${selectedCustomer.name}\n需求：产品建议`,
                          customerName: selectedCustomer.name,
                          customerEmail: selectedCustomer.email || 'customer@example.com',
                          status: 'open',
                          type: 'product_suggestion',
                          createdTime: new Date(),
                          updatedTime: new Date(),
                          lastProcessor: '',
                          lastProcessTime: new Date(),
                        }]);
                      }
                    }}
                  >
                    产品建议
                  </Button>
                </div>
                
                {/* 输入区域 - 确保完整显示 */}
                <div className="chat-input" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6, height: 100, flexShrink: 0 }}>
                  {/* 输入框单独一行 - 自适应高度 */}
                  <Input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="请输入回复..."
                    onPressEnter={handleSendMessage}
                    style={{ width: '100%', flexShrink: 0 }}
                    size="small"
                  />
                  {/* 按钮区域单独一行 - 确保按钮不换行 */}
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexShrink: 0 }}>
                    <Button type="primary" size="small" onClick={handleSendMessage}>
                      发送
                    </Button>
                    <Button type="default" size="small" onClick={handleHandoverClick}>
                      交接
                    </Button>
                    <Button type="default" size="small" onClick={handleFinishSession}>
                      完结会话
                    </Button>
                  </div>
                </div>
              </div>

              {/* 右侧客户信息区域 - 可折叠或自适应宽度 */}
              <div style={{ width: '260px', minWidth: '260px', border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                {/* 客户基本信息 */}
                <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8', backgroundColor: getImportanceBackgroundColor(getCustomerImportanceLevel(selectedCustomer)), color: getImportanceBackgroundColor(getCustomerImportanceLevel(selectedCustomer)) === '#ffffff' ? '#333' : '#333' }}>
                  <div style={{ marginBottom: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>客户名称:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.name}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>所在地区:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.所在地区.split('区')[0]}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: '11px' }}>客户类型:</strong>
                      <Tag color={selectedCustomer.customerType === 'KA' ? 'blue' : 'orange'} size="small" style={{ fontSize: '10px' }}>
                        {selectedCustomer.customerType === 'KA' ? 'KA' : '非KA'}
                      </Tag>
                    </p>
                    {selectedCustomer.customerType === 'KA' && selectedCustomer.manufacturers.length > 0 && (
                      <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>合作厂家:</strong> <span style={{ fontSize: '10px' }}>{selectedCustomer.manufacturers.join('、')}</span></p>
                    )}
                    <p style={{ margin: '2px 0', gridColumn: '1 / -1', fontSize: '12px' }}>
                      <strong style={{ fontSize: '11px' }}>客户主账号:</strong> 
                      <span 
                        onClick={() => setPhoneVisible(!phoneVisible)}
                        style={{ cursor: 'pointer', color: '#1890ff', fontSize: '11px' }}
                      >
                        {phoneVisible 
                          ? selectedCustomer.phone 
                          : selectedCustomer.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                        }
                      </span>
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>到期时间:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.nextBillingDate.toLocaleDateString()}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>购买端口:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.purchasePort} 个</span></p>
                    {selectedCustomer.plan === '专业版' ? (
                      <p style={{ margin: '2px 0', fontSize: '12px', gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: '11px' }}>软件版本:</strong>
                        <Tag color="blue" size="small" style={{ fontSize: '10px' }}>
                          {selectedCustomer.plan}
                        </Tag>
                        {selectedCustomer.remainingPoints !== undefined && (
                          <Button 
                            type="link" 
                            size="small" 
                            onClick={() => {
                              message.info(`客户剩余点数: ${selectedCustomer.remainingPoints}`);
                            }}
                            style={{ padding: 0, fontSize: '10px' }}
                          >
                            查看剩余点数
                          </Button>
                        )}
                      </p>
                    ) : (
                      <p style={{ margin: '2px 0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: '11px' }}>软件版本:</strong>
                        <Tag color={
                          selectedCustomer.plan === '行业版' ? 'green' :
                          selectedCustomer.plan === '订阅版' ? 'orange' :
                          'purple'
                        } size="small" style={{ fontSize: '10px' }}>
                          {selectedCustomer.plan}
                        </Tag>
                      </p>
                    )}
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>最后活跃:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.lastActiveTime.toLocaleDateString()}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>投诉次数:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.complaintCount} 次</span></p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>归属类型:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.归属类型}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>归属人:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.归属人}</span></p>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>客户标签:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 3 }}>
                      {selectedCustomer.tags.map((tag, index) => {
                        const colors = ['blue', 'green', 'orange', 'purple', 'red', 'cyan', 'magenta', 'lime'];
                        const color = colors[index % colors.length];
                        return <Tag key={index} color={color} size="small" style={{ fontSize: '10px' }}>{tag}</Tag>;
                      })}
                    </div>
                  </div>
                  
                  {/* 购买增值产品 */}
                  <div style={{ marginBottom: 10 }}>
                    <p style={{ margin: '2px 0 6px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>购买增值产品:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {selectedCustomer.valueAddedModules.map((module, index) => (
                        <Tag key={index} color="blue" size="small" style={{ fontSize: '10px' }}>
                          {module}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 历史工单 */}
                <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8', color: '#333' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#333' }}>历史工单</h4>
                  <div style={{ maxHeight: 180, overflow: 'auto' }}>
                    {tickets.filter(t => t.customerName === selectedCustomer.name).slice(0, 3).map(ticket => (
                      <div key={ticket.id} style={{ marginBottom: 10, padding: 10, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                          <strong style={{ fontSize: 12 }}>{ticket.title}</strong>
                          <Tag size="small" color={
                            ticket.type === 'system_issue' ? 'red' :
                            ticket.type === 'product_suggestion' ? 'green' :
                            ticket.type === 'training_implementation' ? 'blue' :
                            ticket.type === 'renewal_question' ? 'orange' :
                            ticket.type === 'issue_escalation' ? 'purple' :
                            'magenta'
                          } style={{ fontSize: 9 }}>
                            {
                              ticket.type === 'system_issue' ? '系统问题' :
                              ticket.type === 'product_suggestion' ? '产品建议' :
                              ticket.type === 'training_implementation' ? '培训实施' :
                              ticket.type === 'renewal_question' ? '续费疑问' :
                              ticket.type === 'issue_escalation' ? '问题升级' :
                              '投诉'
                            }
                          </Tag>
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 3 }}>
                          创建时间: {ticket.createdTime.toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: 11, color: '#999' }}>
                          状态: {ticket.status === 'open' ? '待处理' : ticket.status === 'processing' ? '处理中' : '已解决'}
                        </div>
                      </div>
                    ))}
                    {tickets.filter(t => t.customerName === selectedCustomer.name).length === 0 && (
                      <div style={{ textAlign: 'center', color: '#999', padding: 16 }}>
                        <span style={{ fontSize: 12 }}>暂无历史工单</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 培训记录 */}
                <div style={{ padding: 12, flex: 1, overflow: 'hidden', color: '#333' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#333' }}>培训记录</h4>
                  {/* 培训记录填写按钮 */}
                  {tickets.some(t => t.customerName === selectedCustomer.name && t.type === 'training_implementation') && (
                    <Button 
                      type="primary" 
                      size="small" 
                      onClick={() => setTrainingFormVisible(true)}
                      style={{ marginBottom: 10, width: '100%', fontSize: 11 }}
                    >
                      填写培训记录
                    </Button>
                  )}
                  <div style={{ maxHeight: 180, overflow: 'auto' }}>
                    {trainingRecords.filter(tr => tr.customerId === selectedCustomer.id).slice(0, 3).map(record => (
                      <div key={record.id} style={{ marginBottom: 10, padding: 10, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                          <strong style={{ fontSize: 12 }}>{record.title}</strong>
                          <Tag size="small" color={
                            record.status === '已完成' ? 'green' :
                            record.status === '待进行' ? 'orange' :
                            'blue'
                          } style={{ fontSize: 9 }}>
                            {record.status}
                          </Tag>
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                          培训日期: {record.trainingDate.toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                          培训类型: {record.trainingType} · 时长: {record.duration}小时
                        </div>
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                          培训师: {record.trainer} · 参与人数: {record.participants}人
                        </div>
                      </div>
                    ))}
                    {trainingRecords.filter(tr => tr.customerId === selectedCustomer.id).length === 0 && (
                      <div style={{ textAlign: 'center', color: '#999', padding: 16 }}>
                        <span style={{ fontSize: 12 }}>暂无培训记录</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 交接弹窗 */}
      <Modal
        title={`交接客户 - ${selectedCustomer.name}`}
        open={handoverModalVisible}
        footer={[
          <Button key="cancel" onClick={() => setHandoverModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveHandover}>
            发送交接请求
          </Button>,
        ]}
        onCancel={() => setHandoverModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>选择交接人员:</strong></p>
          <Select
            style={{ width: '100%', marginBottom: 16 }}
            placeholder="请选择交接人员"
            value={selectedHandoverPerson}
            onChange={setSelectedHandoverPerson}
            options={handoverPersons}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>交接原因:</strong></p>
          <TextArea
            rows={4}
            placeholder="请填写交接原因，包括当前处理情况和需要注意的事项"
            value={handoverReason}
            onChange={e => setHandoverReason(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#999' }}>
            提示：交接请求发送后，对方需要同意才能完成交接
          </p>
        </div>
      </Modal>
      
      {/* 培训记录填写弹窗 */}
      <Modal
        title={`填写培训记录 - ${selectedCustomer.name}`}
        open={trainingFormVisible}
        footer={[
          <Button key="cancel" onClick={() => setTrainingFormVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveTraining}>
            保存记录
          </Button>,
        ]}
        onCancel={() => setTrainingFormVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>培训标题:</strong></p>
          <Input
            style={{ width: '100%', marginBottom: 12 }}
            value={newTrainingRecord.title}
            onChange={e => setNewTrainingRecord(prev => ({ ...prev, title: e.target.value }))}
            placeholder="请输入培训标题"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>培训师:</strong></p>
          <Input
            style={{ width: '100%', marginBottom: 12 }}
            value={newTrainingRecord.trainer}
            onChange={e => setNewTrainingRecord(prev => ({ ...prev, trainer: e.target.value }))}
            placeholder="请输入培训师姓名"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>培训日期:</strong></p>
          <Input
            type="date"
            style={{ width: '100%', marginBottom: 12 }}
            value={newTrainingRecord.trainingDate.toISOString().split('T')[0]}
            onChange={e => setNewTrainingRecord(prev => ({ ...prev, trainingDate: new Date(e.target.value) }))}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>培训类型:</strong></p>
          <Select
            style={{ width: '100%', marginBottom: 12 }}
            value={newTrainingRecord.trainingType}
            onChange={(value) => setNewTrainingRecord(prev => ({ ...prev, trainingType: value }))}
            options={[
              { value: '线上', label: '线上' },
              { value: '线下', label: '线下' },
            ]}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>培训时长 (小时):</strong></p>
          <Input
            type="number"
            min={1}
            style={{ width: '100%', marginBottom: 12 }}
            value={newTrainingRecord.duration}
            onChange={e => setNewTrainingRecord(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
            placeholder="请输入培训时长"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>参与人数:</strong></p>
          <Input
            type="number"
            min={1}
            style={{ width: '100%', marginBottom: 12 }}
            value={newTrainingRecord.participants}
            onChange={e => setNewTrainingRecord(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
            placeholder="请输入参与人数"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>培训状态:</strong></p>
          <Select
            style={{ width: '100%', marginBottom: 12 }}
            value={newTrainingRecord.status}
            onChange={(value) => setNewTrainingRecord(prev => ({ ...prev, status: value }))}
            options={[
              { value: '待进行', label: '待进行' },
              { value: '进行中', label: '进行中' },
              { value: '已完成', label: '已完成' },
            ]}
          />
        </div>
      </Modal>
      
      {/* 会话小结弹窗 */}
      <Modal
        title={`会话小结 - ${selectedCustomer.name}`}
        open={sessionSummaryVisible}
        footer={[
          <Button key="cancel" onClick={() => setSessionSummaryVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveSessionSummary}>
            确认完结
          </Button>,
        ]}
        onCancel={() => setSessionSummaryVisible(false)}
        width={600}
      >
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ margin: '0 0 16px 0' }}>本次沟通记录</h4>
          <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #f0f0f0', borderRadius: 4, padding: 12, marginBottom: 16 }}>
            {messages.slice(-5).map(message => (
              <div key={message.id} style={{ marginBottom: 8, padding: 8, backgroundColor: message.sender === 'customer' ? '#f9f9f9' : '#f0f8ff', borderRadius: 4 }}>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>
                  {message.sender === 'customer' ? '客户' : '客服'} · {message.timestamp.toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: '#333' }}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16, color: '#333' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>会话小结</h4>
            <TextArea
              rows={4}
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              placeholder="请输入本次会话的小结内容，包括解决的问题、提供的方案等"
              style={{ resize: 'none', color: '#333' }}
            />
          </div>
          <div style={{ color: '#333' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>完成的工单</h4>
            <div style={{ maxHeight: 150, overflow: 'auto', border: '1px solid #f0f0f0', borderRadius: 4, padding: 8, color: '#333' }}>
              {tickets.filter(t => t.customerName === selectedCustomer.name && t.status !== 'resolved').map(ticket => (
                <div key={ticket.id} style={{ marginBottom: 8, padding: 8, border: '1px solid #f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#333' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 'bold', marginBottom: 4, color: '#333' }}>{ticket.title}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      类型: {ticket.type === 'system_issue' ? '系统问题' :
                           ticket.type === 'product_suggestion' ? '产品建议' :
                           ticket.type === 'training_implementation' ? '培训实施' :
                           ticket.type === 'renewal_question' ? '续费疑问' :
                           ticket.type === 'issue_escalation' ? '问题升级' :
                           '投诉'}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={completedTickets.includes(ticket.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCompletedTickets([...completedTickets, ticket.id]);
                      } else {
                        setCompletedTickets(completedTickets.filter(id => id !== ticket.id));
                      }
                    }}
                  />
                </div>
              ))}
              {tickets.filter(t => t.customerName === selectedCustomer.name && t.status !== 'resolved').length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: 16 }}>
                  暂无待完成的工单
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerServiceView;
