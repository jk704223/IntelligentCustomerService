import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navigation from '../../components/Navigation';
import './记账.css';

function AccountPage() {
  const navigate = useNavigate();
  const { addAccount, getCategoriesByType, items } = useApp();
  const [amount, setAmount] = useState('0.00');
  const [categoryId, setCategoryId] = useState(1); // 默认选择餐饮分类
  const [category, setCategory] = useState('餐饮'); // 默认分类名称
  const [source, setSource] = useState('微信钱包');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [remark, setRemark] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // 账单图片URL
  const [isRecording, setIsRecording] = useState(false); // 语音录制状态
  const [itemId, setItemId] = useState<number | undefined>(undefined); // 关联的物品ID
  const [transactionType, setTransactionType] = useState('支出'); // 交易类型
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null); // 展开的分类ID
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(''); // 选中的子分类
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // 选中的标签
  const [availableTags, setAvailableTags] = useState(['工作', '生活', '娱乐', '紧急', '重要', '日常']); // 可用标签
  const [newTag, setNewTag] = useState(''); // 新标签输入

  // 获取支出分类
  const expenseCategories = getCategoriesByType('expense');
  const sources = ['信用卡', '储蓄卡', '花呗', '美团月付', '微信钱包'];

  // 分类数据（包含子分类）
  const categories = [
    {
      id: 1, 
      name: '餐饮', 
      icon: '🍽️',
      subcategories: ['早餐', '午餐', '晚餐', '外卖', '聚餐', '零食', '饮料']
    },
    {
      id: 2, 
      name: '购物', 
      icon: '🛍️',
      subcategories: ['服装', '电子产品', '家居用品', '化妆品', '书籍', '礼品', '其他']
    },
    {
      id: 3, 
      name: '住宿', 
      icon: '🏠',
      subcategories: ['房租', '水电费', '物业费', '网费', '其他']
    },
    {
      id: 4, 
      name: '出行', 
      icon: '🚗',
      subcategories: ['打车', '公交', '地铁', '加油', '停车', '保养', '其他']
    },
    {
      id: 5, 
      name: '旅行', 
      icon: '✈️',
      subcategories: ['机票', '酒店', '景点', '美食', '交通', '购物', '其他']
    },
    {
      id: 6, 
      name: '人情', 
      icon: '❤️',
      subcategories: ['红包', '礼物', '聚餐', '其他']
    },
    {
      id: 7, 
      name: '医疗', 
      icon: '🏥',
      subcategories: ['挂号', '药品', '检查', '手术', '其他']
    },
    {
      id: 8, 
      name: '咖咖', 
      icon: '☕',
      subcategories: ['咖啡', '奶茶', '茶', '其他饮品']
    },
    {
      id: 9, 
      name: '娱乐', 
      icon: '🎮',
      subcategories: ['电影', '游戏', 'KTV', '运动', '其他']
    },
    {
      id: 10, 
      name: '日常', 
      icon: '📦',
      subcategories: ['洗漱用品', '清洁用品', '厨房用品', '其他']
    },
    {
      id: 11, 
      name: '其他', 
      icon: '📦',
      subcategories: ['其他']
    },
    {
      id: 12, 
      name: '设置', 
      icon: '⚙️',
      subcategories: []
    }
  ];

  // 交易类型
  const transactionTypes = ['支出', '收入', '转账', '借还', '报销', '退款'];

  // 处理分类选择（支持展开/收起）
  const handleCategoryChange = (clickedCategoryId: number, categoryName: string) => {
    // 如果点击的是当前选中的分类，则展开/收起子分类
    if (clickedCategoryId === categoryId && expandedCategory === clickedCategoryId) {
      setExpandedCategory(null);
      setSelectedSubcategory('');
    } else if (clickedCategoryId === categoryId) {
      setExpandedCategory(clickedCategoryId);
    } else {
      setCategoryId(clickedCategoryId);
      setCategory(categoryName);
      setExpandedCategory(clickedCategoryId);
      setSelectedSubcategory('');
    }
  };

  // 处理子分类选择
  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  // 处理标签选择
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 处理添加新标签
  const handleAddTag = () => {
    if (newTag && !availableTags.includes(newTag)) {
      setAvailableTags([...availableTags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    }
  };

  // 处理数字键盘输入
  const handleNumberInput = (number: string) => {
    if (amount === '0.00') {
      if (number === '.') {
        setAmount('0.');
      } else {
        setAmount(number + '.00');
      }
    } else {
      if (number === '.' && amount.includes('.')) {
        return;
      }
      if (number === '.' && !amount.includes('.')) {
        setAmount(amount + '.');
      } else {
        const currentAmount = amount.replace('.', '');
        const newAmount = currentAmount + number;
        const formattedAmount = (parseInt(newAmount) / 100).toFixed(2);
        setAmount(formattedAmount);
      }
    }
  };

  // 处理清除按钮
  const handleClear = () => {
    setAmount('0.00');
  };

  // 处理保存按钮
  const handleSave = () => {
    if (parseFloat(amount) === 0) {
      alert('请输入金额');
      return;
    }
    
    // 添加记账记录
    addAccount({
      amount: parseFloat(amount),
      categoryId,
      category,
      source,
      date,
      remark,
      imageUrl,
      itemId
    });
    
    // 重置表单
    setAmount('0.00');
    setRemark('');
    setItemId(undefined);
    
    alert('记账成功！');
  };

  // 处理再记按钮
  const handleRecordAgain = () => {
    // 重置金额和备注，保留其他设置
    setAmount('0.00');
    setRemark('');
  };

  // 处理语音记账
  const handleVoiceRecord = () => {
    if (!isRecording) {
      // 开始录音
      setIsRecording(true);
      // 模拟语音识别
      setTimeout(() => {
        // 模拟识别结果
        setAmount('50.00');
        setCategoryId(1);
        setCategory('餐饮');
        setRemark('语音识别：午餐');
        setIsRecording(false);
        alert('语音识别成功！已自动填充金额和分类。');
      }, 2000);
    }
  };

  // 自动分类功能
  const autoCategorize = (text: string) => {
    const categoryKeywords = {
      餐饮: ['吃', '饭', '餐', '饮', '外卖', '食堂', '餐厅', '饭店'],
      购物: ['买', '购物', '商场', '超市', '淘宝', '京东'],
      出行: ['车', '交通', '打车', '公交', '地铁', '加油', '停车'],
      娱乐: ['玩', '娱乐', '电影', '游戏', 'KTV', '旅游'],
      医疗: ['医', '药', '医院', '看病', '健康'],
      其他: ['其他']
    };

    for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        const matchedCategory = categories.find(cat => cat.name === categoryName);
        if (matchedCategory) {
          setCategoryId(matchedCategory.id);
          setCategory(matchedCategory.name);
          break;
        }
      }
    }
  };

  // 监听备注变化，自动分类
  useEffect(() => {
    if (remark.length > 0) {
      autoCategorize(remark);
    }
  }, [remark]);

  return (
    <div className="account-page">
      {/* 顶部导航栏 */}
      <div className="header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate(-1)}>
            &lt;
          </button>
          <div className="transaction-types">
            {transactionTypes.map((type) => (
              <button 
                key={type}
                className={`transaction-type-btn ${transactionType === type ? 'active' : ''}`}
                onClick={() => setTransactionType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <button className="settings-btn" onClick={() => navigate('/设置')}>
            ⚙️
          </button>
        </div>
      </div>
      
      {/* 分类选择区 */}
      <div className="category-section">
        <div className="category-grid">
          {categories.map((cat) => (
            <React.Fragment key={cat.id}>
              <button 
                className={`category-item ${categoryId === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id, cat.name)}
              >
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className={`expand-icon ${expandedCategory === cat.id ? 'expanded' : ''}`}>
                    {expandedCategory === cat.id ? '▼' : '▶'}
                  </div>
                )}
              </button>
            </React.Fragment>
          ))}
        </div>
        
        {/* 子分类选择区 */}
        {expandedCategory && (
          <div className="subcategory-section">
            <div className="subcategory-grid">
              {categories.find(cat => cat.id === expandedCategory)?.subcategories.map((subcat, index) => (
                <button 
                  key={index}
                  className={`subcategory-item ${selectedSubcategory === subcat ? 'active' : ''}`}
                  onClick={() => handleSubcategoryChange(subcat)}
                >
                  {subcat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 标签选择区 */}
      <div className="tag-section">
        <div className="tag-header">
          <span>标签</span>
          <div className="tag-input-container">
            <input 
              type="text" 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="添加新标签"
              className="tag-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button className="add-tag-btn" onClick={handleAddTag}>添加</button>
          </div>
        </div>
        <div className="tag-grid">
          {availableTags.map((tag, index) => (
            <button 
              key={index}
              className={`tag-item ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      {/* 功能标签区 */}
      <div className="feature-tags">
        <button className="feature-tag">账户</button>
        <button className="feature-tag">默认账本</button>
        <button className="feature-tag">报销</button>
        <button className="feature-tag">优惠</button>
        <button className="feature-tag">设置</button>
      </div>
      
      {/* 金额和备注区 */}
      <div className="amount-section">
        <div className="amount-display">
          <span className="currency-symbol">¥</span>
          <span className="amount-value">{amount}</span>
        </div>
        <div className="remark-section">
          <input 
            type="text" 
            value={remark} 
            onChange={(e) => setRemark(e.target.value)}
            placeholder="请输入备注信息(最多100字)"
            className="remark-input"
          />
          <button className="date-btn">
            {date.split('-')[1]}月{date.split('-')[2]}日
          </button>
        </div>
        {/* 选中的标签显示 */}
        {selectedTags.length > 0 && (
          <div className="selected-tags">
            {selectedTags.map((tag, index) => (
              <span key={index} className="selected-tag">
                {tag}
                <button 
                  className="remove-tag-btn"
                  onClick={() => handleTagToggle(tag)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* 数字键盘 */}
      <div className="number-keypad">
        <div className="keypad-row">
          <button className="key-btn" onClick={() => handleNumberInput('1')}>1</button>
          <button className="key-btn" onClick={() => handleNumberInput('2')}>2</button>
          <button className="key-btn" onClick={() => handleNumberInput('3')}>3</button>
          <button className="key-btn delete-btn" onClick={handleClear}>✕</button>
        </div>
        <div className="keypad-row">
          <button className="key-btn" onClick={() => handleNumberInput('4')}>4</button>
          <button className="key-btn" onClick={() => handleNumberInput('5')}>5</button>
          <button className="key-btn" onClick={() => handleNumberInput('6')}>6</button>
          <button className="key-btn">-</button>
        </div>
        <div className="keypad-row">
          <button className="key-btn" onClick={() => handleNumberInput('7')}>7</button>
          <button className="key-btn" onClick={() => handleNumberInput('8')}>8</button>
          <button className="key-btn" onClick={() => handleNumberInput('9')}>9</button>
          <button className="key-btn">+</button>
        </div>
        <div className="keypad-row">
          <button className="key-btn record-again-btn" onClick={handleRecordAgain}>再记</button>
          <button className="key-btn" onClick={() => handleNumberInput('0')}>0</button>
          <button className="key-btn" onClick={() => handleNumberInput('.')}>.</button>
          <button className="key-btn save-btn" onClick={handleSave}>保存</button>
        </div>
      </div>

      <Navigation activeTab="account" />
    </div>
  );
}

export default AccountPage;