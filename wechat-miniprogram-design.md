# 服务商小程序设计方案

## 1. 前端页面结构设计

### 1.1 页面列表

| 页面名称 | 页面路径 | 功能描述 |
|---------|---------|----------|
| 登录页 | `/pages/login/index` | 服务商登录入口，支持账号密码登录 |
| 首页 | `/pages/index/index` | 服务商工作台，展示关键信息和快捷入口 |
| 客户列表页 | `/pages/customer/list` | 展示服务商归属下的所有客户信息 |
| 客户详情页 | `/pages/customer/detail` | 展示客户详细信息，包括软件版本、开通端口、历史工单等 |
| 工单列表页 | `/pages/ticket/list` | 展示所有工单信息，包括待处理、处理中、已解决的工单 |
| 工单详情页 | `/pages/ticket/detail` | 展示工单详细信息，支持问题升级操作 |
| 消息中心页 | `/pages/message/index` | 展示系统通知和客户问题提醒 |
| 个人中心页 | `/pages/profile/index` | 服务商个人信息管理 |

### 1.2 页面详细设计

#### 1.2.1 登录页
- 账号输入框
- 密码输入框
- 登录按钮
- 忘记密码链接
- 注册链接（可选）

#### 1.2.2 首页
- 服务商信息展示
- 待处理工单数量
- 未读消息数量
- 快捷入口：客户管理、工单管理、消息中心
- 数据概览：客户数量、活跃客户数、工单处理率等

#### 1.2.3 客户列表页
- 客户搜索功能
- 客户筛选功能（按状态、按地区等）
- 客户列表展示：
  - 客户名称
  - 软件版本
  - 开通端口
  - 是否有未解决问题
  - 使用深度评分
  - 状态标签（活跃、即将到期、已过期）
- 客户详情入口

#### 1.2.4 客户详情页
- 客户基本信息：名称、联系方式、所在地区等
- 软件信息：版本、开通端口、购买时间、到期时间等
- 历史工单列表：工单号、问题描述、状态、创建时间等
- 当前未解决问题（如果有）
- 客户软件使用深度评分详情
- 快捷操作：创建工单、联系客户、问题升级

#### 1.2.5 工单列表页
- 工单搜索功能
- 工单筛选功能（按状态、按类型等）
- 工单列表展示：
  - 工单号
  - 工单标题
  - 客户名称
  - 状态
  - 创建时间
  - 处理人
- 工单详情入口

#### 1.2.6 工单详情页
- 工单基本信息：标题、类型、状态、创建时间等
- 工单内容：详细描述、截图等
- 处理记录：历史处理步骤和时间
- 操作按钮：回复、标记为已解决、问题升级

#### 1.2.7 消息中心页
- 消息分类：系统通知、客户提醒、工单更新等
- 消息列表展示：
  - 消息标题
  - 消息内容摘要
  - 发送时间
  - 未读标记
- 消息详情入口

#### 1.2.8 个人中心页
- 服务商基本信息：名称、联系方式、所属公司等
- 账号设置：修改密码、绑定手机等
- 系统设置：消息通知开关等
- 关于我们：版本信息、用户协议等

## 2. 技术栈选择

### 2.1 前端技术栈
- **框架**：Taro 3.x（支持React语法）
- **UI组件库**：Taro UI 或 微信小程序原生组件
- **状态管理**：Redux 或 MobX
- **网络请求**：Taro.request 或 axios
- **本地存储**：微信小程序本地存储 API

### 2.2 后端技术栈
- **语言**：Node.js
- **框架**：Express 或 Koa
- **数据库**：MongoDB 或 MySQL
- **缓存**：Redis
- **认证**：JWT

## 3. 后端API接口设计

### 3.1 认证相关接口

| 接口路径 | 方法 | 功能描述 | 请求参数 | 响应数据 |
|---------|------|----------|----------|----------|
| `/api/auth/login` | POST | 服务商登录 | `username`, `password` | `token`, `userInfo` |
| `/api/auth/logout` | POST | 服务商登出 | `token` | `success` |
| `/api/auth/refresh` | POST | 刷新token | `refreshToken` | `newToken` |

### 3.2 客户管理接口

