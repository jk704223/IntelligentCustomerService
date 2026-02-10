import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义分类类型
interface Category {
  id: number;
  name: string;
  type: 'expense' | 'income' | 'item'; // expense: 支出分类, income: 收入分类, item: 物品分类
  icon?: string;
  color?: string;
}

// 定义记账记录类型
interface Account {
  id: number;
  amount: number;
  categoryId: number; // 使用分类ID替代直接的分类名称
  category: string; // 保留分类名称用于显示
  source: string;
  date: string;
  remark: string;
  createdAt: string;
  itemId?: number; // 关联的物品ID
  imageUrl?: string; // 账单图片URL
}

// 定义物品记录类型
interface Item {
  id: number;
  name: string;
  purchaseDate: string;
  usagePeriod: number;
  usageUnit: string;
  purchasePrice: number;
  remark: string;
  createdAt: string;
  accountId?: number; // 关联的记账记录ID
  categoryId: number; // 物品分类ID
  category: string; // 物品分类名称
}

// 定义上下文类型
interface AppContextType {
  accounts: Account[];
  items: Item[];
  categories: Category[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateAccount: (id: number, account: Partial<Account>) => void;
  updateItem: (id: number, item: Partial<Item>) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteAccount: (id: number) => void;
  deleteItem: (id: number) => void;
  deleteCategory: (id: number) => void;
  getAccountById: (id: number) => Account | undefined;
  getItemById: (id: number) => Item | undefined;
  getCategoryById: (id: number) => Category | undefined;
  getRecentAccounts: (limit: number) => Account[];
  getExpiringItems: (days: number) => Item[];
  getTotalExpense: () => number;
  getCategoryStats: () => { category: string; amount: number }[];
  getSourceStats: () => { source: string; amount: number }[];
  getItemStats: () => {
    totalItems: number;
    expiringItems: number;
    totalValue: number;
  };
  // 关联功能
  linkAccountToItem: (accountId: number, itemId: number) => void;
  linkItemToAccount: (itemId: number, accountId: number) => void;
  getAccountWithItem: (accountId: number) => { account: Account; item?: Item } | undefined;
  getItemWithAccount: (itemId: number) => { item: Item; account?: Account } | undefined;
  // 分类功能
  getCategoriesByType: (type: 'expense' | 'income' | 'item') => Category[];
}

// 创建上下文
const AppContext = createContext<AppContextType | undefined>(undefined);

// 模拟初始分类数据
const initialCategories: Category[] = [
  // 支出分类
  { id: 1, name: '餐饮', type: 'expense', color: '#FF6B6B' },
  { id: 2, name: '交通', type: 'expense', color: '#4ECDC4' },
  { id: 3, name: '购物', type: 'expense', color: '#45B7D1' },
  { id: 4, name: '娱乐', type: 'expense', color: '#96CEB4' },
  { id: 5, name: '医疗', type: 'expense', color: '#FECA57' },
  { id: 6, name: '教育', type: 'expense', color: '#FF9FF3' },
  { id: 7, name: '其他', type: 'expense', color: '#54A0FF' },
  // 收入分类
  { id: 8, name: '工资', type: 'income', color: '#1DD1A1' },
  { id: 9, name: '奖金', type: 'income', color: '#1289A7' },
  { id: 10, name: '投资', type: 'income', color: '#009432' },
  { id: 11, name: '其他收入', type: 'income', color: '#0652DD' },
  // 物品分类
  { id: 12, name: '个人护理', type: 'item', color: '#EE5253' },
  { id: 13, name: '家居用品', type: 'item', color: '#00B894' },
  { id: 14, name: '电子产品', type: 'item', color: '#2D3436' },
  { id: 15, name: '服装鞋帽', type: 'item', color: '#6C5CE7' },
  { id: 16, name: '食品饮料', type: 'item', color: '#FD79A8' },
  { id: 17, name: '其他物品', type: 'item', color: '#A29BFE' }
];

// 模拟初始记账记录数据
const initialAccounts: Account[] = [
  { id: 1, amount: 88.5, categoryId: 1, category: '餐饮', source: '微信钱包', date: '2024-01-01', remark: '午餐和同事聚餐', createdAt: '2024-01-01 12:30:00' },
  { id: 2, amount: 25.0, categoryId: 2, category: '交通', source: '微信钱包', date: '2024-01-01', remark: '打车回家', createdAt: '2024-01-01 18:00:00' },
  { id: 3, amount: 199.0, categoryId: 3, category: '购物', source: '花呗', date: '2023-12-31', remark: '购买生活用品', createdAt: '2023-12-31 14:00:00' },
  { id: 4, amount: 150.0, categoryId: 4, category: '娱乐', source: '信用卡', date: '2023-12-30', remark: '看电影', createdAt: '2023-12-30 20:00:00' },
  { id: 5, amount: 188.0, categoryId: 7, category: '其他', source: '储蓄卡', date: '2023-12-29', remark: '杂项支出', createdAt: '2023-12-29 10:00:00' },
  { id: 6, amount: 59.9, categoryId: 3, category: '购物', source: '微信钱包', date: '2024-01-01', remark: '购买洗发水', createdAt: '2024-01-01 10:00:00', itemId: 1 },
  { id: 7, amount: 19.9, categoryId: 3, category: '购物', source: '微信钱包', date: '2024-01-01', remark: '购买牙膏', createdAt: '2024-01-01 10:00:00', itemId: 2 },
  { id: 8, amount: 49.9, categoryId: 3, category: '购物', source: '微信钱包', date: '2024-01-01', remark: '购买沐浴露', createdAt: '2024-01-01 10:00:00', itemId: 3 },
  { id: 9, amount: 89.9, categoryId: 3, category: '购物', source: '微信钱包', date: '2024-01-01', remark: '购买洗面奶', createdAt: '2024-01-01 10:00:00', itemId: 4 },
  { id: 10, amount: 599.9, categoryId: 3, category: '购物', source: '花呗', date: '2024-01-01', remark: '购买护肤品套装', createdAt: '2024-01-01 10:00:00', itemId: 5 }
];

// 模拟初始物品记录数据
const initialItems: Item[] = [
  { id: 1, name: '洗发水', purchaseDate: '2024-01-01', usagePeriod: 90, usageUnit: '天', purchasePrice: 59.9, remark: '家庭装，适合全家使用', createdAt: '2024-01-01 10:00:00', accountId: 6, categoryId: 12, category: '个人护理' },
  { id: 2, name: '牙膏', purchaseDate: '2024-01-01', usagePeriod: 60, usageUnit: '天', purchasePrice: 19.9, remark: '薄荷味', createdAt: '2024-01-01 10:00:00', accountId: 7, categoryId: 12, category: '个人护理' },
  { id: 3, name: '沐浴露', purchaseDate: '2024-01-01', usagePeriod: 90, usageUnit: '天', purchasePrice: 49.9, remark: '花香型', createdAt: '2024-01-01 10:00:00', accountId: 8, categoryId: 12, category: '个人护理' },
  { id: 4, name: '洗面奶', purchaseDate: '2024-01-01', usagePeriod: 60, usageUnit: '天', purchasePrice: 89.9, remark: '深层清洁', createdAt: '2024-01-01 10:00:00', accountId: 9, categoryId: 12, category: '个人护理' },
  { id: 5, name: '护肤品套装', purchaseDate: '2024-01-01', usagePeriod: 180, usageUnit: '天', purchasePrice: 599.9, remark: '高端护肤品', createdAt: '2024-01-01 10:00:00', accountId: 10, categoryId: 12, category: '个人护理' },
  { id: 6, name: '毛巾', purchaseDate: '2024-01-01', usagePeriod: 180, usageUnit: '天', purchasePrice: 29.9, remark: '纯棉毛巾', createdAt: '2024-01-01 10:00:00', categoryId: 13, category: '家居用品' },
  { id: 7, name: '牙刷', purchaseDate: '2024-01-01', usagePeriod: 90, usageUnit: '天', purchasePrice: 12.9, remark: '软毛牙刷', createdAt: '2024-01-01 10:00:00', categoryId: 12, category: '个人护理' },
  { id: 8, name: '纸巾', purchaseDate: '2024-01-01', usagePeriod: 30, usageUnit: '天', purchasePrice: 19.9, remark: '抽纸', createdAt: '2024-01-01 10:00:00', categoryId: 13, category: '家居用品' },
  { id: 9, name: '洗衣液', purchaseDate: '2024-01-01', usagePeriod: 120, usageUnit: '天', purchasePrice: 49.9, remark: '浓缩洗衣液', createdAt: '2024-01-01 10:00:00', categoryId: 13, category: '家居用品' },
  { id: 10, name: '洗洁精', purchaseDate: '2024-01-01', usagePeriod: 60, usageUnit: '天', purchasePrice: 15.9, remark: '柠檬味', createdAt: '2024-01-01 10:00:00', categoryId: 13, category: '家居用品' }
];

// 上下文提供者组件
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // 添加记账记录
  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now(),
      createdAt: new Date().toLocaleString()
    };
    setAccounts([newAccount, ...accounts]);
  };

  // 添加物品记录
  const addItem = (item: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...item,
      id: Date.now(),
      createdAt: new Date().toLocaleString()
    };
    setItems([newItem, ...items]);
  };

  // 添加分类
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now()
    };
    setCategories([newCategory, ...categories]);
  };

  // 更新记账记录
  const updateAccount = (id: number, account: Partial<Account>) => {
    setAccounts(accounts.map(acc => acc.id === id ? { ...acc, ...account } : acc));
  };

  // 更新物品记录
  const updateItem = (id: number, item: Partial<Item>) => {
    setItems(items.map(it => it.id === id ? { ...it, ...item } : it));
  };

  // 更新分类
  const updateCategory = (id: number, category: Partial<Category>) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, ...category } : cat));
    // 更新相关的记账记录
    setAccounts(accounts.map(acc => acc.categoryId === id ? { ...acc, category: category.name || acc.category } : acc));
    // 更新相关的物品记录
    setItems(items.map(it => it.categoryId === id ? { ...it, category: category.name || it.category } : it));
  };

  // 删除记账记录
  const deleteAccount = (id: number) => {
    // 同时删除关联的物品记录中的accountId
    setItems(items.map(it => it.accountId === id ? { ...it, accountId: undefined } : it));
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  // 删除物品记录
  const deleteItem = (id: number) => {
    // 同时删除关联的记账记录中的itemId
    setAccounts(accounts.map(acc => acc.itemId === id ? { ...acc, itemId: undefined } : acc));
    setItems(items.filter(it => it.id !== id));
  };

  // 删除分类
  const deleteCategory = (id: number) => {
    // 检查是否有关联的记账记录或物品记录
    const has关联记录 = accounts.some(acc => acc.categoryId === id) || items.some(it => it.categoryId === id);
    if (has关联记录) {
      console.warn('无法删除分类，因为有关联的记账记录或物品记录');
      return;
    }
    setCategories(categories.filter(cat => cat.id !== id));
  };

  // 根据ID获取记账记录
  const getAccountById = (id: number) => {
    return accounts.find(acc => acc.id === id);
  };

  // 根据ID获取物品记录
  const getItemById = (id: number) => {
    return items.find(it => it.id === id);
  };

  // 根据ID获取分类
  const getCategoryById = (id: number) => {
    return categories.find(cat => cat.id === id);
  };

  // 获取最近的记账记录
  const getRecentAccounts = (limit: number) => {
    return accounts.slice(0, limit);
  };

  // 获取即将过期的物品
  const getExpiringItems = (days: number) => {
    const today = new Date();
    return items.filter(item => {
      const purchaseDate = new Date(item.purchaseDate);
      const expiryDate = new Date(purchaseDate);
      if (item.usageUnit === '天') {
        expiryDate.setDate(expiryDate.getDate() + item.usagePeriod);
      } else if (item.usageUnit === '周') {
        expiryDate.setDate(expiryDate.getDate() + item.usagePeriod * 7);
      } else if (item.usageUnit === '月') {
        expiryDate.setMonth(expiryDate.getMonth() + item.usagePeriod);
      } else if (item.usageUnit === '年') {
        expiryDate.setFullYear(expiryDate.getFullYear() + item.usagePeriod);
      }
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days && diffDays >= 0;
    });
  };

  // 获取总支出
  const getTotalExpense = () => {
    return accounts.reduce((total, acc) => total + acc.amount, 0);
  };

  // 获取分类统计
  const getCategoryStats = () => {
    const categoryMap = new Map<string, number>();
    accounts.forEach(acc => {
      categoryMap.set(acc.category, (categoryMap.get(acc.category) || 0) + acc.amount);
    });
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  // 获取来源统计
  const getSourceStats = () => {
    const sourceMap = new Map<string, number>();
    accounts.forEach(acc => {
      sourceMap.set(acc.source, (sourceMap.get(acc.source) || 0) + acc.amount);
    });
    return Array.from(sourceMap.entries()).map(([source, amount]) => ({
      source,
      amount
    }));
  };

  // 获取物品统计
  const getItemStats = () => {
    const totalItems = items.length;
    const expiringItems = getExpiringItems(30).length;
    const totalValue = items.reduce((total, item) => total + item.purchasePrice, 0);
    return {
      totalItems,
      expiringItems,
      totalValue
    };
  };

  // 关联记账记录到物品
  const linkAccountToItem = (accountId: number, itemId: number) => {
    // 更新记账记录
    setAccounts(accounts.map(acc => acc.id === accountId ? { ...acc, itemId } : acc));
    // 更新物品记录
    setItems(items.map(it => it.id === itemId ? { ...it, accountId } : it));
  };

  // 关联物品到记账记录
  const linkItemToAccount = (itemId: number, accountId: number) => {
    linkAccountToItem(accountId, itemId);
  };

  // 获取记账记录及其关联的物品
  const getAccountWithItem = (accountId: number) => {
    const account = getAccountById(accountId);
    if (!account) return undefined;
    const item = account.itemId ? getItemById(account.itemId) : undefined;
    return { account, item };
  };

  // 获取物品及其关联的记账记录
  const getItemWithAccount = (itemId: number) => {
    const item = getItemById(itemId);
    if (!item) return undefined;
    const account = item.accountId ? getAccountById(item.accountId) : undefined;
    return { item, account };
  };

  // 根据类型获取分类
  const getCategoriesByType = (type: 'expense' | 'income' | 'item') => {
    return categories.filter(cat => cat.type === type);
  };

  const value: AppContextType = {
    accounts,
    items,
    categories,
    addAccount,
    addItem,
    addCategory,
    updateAccount,
    updateItem,
    updateCategory,
    deleteAccount,
    deleteItem,
    deleteCategory,
    getAccountById,
    getItemById,
    getCategoryById,
    getRecentAccounts,
    getExpiringItems,
    getTotalExpense,
    getCategoryStats,
    getSourceStats,
    getItemStats,
    linkAccountToItem,
    linkItemToAccount,
    getAccountWithItem,
    getItemWithAccount,
    getCategoriesByType
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 自定义钩子，用于使用上下文
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};