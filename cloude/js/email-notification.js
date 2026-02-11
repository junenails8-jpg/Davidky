// ==================== email-notification.js ====================
// 邮件通知功能
// 【使用说明】
//   1. 选择邮件服务提供商（Resend / SendGrid / 自定义）
//   2. 填写配置信息
//   3. 启用邮件通知

class EmailNotification {
  constructor() {
    // ==================== 配置区域 ====================
    this.config = {
      enabled: true, // 是否启用邮件通知
      provider: 'resend', // 邮件服务: 'resend' | 'sendgrid' | 'custom'
      
      // Resend 配置 (推荐)
      // 注册地址: https://resend.com
      // 免费额度: 3000封/月
      resend: {
        apiKey: 'YOUR_RESEND_API_KEY', // 替换为您的 Resend API Key
        from: 'nails@yourdomain.com',  // 发件人邮箱（需要验证域名）
        to: 'admin@example.com'         // 接收通知的邮箱
      },

      // SendGrid 配置
      // 注册地址: https://sendgrid.com
      // 免费额度: 100封/天
      sendgrid: {
        apiKey: 'YOUR_SENDGRID_API_KEY',
        from: 'nails@yourdomain.com',
        to: 'admin@example.com'
      },

      // 自定义邮件服务
      custom: {
        endpoint: 'https://your-email-api.com/send',
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        },
        to: 'admin@example.com'
      }
    };
  }

  /**
   * 发送新预约通知邮件
   * @param {Object} bookingData - 预约数据
   */
  async sendNewBookingNotification(bookingData) {
    if (!this.config.enabled) {
      console.log('📧 邮件通知已禁用');
      return { success: false, message: 'Email notification disabled' };
    }

    const provider = this.config.provider;

    try {
      switch (provider) {
        case 'resend':
          return await this.sendViaResend(bookingData);
        case 'sendgrid':
          return await this.sendViaSendGrid(bookingData);
        case 'custom':
          return await this.sendViaCustom(bookingData);
        default:
          console.error('❌ 未知的邮件服务提供商:', provider);
          return { success: false, message: 'Unknown provider' };
      }
    } catch (error) {
      console.error('❌ 邮件发送失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 使用 Resend 发送邮件
   */
  async sendViaResend(bookingData) {
    const config = this.config.resend;
    
    const emailHtml = this.generateEmailHTML(bookingData);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: `🎉 新预约通知 - ${bookingData.customerName}`,
        html: emailHtml
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Resend 邮件发送成功:', result);
      return { success: true, data: result };
    } else {
      throw new Error(result.message || 'Resend API error');
    }
  }

  /**
   * 使用 SendGrid 发送邮件
   */
  async sendViaSendGrid(bookingData) {
    const config = this.config.sendgrid;
    
    const emailHtml = this.generateEmailHTML(bookingData);

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: config.to }]
        }],
        from: { email: config.from },
        subject: `🎉 新预约通知 - ${bookingData.customerName}`,
        content: [{
          type: 'text/html',
          value: emailHtml
        }]
      })
    });

    if (response.ok) {
      console.log('✅ SendGrid 邮件发送成功');
      return { success: true };
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  }

  /**
   * 使用自定义邮件服务
   */
  async sendViaCustom(bookingData) {
    const config = this.config.custom;
    
    const emailHtml = this.generateEmailHTML(bookingData);

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        to: config.to,
        subject: `🎉 新预约通知 - ${bookingData.customerName}`,
        html: emailHtml,
        bookingData: bookingData
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ 自定义邮件发送成功:', result);
      return { success: true, data: result };
    } else {
      throw new Error(result.message || 'Custom email API error');
    }
  }

  /**
   * 生成邮件 HTML 内容
   */
  generateEmailHTML(bookingData) {
    const dateTime = this.formatDateTime(new Date(bookingData.bookingTime));

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      margin: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 28px;
    }
    .email-body {
      padding: 30px;
    }
    .info-row {
      display: flex;
      margin-bottom: 15px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .info-label {
      font-weight: bold;
      color: #667eea;
      min-width: 100px;
    }
    .info-value {
      color: #333;
      flex: 1;
    }
    .highlight {
      background: #fff3cd;
      padding: 15px;
      border-left: 4px solid #ffc107;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #999;
      font-size: 14px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>💅 NEW PROUD NAILS</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">新预约通知</p>
    </div>
    
    <div class="email-body">
      <div class="highlight">
        <strong>🎉 您有一个新的预约！</strong>
      </div>

      <div class="info-row">
        <div class="info-label">👤 客户姓名:</div>
        <div class="info-value">${bookingData.customerName}</div>
      </div>

      <div class="info-row">
        <div class="info-label">📱 联系电话:</div>
        <div class="info-value"><a href="tel:${bookingData.customerPhone}">${bookingData.customerPhone}</a></div>
      </div>

      <div class="info-row">
        <div class="info-label">🕐 预约时间:</div>
        <div class="info-value"><strong>${dateTime}</strong></div>
      </div>

      <div class="info-row">
        <div class="info-label">💅 服务项目:</div>
        <div class="info-value">${bookingData.serviceName}</div>
      </div>

      <div class="info-row">
        <div class="info-label">👩‍💼 指定技师:</div>
        <div class="info-value">${bookingData.staffName}</div>
      </div>

      ${bookingData.notes ? `
      <div class="info-row">
        <div class="info-label">📝 备注:</div>
        <div class="info-value">${bookingData.notes}</div>
      </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center;">
        <a href="YOUR_ADMIN_URL/admin.html" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          查看管理后台
        </a>
      </div>
    </div>

    <div class="footer">
      <p>此邮件由系统自动发送，请勿直接回复</p>
      <p>NEW PROUD NAILS © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * 格式化日期时间
   */
  formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}`;
  }
}

// 创建全局实例
const emailNotification = new EmailNotification();

console.log('📧 邮件通知模块已加载');
