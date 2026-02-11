# 🎯 Resend + Web Push 配置指南

## 您选择的方案

✅ **邮件通知**：Resend（免费 3000 封/月）
✅ **推送通知**：Web Push（浏览器原生，完全免费）

**总配置时间：约 20-30 分钟**

---

## 📧 第一步：配置 Resend 邮件通知

### 1️⃣ 注册 Resend 账号

1. **访问 Resend**
   - 打开：https://resend.com
   - 点击右上角 "Sign Up"
   - 使用 GitHub 或邮箱注册

2. **验证邮箱**
   - 查收验证邮件
   - 点击验证链接

### 2️⃣ 验证您的域名（重要！）

**为什么需要验证域名？**
- 提高邮件送达率
- 避免被当作垃圾邮件
- 使用自定义发件人地址

**步骤**：

1. **登录 Resend 后台**
   - 点击左侧菜单 "Domains"
   - 点击 "Add Domain"

2. **添加域名**
   - 输入您的域名（例如：`yourdomain.com`）
   - 点击 "Add"

3. **配置 DNS 记录**
   
   Resend 会显示需要添加的 DNS 记录，通常包括：
   
   ```
   类型: TXT
   名称: _resend
   值: re=xxxxxxxx（Resend 提供的值）
   
   类型: TXT
   名称: @
   值: v=spf1 include:resend.com ~all
   
   类型: CNAME
   名称: resend._domainkey
   值: resend._domainkey.resend.com
   ```

4. **在您的域名服务商添加 DNS 记录**
   
   **如果使用 Cloudflare**：
   - 登录 Cloudflare
   - 选择域名
   - 点击 "DNS"
   - 点击 "Add record"
   - 按照 Resend 提供的值添加记录
   
   **如果使用 GoDaddy/Namecheap 等**：
   - 登录域名管理后台
   - 找到 DNS 管理
   - 添加相应的 TXT 和 CNAME 记录

5. **等待验证**
   - DNS 更新可能需要 5 分钟到 24 小时
   - 在 Resend 后台点击 "Verify"
   - 看到绿色勾号即表示成功 ✅

### 3️⃣ 获取 API Key

1. **在 Resend 后台**
   - 点击左侧菜单 "API Keys"
   - 点击 "Create API Key"

2. **创建 Key**
   - Name: `nail-salon-booking`（随便取名）
   - Permission: 选择 "Sending access"
   - 点击 "Create"

3. **复制 API Key**
   - ⚠️ **重要**：只显示一次，立即复制保存！
   - 格式：`re_xxxxxxxxxxxxxxxxxx`

### 4️⃣ 配置代码

1. **打开 `js/email-notification.js`**

2. **找到第 17-20 行**，修改配置：

```javascript
resend: {
  apiKey: 're_xxxxxxxxxxxxxxxxxx',      // 👈 粘贴您的 API Key
  from: 'nails@yourdomain.com',         // 👈 发件人邮箱（使用验证过的域名）
  to: 'your-email@gmail.com'            // 👈 您接收通知的邮箱
}
```

**示例**：
```javascript
resend: {
  apiKey: 're_AbCdEf123456789',
  from: 'nails@newproudnails.com',  // 假设您的域名是 newproudnails.com
  to: 'admin@gmail.com'              // 您的 Gmail
}
```

3. **确认已启用**

在同一文件，第 10-11 行：
```javascript
enabled: true,        // ✅ 确保是 true
provider: 'resend',   // ✅ 确保是 'resend'
```

### 5️⃣ 测试邮件通知

1. **上传修改后的文件**
   - 上传 `js/email-notification.js` 到您的服务器/GitHub

2. **清除浏览器缓存**
   - Ctrl+Shift+R（Windows）或 Cmd+Shift+R（Mac）

3. **提交测试预约**
   - 访问您的网站
   - 点击"预约"按钮
   - 填写信息并提交

