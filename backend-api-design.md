# 服务商小程序后端API设计文档

## 1. 接口概述

本API设计文档描述了服务商小程序后端系统的API接口，包括认证相关、客户管理、工单管理、消息管理和智能客服等功能模块。这些接口将支持服务商小程序与后端系统的交互，实现客户管理、工单处理、消息推送和问题升级等核心功能。

## 2. 技术栈选择

- **语言**：Node.js
- **框架**：Express 4.x
- **数据库**：MongoDB 4.x
- **缓存**：Redis 6.x
- **认证**：JWT (JSON Web Token)
- **API文档**：Swagger

## 3. 接口设计

### 3.1 认证相关接口

#### 3.1.1 登录接口

- **接口路径**：`/api/auth/login`
- **请求方法**：POST
- **功能描述**：服务商登录，获取访问令牌
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | username | string | 是 | 服务商账号 |
  | password | string | 是 | 服务商密码 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "userInfo": {
        "id": "sp001",
        "name": "服务商A",
        "contactPerson": "张三",
        "phone": "13812345678",
        "email": "service@example.com",
        "region": "北京市朝阳区"
      }
    }
  }
  ```

#### 3.1.2 登出接口

- **接口路径**：`/api/auth/logout`
- **请求方法**：POST
- **功能描述**：服务商登出，销毁访问令牌
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | token | string | 是 | 访问令牌 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "登出成功",
    "data": {
      "success": true
    }
  }
  ```

#### 3.1.3 刷新令牌接口

- **接口路径**：`/api/auth/refresh`
- **请求方法**：POST
- **功能描述**：刷新访问令牌
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | refreshToken | string | 是 | 刷新令牌 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "令牌刷新成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 3.2 客户管理接口

#### 3.2.1 获取客户列表接口

- **接口路径**：`/api/customers`
- **请求方法**：GET
- **功能描述**：获取服务商归属下的所有客户信息
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | pageSize | number | 否 | 每页条数，默认10 |
  | status | string | 否 | 客户状态，可选值：active, expiring, expired |
  | keyword | string | 否 | 搜索关键词，支持客户名称、联系人等 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "customers": [
        {
          "id": "c001",
          "name": "客户A",
          "contactPerson": "李四",
          "phone": "13987654321",
          "email": "customer@example.com",
          "region": "上海市浦东新区",
          "softwareVersion": "专业版",
          "portCount": 50,
          "status": "active",
          "usageScore": 85,
          "unresolvedIssues": 2,
          "lastActiveTime": "2026-01-29T10:00:00Z",
          "expiryDate": "2026-12-31T00:00:00Z"
        },
        // 更多客户...
      ],
      "total": 100,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 3.2.2 获取客户详情接口

