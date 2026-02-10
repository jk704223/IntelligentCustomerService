import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Modal, Form, message, Tooltip, Space, Tag, Popconfirm, Card, Row, Col } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  DownloadOutlined, 
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './AccountManagement.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface AccountRecord {
  id: number;
  date: string;
  category: string;
  subcategory: string;
  amount: number;
  type: '支出' | '收入';
  account: string;
  remark: string;
  tags: string[];
  status: '已完成' | '待处理' | '已取消';
}

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<AccountRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AccountRecord | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    account: '',
    dateRange: null as any,
    status: ''
  });
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const mockAccounts: AccountRecord[] = [
    {
      id: 1,
      date: '2024-02-09',
      category: '餐饮',
      subcategory: '午餐',
      amount: 88.50,
      type: '支出',
      account: '微信钱包',
      remark: '和同事一起吃午餐',
      tags: ['工作', '餐饮'],
      status: '已完成'
    },
    {
      id: 2,
      date: '2024-02-08',
      category: '购物',
      subcategory: '服装',
      amount: 199.00,
      type: '支出',
      account: '花呗',
      remark: '购买新衣服',
      tags: ['生活', '购物'],
      status: '已完成'
    },
    {
      id: 3,
      date: '2024-02-07',
      category: '工资',
      subcategory: '月薪',
      amount: 15000.00,
      type: '收入',
      account: '储蓄卡',
      remark: '2月份工资',
      tags: ['工作', '收入'],
      status: '已完成'
    },
    {
      id: 4,
      date: '2024-02-06',
      category: '交通',
      subcategory: '打车',
      amount: 25.00,
      type: '支出',
      account: '微信钱包',
      remark: '打车回家',
      tags: ['生活', '交通'],
      status: '已完成'
    },
    {
      id: 5,
      date: '2024-02-05',
      category: '娱乐',
      subcategory: '电影',
      amount: 150.00,
      type: '支出',
      account: '信用卡',
      remark: '和朋友看电影',
      tags: ['娱乐', '社交'],
      status: '已完成'
    },
    {
      id: 6,
      date: '2024-02-04',
      category: '住宿',
      subcategory: '房租',
      amount: 3000.00,
      type: '支出',
      account: '储蓄卡',
      remark: '2月份房租',
      tags: ['生活', '住宿'],
      status: '已完成'
    },
    {
      id: 7,
      date: '2024-02-03',
      category: '交通',
      subcategory: '加油',
      amount: 300.00,
      type: '支出',
      account: '储蓄卡',
      remark: '汽车加油',
      tags: ['生活', '交通'],
      status: '已完成'
    },
    {
      id: 8,
      date: '2024-02-02',
      category: '购物',
      subcategory: '家居用品',
      amount: 299.00,
      type: '支出',
      account: '花呗',
      remark: '购买家居用品',
      tags: ['生活', '购物'],
      status: '已完成'
    },
    {
      id: 9,
      date: '2024-02-01',
      category: '餐饮',
      subcategory: '晚餐',
      amount: 120.00,
      type: '支出',
      account: '微信钱包',
      remark: '新年晚餐',
      tags: ['生活', '餐饮'],
      status: '已完成'
    },
    {
      id: 10,
      date: '2024-01-31',
      category: '娱乐',
      subcategory: 'KTV',
      amount: 500.00,
      type: '支出',
      account: '信用卡',
      remark: '跨年聚会',
      tags: ['娱乐', '社交'],
      status: '已完成'
    }
  ];

  // 分类和账户选项
  const categories = ['餐饮', '购物', '交通', '娱乐', '住宿', '医疗', '教育', '工资', '其他'];
  const accountsList = ['信用卡', '储蓄卡', '花呗', '美团月付', '微信钱包'];
  const statusOptions = ['已完成', '待处理', '已取消'];

  // 初始化数据
  useEffect(() => {
    setAccounts(mockAccounts);
    setFilteredAccounts(mockAccounts);
  }, []);

  // 应用筛选
  useEffect(() => {
    let result = [...accounts];

    // 搜索筛选
    if (searchText) {
      result = result.filter(item => 
        item.remark.includes(searchText) ||
        item.category.includes(searchText) ||
        item.account.includes(searchText)
      );
    }

    // 分类筛选
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }

    // 类型筛选
    if (filters.type) {
      result = result.filter(item => item.type === filters.type);
    }

    // 账户筛选
    if (filters.account) {
      result = result.filter(item => item.account === filters.account);
    }

    // 状态筛选
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }

    // 日期筛选
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }

    setFilteredAccounts(result);
  }, [searchText, filters, accounts]);

  // 打开添加模态框
  const handleAdd = () => {
    form.resetFields();
    setIsEditMode(false);
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const handleEdit = (record: AccountRecord) => {
    form.setFieldsValue({
      date: record.date,
      category: record.category,
      subcategory: record.subcategory,
      amount: record.amount,
      type: record.type,
      account: record.account,
      remark: record.remark,
      tags: record.tags,
      status: record.status
    });
    setIsEditMode(true);
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // 删除记录
  const handleDelete = (id: number) => {
    setAccounts(accounts.filter(item => item.id !== id));
    message.success('删除成功');
  };

  // 保存记录
  const handleSave = () => {
    form.validateFields().then(values => {
      if (isEditMode && editingRecord) {
        // 编辑现有记录
        const updatedAccounts = accounts.map(item => 
          item.id === editingRecord.id ? { ...item, ...values } : item
        );
        setAccounts(updatedAccounts);
        message.success('编辑成功');
      } else {
        // 添加新记录
        const newRecord: AccountRecord = {
          id: Date.now(),
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          tags: values.tags || []
        };
        setAccounts([newRecord, ...accounts]);
        message.success('添加成功');
      }
      setIsModalOpen(false);
    }).catch(error => {
      console.error('验证失败:', error);
    });
  };

  // 导出数据
  const handleExport = () => {
    message.success('数据导出成功');
  };

  // 重置筛选
  const handleReset = () => {
    setSearchText('');
    setFilters({
      category: '',
      type: '',
      account: '',
      dateRange: null,
      status: ''
    });
    form.resetFields();
  };

  // 表格列
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: AccountRecord, b: AccountRecord) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: categories.map(category => ({ text: category, value: category })),
      onFilter: (value: string, record: AccountRecord) => record.category === value,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '子分类',
      dataIndex: 'subcategory',
      key: 'subcategory',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: AccountRecord, b: AccountRecord) => a.amount - b.amount,
      sortDirections: ['ascend', 'descend'],
      render: (text: number, record: AccountRecord) => (
        <Tag color={record.type === '支出' ? 'red' : 'green'}>
          {record.type === '支出' ? '-' : '+'}¥{text.toFixed(2)}
        </Tag>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '支出', value: '支出' },
        { text: '收入', value: '收入' },
      ],
      onFilter: (value: string, record: AccountRecord) => record.type === value,
      render: (text: string) => (
        <Tag color={text === '支出' ? 'red' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: '账户',
      dataIndex: 'account',
      key: 'account',
      filters: accountsList.map(account => ({ text: account, value: account })),
      onFilter: (value: string, record: AccountRecord) => record.account === value,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size="small">
          {tags.map((tag, index) => (
            <Tag key={index} color="default">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions.map(status => ({ text: status, value: status })),
      onFilter: (value: string, record: AccountRecord) => record.status === value,
      render: (text: string) => (
        <Tag color={text === '已完成' ? 'green' : text === '待处理' ? 'orange' : 'red'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AccountRecord) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
          />
          <Popconfirm 
            title="确定要删除这条记录吗？" 
            onConfirm={() => handleDelete(record.id)}
            okText="确定" 
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="account-management">
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input 
              placeholder="搜索备注、分类或账户" 
              prefix={<SearchOutlined />} 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Select 
                  placeholder="选择分类" 
                  style={{ width: '100%' }}
                  value={filters.category}
                  onChange={(value) => setFilters({ ...filters, category: value })}
                >
                  <Option value="">全部</Option>
                  {categories.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Select 
                  placeholder="选择类型" 
                  style={{ width: '100%' }}
                  value={filters.type}
                  onChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <Option value="">全部</Option>
                  <Option value="支出">支出</Option>
                  <Option value="收入">收入</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select 
                  placeholder="选择账户" 
                  style={{ width: '100%' }}
                  value={filters.account}
                  onChange={(value) => setFilters({ ...filters, account: value })}
                >
                  <Option value="">全部</Option>
                  {accountsList.map(account => (
                    <Option key={account} value={account}>{account}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <Select 
                  placeholder="选择状态" 
                  style={{ width: '100%' }}
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <Option value="">全部</Option>
                  {statusOptions.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Space>
              <DatePicker.RangePicker 
                style={{ width: '300px' }}
                value={filters.dateRange}
                onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              />
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={handleReset}
              >
                重置筛选
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
              >
                添加记账
              </Button>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
              >
                导出数据
              </Button>
            </Space>
          </Col>
        </Row>
        
        <Table 
          columns={columns} 
          dataSource={filteredAccounts} 
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 添加/编辑模态框 */}
      <Modal
        title={isEditMode ? '编辑记账' : '添加记账'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="date" 
            label="日期" 
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item 
            name="category" 
            label="分类" 
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="选择分类">
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item 
            name="subcategory" 
            label="子分类" 
            rules={[{ required: true, message: '请输入子分类' }]}
          >
            <Input placeholder="输入子分类" />
          </Form.Item>
          <Form.Item 
            name="amount" 
            label="金额" 
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <Input type="number" placeholder="输入金额" />
          </Form.Item>
          <Form.Item 
            name="type" 
            label="类型" 
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="选择类型">
              <Option value="支出">支出</Option>
              <Option value="收入">收入</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="account" 
            label="账户" 
            rules={[{ required: true, message: '请选择账户' }]}
          >
            <Select placeholder="选择账户">
              {accountsList.map(account => (
                <Option key={account} value={account}>{account}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item 
            name="remark" 
            label="备注" 
          >
            <TextArea rows={3} placeholder="输入备注" />
          </Form.Item>
          <Form.Item 
            name="tags" 
            label="标签" 
          >
            <Select 
              mode="tags" 
              placeholder="输入标签" 
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item 
            name="status" 
            label="状态" 
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="选择状态">
              {statusOptions.map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;