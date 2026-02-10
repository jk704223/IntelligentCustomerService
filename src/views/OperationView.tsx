import React, { useState, useEffect } from 'react';
import { Button, Card, List, Badge, Input, Select, Tag, Modal, message, Popover, notification } from 'antd';
import { MessageOutlined, PhoneOutlined, BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

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
  type: 'system_issue' | 'product_suggestion' | 'training_implementation' | 'renewal_question' | 'issue_escalation' | 'complaint' | 'price_approval';
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
  followUpStatus: '初步建联' | '方案报价' | '价格协商' | '成功签约' | '客户流失';
  isCurrentRenewal: boolean;
  归属类型: '公司' | '服务商';
  归属人: string;
  所在地区: string;
  assignedTo: string;
  renewalAmount: number;
  customerType: 'KA' | 'non-KA';
  manufacturers: string[];
  remainingPoints?: number;
  valueAddedModules: string[];
  isUrgent: boolean; // 紧急客户标识
}

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'service';
  timestamp: Date;
}

interface OperationViewProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const OperationView: React.FC<OperationViewProps> = ({ tickets, setTickets }) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('chat');
  const [inputValue, setInputValue] = useState('');
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(true); // 默认收起菜单

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13812345678',
      plan: '订阅版',
      nextBillingDate: new Date('2026-01-30'),
      status: 'expiring',
      purchasePort: 100,
      lastActiveTime: new Date('2026-01-29T10:00:00'),
      complaintCount: 2,
      tags: ['重要客户', '技术导向', '高价值'],
      followUpStatus: '方案报价',
      isCurrentRenewal: true,
      归属类型: '公司',
      归属人: '销售小王',
      所在地区: '北京市朝阳区',
      assignedTo: '运营A',
      renewalAmount: 89900,
      customerType: 'KA',
      manufacturers: ['农夫', '雪花'],
      valueAddedModules: ['小程序', '勤商', '多组织核算'],
      isUrgent: true, // 紧急客户
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      phone: '13987654321',
      plan: '行业版',
      nextBillingDate: new Date('2026-02-05'),
      status: 'expiring',
      purchasePort: 50,
      lastActiveTime: new Date('2026-01-28T15:30:00'),
      complaintCount: 1,
      tags: ['成长型', '价格敏感'],
      followUpStatus: '价格协商',
      isCurrentRenewal: true,
      归属类型: '服务商',
      归属人: '服务商A',
      所在地区: '上海市浦东新区',
      assignedTo: '运营A',
      renewalAmount: 44950,
      customerType: 'non-KA',
      manufacturers: [],
      valueAddedModules: ['小程序', '返利'],
      isUrgent: false,
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      phone: '13711223344',
      plan: '专业版',
      nextBillingDate: new Date('2026-02-10'),
      status: 'active',
      purchasePort: 20,
      lastActiveTime: new Date('2026-01-27T09:15:00'),
      complaintCount: 0,
      tags: ['新客户', '潜力客户'],
      followUpStatus: '初步建联',
      isCurrentRenewal: true,
      归属类型: '公司',
      归属人: '销售小李',
      所在地区: '广州市天河区',
      assignedTo: '运营A',
      renewalAmount: 17980,
      customerType: 'KA',
      manufacturers: ['大窑', '新希望'],
      remainingPoints: 150,
      valueAddedModules: ['小程序', '勤商', '现金牛', 'WMS'],
      isUrgent: false,
    },
    {
      id: '4',
      name: '赵六',
      email: 'zhaoliu@example.com',
      phone: '13655667788',
      plan: '订阅版',
      nextBillingDate: new Date('2026-02-15'),
      status: 'expiring',
      purchasePort: 150,
      lastActiveTime: new Date('2026-01-29T11:20:00'),
      complaintCount: 3,
      tags: ['重要客户', '服务导向'],
      followUpStatus: '成功签约',
      isCurrentRenewal: true,
      归属类型: '服务商',
      归属人: '服务商B',
      所在地区: '深圳市南山区',
      assignedTo: '运营A',
      renewalAmount: 134850,
      customerType: 'non-KA',
      manufacturers: [],
      valueAddedModules: ['勤商', '多组织核算', '返利'],
      isUrgent: true, // 紧急客户
    },
    // 不活跃客户
    {
      id: '5',
      name: '陈七',
      email: 'chenqi@example.com',
      phone: '13512345678',
      plan: '行业版',
      nextBillingDate: new Date('2026-03-20'),
      status: 'active',
      purchasePort: 30,
      lastActiveTime: new Date('2026-01-10T14:00:00'),
      complaintCount: 0,
      tags: ['不活跃', '潜在流失'],
      followUpStatus: '初步建联',
      isCurrentRenewal: false,
      归属类型: '公司',
      归属人: '销售小王',
      所在地区: '成都市武侯区',
      assignedTo: '运营A',
      renewalAmount: 26970,
      customerType: 'non-KA',
      manufacturers: [],
      valueAddedModules: ['小程序'],
      isUrgent: false,
    },
    {
      id: '6',
      name: '周八',
      email: 'zhouba@example.com',
      phone: '13487654321',
      plan: '订阅版',
      nextBillingDate: new Date('2026-04-15'),
      status: 'active',
      purchasePort: 15,
      lastActiveTime: new Date('2026-01-05T09:30:00'),
      complaintCount: 1,
      tags: ['不活跃', '低使用频率'],
      followUpStatus: '方案报价',
      isCurrentRenewal: false,
      归属类型: '服务商',
      归属人: '服务商C',
      所在地区: '杭州市西湖区',
      assignedTo: '运营A',
      renewalAmount: 13485,
      customerType: 'non-KA',
      manufacturers: [],
      valueAddedModules: [],
      isUrgent: false,
    },
    {
      id: '7',
      name: '吴九',
      email: 'wujiu@example.com',
      phone: '13312345678',
      plan: '专业版',
      nextBillingDate: new Date('2026-05-10'),
      status: 'active',
      purchasePort: 25,
      lastActiveTime: new Date('2025-12-20T16:00:00'),
      complaintCount: 0,
      tags: ['不活跃', '长期未登录'],
      followUpStatus: '价格协商',
      isCurrentRenewal: false,
      归属类型: '公司',
      归属人: '销售小李',
      所在地区: '武汉市江汉区',
      assignedTo: '运营A',
      renewalAmount: 22475,
      customerType: 'KA',
      manufacturers: ['雪花'],
      remainingPoints: 80,
      valueAddedModules: ['小程序', '现金牛'],
      isUrgent: false,
    },
  ]);

  // 按跟进状态排序客户
  useEffect(() => {
    setCustomers(prevCustomers => 
      [...prevCustomers].sort((a, b) => {
        const statusOrder = {
          '价格协商': 0,
          '方案报价': 1,
          '初步建联': 2,
          '成功签约': 3,
          '客户流失': 4
        };
        return (statusOrder[a.followUpStatus] || 999) - (statusOrder[b.followUpStatus] || 999);
      })
    );
  }, []);

  const [customerMessages, setCustomerMessages] = useState<Record<string, any[]>>({
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
    // 不活跃客户的消息记录
    '5': [
      {
        id: '1',
        content: '您好！我是您的专属客服，最近看到您较少使用我们的系统，请问有什么可以帮助您的吗？',
        sender: 'service',
        timestamp: new Date('2026-01-15T10:00:00'),
      },
      {
        id: '2',
        content: '最近工作比较忙，暂时没有时间使用系统',
        sender: 'customer',
        timestamp: new Date('2026-01-15T10:30:00'),
      },
      {
        id: '3',
        content: '理解您的情况，如有任何需要随时联系我们，我们会为您提供最及时的支持。',
        sender: 'service',
        timestamp: new Date('2026-01-15T10:35:00'),
      },
    ],
    '6': [
      {
        id: '1',
        content: '您好！系统检测到您近30天使用频率较低，请问是遇到了什么问题吗？',
        sender: 'service',
        timestamp: new Date('2026-01-20T14:00:00'),
      },
      {
        id: '2',
        content: '系统功能对我们来说有些复杂，还在学习中',
        sender: 'customer',
        timestamp: new Date('2026-01-20T14:15:00'),
      },
      {
        id: '3',
        content: '我们可以为您安排专门的培训课程，帮助您更快上手系统功能。您方便什么时间进行培训？',
        sender: 'service',
        timestamp: new Date('2026-01-20T14:20:00'),
      },
      {
        id: '4',
        content: '最近比较忙，等有空了再联系你们安排培训',
        sender: 'customer',
        timestamp: new Date('2026-01-20T14:25:00'),
      },
    ],
    '7': [
      {
        id: '1',
        content: '您好！我们注意到您已经很久没有登录系统了，请问是遇到了什么问题吗？',
        sender: 'service',
        timestamp: new Date('2026-01-25T09:00:00'),
      },
      {
        id: '2',
        content: '系统使用起来不太顺手，我们正在考虑其他解决方案',
        sender: 'customer',
        timestamp: new Date('2026-01-25T09:30:00'),
      },
      {
        id: '3',
        content: '非常抱歉给您带来了不好的体验，我们正在不断优化系统。您具体是对哪些功能不太满意呢？我们可以安排产品经理与您沟通，了解您的需求。',
        sender: 'service',
        timestamp: new Date('2026-01-25T09:40:00'),
      },
    ],
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(() => customers[0]);
  const [messages, setMessages] = useState<any[]>(() => customerMessages[customers[0].id]);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [followUpFormVisible, setFollowUpFormVisible] = useState(false);
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState<string>('');
  const [currentRenewalPrice, setCurrentRenewalPrice] = useState<string>('899');
  const [followUpDeadlines, setFollowUpDeadlines] = useState<Record<string, Date>>({});
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});
  const [handoverModalVisible, setHandoverModalVisible] = useState(false);
  const [selectedHandoverPerson, setSelectedHandoverPerson] = useState<string>('');
  const [handoverReason, setHandoverReason] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 会话小结弹窗状态
  const [sessionSummaryVisible, setSessionSummaryVisible] = useState(false);
  const [completedTickets, setCompletedTickets] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  
  // 创建工单弹窗状态
  const [createTicketModalVisible, setCreateTicketModalVisible] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketContent, setTicketContent] = useState('');
  const [ticketType, setTicketType] = useState('system_issue');
  const [handoverPersons] = useState([
    { value: 'op1', label: '运营A' },
    { value: 'op2', label: '运营B' },
    { value: 'op3', label: '运营C' },
    { value: 'op4', label: '运营D' },
    { value: 'op5', label: '运营E' },
  ]);
  
  // 客户软件使用深度相关状态
  const [usageDepthModalVisible, setUsageDepthModalVisible] = useState(false);
  const [customerUsageData, setCustomerUsageData] = useState({
    recent7DaysOrderDays: 5,
    verificationOrderRatio: '85%',
    zeroCostProductRatio: '12%',
    negativeInventoryRatio: '3%',
    useSalaryModule: true,
    useFinanceModule: false,
    dailyAverageVisits: 8.5,
    comprehensiveScore: 82,
  });
  
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
      title: '价格审批结果',
      content: '张三的价格审批已通过，续费金额为799',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      read: false,
    },
    {
      id: '2',
      title: '客户跟进提醒',
      content: '李四的价格协商已超过24小时，需要及时处理',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
    },
    {
      id: '3',
      title: '续费成功',
      content: '赵六已成功完成续费，金额为134850',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
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
  
  // 计算高亮客户数
  const getHighlightedCustomersCount = () => {
    return customers.filter(customer => {
      const hasDeadline = !!followUpDeadlines[customer.id];
      const isOverdue = hasDeadline && (timeLeft[customer.id] || 0) === 0;
      const isNearDeadline = hasDeadline && (timeLeft[customer.id] || 0) > 0 && (timeLeft[customer.id] || 0) < 86400; // 24小时
      return isOverdue || isNearDeadline;
    }).length;
  };

  // 处理交接弹窗的逻辑
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

  const handleFinishSession = () => {
    // 打开会话小结弹窗
    setCompletedTickets([]);
    setSessionNotes('');
    setSessionSummaryVisible(true);
  };
  
  // 处理创建工单
  const handleCreateTicket = () => {
    if (!ticketTitle.trim()) {
      message.error('请输入工单标题');
      return;
    }
    if (!ticketContent.trim()) {
      message.error('请输入工单内容');
      return;
    }
    
    // 模拟创建工单
    if (setTickets) {
      const newTicket = {
        id: Date.now().toString(),
        title: ticketTitle,
        content: ticketContent,
        customerName: selectedCustomer.name,
        customerEmail: selectedCustomer.email || 'customer@example.com',
        status: 'open' as const,
        type: ticketType as any,
        createdTime: new Date(),
        updatedTime: new Date(),
        lastProcessor: '',
        lastProcessTime: new Date(),
      };
      setTickets(prev => [...prev, newTicket]);
      message.success(`已为${selectedCustomer.name}创建新工单`);
      
      // 发送创建工单的消息
      sendBotMessage(`已为您创建工单：${ticketTitle}\n工单类型：${
        ticketType === 'system_issue' ? '系统问题' :
        ticketType === 'product_suggestion' ? '产品建议' :
        ticketType === 'training_implementation' ? '培训实施' :
        ticketType === 'renewal_question' ? '续费疑问' :
        ticketType === 'issue_escalation' ? '问题升级' :
        '投诉'
      }\n我们会尽快处理您的问题。`);
    }
    
    // 关闭弹窗并重置状态
    setCreateTicketModalVisible(false);
    setTicketTitle('');
    setTicketContent('');
    setTicketType('system_issue');
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
    sendBotMessage(`感谢您的咨询，以下是本次会话的小结：\n\n${sessionNotes || '1. 您处理了客户的续费问题\n2. 提供了相应的续费方案'}\n\n请问客户的问题是否得到解决？`);
    
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

  // 当选中客户变化时，更新消息列表和跟进状态
  useEffect(() => {
    setMessages(customerMessages[selectedCustomer.id] || []);
    setFollowUpStatus(selectedCustomer.followUpStatus);
    setCurrentRenewalPrice('899'); // 默认显示899
  }, [selectedCustomer, customerMessages]);

  // 初始化时为所有客户设置初始截止时间
  useEffect(() => {
    const initialDeadlines: Record<string, Date> = {};
    customers.forEach(customer => {
      let deadline: Date | null = null;
      switch (customer.followUpStatus) {
        case '方案报价':
          deadline = new Date();
          deadline.setDate(deadline.getDate() + 2); // 2天内变更状态
          break;
        case '价格协商':
          deadline = new Date();
          deadline.setDate(deadline.getDate() + 3); // 3天内变更状态
          break;
        default:
          deadline = null;
      }
      if (deadline) {
        initialDeadlines[customer.id] = deadline;
      }
    });
    setFollowUpDeadlines(initialDeadlines);
  }, [customers]);

  // 计算剩余处理时间
  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft: Record<string, number> = {};
      Object.entries(followUpDeadlines).forEach(([customerId, deadline]) => {
        const now = new Date();
        const timeLeftMs = deadline.getTime() - now.getTime();
        newTimeLeft[customerId] = Math.max(0, Math.floor(timeLeftMs / 1000));
      });
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [followUpDeadlines]);

  // 格式化时间为时:分:秒
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
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
      const customerReply = {
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

  const handlePhoneClick = () => {
    setPhoneVisible(true);
    setPhoneModalVisible(true);
  };

  const handleSavePhoneRecord = () => {
    if (!followUpContent.trim()) {
      message.error('请输入电话沟通记录');
      return;
    }
    message.success(`已保存对${selectedCustomer.name}的电话沟通记录`);
    setPhoneModalVisible(false);
    setFollowUpContent('');
  };

  const handleSaveFollowUp = () => {
    if (!followUpStatus) {
      message.error('请选择跟进状态');
      return;
    }
    
    const renewalAmount = parseInt(currentRenewalPrice);
    
    // 更新客户跟进状态和续费金额
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === selectedCustomer.id 
          ? { ...customer, followUpStatus: followUpStatus as any, renewalAmount } 
          : customer
      )
    );
    
    // 根据跟进状态设置截止时间
    let deadline: Date | null = null;
    switch (followUpStatus) {
      case '方案报价':
        deadline = new Date();
        deadline.setDate(deadline.getDate() + 2); // 2天内变更状态
        break;
      case '价格协商':
        // 默认设置3天协商时间
        deadline = new Date();
        deadline.setDate(deadline.getDate() + 3); // 3天内变更状态
        break;
      default:
        deadline = null;
    }
    
    if (deadline) {
      setFollowUpDeadlines(prev => ({
        ...prev,
        [selectedCustomer.id]: deadline
      }));
    }
    
    // 价格审批逻辑
    if (renewalAmount < 899) {
      // 触发价格审批工单
      if (setTickets) {
        setTickets(prev => [...prev, {
          id: Date.now().toString(),
          title: `价格审批：${selectedCustomer.name}`,
          content: `客户：${selectedCustomer.name}\n续费金额：${renewalAmount}\n原价格：899\n跟进状态：${followUpStatus}`,
          customerName: selectedCustomer.name,
          customerEmail: selectedCustomer.email || 'customer@example.com',
          status: 'open',
          type: 'price_approval',
          createdTime: new Date(),
          updatedTime: new Date(),
          lastProcessor: '',
          lastProcessTime: new Date(),
        }]);
      }
      message.success(`已更新${selectedCustomer.name}的跟进状态和续费金额，同时触发价格审批工单`);
    } else {
      message.success(`已更新${selectedCustomer.name}的跟进状态和续费金额`);
    }
    
    setFollowUpFormVisible(false);
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
        <div style={{ flex: 1, padding: '10px 10px 100px 20px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {selectedMenu === 'chat' && (
            <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
              {/* 左侧客户列表区域 */}
              <div style={{ width: 240, border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: '#333' }}>待续费客户</h4>
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
                    )}
                    renderItem={customer => {
                      // 检查是否需要高亮
                      const hasDeadline = !!followUpDeadlines[customer.id];
                      const isOverdue = hasDeadline && (timeLeft[customer.id] || 0) === 0;
                      const isNearDeadline = hasDeadline && (timeLeft[customer.id] || 0) > 0 && (timeLeft[customer.id] || 0) < 86400; // 小于24小时
                      const needHighlight = isOverdue || isNearDeadline;
                      
                      return (
                        <List.Item 
                          style={{ 
                            cursor: 'pointer', 
                            marginBottom: 4, 
                            borderRadius: 4, 
                            padding: '8px 8px',
                            backgroundColor: selectedCustomer.id === customer.id ? '#f0f8ff' : (customer.isUrgent ? '#fff1f0' : (needHighlight ? '#fff7e6' : 'white')),
                            color: '#333',
                            border: selectedCustomer.id === customer.id ? '1px solid #1890ff' : (customer.isUrgent ? '1px solid #ff4d4f' : (needHighlight ? '1px solid #faad14' : '1px solid #f0f0f0')),
                            boxShadow: customer.isUrgent ? '0 1px 4px rgba(255, 77, 79, 0.1)' : (needHighlight ? '0 1px 4px rgba(250, 173, 20, 0.1)' : 'none')
                          }}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <List.Item.Meta
                            title={
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <span style={{ fontSize: 13, fontWeight: '500' }}>{customer.name}</span>
                                <Badge 
                                  status={customer.status === 'active' ? 'success' : customer.status === 'expiring' ? 'warning' : 'error'} 
                                  text={customer.status === 'active' ? '活跃' : customer.status === 'expiring' ? '即将到期' : '已过期'} 
                                  style={{ fontSize: 9 }}
                                />
                              </div>
                            }
                            description={
                              <div>
                                <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                                  到期时间: {customer.nextBillingDate.toLocaleDateString()}
                                </div>
                                <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>
                                  跟进状态: {customer.followUpStatus} · 
                                  <span style={{ color: customer.customerType === 'KA' ? '#1890ff' : '#999' }}>
                                    {customer.customerType === 'KA' ? 'KA' : '非KA'}
                                  </span>
                                </div>
                                {customer.customerType === 'KA' && customer.manufacturers.length > 0 && (
                                  <div style={{ fontSize: 10, color: '#999', marginBottom: 2 }}>
                                    合作厂家: {customer.manufacturers.join('、')}
                                  </div>
                                )}
                                {hasDeadline && (
                                  <div style={{ fontSize: 10, color: isOverdue ? '#ff4d4f' : (isNearDeadline ? '#faad14' : '#1890ff') }}>
                                    剩余: {formatTime(timeLeft[customer.id] || 0)}
                                    {isOverdue && ' (超时)'}
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                </div>
              </div>
              
              {/* 中间客户信息区域 */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                {/* 客户信息和软件使用深度左右布局 */}
                <div style={{ display: 'flex', gap: 12, minHeight: 200 }}>
                  {/* 左侧：客户基本信息 */}
                  <Card 
                    title="客户信息" 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      border: selectedCustomer.isUrgent ? '1px solid #ff4d4f' : '1px solid #f0f0f0',
                      boxShadow: selectedCustomer.isUrgent ? '0 1px 4px rgba(255, 77, 79, 0.1)' : 'none'
                    }} 
                  >
                    <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                      <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>客户名称:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.name}</span></p>
                      <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>所在地区:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.所在地区.split('区')[0]}</span></p>
                      <p style={{ margin: '2px 0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <strong style={{ fontSize: '11px' }}>客户类型:</strong>
                        <Tag color={selectedCustomer.customerType === 'KA' ? 'blue' : 'orange'} size="small" style={{ fontSize: '10px' }}>
                          {selectedCustomer.customerType === 'KA' ? 'KA' : '非KA'}
                        </Tag>
                      </p>
                      {selectedCustomer.customerType === 'KA' && selectedCustomer.manufacturers.length > 0 && (
                        <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>合作厂家:</strong> <span style={{ fontSize: '10px' }}>{selectedCustomer.manufacturers.join('、')}</span></p>
                      )}
                      <p style={{ margin: '2px 0', gridColumn: '1 / -1', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontSize: '11px' }}>客户主账号:</strong> 
                        <span 
                          onClick={handlePhoneClick}
                          style={{ cursor: 'pointer', color: '#1890ff', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                          <PhoneOutlined style={{ fontSize: 11 }} />
                          {phoneVisible 
                            ? selectedCustomer.phone 
                            : selectedCustomer.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                          }
                        </span>
                      </p>
                      <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>到期时间:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.nextBillingDate.toLocaleDateString()}</span></p>
                      <p style={{ margin: '2px 0', fontSize: '12px' }}><strong style={{ fontSize: '11px' }}>购买端口:</strong> <span style={{ fontSize: '11px' }}>{selectedCustomer.purchasePort} 个</span></p>
                      <p style={{ margin: '2px 0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: '11px' }}>软件版本:</strong>
                        <Tag color={
                          selectedCustomer.plan === '行业版' ? 'green' :
                          selectedCustomer.plan === '订阅版' ? 'orange' :
                          'blue'
                        } size="small" style={{ fontSize: '10px' }}>
                          {selectedCustomer.plan}
                        </Tag>
                      </p>
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
                  </Card>
                  
                  {/* 右侧：软件使用深度 */}
                  <Card title="客户软件使用深度" size="small" style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>近7天内开单天数</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
                          {customerUsageData.recent7DaysOrderDays} 天
                        </p>
                      </div>
                      <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>核销订单占比</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
                          {customerUsageData.verificationOrderRatio}
                        </p>
                      </div>
                      <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>0成本商品占比</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#faad14' }}>
                          {customerUsageData.zeroCostProductRatio}
                        </p>
                      </div>
                      <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>负库存占比</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>
                          {customerUsageData.negativeInventoryRatio}
                        </p>
                      </div>
                      <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>日人均拜访家数</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>
                          {customerUsageData.dailyAverageVisits} 家
                        </p>
                      </div>
                      <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#666' }}>综合得分</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#722ed1' }}>
                          {customerUsageData.comprehensiveScore} 分
                        </p>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
                      <p style={{ margin: '2px 0' }}>备注：数据统计周期为最近7天</p>
                      <p style={{ margin: '2px 0' }}>使用模块：{customerUsageData.useSalaryModule ? '薪资' : ''} {customerUsageData.useFinanceModule ? '财务' : ''}</p>
                    </div>
                  </Card>
                </div>
                
                {/* 历史续费信息和历史工单左右布局 */}
                <div style={{ display: 'flex', gap: 12, minHeight: 300 }}>
                  {/* 左侧：历史续费信息 */}
                  <Card title="客户历史续费信息" size="small" style={{ flex: 1, overflow: 'auto' }}>
                    <div style={{ maxHeight: '100%', overflow: 'auto' }}>
                      {[
                        {
                          id: '1',
                          date: '2025-01-30',
                          version: '订阅版',
                          ports: 100,
                          amount: 89900,
                        },
                        {
                          id: '2',
                          date: '2024-01-30',
                          version: '订阅版',
                          ports: 80,
                          amount: 71920,
                        },
                        {
                          id: '3',
                          date: '2023-01-30',
                          version: '行业版',
                          ports: 50,
                          amount: 44950,
                        },
                      ].map(renewal => (
                        <div key={renewal.id} style={{ marginBottom: 8, padding: 8, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <strong style={{ fontSize: 12 }}>{renewal.date}</strong>
                            <Tag size="small" color="blue" style={{ fontSize: 10 }}>
                              {renewal.version}
                            </Tag>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                            <span style={{ color: '#666' }}>购买端口: {renewal.ports} 个</span>
                            <span style={{ color: '#1890ff', fontWeight: '500' }}>续费金额: ¥{renewal.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  {/* 右侧：历史工单 */}
                  <Card title="历史工单" size="small" style={{ flex: 1, overflow: 'auto' }}>
                    <div style={{ maxHeight: '100%', overflow: 'auto' }}>
                      {tickets.filter(t => t.customerName === selectedCustomer.name).slice(0, 3).map(ticket => (
                        <div key={ticket.id} style={{ marginBottom: 8, padding: 8, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                            <strong style={{ fontSize: 12 }}>{ticket.title}</strong>
                            <Tag size="small" color={
                              ticket.type === 'system_issue' ? 'red' :
                              ticket.type === 'product_suggestion' ? 'green' :
                              ticket.type === 'training_implementation' ? 'blue' :
                              ticket.type === 'renewal_question' ? 'orange' :
                              ticket.type === 'issue_escalation' ? 'purple' :
                              'magenta'
                            }>
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
                          <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                            创建时间: {ticket.createdTime.toLocaleDateString()}
                          </div>
                          <div style={{ fontSize: 11, color: '#999' }}>
                            状态: {ticket.status === 'open' ? '待处理' : ticket.status === 'processing' ? '处理中' : '已解决'}
                          </div>
                        </div>
                      ))}
                      {tickets.filter(t => t.customerName === selectedCustomer.name).length === 0 && (
                        <div style={{ textAlign: 'center', color: '#999', padding: 12 }}>
                          暂无历史工单
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              {/* 右侧聊天区域 */}
              <div style={{ width: 300, border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ padding: 8, borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 40, color: '#333' }}>
                  <h4 style={{ margin: 0, fontSize: 13, color: '#333' }}>智能客服 - {selectedCustomer.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                      style={{ width: 80 }}
                      defaultValue="老板"
                      options={[
                        { value: 'boss', label: '老板' },
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
                    padding: '4px 8px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div 
                      style={{ 
                        display: 'flex',
                        animation: 'marquee 15s linear infinite',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {notifications.map(notification => (
                        <span key={notification.id} style={{ marginRight: '12px', color: '#1890ff', fontSize: 10 }}>
                          {notification.title}: {notification.content}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="chat-messages" style={{ flex: 1, overflow: 'auto', padding: 6, borderBottom: '1px solid #e8e8e8', minHeight: 0 }}>
                  {messages.map(message => (
                    <div key={message.id} style={{ marginBottom: 8, display: 'flex', flexDirection: 'column', alignItems: message.sender === 'customer' ? 'flex-start' : 'flex-end' }}>
                      <div style={{ 
                        maxWidth: '80%', 
                        padding: '4px 8px', 
                        borderRadius: '10px', 
                        wordWrap: 'break-word',
                        backgroundColor: message.sender === 'customer' ? '#f0f0f0' : '#1890ff',
                        color: message.sender === 'customer' ? '#333' : 'white',
                        borderBottomRightRadius: message.sender === 'customer' ? '10px' : '3px',
                        borderBottomLeftRadius: message.sender === 'customer' ? '3px' : '10px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        fontSize: 11
                      }}>{message.content}</div>
                      <div style={{ fontSize: 8, color: '#999', marginTop: 2, marginLeft: message.sender === 'customer' ? '6px' : 0, marginRight: message.sender === 'customer' ? 0 : '6px' }}>
                        {message.sender === 'customer' ? '客户' : '运营'} · {message.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                  
                  {/* 问题解决反馈按钮 */}
                  {messages.length > 0 && messages[messages.length - 1].content.includes('请问客户的问题是否得到解决？') && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8, padding: 6, borderTop: '1px solid #f0f0f0' }}>
                      <Button 
                        type="default" 
                        size="small"
                        onClick={() => {
                          sendBotMessage('感谢您的反馈，很高兴能够帮到您！');
                          setTimeout(() => {
                            sendBotMessage('请对本次服务进行评价：\n1. 满意\n2. 一般\n3. 不满意');
                          }, 1000);
                        }}
                        style={{ padding: '2px 8px', fontSize: 10 }}
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
                        style={{ padding: '2px 8px', fontSize: 10 }}
                      >
                        👎 问题未解决
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* 输入区域 */}
                <div style={{ padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid #f0f0f0', height: 160, flexShrink: 0 }}>
                  {/* 跟进管理按钮 */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => setFollowUpFormVisible(true)}
                      style={{ padding: '2px 8px', fontSize: 11 }}
                    >
                      跟进管理
                    </Button>
                  </div>
                  
                  {/* 问题类型按钮 */}
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
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
                      style={{ padding: '2px 8px', fontSize: 11 }}
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
                      style={{ padding: '2px 8px', fontSize: 11 }}
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
                      style={{ padding: '2px 8px', fontSize: 11 }}
                    >
                      培训实施
                    </Button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
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
                      style={{ padding: '2px 8px', fontSize: 11 }}
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
                      style={{ padding: '2px 8px', fontSize: 11 }}
                    >
                      产品建议
                    </Button>
                  </div>
                  
                  {/* 输入框 */}
                  <Input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="请输入回复..."
                    onPressEnter={handleSendMessage}
                    style={{ width: '100%', marginBottom: 2 }}
                    size="small"
                  />
                  
                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end', flexWrap: 'wrap', minHeight: 32 }}>
                    <Button type="primary" size="small" onClick={handleSendMessage} style={{ padding: '2px 12px', fontSize: 11 }}>
                      发送
                    </Button>
                    <Button type="default" size="small" onClick={handleHandoverClick} style={{ padding: '2px 12px', fontSize: 11 }}>
                      交接
                    </Button>
                    <Button type="default" size="small" onClick={() => setCreateTicketModalVisible(true)} style={{ padding: '2px 12px', fontSize: 11 }}>
                      发起工单
                    </Button>
                    <Button type="default" size="small" onClick={handleFinishSession} style={{ padding: '2px 12px', fontSize: 11 }}>
                      完结会话
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 电话沟通跟进弹窗 */}
      <Modal
        title={`电话沟通跟进 - ${selectedCustomer.name}`}
        open={phoneModalVisible}
        footer={[
          <Button key="save" type="primary" onClick={handleSavePhoneRecord}>
            保存记录
          </Button>,
        ]}
        onCancel={() => {
          // 不允许关闭，必须输入记录
          if (!followUpContent.trim()) {
            message.error('请输入电话沟通记录');
          } else {
            setPhoneModalVisible(false);
            setFollowUpContent('');
          }
        }}
        maskClosable={false}
      >
        <div style={{ marginBottom: 16, color: '#333' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>客户电话:</strong> {selectedCustomer.phone}</p>
          <p style={{ margin: '0 0 16px 0' }}><strong>沟通时间:</strong> {new Date().toLocaleString()}</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>沟通记录:</strong></p>
          <TextArea
            rows={6}
            value={followUpContent}
            onChange={e => setFollowUpContent(e.target.value)}
            placeholder="请输入电话沟通记录，包括沟通内容、客户反馈、后续计划等"
            style={{ resize: 'none', color: '#333' }}
          />
          <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#999' }}>
            注: 无论是否打通电话，都需要记录沟通情况
          </p>
        </div>
      </Modal>

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
        <div style={{ marginBottom: 16, color: '#333' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>交接人员:</strong></p>
          <Select
            style={{ width: '100%', marginBottom: 16 }}
            placeholder="请选择要交接的运营人员"
            value={selectedHandoverPerson}
            onChange={setSelectedHandoverPerson}
            options={handoverPersons}
          />
          <p style={{ margin: '0 0 8px 0' }}><strong>交接原因:</strong></p>
          <TextArea
            rows={4}
            value={handoverReason}
            onChange={e => setHandoverReason(e.target.value)}
            placeholder="请填写交接原因，如工作调整、客户分配等"
            style={{ resize: 'none', color: '#333' }}
          />
        </div>
      </Modal>

      {/* 跟进管理弹窗 */}
      <Modal
        title={`跟进管理 - ${selectedCustomer.name}`}
        open={followUpFormVisible}
        footer={[
          <Button key="cancel" onClick={() => setFollowUpFormVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveFollowUp}>
            保存跟进记录
          </Button>,
        ]}
        onCancel={() => setFollowUpFormVisible(false)}
        width={500}
      >
        <div style={{ marginBottom: 16, color: '#333' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>跟进状态:</strong></p>
          <Select
            style={{ width: '100%', marginBottom: 16 }}
            value={followUpStatus}
            onChange={setFollowUpStatus}
            options={[
              { value: '初步建联', label: '初步建联' },
              { value: '方案报价', label: '方案报价' },
              { value: '价格协商', label: '价格协商' },
              { value: '成功签约', label: '成功签约' },
              { value: '客户流失', label: '客户流失' },
            ]}
          />
          <p style={{ margin: '0 0 8px 0' }}><strong>续费金额:</strong></p>
          <Input
            type="number"
            value={currentRenewalPrice}
            onChange={e => setCurrentRenewalPrice(e.target.value)}
            placeholder="请输入续费金额"
            style={{ marginBottom: 16, color: '#333' }}
          />
          <p style={{ margin: '0 0 8px 0' }}><strong>跟进内容:</strong></p>
          <TextArea
            rows={4}
            value={followUpContent}
            onChange={e => setFollowUpContent(e.target.value)}
            placeholder="请输入跟进内容，包括沟通情况、客户反馈、后续计划等"
            style={{ resize: 'none', marginBottom: 16, color: '#333' }}
          />
          {followUpStatus === '价格协商' && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>协商时长:</strong></p>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button 
                  type={currentRenewalPrice === '1' ? 'primary' : 'default'}
                  onClick={() => {
                    setCurrentRenewalPrice('1');
                    // 设置1天协商时间
                    const deadline = new Date();
                    deadline.setDate(deadline.getDate() + 1);
                    setFollowUpDeadlines(prev => ({ ...prev, [selectedCustomer.id]: deadline }));
                  }}
                >
                  1天
                </Button>
                <Button 
                  type={currentRenewalPrice === '3' ? 'primary' : 'default'}
                  onClick={() => {
                    setCurrentRenewalPrice('3');
                    // 设置3天协商时间
                    const deadline = new Date();
                    deadline.setDate(deadline.getDate() + 3);
                    setFollowUpDeadlines(prev => ({ ...prev, [selectedCustomer.id]: deadline }));
                  }}
                >
                  3天
                </Button>
                <Button 
                  type={currentRenewalPrice === '5' ? 'primary' : 'default'}
                  onClick={() => {
                    setCurrentRenewalPrice('5');
                    // 设置5天协商时间
                    const deadline = new Date();
                    deadline.setDate(deadline.getDate() + 5);
                    setFollowUpDeadlines(prev => ({ ...prev, [selectedCustomer.id]: deadline }));
                  }}
                >
                  5天
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 客户软件使用深度弹窗 */}
      <Modal
        title={`客户软件使用深度 - ${selectedCustomer.name}`}
        open={usageDepthModalVisible}
        footer={[
          <Button key="close" type="primary" onClick={() => setUsageDepthModalVisible(false)}>
            关闭
          </Button>,
        ]}
        onCancel={() => setUsageDepthModalVisible(false)}
        width={600}
      >
        <div style={{ marginBottom: 24, color: '#333' }}>
          <h4 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>使用数据统计</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>近7天内开单天数</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                {customerUsageData.recent7DaysOrderDays} 天
              </p>
            </div>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>核销订单占比</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                {customerUsageData.verificationOrderRatio}
              </p>
            </div>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>0成本商品占比</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#faad14' }}>
                {customerUsageData.zeroCostProductRatio}
              </p>
            </div>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>负库存占比</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#ff4d4f' }}>
                {customerUsageData.negativeInventoryRatio}
              </p>
            </div>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>是否使用工资模块</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: customerUsageData.useSalaryModule ? '#52c41a' : '#ff4d4f' }}>
                {customerUsageData.useSalaryModule ? '是' : '否'}
              </p>
            </div>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>是否使用财务模块</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: customerUsageData.useFinanceModule ? '#52c41a' : '#ff4d4f' }}>
                {customerUsageData.useFinanceModule ? '是' : '否'}
              </p>
            </div>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>日人均拜访家数</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                {customerUsageData.dailyAverageVisits} 家
              </p>
            </div>
            <div style={{ padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#666' }}>综合得分</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 'bold', color: '#722ed1' }}>
                {customerUsageData.comprehensiveScore} 分
              </p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#999' }}>备注：</p>
          <p style={{ margin: 0, fontSize: 12, color: '#999' }}>
            1. 综合得分算法后续可在老板视角的规则设置中进行配置
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#999' }}>
            2. 数据统计周期为最近7天
          </p>
        </div>
      </Modal>
      
      {/* 创建工单弹窗 */}
      <Modal
        title={`创建工单 - ${selectedCustomer.name}`}
        open={createTicketModalVisible}
        footer={[
          <Button key="cancel" onClick={() => setCreateTicketModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateTicket}>
            创建工单
          </Button>,
        ]}
        onCancel={() => setCreateTicketModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}>工单标题：</p>
          <Input
            placeholder="请输入工单标题"
            value={ticketTitle}
            onChange={(e) => setTicketTitle(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}>工单类型：</p>
          <Select
            style={{ width: '100%' }}
            value={ticketType}
            onChange={setTicketType}
            options={[
              { value: 'system_issue', label: '系统问题' },
              { value: 'product_suggestion', label: '产品建议' },
              { value: 'training_implementation', label: '培训实施' },
              { value: 'renewal_question', label: '续费疑问' },
              { value: 'issue_escalation', label: '问题升级' },
              { value: 'complaint', label: '投诉' },
            ]}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}>工单内容：</p>
          <TextArea
            rows={4}
            placeholder="请详细描述问题..."
            value={ticketContent}
            onChange={(e) => setTicketContent(e.target.value)}
          />
        </div>
        <div style={{ fontSize: 12, color: '#999' }}>
          <p>提示：创建工单后，系统会自动通知相关人员进行处理。</p>
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
                  {message.sender === 'customer' ? '客户' : '运营'} · {message.timestamp.toLocaleString()}
                </div>
                <div style={{ fontSize: 13 }}>{message.content}</div>
              </div>
            ))}
          </div>
          
          <h4 style={{ margin: '0 0 16px 0' }}>相关工单处理</h4>
          <div style={{ marginBottom: 16 }}>
            {tickets.filter(t => t.customerName === selectedCustomer.name && t.status !== 'resolved').map(ticket => (
              <div key={ticket.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={completedTickets.includes(ticket.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setCompletedTickets([...completedTickets, ticket.id]);
                    } else {
                      setCompletedTickets(completedTickets.filter(id => id !== ticket.id));
                    }
                  }}
                  style={{ marginRight: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: '500', marginBottom: 2 }}>{ticket.title}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    状态: {ticket.status === 'open' ? '待处理' : ticket.status === 'processing' ? '处理中' : '已解决'}
                  </div>
                </div>
              </div>
            ))}
            {tickets.filter(t => t.customerName === selectedCustomer.name && t.status !== 'resolved').length === 0 && (
              <div style={{ textAlign: 'center', color: '#999', padding: 16 }}>
                暂无相关工单
              </div>
            )}
          </div>
          
          <h4 style={{ margin: '0 0 16px 0' }}>会话小结</h4>
          <TextArea
            value={sessionNotes}
            onChange={e => setSessionNotes(e.target.value)}
            placeholder="请输入本次会话的小结内容..."
            rows={4}
            style={{ resize: 'none' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default OperationView;