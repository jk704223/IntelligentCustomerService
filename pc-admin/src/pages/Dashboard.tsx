import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Tooltip, Table, Typography, Tag } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  DollarOutlined, 
  CreditCardOutlined, 
  ShoppingCartOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import * as echarts from 'echarts';
import './Dashboard.css';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [expenseChart, setExpenseChart] = useState<echarts.ECharts | null>(null);
  const [balanceChart, setBalanceChart] = useState<echarts.ECharts | null>(null);

  // 模拟数据
  const summaryData = {
    totalExpense: 8560.50,
    totalIncome: 15000.00,
    netIncome: 6439.50,
    accountBalance: 25680.75,
    expenseTrend: [6500, 7200, 8100, 7800, 8500, 8560],
    balanceTrend: [22000, 23500, 24200, 25100, 25500, 25680],
    categoryExpense: [
      { name: '餐饮', value: 2500 },
      { name: '交通', value: 1200 },
      { name: '购物', value: 2800 },
      { name: '娱乐', value: 1000 },
      { name: '其他', value: 1060.50 }
    ],
    recentTransactions: [
      { id: 1, date: '2024-02-09', category: '餐饮', amount: 88.50, type: '支出', status: '已完成' },
      { id: 2, date: '2024-02-08', category: '购物', amount: 199.00, type: '支出', status: '已完成' },
      { id: 3, date: '2024-02-07', category: '工资', amount: 15000.00, type: '收入', status: '已完成' },
      { id: 4, date: '2024-02-06', category: '交通', amount: 25.00, type: '支出', status: '已完成' },
      { id: 5, date: '2024-02-05', category: '娱乐', amount: 150.00, type: '支出', status: '已完成' }
    ],
    upcomingItems: [
      { id: 1, name: '洗发水', purchaseDate: '2024-01-01', expiryDate: '2024-03-31', daysLeft: 50, status: '使用中' },
      { id: 2, name: '牙膏', purchaseDate: '2024-01-01', expiryDate: '2024-03-01', daysLeft: 20, status: '使用中' },
      { id: 3, name: '沐浴露', purchaseDate: '2024-01-01', expiryDate: '2024-03-31', daysLeft: 50, status: '使用中' },
      { id: 4, name: '洗面奶', purchaseDate: '2024-01-01', expiryDate: '2024-03-01', daysLeft: 20, status: '使用中' },
      { id: 5, name: '护肤品套装', purchaseDate: '2024-01-01', expiryDate: '2024-06-30', daysLeft: 140, status: '使用中' }
    ]
  };

  // 初始化图表
  useEffect(() => {
    // 消费趋势图
    const expenseChartDom = document.getElementById('expense-chart');
    if (expenseChartDom) {
      const chart = echarts.init(expenseChartDom);
      setExpenseChart(chart);
      
      const option = {
        title: {
          text: '近6个月消费趋势',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['8月', '9月', '10月', '11月', '12月', '1月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: summaryData.expenseTrend,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#ff4d4f'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
                { offset: 1, color: 'rgba(255, 77, 79, 0.1)' }
              ])
            }
          }
        ]
      };
      
      chart.setOption(option);
    }

    // 账户余额趋势图
    const balanceChartDom = document.getElementById('balance-chart');
    if (balanceChartDom) {
      const chart = echarts.init(balanceChartDom);
      setBalanceChart(chart);
      
      const option = {
        title: {
          text: '近6个月账户余额趋势',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['8月', '9月', '10月', '11月', '12月', '1月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: summaryData.balanceTrend,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#52c41a'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
              ])
            }
          }
        ]
      };
      
      chart.setOption(option);
    }

    // 窗口大小变化时调整图表大小
    const handleResize = () => {
      expenseChart?.resize();
      balanceChart?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      expenseChart?.dispose();
      balanceChart?.dispose();
    };
  }, []);

  // 交易表格列
  const transactionColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number, record: any) => (
        <Text type={record.type === '支出' ? 'danger' : 'success'}>
          {record.type === '支出' ? '-' : '+'}¥{text.toFixed(2)}
        </Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color={text === '支出' ? 'red' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
  ];

  // 物品表格列
  const itemColumns = [
    {
      title: '物品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '购买日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
    },
    {
      title: '过期日期',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: '剩余天数',
      dataIndex: 'daysLeft',
      key: 'daysLeft',
      render: (text: number) => (
        <Text type={text < 30 ? 'danger' : 'default'}>{text}天</Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color="green">{text}</Tag>
      ),
    },
  ];

  return (
    <div className="dashboard">
      <Title level={4}>仪表盘</Title>
      
      {/* 概览卡片 */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col span={6}>
          <Card hoverable className="summary-card">
            <Statistic 
              title="本月支出" 
              value={summaryData.totalExpense} 
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#ff4d4f' }}
              prefix={
                <ArrowUpOutlined style={{ color: '#ff4d4f' }} />
              }
            />
            <div className="card-footer">
              <Text type="secondary">较上月增加 5.2%</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="summary-card">
            <Statistic 
              title="本月收入" 
              value={summaryData.totalIncome} 
              prefix={<CreditCardOutlined />}
              suffix="元"
              valueStyle={{ color: '#52c41a' }}
              prefix={
                <ArrowDownOutlined style={{ color: '#52c41a' }} />
              }
            />
            <div className="card-footer">
              <Text type="secondary">较上月持平</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="summary-card">
            <Statistic 
              title="本月结余" 
              value={summaryData.netIncome} 
              prefix={<ShoppingCartOutlined />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="card-footer">
              <Text type="secondary">较上月减少 3.1%</Text>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="summary-card">
            <Statistic 
              title="账户余额" 
              value={summaryData.accountBalance} 
              prefix={<CalendarOutlined />}
              suffix="元"
              valueStyle={{ color: '#fa8c16' }}
            />
            <div className="card-footer">
              <Progress 
                percent={75} 
                size="small" 
                status="active"
                strokeColor="#fa8c16"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="chart-row">
        <Col span={12}>
          <Card className="chart-card">
            <div id="expense-chart" style={{ width: '100%', height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="chart-card">
            <div id="balance-chart" style={{ width: '100%', height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* 最近交易和即将过期物品 */}
      <Row gutter={[16, 16]} className="table-row">
        <Col span={12}>
          <Card title="最近交易" className="table-card">
            <Table 
              columns={transactionColumns} 
              dataSource={summaryData.recentTransactions} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="即将过期物品" className="table-card">
            <Table 
              columns={itemColumns} 
              dataSource={summaryData.upcomingItems} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// 缺失的图标组件
const BellOutlined: React.FC = () => {
  return <span>🔔</span>;
};

export default Dashboard;