- **接口路径**：`/api/customers/:id`
- **请求方法**：GET
- **功能描述**：获取指定客户的详细信息
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 客户ID |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": "c001",
      "name": "客户A",
      "contactPerson": "李四",
      "phone": "13987654321",
      "email": "customer@example.com",
      "region": "上海市浦东新区",
      "softwareVersion": "专业版",
      "portCount": 50,
      "purchaseDate": "2025-01-01T00:00:00Z",
      "expiryDate": "2026-12-31T00:00:00Z",
      "status": "active",
      "serviceProviderId": "sp001",
      "serviceProviderName": "服务商A",
      "usageScore": 85,
      "usageScoreDetails": {
        "loginFrequency": 90,
        "featureUsage": 80,
        "dataInput": 85,
        "trainingCompletion": 95
      },
      "unresolvedIssues": 2,
      "lastActiveTime": "2026-01-29T10:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2026-01-29T10:00:00Z"
    }
  }
  ```

#### 3.2.3 获取客户工单列表接口

- **接口路径**：`/api/customers/:id/tickets`
- **请求方法**：GET
- **功能描述**：获取指定客户的工单列表
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 客户ID |
  | page | number | 否 | 页码，默认1 |
  | pageSize | number | 否 | 每页条数，默认10 |
  | status | string | 否 | 工单状态，可选值：open, processing, resolved |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "tickets": [
        {
          "id": "t001",
          "title": "系统登录失败",
          "content": "尝试登录系统时提示账号或密码错误，但确认账号密码正确。",
          "type": "system_issue",
          "status": "processing",
          "createdAt": "2026-01-28T00:00:00Z",
          "updatedAt": "2026-01-29T10:00:00Z",
          "lastProcessor": "客服小王"
        },
        // 更多工单...
      ],
      "total": 20,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 3.2.4 获取客户使用深度评分接口

- **接口路径**：`/api/customers/:id/usage-score`
- **请求方法**：GET
- **功能描述**：获取指定客户的软件使用深度评分
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 客户ID |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "customerId": "c001",
      "customerName": "客户A",
      "totalScore": 85,
      "scoreLevel": "高",
      "scoreDetails": {
        "loginFrequency": {
          "score": 90,
          "level": "高",
          "description": "登录频率较高，使用活跃"
        },
        "featureUsage": {
          "score": 80,
          "level": "中高",
          "description": "使用了大部分核心功能"
        },
        "dataInput": {
          "score": 85,
          "level": "中高",
          "description": "数据输入量较大，系统使用充分"
        },
        "trainingCompletion": {
          "score": 95,
          "level": "高",
          "description": "培训完成度高，操作规范"
        }
      },
      "suggestions": [
        "可以考虑升级到企业版，获得更多高级功能",
        "建议定期进行系统使用培训，提高团队整体使用水平"
      ],
      "updatedAt": "2026-01-29T00:00:00Z"
    }
  }
  ```

### 3.3 工单管理接口

#### 3.3.1 获取工单列表接口

- **接口路径**：`/api/tickets`
- **请求方法**：GET
- **功能描述**：获取服务商归属下的所有工单信息
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | pageSize | number | 否 | 每页条数，默认10 |
  | status | string | 否 | 工单状态，可选值：open, processing, resolved |
  | type | string | 否 | 工单类型，可选值：system_issue, product_suggestion, training_implementation, renewal_question, issue_escalation, complaint |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "tickets": [
        {
          "id": "t001",
          "customerId": "c001",
          "customerName": "客户A",
          "title": "系统登录失败",
          "content": "尝试登录系统时提示账号或密码错误，但确认账号密码正确。",
          "type": "system_issue",
          "status": "processing",
          "escalationStatus": "normal",
          "createdAt": "2026-01-28T00:00:00Z",
          "updatedAt": "2026-01-29T10:00:00Z",
          "lastProcessor": "客服小王"
        },
        // 更多工单...
      ],
      "total": 50,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 3.3.2 获取工单详情接口

- **接口路径**：`/api/tickets/:id`
- **请求方法**：GET
- **功能描述**：获取指定工单的详细信息
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 工单ID |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": "t001",
      "customerId": "c001",
      "customerName": "客户A",
      "title": "系统登录失败",
      "content": "尝试登录系统时提示账号或密码错误，但确认账号密码正确。",
      "type": "system_issue",
      "status": "processing",
      "escalationStatus": "normal",
      "serviceProviderId": "sp001",
      "serviceProviderName": "服务商A",
      "assigneeId": "cs001",
      "assigneeName": "客服小王",
      "createdAt": "2026-01-28T00:00:00Z",
      "updatedAt": "2026-01-29T10:00:00Z",
      "resolvedAt": null,
      "processingHistory": [
        {
          "id": "h001",
          "operatorId": "cs001",
          "operatorName": "客服小王",
          "action": "assign",
          "content": "工单已分配给客服小王",
          "timestamp": "2026-01-28T09:00:00Z"
        },
        {
          "id": "h002",
          "operatorId": "cs001",
          "operatorName": "客服小王",
          "action": "process",
          "content": "正在处理登录问题",
          "timestamp": "2026-01-29T10:00:00Z"
        }
      ]
    }
  }
  ```

#### 3.3.3 创建工单接口

- **接口路径**：`/api/tickets`
- **请求方法**：POST
- **功能描述**：为客户创建新工单
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | customerId | string | 是 | 客户ID |
  | title | string | 是 | 工单标题 |
  | content | string | 是 | 工单内容 |
  | type | string | 是 | 工单类型，可选值：system_issue, product_suggestion, training_implementation, renewal_question, issue_escalation, complaint |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "创建成功",
    "data": {
      "ticketId": "t002",
      "customerId": "c001",
      "customerName": "客户A",
      "title": "产品功能建议",
      "type": "product_suggestion",
      "status": "open",
      "createdAt": "2026-01-30T00:00:00Z"
    }
  }
  ```