| 接口路径 | 方法 | 功能描述 | 请求参数 | 响应数据 |
|---------|------|----------|----------|----------|
| `/api/customers` | GET | 获取客户列表 | `page`, `pageSize`, `status`, `keyword` | `customers`, `total` |
| `/api/customers/:id` | GET | 获取客户详情 | `id` | `customerInfo` |
| `/api/customers/:id/tickets` | GET | 获取客户工单列表 | `id`, `page`, `pageSize`, `status` | `tickets`, `total` |
| `/api/customers/:id/usage-score` | GET | 获取客户使用深度评分 | `id` | `scoreInfo` |

### 3.3 工单管理接口

| 接口路径 | 方法 | 功能描述 | 请求参数 | 响应数据 |
|---------|------|----------|----------|----------|
| `/api/tickets` | GET | 获取工单列表 | `page`, `pageSize`, `status`, `type` | `tickets`, `total` |
| `/api/tickets/:id` | GET | 获取工单详情 | `id` | `ticketInfo` |
| `/api/tickets` | POST | 创建工单 | `customerId`, `title`, `content`, `type` | `ticketId` |
| `/api/tickets/:id/reply` | POST | 回复工单 | `id`, `content` | `success` |
| `/api/tickets/:id/resolve` | POST | 标记工单为已解决 | `id` | `success` |
| `/api/tickets/:id/escalate` | POST | 升级工单 | `id`, `reason` | `success` |

### 3.4 消息管理接口

| 接口路径 | 方法 | 功能描述 | 请求参数 | 响应数据 |
|---------|------|----------|----------|----------|
| `/api/messages` | GET | 获取消息列表 | `page`, `pageSize`, `type`, `readStatus` | `messages`, `total` |
| `/api/messages/:id` | GET | 获取消息详情 | `id` | `messageInfo` |
| `/api/messages/:id/read` | POST | 标记消息为已读 | `id` | `success` |
| `/api/messages/read-all` | POST | 标记所有消息为已读 | - | `success` |

### 3.5 智能客服接口

| 接口路径 | 方法 | 功能描述 | 请求参数 | 响应数据 |
|---------|------|----------|----------|----------|
| `/api/chat/messages` | GET | 获取聊天消息 | `customerId`, `page`, `pageSize` | `messages` |
| `/api/chat/send` | POST | 发送聊天消息 | `customerId`, `content` | `messageId` |
| `/api/chat/escalate` | POST | 升级聊天到工单 | `customerId`, `content`, `reason` | `ticketId` |

## 4. 数据结构设计

### 4.1 客户信息结构

