import React, { useState, useEffect } from 'react';
import { Button, Card, List, Badge, Table, Input, message, Select, Tag, Modal } from 'antd';
import { MessageOutlined, DollarOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
import type { ColumnsType } from 'antd/es/table';

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
  assignedTo?: string;
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
  customerType: 'KA' | 'non-KA';
  manufacturers: string[];
  remainingPoints?: number;
  assignedTo?: string;
  renewalAmount?: number;
  valueAddedModules: string[];
}

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'service';
  timestamp: Date;
}

interface BossViewProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const BossView: React.FC<BossViewProps> = ({ tickets, setTickets }) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('chat');
  const [inputValue, setInputValue] = useState('');

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
      followUpStatus: '方案报价',
      isCurrentRenewal: true,
      归属类型: '公司',
      归属人: '销售小王',
      所在地区: '北京市朝阳区',
      customerType: 'KA',
      manufacturers: ['农夫', '雪花'],
      assignedTo: '运营A',
      renewalAmount: 89900,
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
      followUpStatus: '价格协商',
      isCurrentRenewal: true,
      归属类型: '服务商',
      归属人: '服务商A',
      所在地区: '上海市浦东新区',
      customerType: 'non-KA',
      manufacturers: [],
      assignedTo: '运营A',
      renewalAmount: 44950,
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
      followUpStatus: '初步建联',
      isCurrentRenewal: false,
      归属类型: '公司',
      归属人: '销售小李',
      所在地区: '广州市天河区',
      customerType: 'KA',
      manufacturers: ['大窑', '新希望'],
      remainingPoints: 150,
      assignedTo: '运营A',
      renewalAmount: 17980,
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
      followUpStatus: '成功签约',
      isCurrentRenewal: true,
      归属类型: '服务商',
      归属人: '服务商B',
      所在地区: '深圳市南山区',
      customerType: 'non-KA',
      manufacturers: [],
      assignedTo: '运营A',
      renewalAmount: 134850,
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
  const [communicatingCustomers, setCommunicatingCustomers] = useState<Customer[]>(customers);
  
  // 客户软件使用深度相关状态
  const [usageDepthModalVisible, setUsageDepthModalVisible] = useState(false);
  const [customerUsageData] = useState({
    recent7DaysOrderDays: 5,
    verificationOrderRatio: '85%',
    zeroCostProductRatio: '12%',
    negativeInventoryRatio: '3%',
    useSalaryModule: true,
    useFinanceModule: false,
    dailyAverageVisits: 8.5,
    comprehensiveScore: 82,
  });

  // 当选中客户变化时，更新消息列表
  useEffect(() => {
    setMessages(customerMessages[selectedCustomer.id] || []);
  }, [selectedCustomer, customerMessages]);

  const handleTicketSelect = (ticketId: string) => {
    // 这里可以加载对应工单的详细信息和聊天记录
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && (ticket.type === 'billing' || ticket.type === 'customer_initiated_renewal')) {
      // 如果是续费相关工单，确保客户在当期续费列表里
      const customer = customers.find(c => c.name === ticket.customerName);
      if (customer && !customer.isCurrentRenewal) {
        message.success(`${customer.name}已添加到当期续费列表`);
        // 实际项目中这里应该更新状态，这里只是模拟
      }
    }
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

  const handleAddTag = () => {
    setAddTagModalVisible(true);
  };

  const handleSaveTag = () => {
    if (!newTag.trim()) {
      message.error('请输入标签内容');
      return;
    }
    message.success(`已添加标签: ${newTag}`);
    setAddTagModalVisible(false);
    setNewTag('');
  };

  const handleProcessTicket = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    setProcessStatus(ticket.status);
    setProcessNotes('');
    setProcessModalVisible(true);
  };

  const handleSaveProcess = () => {
    if (!currentTicket) return;
    
    // 更新工单状态
    const updatedTickets = tickets.map(t => 
      t.id === currentTicket.id 
        ? { ...t, status: processStatus, lastProcessor: '当前客服', lastProcessTime: new Date() }
        : t
    );
    setTickets(updatedTickets);
    
    // 处理续费工单状态变更
    if ((currentTicket.type === 'renewal_question' || currentTicket.type === 'customer_initiated_renewal') && 
        currentTicket.status === 'open' && processStatus === 'processing') {
      // 查找对应的客户
      const customer = customers.find(c => c.name === currentTicket.customerName);
      if (customer && !customer.isCurrentRenewal) {
        // 实际项目中这里应该更新状态，这里只是模拟
        message.success(`${currentTicket.customerName}已添加到当期续费列表`);
      }
    }
    
    message.success(`${currentTicket.title} 工单状态已更新为 ${processStatus === 'open' ? '待处理' : processStatus === 'processing' ? '处理中' : '已解决'}`);
    setProcessModalVisible(false);
    setCurrentTicket(null);
    setProcessNotes('');
  };

  const handleSaveNewTicket = () => {
    if (!newTicket.title || !newTicket.content || !newTicket.customerName) {
      message.error('请填写完整的工单信息');
      return;
    }
    
    const newTicketData = {
      title: newTicket.title,
      content: newTicket.content,
      customerName: newTicket.customerName,
      customerEmail: `${newTicket.customerName.toLowerCase()}@example.com`,
      status: 'open' as const,
      type: newTicket.type,
      assignedTo: newTicket.assignedTo,
    };
    
    setTickets([...tickets, {
      ...newTicketData,
      id: (tickets.length + 1).toString(),
      createdTime: new Date(),
      updatedTime: new Date(),
      lastProcessor: '',
      lastProcessTime: new Date(),
    }]);
    
    message.success(`工单 "${newTicket.title}" 已成功创建`);
    setCreateTicketModalVisible(false);
    setNewTicket({
      title: '',
      content: '',
      customerName: '',
      type: 'system_issue',
      assignedTo: '',
    });
  };

  const getUnfinishedTicketsCount = () => {
    return tickets.filter(t => t.status === 'open' || t.status === 'processing').length;
  };

  const getUnfinishedRenewalsCount = () => {
    return customers.filter(c => 
      c.isCurrentRenewal && 
      c.followUpStatus !== '成功签约' && 
      c.followUpStatus !== '客户流失'
    ).length;
  };

  const ticketColumns: ColumnsType<Ticket> = [
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
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 90,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 90,
      render: (type: Ticket['type']) => {
        const typeConfig: Record<Ticket['type'], { text: string; color: string }> = {
          system_issue: { text: '系统问题', color: 'red' },
          product_suggestion: { text: '产品建议', color: 'green' },
          training_implementation: { text: '培训实施', color: 'blue' },
          renewal_question: { text: '续费疑问', color: 'orange' },
          issue_escalation: { text: '问题升级', color: 'purple' },
          complaint: { text: '投诉', color: 'magenta' },
          price_approval: { text: '价格审批', color: 'cyan' },
        };
        const config = typeConfig[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: Ticket['status']) => {
        const statusConfig: Record<Ticket['status'], { text: string; color: string }> = {
          open: { text: '待处理', color: 'blue' },
          processing: { text: '处理中', color: 'orange' },
          resolved: { text: '已解决', color: 'green' },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 120,
      render: (time) => time.toLocaleDateString(),
    },
    {
      title: '最后处理人',
      dataIndex: 'lastProcessor',
      key: 'lastProcessor',
      width: 80,
      render: (processor) => processor || '-',
    },
    {
      title: '最新分配客服',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 90,
      render: (assignedTo) => assignedTo || '-',
    },
    {
      title: '最后处理时间',
      dataIndex: 'lastProcessTime',
      key: 'lastProcessTime',
      width: 120,
      render: (time) => time.toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 6 }}>
                      <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => {
                          handleTicketSelect(record.id);
                          const customer = customers.find(c => c.name === record.customerName);
                          if (customer) {
                            setSelectedCustomer(customer);
                          }
                        }}
                        style={{ padding: '0 8px' }}
                      >
                        查看
                      </Button>
                      <Button 
                        type="default" 
                        size="small" 
                        onClick={() => handleProcessTicket(record)}
                        style={{ padding: '0 8px' }}
                      >
                        处理
                      </Button>
                      <Button 
                        type="default" 
                        size="small" 
                        onClick={() => {
                          // 分配工单逻辑
                          setCurrentTicket(record);
                          setAssignModalVisible(true);
                        }}
                        style={{ padding: '0 8px' }}
                      >
                        分配
                      </Button>
                    </div>
      ),
    }
  ];

  const [followUpFormVisible, setFollowUpFormVisible] = useState(false);
  const [currentFollowUpCustomer, setCurrentFollowUpCustomer] = useState<Customer | null>(null);
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState<string>('');
  const [currentRenewalPrice, setCurrentRenewalPrice] = useState<string>('');
  const [addTagModalVisible, setAddTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [processStatus, setProcessStatus] = useState<Ticket['status']>('open');
  const [processNotes, setProcessNotes] = useState('');
  const [createTicketModalVisible, setCreateTicketModalVisible] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    content: '',
    customerName: '',
    type: 'system_issue' as Ticket['type'],
    assignedTo: '',
  });
  const [ticketFilterStatus, setTicketFilterStatus] = useState<string>('all');
  const [renewalFilterStatus, setRenewalFilterStatus] = useState<string>('all');
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);
  const [searchCustomerKeyword, setSearchCustomerKeyword] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedAssignCustomer, setSelectedAssignCustomer] = useState<Customer | null>(null);
  const [assignTo, setAssignTo] = useState('');
  const [selectedStatType, setSelectedStatType] = useState<string>('all');

  const handleFollowUpClick = (customer: Customer) => {
    setCurrentFollowUpCustomer(customer);
    setFollowUpStatus(customer.followUpStatus);
    setFollowUpContent('');
    setCurrentRenewalPrice('');
    setFollowUpFormVisible(true);
  };

  const handleSaveFollowUp = () => {
    if (!currentFollowUpCustomer || !followUpContent.trim()) {
      message.error('请填写跟进内容');
      return;
    }
    message.success(`已保存对${currentFollowUpCustomer.name}的跟进记录`);
    setFollowUpFormVisible(false);
  };

  const handleSearchCustomer = (keyword: string) => {
    setSearchCustomerKeyword(keyword);
    // 模拟搜索客户，包含一些不在当前列表中的客户
    const allCustomers = [
      ...customers,
      {
        id: '5',
        name: '周七',
        email: 'zhouqi@example.com',
        phone: '13511223344',
        plan: '专业版',
        nextBillingDate: new Date('2026-02-20'),
        status: 'active',
        purchasePort: 30,
        lastActiveTime: new Date('2026-01-29T10:00:00'),
        complaintCount: 0,
        tags: ['新客户', '技术导向'],
        followUpStatus: '初步建联',
        isCurrentRenewal: false,
        归属类型: '公司',
        归属人: '销售小张',
        所在地区: '杭州市西湖区',
      },
      {
        id: '6',
        name: '吴八',
        email: 'wuba@example.com',
        phone: '13455667788',
        plan: '行业版',
        nextBillingDate: new Date('2026-02-25'),
        status: 'expiring',
        purchasePort: 80,
        lastActiveTime: new Date('2026-01-28T14:00:00'),
        complaintCount: 1,
        tags: ['成长型', '服务导向'],
        followUpStatus: '方案报价',
        isCurrentRenewal: false,
        归属类型: '服务商',
        归属人: '服务商C',
        所在地区: '成都市武侯区',
      },
      {
        id: '7',
        name: '郑九',
        email: 'zhengjiu@example.com',
        phone: '13399887766',
        plan: '订阅版',
        nextBillingDate: new Date('2026-03-05'),
        status: 'active',
        purchasePort: 200,
        lastActiveTime: new Date('2026-01-27T09:00:00'),
        complaintCount: 0,
        tags: ['重要客户', '高价值'],
        followUpStatus: '价格协商',
        isCurrentRenewal: false,
        归属类型: '公司',
        归属人: '销售小李',
        所在地区: '武汉市武昌区',
      },
      {
        id: '8',
        name: '王十',
        email: 'wangshi@example.com',
        phone: '13288776655',
        plan: '专业版',
        nextBillingDate: new Date('2026-03-10'),
        status: 'active',
        purchasePort: 40,
        lastActiveTime: new Date('2026-01-26T16:00:00'),
        complaintCount: 2,
        tags: ['老客户', '稳定'],
        followUpStatus: '初步建联',
        isCurrentRenewal: false,
        归属类型: '服务商',
        归属人: '服务商D',
        所在地区: '重庆市渝中区',
      },
    ];
    
    if (keyword) {
      const filtered = allCustomers.filter(c => 
        c.name.toLowerCase().includes(keyword.toLowerCase()) ||
        c.email.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      // 显示一些推荐客户
      setFilteredCustomers(allCustomers.slice(customers.length, customers.length + 3));
    }
  };

  const handleAddToCurrentRenewal = (customer: Customer) => {
    if (!customer.isCurrentRenewal) {
      // 实际项目中这里应该更新状态，这里只是模拟
      message.success(`${customer.name}已添加到当期续费列表`);
    } else {
      message.info(`${customer.name}已经在当期续费列表中`);
    }
    setAddCustomerModalVisible(false);
  };

  const handleAssignCustomer = (customer: Customer) => {
    setSelectedAssignCustomer(customer);
    setAssignTo('');
    setAssignModalVisible(true);
  };

  const handleSaveAssign = () => {
    if (!selectedAssignCustomer || !assignTo) {
      message.error('请选择分配人员');
      return;
    }
    message.success(`${selectedAssignCustomer.name}已分配给${assignTo}`);
    setAssignModalVisible(false);
  };

  const customerColumns: ColumnsType<Customer> = [
    {
      title: '客户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '套餐',
      dataIndex: 'plan',
      key: 'plan',
    },
    {
      title: '下次 billing 日期',
      dataIndex: 'nextBillingDate',
      key: 'nextBillingDate',
      render: (date) => date.toLocaleDateString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Customer['status']) => {
        const statusMap: Record<Customer['status'], { text: string; color: 'default' | 'processing' | 'success' | 'error' | 'warning' }> = {
          active: { text: '活跃', color: 'success' },
          expiring: { text: '即将到期', color: 'warning' },
          expired: { text: '已过期', color: 'error' },
        };
        return (
          <Badge status={statusMap[status].color} text={statusMap[status].text} />
        );
      },
    },
    {
      title: '跟进状态',
      dataIndex: 'followUpStatus',
      key: 'followUpStatus',
      render: (status: Customer['followUpStatus']) => (
        <Tag color={
          status === '初步建联' ? 'blue' :
          status === '方案报价' ? 'green' :
          status === '价格协商' ? 'orange' :
          status === '成功签约' ? 'purple' :
          'red'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="default" 
            size="small" 
            onClick={() => setSelectedCustomer(record)}
          >
            查看详情
          </Button>
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleFollowUpClick(record)}
          >
            跟进
          </Button>
          <Button 
            type="default" 
            size="small" 
            onClick={() => handleAssignCustomer(record)}
          >
            分配
          </Button>
        </div>
      ),
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左侧菜单 */}
        <div style={{ width: 200, backgroundColor: '#f0f2f5', borderRight: '1px solid #e8e8e8', padding: 16 }}>
          <div style={{ marginBottom: 24 }}>
            <Button 
              type={selectedMenu === 'chat' ? 'primary' : 'default'} 
              icon={<MessageOutlined />} 
              style={{ width: '100%', marginBottom: 8 }} 
              onClick={() => setSelectedMenu('chat')}
            >
              智能客服
            </Button>
            <Button 
              type={selectedMenu === 'tickets' ? 'primary' : 'default'} 
              icon={<MessageOutlined />}
              style={{ width: '100%', marginBottom: 8 }} 
              onClick={() => setSelectedMenu('tickets')}
            >
              工单管理
              <Badge 
                count={getUnfinishedTicketsCount()} 
                style={{ marginLeft: 8, backgroundColor: '#ff4d4f' }} 
              />
            </Button>
            <Button 
              type={selectedMenu === 'renewal' ? 'primary' : 'default'} 
              icon={<DollarOutlined />} 
              style={{ width: '100%', marginBottom: 8 }} 
              onClick={() => setSelectedMenu('renewal')}
            >
              续费管理
              <Badge 
                count={getUnfinishedRenewalsCount()} 
                style={{ marginLeft: 8, backgroundColor: '#ff4d4f' }} 
              />
            </Button>
            <Button 
                type={selectedMenu === 'statistics' ? 'primary' : 'default'} 
                icon={<SettingOutlined />} 
                style={{ width: '100%', marginBottom: 8 }} 
                onClick={() => setSelectedMenu('statistics')}
              >
                统计数据
              </Button>
              <Button 
                type={selectedMenu === 'airobot' ? 'primary' : 'default'} 
                icon={<SettingOutlined />} 
                style={{ width: '100%', marginBottom: 8 }} 
                onClick={() => setSelectedMenu('airobot')}
              >
                AI机器人
              </Button>
              <Button 
                type={selectedMenu === 'rules' ? 'primary' : 'default'} 
                icon={<SettingOutlined />} 
                style={{ width: '100%' }} 
                onClick={() => setSelectedMenu('rules')}
              >
                规则设置
              </Button>
          </div>
        </div>

        {/* 右侧内容区域 */}
        <div style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          {selectedMenu === 'tickets' && (
            <Card>
              <div style={{ marginBottom: 16 }}>
                {/* 工单筛选条件 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Select 
                    style={{ width: 120 }}
                    placeholder="工单类型"
                    defaultValue="all"
                    options={[
                      { value: 'all', label: '全部类型' },
                      { value: 'system_issue', label: '系统问题' },
                      { value: 'product_suggestion', label: '产品建议' },
                      { value: 'training_implementation', label: '培训实施' },
                      { value: 'renewal_question', label: '续费疑问' },
                      { value: 'issue_escalation', label: '问题升级' },
                      { value: 'complaint', label: '投诉' },
                    ]}
                  />
                  <Select 
                    style={{ width: 100 }}
                    placeholder="工单状态"
                    defaultValue="all"
                    options={[
                      { value: 'all', label: '全部状态' },
                      { value: 'open', label: '待处理' },
                      { value: 'processing', label: '处理中' },
                      { value: 'resolved', label: '已解决' },
                    ]}
                  />
                  <Input 
                    placeholder="搜索客户名称..." 
                    style={{ width: 180 }}
                  />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 14 }}>创建时间:</span>
                    <Input 
                      type="date" 
                      style={{ width: 140 }}
                    />
                    <span style={{ fontSize: 14 }}>至</span>
                    <Input 
                      type="date" 
                      style={{ width: 140 }}
                    />
                    <Button type="default">
                      筛选
                    </Button>
                  </div>
                  </div>
                  <Button type="primary" onClick={() => setCreateTicketModalVisible(true)}>
                    新建工单
                  </Button>
                </div>
                  
                {/* 工单状态统计 */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      cursor: 'pointer',
                      border: ticketFilterStatus === 'open' ? '1px solid #1890ff' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setTicketFilterStatus('open')}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>待处理</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      {tickets.filter(t => t.status === 'open').length}
                    </p>
                  </Card>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      cursor: 'pointer',
                      border: ticketFilterStatus === 'processing' ? '1px solid #faad14' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setTicketFilterStatus('processing')}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>处理中</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                      {tickets.filter(t => t.status === 'processing').length}
                    </p>
                  </Card>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      cursor: 'pointer',
                      border: ticketFilterStatus === 'resolved' ? '1px solid #52c41a' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setTicketFilterStatus('resolved')}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>已解决</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      {tickets.filter(t => t.status === 'resolved').length}
                    </p>
                  </Card>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      cursor: 'pointer',
                      border: ticketFilterStatus === 'all' ? '1px solid #722ed1' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setTicketFilterStatus('all')}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>总计</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                      {tickets.length}
                    </p>
                  </Card>
                </div>
                
                {/* 工单相关统计数据 */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 150,
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>平均处理时长</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                      2.5小时
                    </p>
                  </Card>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 150,
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>今日工单量</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                      {tickets.filter(t => new Date(t.createdTime).toDateString() === new Date().toDateString()).length}
                    </p>
                  </Card>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 150,
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>工单解决率</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                      {tickets.length > 0 ? Math.round((tickets.filter(t => t.status === 'resolved').length / tickets.length) * 100) : 0}%
                    </p>
                  </Card>
                  <Card 
                    size="small" 
                    style={{ 
                      flex: 1, 
                      minWidth: 150,
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 14 }}>未分配工单</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                      {tickets.filter(t => !t.assignedTo).length}
                    </p>
                  </Card>
                </div>
              </div>
              <Table 
                columns={ticketColumns} 
                dataSource={ticketFilterStatus === 'all' ? tickets : tickets.filter(t => t.status === ticketFilterStatus)} 
                rowKey="id" 
                pagination={{ pageSize: 15 }}
                size="small"
              />
            </Card>
          )}

          {selectedMenu === 'renewal' && (
            <div>
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>续费管理</h3>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Select 
                    style={{ width: 120 }}
                    defaultValue="最近1个月"
                    options={[
                      { value: '1', label: '最近1个月' },
                      { value: '3', label: '最近3个月' },
                      { value: '6', label: '最近6个月' },
                      { value: '12', label: '最近1年' },
                    ]}
                  />
                  <Select 
                    style={{ width: 100 }}
                    defaultValue="全部状态"
                    options={[
                      { value: 'all', label: '全部状态' },
                      { value: 'active', label: '活跃' },
                      { value: 'expiring', label: '即将到期' },
                      { value: 'expired', label: '已过期' },
                    ]}
                  />
                  <Input 
                    placeholder="搜索客户名称..." 
                    style={{ width: 200 }}
                  />
                  <Button type="primary" onClick={() => setAddCustomerModalVisible(true)}>
                    主动查询客户
                  </Button>
                </div>
              </div>
              
              {/* 续费统计信息 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                  <Card 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      textAlign: 'center', 
                      padding: '12px 0',
                      cursor: 'pointer',
                      border: renewalFilterStatus === 'current' ? '1px solid #1890ff' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setRenewalFilterStatus('current')}
                  >
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>待续费客户</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                      {customers.filter(c => c.isCurrentRenewal).length}
                    </p>
                  </Card>
                  <Card 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      textAlign: 'center', 
                      padding: '12px 0',
                      cursor: 'pointer',
                      border: renewalFilterStatus === 'following' ? '1px solid #faad14' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setRenewalFilterStatus('following')}
                  >
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>跟进中</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: 20, fontWeight: 'bold', color: '#faad14' }}>
                      {customers.filter(c => c.followUpStatus !== '成功签约' && c.followUpStatus !== '客户流失').length}
                    </p>
                  </Card>
                  <Card 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      textAlign: 'center', 
                      padding: '12px 0',
                      cursor: 'pointer',
                      border: renewalFilterStatus === 'signed' ? '1px solid #52c41a' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setRenewalFilterStatus('signed')}
                  >
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>已签约</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                      {customers.filter(c => c.followUpStatus === '成功签约').length}
                    </p>
                  </Card>
                  <Card 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      textAlign: 'center', 
                      padding: '12px 0',
                      cursor: 'pointer',
                      border: renewalFilterStatus === 'lost' ? '1px solid #ff4d4f' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setRenewalFilterStatus('lost')}
                  >
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>流失客户</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: 20, fontWeight: 'bold', color: '#ff4d4f' }}>
                      {customers.filter(c => c.followUpStatus === '客户流失').length}
                    </p>
                  </Card>
                  <Card 
                    style={{ 
                      flex: 1, 
                      minWidth: 120, 
                      textAlign: 'center', 
                      padding: '12px 0',
                      cursor: 'pointer',
                      border: renewalFilterStatus === 'all' ? '1px solid #722ed1' : '1px solid #f0f0f0'
                    }}
                    onClick={() => setRenewalFilterStatus('all')}
                  >
                    <p style={{ margin: 0, fontSize: 12, color: '#666' }}>总计</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: 20, fontWeight: 'bold', color: '#722ed1' }}>
                      {customers.length}
                    </p>
                  </Card>
                </div>
              
              <Table 
                columns={[
                  {
                    title: '客户名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: 100,
                  },
                  {
                    title: '账号',
                    dataIndex: 'phone',
                    key: 'phone',
                    width: 120,
                    render: (phone: string, record: Customer) => {
                      return (
                        <span 
                          onClick={() => setPhoneVisible(!phoneVisible)}
                          style={{ cursor: 'pointer', color: '#1890ff' }}
                        >
                          {phoneVisible 
                            ? phone 
                            : phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                          }
                        </span>
                      );
                    },
                  },
                  {
                    title: '到期时间',
                    dataIndex: 'nextBillingDate',
                    key: 'nextBillingDate',
                    width: 90,
                    render: (date: Date, record: Customer) => {
                      // 成功签约后，到期时间自动延长一年
                      if (record.followUpStatus === '成功签约') {
                        const newDate = new Date(date);
                        newDate.setFullYear(newDate.getFullYear() + 1);
                        return (
                          <div>
                            <div>{newDate.toLocaleDateString()}</div>
                            <div style={{ fontSize: 10, color: '#52c41a' }}>(已续期)</div>
                          </div>
                        );
                      }
                      return date.toLocaleDateString();
                    },
                  },
                  {
                    title: '剩余天数',
                    key: 'daysLeft',
                    width: 70,
                    render: (_, record: Customer) => {
                      const today = new Date();
                      const daysLeft = Math.ceil((record.nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return <span style={{ color: daysLeft <= 7 ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>{daysLeft}天</span>;
                    },
                  },
                  {
                    title: '续费进展',
                    dataIndex: 'followUpStatus',
                    key: 'followUpStatus',
                    width: 100,
                    render: (status: Customer['followUpStatus']) => {
                      const statusConfig: Record<Customer['followUpStatus'], { color: string, text: string }> = {
                        '初步建联': { color: '#1890ff', text: '初步建联' },
                        '方案报价': { color: '#722ed1', text: '方案报价' },
                        '价格协商': { color: '#faad14', text: '价格协商' },
                        '成功签约': { color: '#52c41a', text: '成功签约' },
                        '客户流失': { color: '#ff4d4f', text: '客户流失' },
                      };
                      const config = statusConfig[status];
                      return <Tag color={config.color}>{config.text}</Tag>;
                    },
                  },
                  {
                    title: '负责人',
                    key: 'manager',
                    width: 80,
                    render: () => {
                      const managers = ['张三', '李四', '王五', '赵六', '钱七'];
                      return managers[Math.floor(Math.random() * managers.length)];
                    },
                  },
                  {
                    title: '上次跟进',
                    key: 'lastFollowUp',
                    width: 100,
                    render: () => {
                      const date = new Date();
                      date.setDate(date.getDate() - Math.floor(Math.random() * 10));
                      return date.toLocaleDateString();
                    },
                  },
                  {
                    title: '预测续费金额',
                    key: 'predictedAmount',
                    width: 100,
                    render: () => {
                      const amounts = [2400, 6800, 9800, 12000, 18000, 24000];
                      return `¥${amounts[Math.floor(Math.random() * amounts.length)]}`;
                    },
                  },
                  {
                    title: '当前续费价格',
                    key: 'currentPrice',
                    width: 100,
                    render: (_, record: Customer) => {
                      if (['方案报价', '价格协商', '成功签约'].includes(record.followUpStatus)) {
                        return `¥${Math.floor(Math.random() * 10000) + 2000}`;
                      }
                      return '-';
                    },
                  },
                  {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    render: (_, record) => (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button 
                          type="primary" 
                          size="small" 
                          onClick={() => handleFollowUpClick(record)}
                          style={{ padding: '0 8px' }}
                        >
                          跟进
                        </Button>
                        <Button 
                          type="default" 
                          size="small"
                          style={{ padding: '0 8px' }}
                          onClick={() => handleAssignCustomer(record)}
                        >
                          分配
                        </Button>
                        <Button 
                          type="default" 
                          size="small"
                          style={{ padding: '0 8px' }}
                        >
                          更新
                        </Button>
                      </div>
                    ),
                  },
                ]} 
                dataSource={
                  renewalFilterStatus === 'all' ? customers :
                  renewalFilterStatus === 'current' ? 
                    customers.filter(c => {
                      // 当期续费：本月之前到期未续费且状态不是客户流失的客户 + 本月到期的客户 + 续费工单状态是非待处理的客户
                      // 默认不显示成功签约的客户
                      if (c.followUpStatus === '成功签约') return false;
                      
                      const today = new Date();
                      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                      const isBeforeThisMonth = c.nextBillingDate < thisMonthStart;
                      const isThisMonth = c.nextBillingDate >= thisMonthStart && c.nextBillingDate < new Date(today.getFullYear(), today.getMonth() + 1, 1);
                      const isNotLost = c.followUpStatus !== '客户流失';
                      const hasRenewalTicketInProgress = tickets.some(t => 
                        (t.type === 'renewal_question' || t.type === 'customer_initiated_renewal') && 
                        t.customerName === c.name && 
                        t.status !== 'open'
                      );
                      
                      return (c.isCurrentRenewal || isBeforeThisMonth || isThisMonth || hasRenewalTicketInProgress) && isNotLost;
                    }) :
                  renewalFilterStatus === 'following' ? customers.filter(c => c.followUpStatus !== '成功签约' && c.followUpStatus !== '客户流失') :
                  renewalFilterStatus === 'signed' ? customers.filter(c => c.followUpStatus === '成功签约') :
                  renewalFilterStatus === 'lost' ? customers.filter(c => c.followUpStatus === '客户流失') :
                  customers
                } 
                rowKey="id" 
                pagination={{ pageSize: 15 }}
                size="small"
                style={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginTop: 16 }}
              />
            </div>
          )}

          {selectedMenu === 'airobot' && (
            <div>
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>AI机器人管理</h3>
              </div>
              
              {/* AI机器人使用情况统计 */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <Card 
                  size="small" 
                  style={{ 
                    flex: 1, 
                    minWidth: 150,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: selectedStatType === 'all' ? '1px solid #1890ff' : '1px solid #f0f0f0'
                  }}
                  onClick={() => setSelectedStatType('all')}
                >
                  <p style={{ margin: 0, fontSize: 14 }}>总回答问题数</p>
                  <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    1,245
                  </p>
                </Card>
                <Card 
                  size="small" 
                  style={{ 
                    flex: 1, 
                    minWidth: 150,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: selectedStatType === 'correct' ? '1px solid #52c41a' : '1px solid #f0f0f0'
                  }}
                  onClick={() => setSelectedStatType('correct')}
                >
                  <p style={{ margin: 0, fontSize: 14 }}>反馈正确数</p>
                  <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    987
                  </p>
                </Card>
                <Card 
                  size="small" 
                  style={{ 
                    flex: 1, 
                    minWidth: 150,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: selectedStatType === 'incorrect' ? '1px solid #ff4d4f' : '1px solid #f0f0f0'
                  }}
                  onClick={() => setSelectedStatType('incorrect')}
                >
                  <p style={{ margin: 0, fontSize: 14 }}>反馈错误数</p>
                  <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                    258
                  </p>
                </Card>
                <Card 
                  size="small" 
                  style={{ 
                    flex: 1, 
                    minWidth: 150,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: selectedStatType === 'rate' ? '1px solid #722ed1' : '1px solid #f0f0f0'
                  }}
                  onClick={() => setSelectedStatType('rate')}
                >
                  <p style={{ margin: 0, fontSize: 14 }}>正确率</p>
                  <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                    79.3%
                  </p>
                </Card>
              </div>
              
              {/* 知识集管理 */}
              <Card title="知识集管理" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Button type="primary">
                    上传知识集
                  </Button>
                </div>
                <Table 
                  columns={[
                    {
                      title: 'ID',
                      dataIndex: 'id',
                      key: 'id',
                      width: 60,
                    },
                    {
                      title: '知识集名称',
                      dataIndex: 'name',
                      key: 'name',
                      flex: 1,
                      ellipsis: true,
                    },
                    {
                      title: '文件大小',
                      dataIndex: 'size',
                      key: 'size',
                      width: 80,
                    },
                    {
                      title: '上传时间',
                      dataIndex: 'uploadTime',
                      key: 'uploadTime',
                      width: 120,
                    },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      key: 'status',
                      width: 80,
                      render: (status: string) => (
                        <Tag color={status === '已启用' ? 'green' : 'gray'}>
                          {status}
                        </Tag>
                      ),
                    },
                    {
                      title: '操作',
                      key: 'action',
                      width: 80,
                      render: () => (
                        <Button 
                          type="default" 
                          size="small" 
                          danger
                          style={{ padding: '0 8px' }}
                        >
                          删除
                        </Button>
                      ),
                    }
                  ]} 
                  dataSource={[
                    {
                      id: '1',
                      name: '常见问题解答',
                      size: '2.3MB',
                      uploadTime: '2026-01-28',
                      status: '已启用',
                    },
                    {
                      id: '2',
                      name: '产品功能说明',
                      size: '5.7MB',
                      uploadTime: '2026-01-27',
                      status: '已启用',
                    },
                    {
                      id: '3',
                      name: '技术支持文档',
                      size: '3.1MB',
                      uploadTime: '2026-01-26',
                      status: '已启用',
                    },
                  ]} 
                  rowKey="id" 
                  pagination={{ pageSize: 10 }}
                  size="small"
                />
              </Card>
              
              {/* 对话记录 */}
              <Card title="对话记录">
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Select 
                      style={{ width: 120 }}
                      defaultValue="all"
                      placeholder="筛选反馈"
                      onChange={(value) => setSelectedStatType(value)}
                      options={[
                        { value: 'all', label: '全部' },
                        { value: 'correct', label: '反馈正确' },
                        { value: 'incorrect', label: '反馈错误' },
                      ]}
                    />
                    <Input 
                      placeholder="搜索问题或回答..." 
                      style={{ width: 200 }}
                    />
                  </div>
                  <Button type="primary" onClick={() => {
                    message.success('对话记录导出成功，文件已下载');
                  }}>
                    导出对话记录
                  </Button>
                </div>
                <Table 
                  columns={[
                    {
                      title: 'ID',
                      dataIndex: 'id',
                      key: 'id',
                      width: 60,
                    },
                    {
                      title: '客户',
                      dataIndex: 'customer',
                      key: 'customer',
                      width: 100,
                    },
                    {
                      title: '问题',
                      dataIndex: 'question',
                      key: 'question',
                      flex: 1,
                      ellipsis: true,
                    },
                    {
                      title: '回答',
                      dataIndex: 'answer',
                      key: 'answer',
                      flex: 1,
                      ellipsis: true,
                    },
                    {
                      title: '时间',
                      dataIndex: 'time',
                      key: 'time',
                      width: 120,
                    },
                    {
                      title: '反馈',
                      dataIndex: 'feedback',
                      key: 'feedback',
                      width: 80,
                      render: (feedback: string) => (
                        <Tag color={feedback === '正确' ? 'green' : 'red'}>
                          {feedback}
                        </Tag>
                      ),
                    },
                  ]} 
                  dataSource={
                    selectedStatType === 'all' ? [
                      {
                        id: '1',
                        customer: '张三',
                        question: '如何重置密码？',
                        answer: '请在登录页面点击"忘记密码"，按照提示操作即可重置密码。',
                        time: '2026-01-29 10:00',
                        feedback: '正确',
                      },
                      {
                        id: '2',
                        customer: '李四',
                        question: '软件如何升级？',
                        answer: '软件会自动检测更新，您也可以在设置页面手动检查更新。',
                        time: '2026-01-29 09:30',
                        feedback: '正确',
                      },
                      {
                        id: '3',
                        customer: '王五',
                        question: '续费价格是多少？',
                        answer: '当前续费价格为899/端口/年，具体价格可能会根据您的订阅情况有所不同。',
                        time: '2026-01-29 11:15',
                        feedback: '错误',
                      },
                      {
                        id: '4',
                        customer: '赵六',
                        question: '如何联系客服？',
                        answer: '您可以通过智能客服系统、电话或邮件联系我们的客服团队。',
                        time: '2026-01-29 14:20',
                        feedback: '正确',
                      },
                    ] : selectedStatType === 'correct' ? [
                      {
                        id: '1',
                        customer: '张三',
                        question: '如何重置密码？',
                        answer: '请在登录页面点击"忘记密码"，按照提示操作即可重置密码。',
                        time: '2026-01-29 10:00',
                        feedback: '正确',
                      },
                      {
                        id: '2',
                        customer: '李四',
                        question: '软件如何升级？',
                        answer: '软件会自动检测更新，您也可以在设置页面手动检查更新。',
                        time: '2026-01-29 09:30',
                        feedback: '正确',
                      },
                      {
                        id: '4',
                        customer: '赵六',
                        question: '如何联系客服？',
                        answer: '您可以通过智能客服系统、电话或邮件联系我们的客服团队。',
                        time: '2026-01-29 14:20',
                        feedback: '正确',
                      },
                    ] : selectedStatType === 'incorrect' ? [
                      {
                        id: '3',
                        customer: '王五',
                        question: '续费价格是多少？',
                        answer: '当前续费价格为899/端口/年，具体价格可能会根据您的订阅情况有所不同。',
                        time: '2026-01-29 11:15',
                        feedback: '错误',
                      },
                    ] : [
                      {
                        id: '1',
                        customer: '张三',
                        question: '如何重置密码？',
                        answer: '请在登录页面点击"忘记密码"，按照提示操作即可重置密码。',
                        time: '2026-01-29 10:00',
                        feedback: '正确',
                      },
                      {
                        id: '2',
                        customer: '李四',
                        question: '软件如何升级？',
                        answer: '软件会自动检测更新，您也可以在设置页面手动检查更新。',
                        time: '2026-01-29 09:30',
                        feedback: '正确',
                      },
                      {
                        id: '3',
                        customer: '王五',
                        question: '续费价格是多少？',
                        answer: '当前续费价格为899/端口/年，具体价格可能会根据您的订阅情况有所不同。',
                        time: '2026-01-29 11:15',
                        feedback: '错误',
                      },
                      {
                        id: '4',
                        customer: '赵六',
                        question: '如何联系客服？',
                        answer: '您可以通过智能客服系统、电话或邮件联系我们的客服团队。',
                        time: '2026-01-29 14:20',
                        feedback: '正确',
                      },
                    ]
                  }
                  rowKey="id" 
                  pagination={{ pageSize: 15 }}
                  size="small"
                />
              </Card>
            </div>
          )}

          {selectedMenu === 'rules' && (
            <div>
              <h3 style={{ marginBottom: 24 }}>规则设置</h3>
              
              {/* 客户分配规则 */}
              <Card title="客户分配规则" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>分配方式:</strong></p>
                  <Select
                    style={{ width: 200, marginBottom: 16 }}
                    defaultValue="轮询分配"
                    options={[
                      { value: 'roundRobin', label: '轮询分配' },
                      { value: 'loadBalancing', label: '负载均衡' },
                      { value: 'manual', label: '手动分配' },
                      { value: 'skillBased', label: '技能匹配' },
                    ]}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>分配规则:</strong></p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                    <input type="checkbox" id="priorityVIP" style={{ marginRight: 6 }} />
                    <label htmlFor="priorityVIP">优先分配VIP客户</label>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                    <input type="checkbox" id="priorityUrgent" style={{ marginRight: 6 }} />
                    <label htmlFor="priorityUrgent">优先分配紧急工单</label>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <input type="checkbox" id="avoidOverload" style={{ marginRight: 6 }} />
                    <label htmlFor="avoidOverload">避免客服过载</label>
                  </div>
                </div>
                <Button type="primary">保存设置</Button>
              </Card>
              
              {/* 客服上下班设置 */}
              <Card title="客服上下班设置" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>工作时间:</strong></p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <div>
                      <p style={{ margin: '0 0 8px 0' }}><strong>周一至周五:</strong></p>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Input type="time" defaultValue="09:00" />
                        <span>至</span>
                        <Input type="time" defaultValue="18:00" />
                      </div>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 8px 0' }}><strong>周六至周日:</strong></p>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Input type="time" defaultValue="10:00" />
                        <span>至</span>
                        <Input type="time" defaultValue="16:00" />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>客服排班:</strong></p>
                  <Select
                    style={{ width: 300, marginBottom: 16 }}
                    placeholder="选择客服"
                    options={[
                      { value: 'cs1', label: '客服A' },
                      { value: 'cs2', label: '客服B' },
                      { value: 'cs3', label: '客服C' },
                      { value: 'cs4', label: '客服D' },
                      { value: 'cs5', label: '客服E' },
                    ]}
                  />
                </div>
                <Button type="primary">保存设置</Button>
              </Card>
              
              {/* 消息超时时间设置 */}
              <Card title="消息超时时间设置" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>超时时间:</strong></p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Input type="number" defaultValue={5} style={{ width: 80 }} />
                      <span>分钟</span>
                    </div>
                    <span>无回复自动转人工</span>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>提醒设置:</strong></p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                    <input type="checkbox" id="remindBefore" style={{ marginRight: 6 }} />
                    <label htmlFor="remindBefore">超时前提醒</label>
                    <Input type="number" defaultValue={2} style={{ width: 60 }} />
                    <span>分钟</span>
                  </div>
                </div>
                <Button type="primary">保存设置</Button>
              </Card>
              
              {/* 标签设置 */}
              <Card title="标签设置" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>自定义标签:</strong></p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                    <Input placeholder="输入标签名称" style={{ flex: 1, maxWidth: 200 }} />
                    <Select
                      style={{ width: 120, marginRight: 8 }}
                      defaultValue="blue"
                      options={[
                        { value: 'blue', label: '蓝色' },
                        { value: 'green', label: '绿色' },
                        { value: 'orange', label: '橙色' },
                        { value: 'purple', label: '紫色' },
                        { value: 'red', label: '红色' },
                        { value: 'cyan', label: '青色' },
                        { value: 'magenta', label: '品红' },
                        { value: 'lime', label: '石灰' },
                      ]}
                    />
                    <Button type="primary">添加标签</Button>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>已添加标签:</strong></p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Tag color="blue" closable>重要客户</Tag>
                    <Tag color="green" closable>技术导向</Tag>
                    <Tag color="orange" closable>高价值</Tag>
                    <Tag color="purple" closable>成长型</Tag>
                    <Tag color="red" closable>价格敏感</Tag>
                    <Tag color="cyan" closable>新客户</Tag>
                    <Tag color="magenta" closable>潜力客户</Tag>
                    <Tag color="lime" closable>服务导向</Tag>
                  </div>
                </div>
                <Button type="primary">保存设置</Button>
              </Card>
              
              {/* 消息发送规则设置 */}
              <Card title="消息发送规则设置" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>消息发送规则:</strong></p>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: '4px 0 8px 0' }}><strong>通知给指定角色:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" id="roleAdmin" style={{ marginRight: 6 }} checked />
                        <label htmlFor="roleAdmin">管理员</label>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" id="roleCS" style={{ marginRight: 6 }} checked />
                        <label htmlFor="roleCS">客服人员</label>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" id="roleOP" style={{ marginRight: 6 }} checked />
                        <label htmlFor="roleOP">运营人员</label>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" id="roleSales" style={{ marginRight: 6 }} />
                        <label htmlFor="roleSales">销售人员</label>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" id="roleCustomer" style={{ marginRight: 6 }} />
                        <label htmlFor="roleCustomer">发送给客户</label>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: '4px 0 8px 0' }}><strong>消息发送设置:</strong></p>
                    <Select
                      style={{ width: 200, marginBottom: 16 }}
                      defaultValue="system"
                      options={[
                        { value: 'system', label: '系统通知' },
                        { value: 'email', label: '邮件通知' },
                        { value: 'sms', label: '短信通知' },
                        { value: 'all', label: '全部通知' },
                      ]}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: '4px 0 8px 0' }}><strong>消息有效时间:</strong></p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Input type="number" defaultValue={24} style={{ width: 80 }} />
                        <span>小时</span>
                      </div>
                      <span>超过时间后消息自动标记为已读</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: '4px 0 8px 0' }}><strong>轮播方式:</strong></p>
                    <Select
                      style={{ width: 200, marginBottom: 16 }}
                      defaultValue="auto"
                      options={[
                        { value: 'auto', label: '自动轮播' },
                        { value: 'manual', label: '手动轮播' },
                        { value: 'none', label: '不轮播' },
                      ]}
                    />
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <p style={{ margin: '4px 0' }}><strong>轮播间隔:</strong></p>
                        <Input type="number" defaultValue={5} style={{ width: 80 }} />
                        <span>秒</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: '4px 0 8px 0' }}><strong>消息发送内容:</strong></p>
                    <TextArea
                      placeholder="请输入发送给客户的消息内容..."
                      style={{ width: '100%', minHeight: 100, marginBottom: 12 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ margin: '4px 0 8px 0' }}><strong>历史发送消息:</strong></p>
                    <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #f0f0f0', borderRadius: 4, padding: 12 }}>
                      <List
                        size="small"
                        dataSource={[
                          {
                            id: '1',
                            content: '您好！您的订阅即将到期，我们为您准备了续费优惠方案，最高可享受8折优惠。',
                            time: '2026-01-28 10:30',
                            recipient: '所有即将到期客户'
                          },
                          {
                            id: '2',
                            content: '感谢您一直以来对我们产品的支持！我们近期推出了新功能，欢迎体验。',
                            time: '2026-01-25 14:20',
                            recipient: '所有活跃客户'
                          },
                          {
                            id: '3',
                            content: '系统将于本周末进行维护升级，预计停机时间为2小时，请提前做好准备。',
                            time: '2026-01-20 09:00',
                            recipient: '所有客户'
                          }
                        ]}
                        renderItem={message => (
                          <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                            <List.Item.Meta
                              title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 12, color: '#666' }}>{message.recipient}</span>
                                  <span style={{ fontSize: 11, color: '#999' }}>{message.time}</span>
                                </div>
                              }
                              description={
                                <div style={{ fontSize: 12, color: '#333', marginTop: 4 }}>
                                  {message.content}
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <Button type="primary">保存设置</Button>
              </Card>
              
              {/* 客户紧急程度配置 */}
              <Card title="客户紧急程度配置" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>客服角色紧急程度设置:</strong></p>
                  <div style={{ marginBottom: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                      <input type="checkbox" id="csUrgentTicket" style={{ marginRight: 6 }} checked />
                      <label htmlFor="csUrgentTicket">客户累计超过3个工单未解决</label>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                      <input type="checkbox" id="csUrgentComplaint" style={{ marginRight: 6 }} checked />
                      <label htmlFor="csUrgentComplaint">客户投诉未处理</label>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <input type="checkbox" id="csUrgentPort" style={{ marginRight: 6 }} checked />
                      <label htmlFor="csUrgentPort">客户端口超过10个</label>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>运营角色紧急程度设置:</strong></p>
                  <div style={{ marginBottom: 12, padding: 12, border: '1px solid #f0f0f0', borderRadius: 4 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                      <input type="checkbox" id="opUrgentExpire" style={{ marginRight: 6 }} checked />
                      <label htmlFor="opUrgentExpire">客户到期未续费</label>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                      <input type="checkbox" id="opUrgentNegotiation" style={{ marginRight: 6 }} checked />
                      <label htmlFor="opUrgentNegotiation">客户价格谈判超过3天没跟进</label>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <input type="checkbox" id="opUrgentChurn" style={{ marginRight: 6 }} checked />
                      <label htmlFor="opUrgentChurn">客户有流失风险</label>
                    </div>
                  </div>
                </div>
                <Button type="primary">保存设置</Button>
              </Card>
              
              {/* 其他系统规则 */}
              <Card title="其他系统规则">
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>工单自动关闭时间:</strong></p>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Input type="number" defaultValue={7} style={{ width: 80 }} />
                      <span>天</span>
                    </div>
                    <span>无活动自动关闭</span>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>客户评价提醒:</strong></p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                    <input type="checkbox" id="enableRating" style={{ marginRight: 6 }} checked />
                    <label htmlFor="enableRating">启用评价提醒</label>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: '4px 0 12px 0' }}><strong>系统通知设置:</strong></p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                    <input type="checkbox" id="notifyNewTicket" style={{ marginRight: 6 }} checked />
                    <label htmlFor="notifyNewTicket">新工单通知</label>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                    <input type="checkbox" id="notifyTicketUpdate" style={{ marginRight: 6 }} checked />
                    <label htmlFor="notifyTicketUpdate">工单状态更新通知</label>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <input type="checkbox" id="notifyOverdue" style={{ marginRight: 6 }} checked />
                    <label htmlFor="notifyOverdue">超时工单通知</label>
                  </div>
                </div>
                <Button type="primary">保存设置</Button>
              </Card>
            </div>
          )}

          {selectedMenu === 'chat' && (
            <div style={{ display: 'flex', gap: 24, height: '100%' }}>
              {/* 左侧客户列表区域 */}
              <div style={{ width: 200, border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8', color: '#333' }}>
                  <h4 style={{ margin: 0, color: '#333' }}>正在沟通的客户</h4>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
                  <List
                    size="small"
                    dataSource={communicatingCustomers}
                    renderItem={customer => (
                      <List.Item 
                        style={{ 
                          cursor: 'pointer', 
                          marginBottom: 8, 
                          borderRadius: 4, 
                          padding: '12px 8px',
                          backgroundColor: selectedCustomer.id === customer.id ? '#f0f8ff' : 'white',
                          color: '#333',
                          border: selectedCustomer.id === customer.id ? '1px solid #1890ff' : '1px solid #f0f0f0'
                        }}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <List.Item.Meta
                          title={customer.name}
                          description={
                            <div>
                              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{customer.所在地区}</div>
                              <div style={{ fontSize: 11, color: '#999' }}>最后活跃: {customer.lastActiveTime.toLocaleTimeString()}</div>
                            </div>
                          }
                        />
                        <Badge 
                          status="processing" 
                          text="沟通中" 
                          style={{ fontSize: 10 }}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
              
              {/* 中间聊天区域 */}
              <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#333' }}>
                  <h4 style={{ margin: 0, color: '#333' }}>智能客服 - {selectedCustomer.name}</h4>
                  <Select
                    style={{ width: 160 }}
                    defaultValue="老板"
                    options={[
                      { value: 'boss', label: '老板' },
                      { value: '内勤', label: '内勤' },
                      { value: '业务员', label: '业务员' },
                      { value: '财务', label: '财务' },
                    ]}
                  />
                </div>
                <div className="chat-messages" style={{ flex: 1, overflow: 'auto', padding: 16, borderBottom: '1px solid #e8e8e8' }}>
                  {messages.map(message => (
                    <div key={message.id} style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: message.sender === 'customer' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '70%', 
                        padding: '12px 16px', 
                        borderRadius: '18px', 
                        wordWrap: 'break-word',
                        backgroundColor: message.sender === 'customer' ? '#1890ff' : '#f0f0f0',
                        color: message.sender === 'customer' ? 'white' : '#333',
                        borderBottomRightRadius: message.sender === 'customer' ? '4px' : '18px',
                        borderBottomLeftRadius: message.sender === 'customer' ? '18px' : '4px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>{message.content}</div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 6, marginLeft: message.sender === 'customer' ? 0 : '12px', marginRight: message.sender === 'customer' ? '12px' : 0 }}>
                        {message.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 问题类型按钮 */}
                <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                
                <div className="chat-input" style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                  <Input
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder="请输入回复..."
                    onPressEnter={handleSendMessage}
                    style={{ flex: 1 }}
                  />
                  <Button type="primary" onClick={handleSendMessage}>
                    发送
                  </Button>
                  <Button type="default" onClick={() => setCreateTicketModalVisible(true)}>
                    发起工单
                  </Button>
                  <Button type="default" onClick={() => {
                    if (!communicatingCustomers.some(c => c.id === selectedCustomer.id)) {
                      setCommunicatingCustomers([...communicatingCustomers, selectedCustomer]);
                      message.success(`已加入与${selectedCustomer.name}的沟通`);
                    } else {
                      message.info(`您已经在与${selectedCustomer.name}沟通中`);
                    }
                  }}>
                    加入沟通
                  </Button>
                </div>
              </div>

              {/* 右侧客户信息区域 */}
              <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 客户基本信息 */}
                <Card title="客户信息" size="small">
                  <div style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>客户名称:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.name}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>所在地区:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.所在地区.split('区')[0]}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '12px' }}>客户类型:</strong>
                      <Tag color={selectedCustomer.customerType === 'KA' ? 'blue' : 'orange'} size="small" style={{ fontSize: '11px' }}>
                        {selectedCustomer.customerType === 'KA' ? 'KA' : '非KA'}
                      </Tag>
                    </p>
                    {selectedCustomer.customerType === 'KA' && selectedCustomer.manufacturers.length > 0 && (
                      <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>合作厂家:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.manufacturers.join('、')}</span></p>
                    )}
                    <p style={{ margin: '2px 0', gridColumn: '1 / -1', fontSize: '13px' }}>
                      <strong style={{ fontSize: '12px' }}>客户主账号:</strong> 
                      <span 
                        onClick={() => setPhoneVisible(!phoneVisible)}
                        style={{ cursor: 'pointer', color: '#1890ff', fontSize: '12px', whiteSpace: 'nowrap' }}
                      >
                        {phoneVisible 
                          ? selectedCustomer.phone 
                          : selectedCustomer.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                        }
                      </span>
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>到期时间:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.nextBillingDate.toLocaleDateString()}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>购买端口:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.purchasePort} 个</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px', gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: '12px' }}>对应版本:</strong>
                      <Tag color={
                        selectedCustomer.plan === '专业版' ? 'blue' :
                        selectedCustomer.plan === '行业版' ? 'green' :
                        selectedCustomer.plan === '订阅版' ? 'orange' :
                        'purple'
                      } size="small" style={{ fontSize: '11px' }}>
                        {selectedCustomer.plan}
                      </Tag>
                      {selectedCustomer.plan === '专业版' && selectedCustomer.remainingPoints !== undefined && (
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => message.info(`客户剩余点数: ${selectedCustomer.remainingPoints}`)}
                          style={{ fontSize: '11px', padding: 0, marginLeft: 4 }}>
                          剩余点数
                        </Button>
                      )}
                    </p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>最后活跃:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.lastActiveTime.toLocaleDateString()}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>投诉次数:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.complaintCount} 次</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>归属类型:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.归属类型}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>归属人:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.归属人}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>归属运营:</strong> <span style={{ fontSize: '12px' }}>{selectedCustomer.assignedTo || '未分配'}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>续费金额:</strong> <span style={{ fontSize: '12px' }}>¥{selectedCustomer.renewalAmount || 0}</span></p>
                    <p style={{ margin: '2px 0', fontSize: '13px', gridColumn: '1 / -1' }}>
                      <strong style={{ fontSize: '12px' }}>跟进状态:</strong> 
                      <Tag color={
                        selectedCustomer.followUpStatus === '初步建联' ? 'blue' :
                        selectedCustomer.followUpStatus === '方案报价' ? 'green' :
                        selectedCustomer.followUpStatus === '价格协商' ? 'orange' :
                        selectedCustomer.followUpStatus === '成功签约' ? 'purple' :
                        'red'
                      } size="small" style={{ fontSize: '11px', marginLeft: 4 }}>
                        {selectedCustomer.followUpStatus}
                      </Tag>
                    </p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>客户标签:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                      {selectedCustomer.tags.map((tag, index) => {
                        const colors = ['blue', 'green', 'orange', 'purple', 'red', 'cyan', 'magenta', 'lime'];
                        const color = colors[index % colors.length];
                        return <Tag key={index} color={color} size="small" style={{ fontSize: '11px' }}>{tag}</Tag>;
                      })}
                    </div>
                    <Button type="dashed" size="small" onClick={handleAddTag} style={{ width: '100%', fontSize: '11px' }}>
                      添加标签
                    </Button>
                  </div>
                  {/* 增值模块 */}
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: '2px 0 8px 0', fontSize: '13px' }}><strong style={{ fontSize: '12px' }}>增值模块:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selectedCustomer.valueAddedModules.map((module, index) => (
                        <Tag key={index} color="blue" size="small" style={{ fontSize: '11px' }}>
                          {module}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <Button 
                      type="primary" 
                      size="default" 
                      onClick={() => setUsageDepthModalVisible(true)}
                      style={{ width: '100%', fontWeight: 'bold' }}
                    >
                      客户软件使用深度
                    </Button>
                  </div>
                </Card>

                {/* 历史工单 */}
                <Card title="历史工单" size="small">
                  <div style={{ maxHeight: 400, overflow: 'auto' }}>
                    <List
                      size="small"
                      dataSource={tickets.filter(t => t.customerName === selectedCustomer.name).slice(0, 3)}
                      renderItem={ticket => (
                        <List.Item
                          key={ticket.id}
                          actions={[
                            <Button 
                              key="view" 
                              type="link" 
                              size="small"
                              onClick={() => handleTicketSelect(ticket.id)}
                            >
                              查看
                            </Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={ticket.title}
                            description={
                              <div>
                                <div>类型: {{
                                  system_issue: '系统问题',
                                  product_suggestion: '产品建议',
                                  training_implementation: '培训实施',
                                  renewal_question: '续费疑问',
                                  issue_escalation: '问题升级',
                                  complaint: '投诉',
                                }[ticket.type]}</div>
                                <div>状态: {{
                                  open: '待处理',
                                  processing: '处理中',
                                  resolved: '已解决',
                                }[ticket.status]}</div>
                                <div>创建时间: {ticket.createdTime.toLocaleDateString()}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    {tickets.filter(t => t.customerName === selectedCustomer.name).length === 0 && (
                      <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
                        暂无历史工单
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {selectedMenu === 'statistics' && (
            <Card>
              <h3 style={{ marginBottom: 24 }}>统计数据</h3>
              
              {/* 续费统计 */}
              <div style={{ marginBottom: 32 }}>
                <h4 style={{ marginBottom: 16 }}>续费统计</h4>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>本月到期客户</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      {customers.filter(c => {
                        const today = new Date();
                        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        return c.nextBillingDate >= thisMonthStart && c.nextBillingDate <= thisMonthEnd;
                      }).length}
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>成功签约率</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      {Math.round((customers.filter(c => c.followUpStatus === '成功签约').length / customers.length) * 100)}%
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>平均续费周期</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                      11.5个月
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>流失客户数</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                      {customers.filter(c => c.followUpStatus === '客户流失').length}
                    </p>
                  </Card>
                </div>
              </div>
              
              {/* 工单处理统计 */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 16 }}>工单处理统计</h4>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>平均处理时间</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      4.2小时
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>工单解决率</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      {Math.round((tickets.filter(t => t.status === 'resolved').length / tickets.length) * 100)}%
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>今日工单量</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                      {tickets.filter(t => {
                        const today = new Date();
                        const ticketDate = new Date(t.createdTime);
                        return ticketDate.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>未处理工单</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                      {tickets.filter(t => t.status === 'open').length}
                    </p>
                  </Card>
                </div>
              </div>
              
              {/* 售后工作统计 */}
              <div>
                <h4 style={{ marginBottom: 16 }}>售后工作统计</h4>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>客服响应时间</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      1.2分钟
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>客户满意度</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      98%
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>平均解决时长</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                      3.5小时
                    </p>
                  </Card>
                  <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>重复问题率</p>
                    <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                      12%
                    </p>
                  </Card>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 工单处理模态框 */}
      <Modal
        title="处理工单"
        open={processModalVisible}
        onOk={handleSaveProcess}
        onCancel={() => setProcessModalVisible(false)}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <p><strong>工单标题:</strong> {currentTicket?.title}</p>
          <p><strong>客户名称:</strong> {currentTicket?.customerName}</p>
          <p><strong>工单类型:</strong> {currentTicket?.type}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>处理状态:</label>
          <Select
            style={{ width: '100%' }}
            value={processStatus}
            onChange={value => setProcessStatus(value)}
            options={[
              { value: 'open', label: '待处理' },
              { value: 'processing', label: '处理中' },
              { value: 'resolved', label: '已解决' },
            ]}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>处理备注:</label>
          <TextArea
            rows={4}
            value={processNotes}
            onChange={e => setProcessNotes(e.target.value)}
            placeholder="请输入处理备注..."
          />
        </div>
      </Modal>

      {/* 创建工单模态框 */}
      <Modal
        title="创建工单"
        open={createTicketModalVisible}
        onOk={handleSaveNewTicket}
        onCancel={() => setCreateTicketModalVisible(false)}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>工单标题:</label>
          <Input
            value={newTicket.title}
            onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
            placeholder="请输入工单标题..."
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>工单内容:</label>
          <TextArea
            rows={4}
            value={newTicket.content}
            onChange={e => setNewTicket({ ...newTicket, content: e.target.value })}
            placeholder="请输入工单内容..."
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>客户名称:</label>
          <Input
            value={newTicket.customerName}
            onChange={e => setNewTicket({ ...newTicket, customerName: e.target.value })}
            placeholder="请输入客户名称..."
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>工单类型:</label>
          <Select
            style={{ width: '100%' }}
            value={newTicket.type}
            onChange={value => setNewTicket({ ...newTicket, type: value })}
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
          <label style={{ display: 'block', marginBottom: 8 }}>处理客服:</label>
          <Select
            style={{ width: '100%' }}
            value={newTicket.assignedTo}
            onChange={value => setNewTicket({ ...newTicket, assignedTo: value })}
            placeholder="请选择处理客服"
            options={[
              { value: '客服A', label: '客服A' },
              { value: '客服B', label: '客服B' },
              { value: '客服C', label: '客服C' },
              { value: '客服D', label: '客服D' },
              { value: '客服E', label: '客服E' },
            ]}
          />
        </div>
      </Modal>

      {/* 跟进记录模态框 */}
      <Modal
        title="跟进记录"
        open={followUpFormVisible}
        onOk={handleSaveFollowUp}
        onCancel={() => setFollowUpFormVisible(false)}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <p><strong>客户名称:</strong> {currentFollowUpCustomer?.name}</p>
          <p><strong>当前状态:</strong> {currentFollowUpCustomer?.followUpStatus}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>跟进状态:</label>
          <Select
            style={{ width: '100%' }}
            value={followUpStatus}
            onChange={value => setFollowUpStatus(value)}
            options={[
              { value: '初步建联', label: '初步建联' },
              { value: '方案报价', label: '方案报价' },
              { value: '价格协商', label: '价格协商' },
              { value: '成功签约', label: '成功签约' },
              { value: '客户流失', label: '客户流失' },
            ]}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>续费金额:</label>
          <Input
            value={currentRenewalPrice}
            onChange={e => setCurrentRenewalPrice(e.target.value)}
            placeholder="请输入续费金额..."
            prefix="¥"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>跟进内容:</label>
          <TextArea
            rows={4}
            value={followUpContent}
            onChange={e => setFollowUpContent(e.target.value)}
            placeholder="请输入跟进内容..."
          />
        </div>
      </Modal>

      {/* 添加标签模态框 */}
      <Modal
        title="添加客户标签"
        open={addTagModalVisible}
        onOk={handleSaveTag}
        onCancel={() => setAddTagModalVisible(false)}
        width={400}
      >
        <Input
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="请输入标签内容..."
        />
      </Modal>

      {/* 主动查询客户模态框 */}
      <Modal
        title="主动查询客户"
        open={addCustomerModalVisible}
        onCancel={() => setAddCustomerModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            value={searchCustomerKeyword}
            onChange={e => handleSearchCustomer(e.target.value)}
            placeholder="请输入客户名称或邮箱..."
            prefix={<UserOutlined />}
          />
        </div>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          <List
            size="small"
            dataSource={filteredCustomers}
            renderItem={customer => (
              <List.Item
                actions={[
                  <Button 
                    key="add" 
                    type="primary" 
                    size="small"
                    onClick={() => handleAddToCurrentRenewal(customer)}
                  >
                    添加到当期续费
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={customer.name}
                  description={
                    <div>
                      <div>{customer.email}</div>
                      <div>到期时间: {customer.nextBillingDate.toLocaleDateString()}</div>
                      <div>当前状态: {customer.followUpStatus}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          {filteredCustomers.length === 0 && searchCustomerKeyword && (
            <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
              未找到匹配的客户
            </div>
          )}
        </div>
      </Modal>

      {/* 分配人员模态框 */}
      <Modal
        title="分配人员"
        open={assignModalVisible}
        onOk={handleSaveAssign}
        onCancel={() => setAssignModalVisible(false)}
        width={400}
      >
        <div style={{ marginBottom: 16 }}>
          <p><strong>客户名称:</strong> {selectedAssignCustomer?.name}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>分配给:</label>
          <Select
            style={{ width: '100%' }}
            value={assignTo}
            onChange={value => setAssignTo(value)}
            options={[
              { value: '张三', label: '张三' },
              { value: '李四', label: '李四' },
              { value: '王五', label: '王五' },
              { value: '赵六', label: '赵六' },
              { value: '钱七', label: '钱七' },
            ]}
          />
        </div>
      </Modal>

      {/* 客户软件使用深度模态框 */}
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
        <div style={{ marginBottom: 24 }}>
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
    </div>
  );
}

export default BossView;