#### 3.3.4 回复工单接口

- **接口路径**：`/api/tickets/:id/reply`
- **请求方法**：POST
- **功能描述**：回复指定工单
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 工单ID |
  | content | string | 是 | 回复内容 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "回复成功",
    "data": {
      "ticketId": "t001",
      "replyId": "r001",
      "content": "已收到您的问题，我们正在处理中",
      "operatorId": "sp001",
      "operatorName": "服务商A",
      "timestamp": "2026-01-30T10:00:00Z"
    }
  }
  ```

#### 3.3.5 标记工单为已解决接口

- **接口路径**：`/api/tickets/:id/resolve`
- **请求方法**：POST
- **功能描述**：将指定工单标记为已解决
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 工单ID |
  | resolution | string | 否 | 解决说明 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "标记成功",
    "data": {
      "ticketId": "t001",
      "status": "resolved",
      "resolvedAt": "2026-01-30T12:00:00Z",
      "resolution": "已重置密码，问题已解决"
    }
  }
  ```

#### 3.3.6 升级工单接口

- **接口路径**：`/api/tickets/:id/escalate`
- **请求方法**：POST
- **功能描述**：将指定工单升级到更高层级的支持
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 工单ID |
  | reason | string | 是 | 升级原因 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "升级成功",
    "data": {
      "ticketId": "t001",
      "escalationStatus": "escalated",
      "reason": "技术复杂度较高，需要专业技术支持",
      "escalatedAt": "2026-01-30T14:00:00Z",
      "notificationSent": true
    }
  }
  ```

### 3.4 消息管理接口

#### 3.4.1 获取消息列表接口

- **接口路径**：`/api/messages`
- **请求方法**：GET
- **功能描述**：获取服务商的消息列表
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | pageSize | number | 否 | 每页条数，默认10 |
  | type | string | 否 | 消息类型，可选值：system_notification, customer_alert, ticket_update |
  | readStatus | string | 否 | 读取状态，可选值：unread, read |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "messages": [
        {
          "id": "m001",
          "type": "ticket_update",
          "title": "工单状态更新",
          "content": "客户A的工单\"系统登录失败\"状态已更新为处理中",
          "relatedCustomerId": "c001",
          "relatedCustomerName": "客户A",
          "relatedTicketId": "t001",
          "readStatus": "unread",
          "createdAt": "2026-01-29T10:00:00Z"
        },
        // 更多消息...
      ],
      "total": 20,
      "page": 1,
      "pageSize": 10,
      "unreadCount": 5
    }
  }
  ```

#### 3.4.2 获取消息详情接口

- **接口路径**：`/api/messages/:id`
- **请求方法**：GET
- **功能描述**：获取指定消息的详细信息
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 消息ID |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": "m001",
      "serviceProviderId": "sp001",
      "type": "ticket_update",
      "title": "工单状态更新",
      "content": "客户A的工单\"系统登录失败\"状态已更新为处理中",
      "relatedCustomerId": "c001",
      "relatedCustomerName": "客户A",
      "relatedTicketId": "t001",
      "readStatus": "read",
      "createdAt": "2026-01-29T10:00:00Z"
    }
  }
  ```

#### 3.4.3 标记消息为已读接口

- **接口路径**：`/api/messages/:id/read`
- **请求方法**：POST
- **功能描述**：将指定消息标记为已读
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | id | string | 是 | 消息ID |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "标记成功",
    "data": {
      "messageId": "m001",
      "readStatus": "read",
      "updatedAt": "2026-01-30T09:00:00Z"
    }
  }
  ```