```json
{
  "id": "string",
  "name": "string",
  "contactPerson": "string",
  "phone": "string",
  "email": "string",
  "region": "string",
  "softwareVersion": "string",
  "portCount": "number",
  "purchaseDate": "date",
  "expiryDate": "date",
  "status": "active|expiring|expired",
  "serviceProviderId": "string",
  "serviceProviderName": "string",
  "usageScore": "number",
  "unresolvedIssues": "number",
  "lastActiveTime": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### 4.2 工单信息结构

```json
{
  "id": "string",
  "customerId": "string",
  "customerName": "string",
  "title": "string",
  "content": "string",
  "type": "system_issue|product_suggestion|training_implementation|renewal_question|issue_escalation|complaint",
  "status": "open|processing|resolved",
  "serviceProviderId": "string",
  "assigneeId": "string",
  "assigneeName": "string",
  "escalationStatus": "normal|escalated",
  "createdAt": "date",
  "updatedAt": "date",
  "resolvedAt": "date",
  "processingHistory": [
    {
      "id": "string",
      "operatorId": "string",
      "operatorName": "string",
      "action": "string",
      "content": "string",
      "timestamp": "date"
    }
  ]
}
```

### 4.3 消息信息结构

```json
{
  "id": "string",
  "serviceProviderId": "string",
  "type": "system_notification|customer_alert|ticket_update",
  "title": "string",
  "content": "string",
  "relatedCustomerId": "string",
  "relatedCustomerName": "string",
  "relatedTicketId": "string",
  "readStatus": "unread|read",
  "createdAt": "date"
}
```

### 4.4 聊天消息结构

```json
{
  "id": "string",
  "customerId": "string",
  "customerName": "string",
  "serviceProviderId": "string",
  "serviceProviderName": "string",
  "senderType": "customer|service_provider",
  "content": "string",
  "timestamp": "date",
  "status": "sent|delivered|read"
}
```

## 5. 系统架构设计

### 5.1 前端架构
- **页面层**：负责UI渲染和用户交互
- **服务层**：负责网络请求和数据处理
- **状态管理层**：负责全局状态管理
- **工具层**：提供通用工具函数

### 5.2 后端架构
- **API层**：处理HTTP请求和响应
- **服务层**：实现业务逻辑
- **数据访问层**：负责数据库操作
- **集成层**：与现有系统进行集成

### 5.3 数据流设计
1. **登录流程**：服务商输入账号密码 → 前端发送登录请求 → 后端验证身份 → 返回token和用户信息 → 前端存储token并跳转首页

2. **客户管理流程**：服务商访问客户列表页 → 前端发送获取客户列表请求 → 后端查询数据库并返回客户列表 → 前端渲染客户列表 → 服务商点击客户进入详情页 → 前端发送获取客户详情请求 → 后端返回客户详情 → 前端渲染客户详情

3. **工单处理流程**：服务商访问工单列表页 → 前端发送获取工单列表请求 → 后端返回工单列表 → 前端渲染工单列表 → 服务商点击工单进入详情页 → 前端发送获取工单详情请求 → 后端返回工单详情 → 前端渲染工单详情 → 服务商点击回复或标记为已解决 → 前端发送相应请求 → 后端更新工单状态 → 返回操作结果

4. **消息推送流程**：后端生成消息 → 存储到数据库 → 推送消息到小程序 → 前端接收消息并更新UI → 服务商查看消息 → 前端发送标记已读请求 → 后端更新消息状态

5. **问题升级流程**：服务商在工单详情页点击问题升级 → 前端发送升级请求 → 后端更新工单状态为已升级 → 通知PC端客服系统 → 返回操作结果

6. **智能客服流程**：客户在PC端发起咨询 → 智能客服系统根据客户归属找到服务商 → 推送咨询到服务商小程序 → 服务商在小程序中查看咨询并回复 → 回复同步到PC端客服系统 → 客户在PC端看到回复 → 如果服务商无法解决，点击问题升级 → 咨询转为工单并升级到PC端客服系统

## 6. 开发计划

### 6.1 前端开发计划
1. 搭建Taro项目框架
2. 实现登录页面
3. 实现首页和导航栏
4. 实现客户列表页和客户详情页
5. 实现工单列表页和工单详情页
6. 实现消息中心页
7. 实现个人中心页
8. 实现与后端API的对接
9. 测试和优化

### 6.2 后端开发计划
1. 搭建Node.js项目框架
2. 实现认证相关接口
3. 实现客户管理接口
4. 实现工单管理接口
5. 实现消息管理接口
6. 实现智能客服接口
7. 实现与现有系统的数据同步
8. 测试和优化

## 7. 技术实现要点

### 7.1 前端实现要点
- 使用Taro框架实现多端兼容
- 实现微信小程序授权登录
- 实现下拉刷新和上拉加载更多
- 实现消息推送和通知
- 实现与后端的WebSocket连接，实时接收消息

### 7.2 后端实现要点
- 使用JWT实现无状态认证
- 实现与现有系统的数据同步，使用定时任务或事件驱动
- 实现消息推送功能，使用微信小程序订阅消息或WebSocket
- 实现智能客服系统的对接，使用WebHook或消息队列

### 7.3 安全实现要点
- 使用HTTPS加密传输
- 实现接口权限控制
- 实现请求频率限制
- 实现敏感信息加密存储
- 实现SQL注入和XSS防护

## 8. 部署计划

### 8.1 前端部署
- 微信小程序代码审核和发布

### 8.2 后端部署
- 部署到云服务器或容器平台
- 配置域名和HTTPS
- 配置数据库和缓存
- 配置监控和告警

## 9. 测试计划

### 9.1 功能测试
- 登录功能测试
- 客户管理功能测试
- 工单处理功能测试
- 消息推送功能测试
- 问题升级功能测试
- 智能客服对接测试

### 9.2 性能测试
- 页面加载速度测试
- 接口响应时间测试
- 并发请求测试

### 9.3 兼容性测试
- 微信小程序不同版本兼容性测试
- 不同设备兼容性测试

## 10. 总结

本设计方案基于微信小程序平台，使用Taro框架实现前端开发，Node.js实现后端开发，旨在为服务商提供一个便捷的客户管理和工单处理工具。通过与现有PC端智能客服系统的对接，实现了客户咨询的实时推送和问题升级功能，提高了服务商的工作效率和客户满意度。

该方案考虑了系统的可扩展性和可维护性，使用了现代化的技术栈和架构设计，为后续的功能迭代和系统升级奠定了基础。