4. **检查邮箱**
   - 查看您配置的接收邮箱
   - 应该收到一封漂亮的 HTML 邮件 ✅
   - ⚠️ 如果没收到，检查垃圾邮件文件夹

5. **查看日志**
   - 打开浏览器 F12 → Console
   - 应该看到：`✅ Resend 邮件发送成功`

---

## 🔔 第二步：配置 Web Push 推送通知

### Web Push 架构说明

Web Push 需要三个组件：
1. **VAPID Keys**（公钥+私钥）
2. **Service Worker**（客户端）
3. **推送服务器**（后端）

### 方案选择

由于 Web Push 需要后端服务器，我提供两种方案：

#### 🌟 方案A：使用 Supabase Edge Function（推荐）

**优点**：
- ✅ 免费
- ✅ 与 Supabase 集成
- ✅ 无需额外服务器

**缺点**：
- ⚠️ 需要配置 Edge Function（稍微复杂）

#### 🌟 方案B：简化版 - 仅浏览器本地通知

**优点**：
- ✅ 超简单，5分钟配置
- ✅ 完全免费
- ✅ 无需服务器

**缺点**：
- ⚠️ 只在用户浏览器打开时有效
- ⚠️ 不是真正的推送（是本地通知）

---

### 🎯 推荐：方案B - 简化版本地通知

**这个方案最简单，立即可用！**

### 1️⃣ 配置本地通知

**修改 `js/push-notification.js`**：

找到第 10-11 行，修改为：
```javascript
enabled: true,
provider: 'local',  // 👈 使用简化的本地通知
```

### 2️⃣ 添加本地通知代码

在 `js/push-notification.js` 文件的 `PushNotification` 类中，添加本地通知方法：

```javascript
// 在第 150 行左右，添加这个方法
async initLocal() {
  // 请求通知权限
  if (!('Notification' in window)) {
    console.warn('⚠️ 浏览器不支持通知');
    return;
  }

  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('✅ 通知权限已授予');
    this.isInitialized = true;
  } else {
    console.log('🔕 用户未授予通知权限');
  }
}

async sendLocalNotification(bookingData) {
  if (!this.isInitialized) {
    console.log('🔕 通知未初始化');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('🎉 新预约通知', {
      body: `${bookingData.customerName} 预约了 ${bookingData.serviceName}\n时间: ${bookingData.bookingTime}`,
      icon: '/images/logo.png',
      badge: '/images/badge.png',
      tag: 'booking-notification',
      requireInteraction: true,
      data: bookingData
    });
    
    console.log('✅ 本地通知已显示');
  }
}
```

### 3️⃣ 修改初始化逻辑

在同一文件中，找到 `init()` 方法（约第 45 行），修改为：

```javascript
async init() {
  if (!this.config.enabled) {
    console.log('🔕 推送通知已禁用');
    return;
  }

  if (this.isInitialized) return;

  const provider = this.config.provider;

  try {
    if (provider === 'local') {
      await this.initLocal();  // 👈 使用本地通知
    } else {
      // 其他推送方式...
    }
    
    this.isInitialized = true;
    console.log('✅ 推送通知已初始化');
  } catch (error) {
    console.error('❌ 推送通知初始化失败:', error);
  }
}
```

### 4️⃣ 修改发送通知逻辑

找到 `sendNewBookingPush()` 方法（约第 163 行），修改为：

```javascript
async sendNewBookingPush(bookingData) {
  if (!this.config.enabled || !this.isInitialized) {
    console.log('🔕 推送通知未启用或未初始化');
    return;
  }

  const provider = this.config.provider;

  try {
    if (provider === 'local') {
      await this.sendLocalNotification(bookingData);  // 👈 发送本地通知
    } else {
      // 其他推送方式...
    }
    
    console.log('✅ 推送通知已发送');
  } catch (error) {
    console.error('❌ 推送通知发送失败:', error);
  }
}
```

### 5️⃣ 测试本地通知

1. **上传修改后的文件**