#### 3.4.4 标记所有消息为已读接口

- **接口路径**：`/api/messages/read-all`
- **请求方法**：POST
- **功能描述**：将所有消息标记为已读
- **请求参数**：无

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "标记成功",
    "data": {
      "success": true,
      "markedCount": 5,
      "updatedAt": "2026-01-30T09:00:00Z"
    }
  }
  ```

### 3.5 智能客服接口

#### 3.5.1 获取聊天消息接口

- **接口路径**：`/api/chat/messages`
- **请求方法**：GET
- **功能描述**：获取与指定客户的聊天消息记录
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | customerId | string | 是 | 客户ID |
  | page | number | 否 | 页码，默认1 |
  | pageSize | number | 否 | 每页条数，默认20 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "messages": [
        {
          "id": "cm001",
          "customerId": "c001",
          "customerName": "客户A",
          "serviceProviderId": "sp001",
          "serviceProviderName": "服务商A",
          "senderType": "customer",
          "content": "您好，我遇到了登录问题",
          "timestamp": "2026-01-29T09:00:00Z",
          "status": "read"
        },
        {
          "id": "cm002",
          "customerId": "c001",
          "customerName": "客户A",
          "serviceProviderId": "sp001",
          "serviceProviderName": "服务商A",
          "senderType": "service_provider",
          "content": "您好，请问具体是什么登录问题？",
          "timestamp": "2026-01-29T09:05:00Z",
          "status": "read"
        },
        // 更多消息...
      ],
      "total": 50,
      "page": 1,
      "pageSize": 20
    }
  }
  ```

#### 3.5.2 发送聊天消息接口

- **接口路径**：`/api/chat/send`
- **请求方法**：POST
- **功能描述**：向客户发送聊天消息
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | customerId | string | 是 | 客户ID |
  | content | string | 是 | 消息内容 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "发送成功",
    "data": {
      "messageId": "cm003",
      "customerId": "c001",
      "customerName": "客户A",
      "content": "请尝试重置密码，操作步骤如下：...",
      "senderType": "service_provider",
      "timestamp": "2026-01-29T09:10:00Z",
      "status": "sent"
    }
  }
  ```

#### 3.5.3 升级聊天到工单接口

- **接口路径**：`/api/chat/escalate`
- **请求方法**：POST
- **功能描述**：将聊天会话升级为工单
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | customerId | string | 是 | 客户ID |
  | content | string | 是 | 工单内容，包含聊天记录摘要 |
  | reason | string | 是 | 升级原因 |

- **响应数据**：
  ```json
  {
    "code": 200,
    "message": "升级成功",
    "data": {
      "ticketId": "t003",
      "customerId": "c001",
      "customerName": "客户A",
      "title": "聊天升级工单",
      "type": "issue_escalation",
      "status": "open",
      "escalationStatus": "escalated",
      "createdAt": "2026-01-29T10:00:00Z"
    }
  }
  ```

## 4. 数据模型设计

### 4.1 服务商模型

```javascript
const serviceProviderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  region: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

### 4.2 客户模型

```javascript
const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  softwareVersion: {
    type: String,
    required: true
  },
  portCount: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expiring', 'expired'],
    default: 'active'
  },
  serviceProviderId: {
    type: String,
    required: true
  },
  serviceProviderName: {
    type: String,
    required: true
  },
  usageScore: {
    type: Number,
    default: 0
  },
  unresolvedIssues: {
    type: Number,
    default: 0
  },
  lastActiveTime: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

### 4.3 工单模型

```javascript
const ticketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['system_issue', 'product_suggestion', 'training_implementation', 'renewal_question', 'issue_escalation', 'complaint'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'processing', 'resolved'],
    default: 'open'
  },
  serviceProviderId: {
    type: String,
    required: true
  },
  assigneeId: {
    type: String
  },
  assigneeName: {
    type: String
  },
  escalationStatus: {
    type: String,
    enum: ['normal', 'escalated'],
    default: 'normal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  processingHistory: [{
    id: {
      type: String,
      required: true
    },
    operatorId: {
      type: String,
      required: true
    },
    operatorName: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});
