import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navigation from '../../components/Navigation';
import './设置.css';

function SettingsPage() {
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
  
  // 状态管理
  const [personalInfo, setPersonalInfo] = useState({
    name: '用户',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20simple%20clean%20design&image_size=square',
    phone: '',
    email: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    expenseReminder: true,
    itemExpiry: true,
    budgetAlert: false
  });
  
  const [budgetSettings, setBudgetSettings] = useState({
    monthlyBudget: 3000,
    categoryBudgets: {
      餐饮: 1000,
      交通: 500,
      购物: 800,
      娱乐: 300,
      其他: 400
    }
  });
  
  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    exportFormat: 'JSON'
  });

  // 处理个人信息更新
  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  // 处理通知设置更新
  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  // 处理预算设置更新
  const handleBudgetChange = (field: string, value: number) => {
    setBudgetSettings(prev => ({ ...prev, [field]: value }));
  };

  // 处理分类预算更新
  const handleCategoryBudgetChange = (category: string, value: number) => {
    setBudgetSettings(prev => ({
      ...prev,
      categoryBudgets: {
        ...prev.categoryBudgets,
        [category]: value
      }
    }));
  };

  // 处理数据设置更新
  const handleDataSettingChange = (field: string, value: any) => {
    setDataSettings(prev => ({ ...prev, [field]: value }));
  };

  // 导出数据
  const handleExportData = () => {
    alert('数据导出功能已触发，实际项目中会生成并下载数据文件');
  };

  // 导入数据
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert('数据导入功能已触发，实际项目中会解析并导入数据文件');
    }
  };

  // 清除所有数据
  const handleClearData = () => {
    if (window.confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      alert('数据清除功能已触发，实际项目中会清空所有本地数据');
    }
  };

  return (
    <div className="settings-page">
      <div className="header">
        <h1>设置</h1>
      </div>
      
      <div className="settings-content">
        {/* 个人信息设置 */}
        <div className="settings-section">
          <h2>个人信息</h2>
          <div className="setting-item">
            <label>头像</label>
            <div className="avatar-upload">
              <img src={personalInfo.avatar} alt="头像" className="avatar" />
              <input type="file" accept="image/*" className="avatar-input" />
              <span className="avatar-upload-btn">更换</span>
            </div>
          </div>
          <div className="setting-item">
            <label>用户名</label>
            <input 
              type="text" 
              value={personalInfo.name} 
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>手机号</label>
            <input 
              type="tel" 
              value={personalInfo.phone} 
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              placeholder="请输入手机号"
            />
          </div>
          <div className="setting-item">
            <label>邮箱</label>
            <input 
              type="email" 
              value={personalInfo.email} 
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              placeholder="请输入邮箱"
            />
          </div>
        </div>

        {/* 通知设置 */}
        <div className="settings-section">
          <h2>通知设置</h2>
          <div className="setting-item toggle-item">
            <label>支出提醒</label>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={notificationSettings.expenseReminder} 
                onChange={(e) => handleNotificationChange('expenseReminder', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item toggle-item">
            <label>物品过期提醒</label>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={notificationSettings.itemExpiry} 
                onChange={(e) => handleNotificationChange('itemExpiry', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item toggle-item">
            <label>预算预警</label>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={notificationSettings.budgetAlert} 
                onChange={(e) => handleNotificationChange('budgetAlert', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* 预算设置 */}
        <div className="settings-section">
          <h2>预算设置</h2>
          <div className="setting-item">
            <label>月度总预算</label>
            <div className="budget-input">
              <span className="currency-symbol">¥</span>
              <input 
                type="number" 
                value={budgetSettings.monthlyBudget} 
                onChange={(e) => handleBudgetChange('monthlyBudget', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          <div className="category-budgets">
            <h3>分类预算</h3>
            {Object.entries(budgetSettings.categoryBudgets).map(([category, amount]) => (
              <div className="setting-item" key={category}>
                <label>{category}</label>
                <div className="budget-input">
                  <span className="currency-symbol">¥</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => handleCategoryBudgetChange(category, parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 数据管理 */}
        <div className="settings-section">
          <h2>数据管理</h2>
          <div className="setting-item toggle-item">
            <label>自动备份</label>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={dataSettings.autoBackup} 
                onChange={(e) => handleDataSettingChange('autoBackup', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <label>导出格式</label>
            <select 
              value={dataSettings.exportFormat} 
              onChange={(e) => handleDataSettingChange('exportFormat', e.target.value)}
            >
              <option value="JSON">JSON</option>
              <option value="CSV">CSV</option>
              <option value="Excel">Excel</option>
            </select>
          </div>
          <div className="data-actions">
            <button className="action-btn export-btn" onClick={handleExportData}>
              导出数据
            </button>
            <button className="action-btn import-btn" onClick={() => document.getElementById('file-import')?.click()}>
              导入数据
            </button>
            <input 
              type="file" 
              id="file-import" 
              accept=".json,.csv,.xlsx" 
              className="file-input" 
              onChange={handleImportData}
            />
            <button className="action-btn danger-btn" onClick={handleClearData}>
              清除所有数据
            </button>
          </div>
        </div>

        {/* 关于应用 */}
        <div className="settings-section">
          <h2>关于应用</h2>
          <div className="setting-item">
            <label>版本</label>
            <span className="version-info">1.0.0</span>
          </div>
          <div className="setting-item">
            <label>开发者</label>
            <span className="developer-info">记账小助手团队</span>
          </div>
          <div className="setting-item">
            <label>反馈建议</label>
            <a href="mailto:feedback@example.com" className="feedback-link">发送邮件</a>
          </div>
        </div>
      </div>

      <Navigation activeTab="settings" />
    </div>
  );
}

export default SettingsPage;