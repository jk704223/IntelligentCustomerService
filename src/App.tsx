import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import CustomerView from './views/CustomerView';
import BossView from './views/BossView';
import CustomerServiceView from './views/CustomerServiceView';
import OperationView from './views/OperationView';
import './App.css';

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

const { Header, Content, Footer } = Layout;

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      title: '系统登录失败',
      content: '尝试登录系统时提示账号或密码错误，但我确认账号密码正确。',
      customerName: '张三',
      customerEmail: 'zhangsan@example.com',
      status: 'processing',
      type: 'system_issue',
      createdTime: new Date('2026-01-28'),
      updatedTime: new Date('2026-01-29'),
      lastProcessor: '客服小王',
      lastProcessTime: new Date('2026-01-29T10:30:00'),
    },
    {
      id: '2',
      title: '希望增加批量导出数据功能',
      content: '希望系统能增加批量导出数据的功能，目前每次只能导出一条记录。',
      customerName: '李四',
      customerEmail: 'lisi@example.com',
      status: 'open',
      type: 'product_suggestion',
      createdTime: new Date('2026-01-27'),
      updatedTime: new Date('2026-01-27'),
      lastProcessor: '',
      lastProcessTime: new Date('2026-01-27'),
    },
    {
      id: '3',
      title: '新员工产品使用培训',
      content: '新入职了几个员工，需要安排产品使用培训。',
      customerName: '王五',
      customerEmail: 'wangwu@example.com',
      status: 'processing',
      type: 'training_implementation',
      createdTime: new Date('2026-01-26'),
      updatedTime: new Date('2026-01-27'),
      lastProcessor: '客服小李',
      lastProcessTime: new Date('2026-01-27T14:20:00'),
    },
    {
      id: '4',
      title: '续费优惠政策咨询',
      content: '想了解续费的优惠政策和流程。',
      customerName: '赵六',
      customerEmail: 'zhaoliu@example.com',
      status: 'resolved',
      type: 'renewal_question',
      createdTime: new Date('2026-01-25'),
      updatedTime: new Date('2026-01-26'),
      lastProcessor: '客服小张',
      lastProcessTime: new Date('2026-01-26T09:15:00'),
    },
    {
      id: '5',
      title: '系统卡顿问题升级',
      content: '系统持续卡顿，影响工作效率，需要紧急处理。',
      customerName: '钱七',
      customerEmail: 'qianqi@example.com',
      status: 'processing',
      type: 'issue_escalation',
      createdTime: new Date('2026-01-24'),
      updatedTime: new Date('2026-01-25'),
      lastProcessor: '客服主管',
      lastProcessTime: new Date('2026-01-25T16:45:00'),
    },
    {
      id: '6',
      title: '客服响应速度慢',
      content: '提交工单后客服响应速度太慢，影响问题解决效率。',
      customerName: '孙八',
      customerEmail: 'sunba@example.com',
      status: 'open',
      type: 'complaint',
      createdTime: new Date('2026-01-23'),
      updatedTime: new Date('2026-01-23'),
      lastProcessor: '',
      lastProcessTime: new Date('2026-01-23'),
    },
  ]);

  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdTime' | 'updatedTime' | 'lastProcessor' | 'lastProcessTime'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: (tickets.length + 1).toString(),
      createdTime: new Date(),
      updatedTime: new Date(),
      lastProcessor: '',
      lastProcessTime: new Date(),
    };
    setTickets([...tickets, newTicket]);
  };

  return (
    <Router>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginRight: 32 }}>智能客服系统</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['customer']}
            items={[
              {
                key: 'customer',
                label: <Link to="/">客户视角</Link>,
              },
              {
                key: 'boss',
                label: <Link to="/boss">老板视角</Link>,
              },
              {
                key: 'customer-service',
                label: <Link to="/customer-service">客服视角</Link>,
              },
              {
                key: 'operation',
                label: <Link to="/operation">运营视角</Link>,
              },
            ]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<CustomerView addTicket={addTicket} tickets={tickets} />} />
            <Route path="/boss" element={<BossView tickets={tickets} setTickets={setTickets} />} />
            <Route path="/customer-service" element={<CustomerServiceView tickets={tickets} setTickets={setTickets} />} />
            <Route path="/operation" element={<OperationView tickets={tickets} setTickets={setTickets} />} />
          </Routes>
        </div>
        <Footer style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>智能客服系统 ©{new Date().getFullYear()} Created by 高级软件工程师</Footer>
      </div>
    </Router>
  );
}

export default App;