```

### 4.4 消息模型

```javascript
const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  serviceProviderId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['system_notification', 'customer_alert', 'ticket_update'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  relatedCustomerId: {
    type: String
  },
  relatedCustomerName: {
    type: String
  },
  relatedTicketId: {
    type: String
  },
  readStatus: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### 4.5 聊天消息模型

```javascript
const chatMessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  serviceProviderId: {
    type: String,
    required: true
  },
  serviceProviderName: {
    type: String,
    required: true
  },
  senderType: {
    type: String,
    enum: ['customer', 'service_provider'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  }
});
```

## 5. 系统架构设计

### 5.1 架构分层

- **API层**：处理HTTP请求和响应，包括路由定义、参数验证和错误处理
- **服务层**：实现业务逻辑，处理核心功能
- **数据访问层**：负责数据库操作，包括CRUD操作
- **集成层**：与现有系统进行集成，包括数据同步和消息推送
- **工具层**：提供通用工具函数，如认证、加密、日志等

### 5.2 核心流程

#### 5.2.1 登录流程

1. 服务商输入账号密码
2. 前端发送登录请求到`/api/auth/login`
3. API层接收请求，验证参数
4. 服务层调用认证服务，验证账号密码
5. 数据访问层查询数据库，获取服务商信息
6. 服务层生成JWT令牌
7. API层返回令牌和服务商信息
8. 前端存储令牌并跳转首页

#### 5.2.2 客户管理流程

1. 服务商访问客户列表页
2. 前端发送获取客户列表请求到`/api/customers`
3. API层接收请求，验证令牌
4. 服务层调用客户服务，查询客户列表
5. 数据访问层查询数据库，获取客户信息
6. API层返回客户列表
7. 前端渲染客户列表
8. 服务商点击客户进入详情页
9. 前端发送获取客户详情请求到`/api/customers/:id`
10. API层接收请求，验证令牌
11. 服务层调用客户服务，查询客户详情
12. 数据访问层查询数据库，获取客户详细信息
13. API层返回客户详情
14. 前端渲染客户详情

#### 5.2.3 工单处理流程

1. 服务商访问工单列表页
2. 前端发送获取工单列表请求到`/api/tickets`
3. API层接收请求，验证令牌
4. 服务层调用工单服务，查询工单列表
5. 数据访问层查询数据库，获取工单信息
6. API层返回工单列表
7. 前端渲染工单列表
8. 服务商点击工单进入详情页
9. 前端发送获取工单详情请求到`/api/tickets/:id`
10. API层接收请求，验证令牌
11. 服务层调用工单服务，查询工单详情
12. 数据访问层查询数据库，获取工单详细信息
13. API层返回工单详情
14. 前端渲染工单详情
15. 服务商点击回复或标记为已解决
16. 前端发送相应请求到`/api/tickets/:id/reply`或`/api/tickets/:id/resolve`
17. API层接收请求，验证令牌
18. 服务层调用工单服务，更新工单状态
19. 数据访问层更新数据库中的工单信息
20. API层返回操作结果
21. 前端更新UI

#### 5.2.4 消息推送流程

1. 后端生成消息
2. 数据访问层存储消息到数据库
3. 集成层推送消息到小程序
4. 前端接收消息并更新UI
5. 服务商查看消息
6. 前端发送标记已读请求到`/api/messages/:id/read`
7. API层接收请求，验证令牌
8. 服务层调用消息服务，更新消息状态
9. 数据访问层更新数据库中的消息状态
10. API层返回操作结果

#### 5.2.5 问题升级流程

1. 服务商在工单详情页点击问题升级
2. 前端发送升级请求到`/api/tickets/:id/escalate`
3. API层接收请求，验证令牌
4. 服务层调用工单服务，更新工单状态为已升级
5. 数据访问层更新数据库中的工单信息
6. 集成层通知PC端客服系统
7. API层返回操作结果
8. 前端更新UI

#### 5.2.6 智能客服流程

1. 客户在PC端发起咨询
2. 智能客服系统根据客户归属找到服务商
3. 集成层推送咨询到服务商小程序
4. 服务商在小程序中查看咨询并回复
5. 前端发送回复请求到`/api/chat/send`
6. API层接收请求，验证令牌
7. 服务层调用聊天服务，存储消息
8. 数据访问层存储消息到数据库
9. 集成层同步回复到PC端客服系统
10. 客户在PC端看到回复
11. 如果服务商无法解决，点击问题升级
12. 前端发送升级请求到`/api/chat/escalate`
13. API层接收请求，验证令牌
14. 服务层调用工单服务，创建新工单
15. 数据访问层存储工单信息到数据库
16. 集成层通知PC端客服系统
17. API层返回操作结果
18. 前端更新UI

## 6. 安全性设计

### 6.1 认证与授权

- **JWT认证**：使用JSON Web Token进行身份认证，令牌有效期设置为24小时
- **密码加密**：使用bcrypt对服务商密码进行加密存储
- **访问控制**：基于JWT令牌的访问控制，确保只有授权用户能访问API
- **权限验证**：验证服务商是否有权限访问指定客户的信息

### 6.2 数据安全

- **HTTPS传输**：所有API接口使用HTTPS加密传输
- **输入验证**：对所有用户输入进行验证，防止SQL注入和XSS攻击
- **参数过滤**：过滤敏感参数，防止信息泄露
- **数据脱敏**：对敏感数据进行脱敏处理，如手机号、邮箱等

### 6.3 防护措施

- **请求频率限制**：对API请求进行频率限制，防止暴力破解和DoS攻击
- **IP封禁**：对异常IP进行封禁，防止恶意攻击
- **日志记录**：记录所有API请求和操作日志，便于审计和排查问题
- **错误处理**：统一错误处理，避免敏感信息泄露

## 7. 部署与集成

### 7.1 部署方案

- **服务器**：云服务器或容器平台
- **数据库**：MongoDB Atlas或自建MongoDB集群
- **缓存**：Redis云服务或自建Redis集群
- **API文档**：使用Swagger UI部署API文档

### 7.2 集成方案

- **与现有系统集成**：通过API接口与现有SAAS进销存软件系统进行数据同步
- **消息推送**：使用微信小程序订阅消息或WebSocket进行消息推送
- **智能客服集成**：使用WebHook或消息队列与现有PC端智能客服系统进行集成

### 7.3 数据同步

- **定时同步**：使用定时任务定期同步客户信息、工单状态等数据
- **实时同步**：使用WebSocket或消息队列实现实时数据同步
- **事件驱动**：基于事件驱动的架构，当数据发生变化时触发同步操作

## 8. 监控与维护

### 8.1 监控方案

- **API监控**：监控API接口的响应时间、成功率和错误率
- **系统监控**：监控服务器CPU、内存、磁盘等资源使用情况
- **数据库监控**：监控数据库性能、连接数和查询效率
- **告警机制**：设置告警阈值，当指标异常时发送告警通知

### 8.2 维护方案

- **日志管理**：集中管理系统日志，便于排查问题
- **备份策略**：定期备份数据库和配置文件
- **版本管理**：使用版本控制系统管理代码和配置
- **更新策略**：制定合理的更新策略，确保系统稳定运行

## 9. 总结

本API设计文档详细描述了服务商小程序后端系统的API接口，包括认证相关、客户管理、工单管理、消息管理和智能客服等功能模块。这些接口将支持服务商小程序与后端系统的交互，实现客户管理、工单处理、消息推送和问题升级等核心功能。

通过使用Node.js、Express、MongoDB和JWT等技术栈，我们设计了一个安全、高效、可扩展的后端系统，能够满足服务商小程序的所有功能需求。同时，我们还考虑了系统的安全性、可维护性和可扩展性，确保系统能够稳定运行并支持未来的功能迭代。