2. **访问网站**
   - 应该弹出通知权限请求
   - 点击"允许" ✅

3. **提交测试预约**
   - 填写预约信息
   - 点击确认

4. **查看通知**
   - 应该在屏幕右下角（Windows）或右上角（Mac）看到通知
   - 内容包含客户姓名、服务项目、时间

---

## 🚀 完整测试流程

### 测试清单

#### ✅ 邮件通知测试
1. [ ] 提交测试预约
2. [ ] 打开 F12 Console，看到 `✅ Resend 邮件发送成功`
3. [ ] 检查邮箱（包括垃圾邮件文件夹）
4. [ ] 收到漂亮的 HTML 邮件
5. [ ] 邮件包含完整预约信息

#### ✅ 推送通知测试
1. [ ] 访问网站，授予通知权限
2. [ ] 提交测试预约
3. [ ] 看到系统通知弹出
4. [ ] 通知内容正确显示

#### ✅ 管理后台测试
1. [ ] 访问 admin.html
2. [ ] 输入密码登录
3. [ ] 看到测试预约记录
4. [ ] 点击"确认"按钮，状态更新成功

---

## 🛠️ 故障排除

### 问题1：Resend 邮件未收到

**检查清单**：
1. [ ] API Key 是否正确复制？
2. [ ] 域名是否已验证？（Resend 后台查看）
3. [ ] 发件人邮箱是否使用验证过的域名？
4. [ ] 检查垃圾邮件文件夹
5. [ ] 打开 F12 Console 查看错误信息

**常见错误**：
```
❌ 403 Forbidden → API Key 错误或没有权限
❌ Domain not verified → 域名未验证
❌ Invalid from address → 发件人邮箱域名不匹配
```

**解决方法**：
- 重新检查 API Key
- 等待域名验证完成（可能需要24小时）
- 确保 from 邮箱使用验证过的域名

### 问题2：推送通知未显示

**检查清单**：
1. [ ] 是否点击了"允许"通知权限？
2. [ ] 浏览器是否支持通知？
3. [ ] 是否在 HTTPS 环境？（本地 localhost 除外）
4. [ ] 打开 F12 Console 查看错误

**解决方法**：
- 重新访问网站，重新授权
- 使用 Chrome、Firefox、Edge 等现代浏览器
- 确保网站使用 HTTPS

### 问题3：Console 显示错误

**如果看到**：
```
❌ Resend API error
```
- 检查 API Key 是否正确
- 检查网络连接

**如果看到**：
```
⚠️ 浏览器不支持通知
```
- 换一个浏览器试试
- 检查浏览器版本

---

## 📊 使用统计

### Resend 免费额度
- ✅ 每月 3000 封邮件
- ✅ 每天 100 封邮件
- ✅ 适合中小型美甲店

**预估**：
- 每天 10 个预约 = 10 封邮件
- 每月约 300 封邮件
- **远低于免费额度！** 👍

### 本地通知
- ✅ 完全免费
- ✅ 无限制
- ⚠️ 需要用户浏览器打开

---

## 🎯 下一步优化（可选）

### 1. 升级为真正的 Web Push

如果需要真正的推送（即使用户关闭浏览器也能收到）：

**选项A**：换用 OneSignal
- 简单，免费 10,000 用户
- 5分钟配置

**选项B**：搭建 Web Push 服务器
- 需要后端开发
- 使用 Supabase Edge Function

### 2. 添加短信通知

使用 Twilio：
- 注册 Twilio
- 获取 API 凭证
- 添加短信发送代码

### 3. 预约提醒

在预约前 24 小时自动发送提醒邮件/短信

---

## ✅ 完成！

您现在拥有：
- ✅ 专业的邮件通知（Resend）
- ✅ 浏览器本地通知（Web Push 简化版）
- ✅ 完整的管理后台

**立即测试吧！** 💅✨

---

**需要帮助？**
查看 Console 错误信息，或参考 COMPLETE_INSTALLATION_GUIDE.md
