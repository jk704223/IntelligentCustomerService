import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navigation from '../../components/Navigation';
import './记物.css';

function ItemPage() {
  const navigate = useNavigate();
  const { addItem, getCategoriesByType, accounts } = useApp();
  const [name, setName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [usagePeriod, setUsagePeriod] = useState('');
  const [usageUnit, setUsageUnit] = useState('天');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [remark, setRemark] = useState('');
  const [categoryId, setCategoryId] = useState(12); // 默认选择个人护理分类
  const [category, setCategory] = useState('个人护理'); // 默认分类名称
  const [accountId, setAccountId] = useState<number | undefined>(undefined); // 关联的记账记录ID

  // 获取物品分类
  const itemCategories = getCategoriesByType('item');
  const usageUnits = ['天', '周', '月', '年'];

  // 处理分类选择
  const handleCategoryChange = (categoryId: number, categoryName: string) => {
    setCategoryId(categoryId);
    setCategory(categoryName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 添加物品记录
    addItem({
      name,
      purchaseDate,
      usagePeriod: parseInt(usagePeriod),
      usageUnit,
      purchasePrice: parseFloat(purchasePrice) || 0,
      remark,
      categoryId,
      category,
      accountId
    });
    // 跳转到首页
    navigate('/');
  };

  return (
    <div className="item-page">
      <div className="header">
        <h1>记物</h1>
      </div>

      <form className="item-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>物品名称</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="请输入物品名称" 
            required
          />
        </div>

        <div className="form-group">
          <label>物品分类</label>
          <div className="category-selector">
            {itemCategories.map((cat) => (
              <button 
                type="button" 
                key={cat.id}
                className={`category-item ${categoryId === cat.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.id, cat.name)}
                style={{ borderColor: cat.color, backgroundColor: categoryId === cat.id ? cat.color : '' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>购买日期</label>
          <input 
            type="date" 
            value={purchaseDate} 
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>使用周期</label>
          <div className="period-input">
            <input 
              type="number" 
              value={usagePeriod} 
              onChange={(e) => setUsagePeriod(e.target.value)} 
              placeholder="请输入使用周期" 
              required
            />
            <select 
              value={usageUnit} 
              onChange={(e) => setUsageUnit(e.target.value)}
            >
              {usageUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>购买价格</label>
          <input 
            type="number" 
            value={purchasePrice} 
            onChange={(e) => setPurchasePrice(e.target.value)} 
            placeholder="请输入购买价格"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>关联记账记录</label>
          <select 
            value={accountId || ''} 
            onChange={(e) => setAccountId(e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">请选择记账记录</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.date} - {account.category} - ¥{account.amount.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>备注</label>
          <textarea 
            value={remark} 
            onChange={(e) => setRemark(e.target.value)} 
            placeholder="请输入备注（可选）"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          保存
        </button>
      </form>

      <Navigation activeTab="item" />
    </div>
  );
}

export default ItemPage;