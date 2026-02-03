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
  followUpStatus: '初步建联' | '方案报价' | '价格协商' | '成功签约' | '客户流失';
  isCurrentRenewal: boolean;
  归属类型: '公司' | '服务商';
  归属人: string;
  所在地区: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'service';
  timestamp: Date;
}

interface ServiceViewProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const ServiceView: React.FC<ServiceViewProps> = ({ tickets, setTickets }) => {
  const [selectedMenu, setSelectedMenu] = useState<string>('tickets');
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
  });
  const [ticketFilterStatus, setTicketFilterStatus] = useState<string>('all');
  const [renewalFilterStatus, setRenewalFilterStatus] = useState<string>('all');
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);
  const [searchCustomerKeyword, setSearchCustomerKeyword] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

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
    // 模拟搜索客户
    if (keyword) {
      const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(keyword.toLowerCase()) ||
        c.email.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
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
              style={{ width: '100%' }} 
              onClick={() => setSelectedMenu('statistics')}
            >
              统计数据
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
                      // 模拟点击显示完整手机号的功能
                      return (
                        <span 
                          onClick={() => {
                            // 实际项目中这里应该使用状态管理
                            message.info(`完整手机号: ${phone}`);
                          }}
                          style={{ cursor: 'pointer', color: '#1890ff' }}
                        >
                          {phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
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
                    width: 90,
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
                    width: 70,
                    render: () => {
                      const managers = ['张三', '李四', '王五', '赵六', '钱七'];
                      return managers[Math.floor(Math.random() * managers.length)];
                    },
                  },
                  {
                    title: '上次跟进',
                    key: 'lastFollowUp',
                    width: 90,
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
                    width: 100,
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

          {selectedMenu === 'chat' && (
            <div style={{ display: 'flex', gap: 24, height: '100%' }}>
              {/* 左侧客户列表区域 */}
              <div style={{ width: 200, border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8' }}>
                  <h4 style={{ margin: 0 }}>客户列表</h4>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
                  <List
                    size="small"
                    dataSource={customers}
                    renderItem={customer => (
                      <List.Item 
                        style={{ 
                          cursor: 'pointer', 
                          marginBottom: 8, 
                          borderRadius: 4, 
                          padding: '12px 8px',
                          backgroundColor: selectedCustomer.id === customer.id ? '#f0f8ff' : 'white',
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
                          status={customer.status === 'active' ? 'success' : customer.status === 'expiring' ? 'warning' : 'error'} 
                          text={customer.status === 'active' ? '活跃' : customer.status === 'expiring' ? '即将到期' : '已过期'} 
                          style={{ fontSize: 10 }}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div>
              
              {/* 中间聊天区域 */}
              <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 12, borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>智能客服 - {selectedCustomer.name}</h4>
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
                <div className="chat-input" style={{ padding: 16, display: 'flex', gap: 8 }}>
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
                </div>
              </div>

              {/* 右侧客户信息区域 */}
              <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 客户基本信息 */}
                <Card title="客户信息" size="small">
                  <div style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                    <p style={{ margin: '4px 0' }}><strong>客户名称:</strong> {selectedCustomer.name}</p>
                    <p style={{ margin: '4px 0' }}><strong>所在地区:</strong> {selectedCustomer.所在地区.split('区')[0]}</p>
                    <p style={{ margin: '4px 0', gridColumn: '1 / -1' }}>
                      <strong>客户主账号:</strong> 
                      <span 
                        onClick={() => setPhoneVisible(!phoneVisible)}
                        style={{ cursor: 'pointer', color: '#1890ff' }}
                      >
                        {phoneVisible 
                          ? selectedCustomer.phone 
                          : selectedCustomer.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                        }
                      </span>
                    </p>
                    <p style={{ margin: '4px 0' }}><strong>到期时间:</strong> {selectedCustomer.nextBillingDate.toLocaleDateString()}</p>
                    <p style={{ margin: '4px 0' }}><strong>购买端口:</strong> {selectedCustomer.purchasePort} 个</p>
                    <p style={{ margin: '4px 0' }}><strong>对应版本:</strong> {selectedCustomer.plan}</p>
                    <p style={{ margin: '4px 0' }}><strong>最后活跃:</strong> {selectedCustomer.lastActiveTime.toLocaleDateString()}</p>
                    <p style={{ margin: '4px 0' }}><strong>投诉次数:</strong> {selectedCustomer.complaintCount} 次</p>
                    <p style={{ margin: '4px 0' }}><strong>归属类型:</strong> {selectedCustomer.归属类型}</p>
                    <p style={{ margin: '4px 0' }}><strong>归属人:</strong> {selectedCustomer.归属人}</p>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: '4px 0' }}><strong>客户标签:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      {selectedCustomer.tags.map((tag, index) => {
                        const colors = ['blue', 'green', 'orange', 'purple', 'red', 'cyan', 'magenta', 'lime'];
                        const color = colors[index % colors.length];
                        return <Tag key={index} color={color}>{tag}</Tag>;
                      })}
                    </div>
                    <Button type="dashed" size="small" onClick={handleAddTag} style={{ width: '100%' }}>
                      添加标签
                    </Button>
                  </div>
                  <div>
                    <p style={{ margin: '4px 0' }}><strong>跟进状态:</strong></p>
                    <Select 
                      defaultValue={selectedCustomer.followUpStatus} 
                      style={{ width: '100%' }}
                      options={[
                        { value: '初步建联', label: '初步建联' },
                        { value: '方案报价', label: '方案报价' },
                        { value: '价格协商', label: '价格协商' },
                        { value: '成功签约', label: '成功签约' },
                        { value: '客户流失', label: '客户流失' },
                      ]}
                    />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <p style={{ margin: '4px 0' }}><strong>增购业务模块:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['小程序', '勤商', '多组织核算', '返利', '会员管理', '数据分析'].map((module, index) => (
                        <Tag key={index} color="blue">{module}</Tag>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* 历史工单 */}
                <Card title="历史工单" size="small" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, overflow: 'auto', maxHeight: 200 }}>
                    <List
                      size="small"
                      dataSource={tickets.filter(t => t.customerName === selectedCustomer.name).slice(0, 3)}
                      renderItem={ticket => (
                        <List.Item>
                          <List.Item.Meta
                            title={ticket.title}
                            description={`${ticket.type === 'technical' ? '技术问题' : ticket.type === 'feature' ? '功能需求' : ticket.type === 'training' ? '培训需求' : '账单问题'} | ${ticket.createdTime.toLocaleString()}`}
                          />
                          <Badge 
                            status={ticket.status === 'open' ? 'default' : ticket.status === 'processing' ? 'processing' : 'success'} 
                            text={ticket.status === 'open' ? '待处理' : ticket.status === 'processing' ? '处理中' : '已解决'} 
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                  <div style={{ marginTop: 8, textAlign: 'center' }}>
                    <Button type="link" size="small">
                      查看更多工单
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {selectedMenu === 'statistics' && (
            <Card>
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>统计数据</h3>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Select 
                      style={{ width: 120 }}
                      defaultValue="month"
                      options={[
                        { value: 'week', label: '最近一周' },
                        { value: 'month', label: '最近一个月' },
                        { value: 'quarter', label: '最近一季度' },
                        { value: 'year', label: '最近一年' },
                      ]}
                    />
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
                        92%
                      </p>
                    </Card>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>工单响应时间</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                        15分钟
                      </p>
                    </Card>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>客户满意度</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                        4.8/5
                      </p>
                    </Card>
                  </div>
                </div>
                
                {/* 续费统计 */}
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ marginBottom: 16 }}>续费统计</h4>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>本期续费金额</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                        ¥128,000
                      </p>
                    </Card>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>续费转化率</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                        85%
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
                        2
                      </p>
                    </Card>
                  </div>
                </div>
                
                {/* 售后工作统计 */}
                <div>
                  <h4 style={{ marginBottom: 16 }}>售后工作统计</h4>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>本月工单量</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                        68
                      </p>
                    </Card>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>技术问题占比</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                        62%
                      </p>
                    </Card>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>功能需求占比</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#faad14' }}>
                        28%
                      </p>
                    </Card>
                    <Card size="small" style={{ flex: 1, minWidth: 140 }}>
                      <p style={{ margin: 0, fontSize: 14 }}>培训需求占比</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                        10%
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 跟进记录模态框 */}
      <Modal
        title={`跟进客户: ${currentFollowUpCustomer?.name || ''}`}
        open={followUpFormVisible}
        onCancel={() => setFollowUpFormVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setFollowUpFormVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveFollowUp}>
            保存跟进记录
          </Button>,
        ]}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>客户信息:</strong></p>
          <p>{currentFollowUpCustomer?.name} | {currentFollowUpCustomer?.plan} | 到期时间: {currentFollowUpCustomer?.nextBillingDate.toLocaleDateString()}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>跟进内容:</strong></p>
          <TextArea 
            rows={4} 
            placeholder="请输入跟进内容"
            style={{ marginBottom: 12 }}
            value={followUpContent}
            onChange={e => setFollowUpContent(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>跟进状态:</strong></p>
          <Select 
            style={{ width: '100%' }}
            placeholder="请选择跟进状态"
            options={[
              { value: '初步建联', label: '初步建联' },
              { value: '方案报价', label: '方案报价' },
              { value: '价格协商', label: '价格协商' },
              { value: '成功签约', label: '成功签约' },
              { value: '客户流失', label: '客户流失' },
            ]}
            value={followUpStatus}
            onChange={value => setFollowUpStatus(value)}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>当前续费价格:</strong></p>
          <Input
            placeholder="请输入当前续费价格"
            style={{ width: '100%' }}
            value={currentRenewalPrice}
            onChange={e => setCurrentRenewalPrice(e.target.value)}
            prefix="¥"
          />
        </div>
      </Modal>

      {/* 添加标签模态框 */}
      <Modal
        title="添加客户标签"
        open={addTagModalVisible}
        onCancel={() => setAddTagModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddTagModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveTag}>
            保存标签
          </Button>,
        ]}
        width={400}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>标签内容:</strong></p>
          <Input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="请输入标签内容"
            style={{ width: '100%' }}
          />
        </div>
      </Modal>

      {/* 处理工单模态框 */}
      <Modal
        title={`处理工单: ${currentTicket?.title || ''}`}
        open={processModalVisible}
        onCancel={() => setProcessModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setProcessModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveProcess}>
            保存处理结果
          </Button>,
        ]}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>工单信息:</strong></p>
          <p>{currentTicket?.customerName} | {currentTicket?.title}</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>处理状态:</strong></p>
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
          <p style={{ marginBottom: 8 }}><strong>处理备注:</strong></p>
          <TextArea
            rows={4}
            value={processNotes}
            onChange={e => setProcessNotes(e.target.value)}
            placeholder="请输入处理备注"
          />
        </div>
      </Modal>

      {/* 新建工单模态框 */}
      <Modal
        title="新建工单"
        open={createTicketModalVisible}
        onCancel={() => setCreateTicketModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCreateTicketModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveNewTicket}>
            保存工单
          </Button>,
        ]}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>工单标题:</strong></p>
          <Input
            value={newTicket.title}
            onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
            placeholder="请输入工单标题"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>工单内容:</strong></p>
          <TextArea
            rows={4}
            value={newTicket.content}
            onChange={e => setNewTicket({ ...newTicket, content: e.target.value })}
            placeholder="请详细描述问题或需求"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>客户名称:</strong></p>
          <Input
            value={newTicket.customerName}
            onChange={e => setNewTicket({ ...newTicket, customerName: e.target.value })}
            placeholder="请输入客户名称"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 8 }}><strong>工单类型:</strong></p>
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
      </Modal>

      {/* 主动查询客户模态框 */}
      <Modal
        title="主动查询客户"
        open={addCustomerModalVisible}
        onCancel={() => setAddCustomerModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddCustomerModalVisible(false)}>
            取消
          </Button>,
        ]}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索客户名称或邮箱..."
            value={searchCustomerKeyword}
            onChange={e => handleSearchCustomer(e.target.value)}
            style={{ width: '100%' }}
            allowClear
          />
        </div>
        {filteredCustomers.length > 0 ? (
          <Table
            columns={[
              {
                title: '客户名称',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
              },
              {
                title: '到期时间',
                key: 'nextBillingDate',
                render: (_, record: Customer) => record.nextBillingDate.toLocaleDateString(),
              },
              {
                title: '当前状态',
                key: 'status',
                render: (_, record: Customer) => (
                  <Tag color={record.status === 'active' ? 'green' : record.status === 'expiring' ? 'orange' : 'red'}>
                    {record.status === 'active' ? '活跃' : record.status === 'expiring' ? '即将到期' : '已过期'}
                  </Tag>
                ),
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record: Customer) => (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleAddToCurrentRenewal(record)}
                  >
                    添加到当期续费
                  </Button>
                ),
              },
            ]}
            dataSource={filteredCustomers}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            size="small"
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 24 }}>
            {searchCustomerKeyword ? '未找到匹配的客户' : '请输入客户名称或邮箱进行搜索'}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceView;