// ==================== booking-integration.js ====================
// 预约功能与 Supabase 集成
// 【功能】连接原有预约UI和Supabase数据库

class BookingIntegration {
  constructor() {
    this.manager = bookingManager; // 使用 supabase-client.js 中的实例
    this.isSubmitting = false;
  }

  /**
   * 初始化预约提交监听
   * 这个函数会监听原有的"确认预约"按钮
   */
  init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupListeners());
    } else {
      this.setupListeners();
    }
  }

  /**
   * 设置事件监听器
   */
  setupListeners() {
    const confirmBtn = document.getElementById('confirmBookingBtn');
    
    if (confirmBtn) {
      // 移除旧的监听器（如果有）
      const newBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
      
      // 添加新的 Supabase 提交监听器
      newBtn.addEventListener('click', (e) => this.handleBookingSubmit(e));
      console.log('✅ Supabase 预约提交监听器已设置');
    } else {
      console.warn('⚠️ 未找到确认预约按钮，3秒后重试...');
      setTimeout(() => this.setupListeners(), 3000);
    }
  }

  /**
   * 处理预约提交
   */
  async handleBookingSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isSubmitting) {
      console.log('⏳ 正在提交中，请勿重复点击');
      return;
    }

    // 收集表单数据
    const bookingData = this.collectFormData();

    // 验证数据
    const validation = this.validateBookingData(bookingData);
    if (!validation.valid) {
      this.showAlert('error', '请完善信息', validation.message);
      return;
    }

    // 提交到 Supabase
    await this.submitToSupabase(bookingData);
  }

  /**
   * 从表单收集数据
   */
  collectFormData() {
    // 获取客户信息
    const customerName = document.getElementById('customerName')?.value?.trim() || '';
    const customerPhone = document.getElementById('customerPhone')?.value?.trim() || '';
    
    // 获取选中的服务
    const selectedService = document.querySelector('.service-option.selected');
    const serviceName = selectedService?.dataset?.service || '';
    
    // 获取选中的技师
    const selectedStaff = document.querySelector('.staff-option.selected');
    const staffName = selectedStaff?.dataset?.staff || '';
    
    // 获取选中的日期和时间
    const selectedDate = document.querySelector('.date-option.selected');
    const dateValue = selectedDate?.dataset?.date || '';
    
    const selectedTime = document.querySelector('.time-option.selected');
    const timeValue = selectedTime?.dataset?.time || '';
    
    // 获取备注
    const notes = document.getElementById('bookingNotes')?.value?.trim() || '';

    // 组合日期时间为 ISO 8601 格式
    let bookingTime = '';
    if (dateValue && timeValue) {
      bookingTime = `${dateValue}T${timeValue}:00`;
    }

    return {
      customerName,
      customerPhone,
      serviceName,
      staffName,
      bookingTime,
      notes
    };
  }

  /**
   * 验证预约数据
   */
  validateBookingData(data) {
    if (!data.customerName) {
      return { valid: false, message: '请输入您的姓名' };
    }
    if (!data.customerPhone) {
      return { valid: false, message: '请输入联系电话' };
    }
    if (!/^[\d\s\-\+\(\)]+$/.test(data.customerPhone)) {
      return { valid: false, message: '电话格式不正确' };
    }
    if (!data.serviceName) {
      return { valid: false, message: '请选择服务项目' };
    }
    if (!data.staffName) {
      return { valid: false, message: '请选择技师' };
    }
    if (!data.bookingTime) {
      return { valid: false, message: '请选择预约时间' };
    }

    // 检查时间是否在未来
    const bookingDate = new Date(data.bookingTime);
    const now = new Date();
    if (bookingDate <= now) {
      return { valid: false, message: '预约时间必须是未来时间' };
    }

    return { valid: true };
  }

  /**
   * 提交到 Supabase
   */
  async submitToSupabase(bookingData) {
    this.isSubmitting = true;
    this.showLoadingState(true);

    try {
      // 先检查时间段是否已被预约
      const isBooked = await this.manager.isTimeSlotBooked(
        bookingData.bookingTime,
        bookingData.staffName
      );

      if (isBooked) {
        this.showAlert('error', '时间冲突', '该时间段已被预约，请选择其他时间');
        this.isSubmitting = false;
        this.showLoadingState(false);
        return;
      }

      // 提交预约
      const result = await this.manager.createBooking(bookingData);

      if (result.success) {
        this.showAlert('success', '预约成功！', `您的预约已确认\n时间: ${this.formatDateTime(bookingData.bookingTime)}`);
        
        // ========== 发送通知 ==========
        // 发送邮件通知
        if (typeof emailNotification !== 'undefined') {
          emailNotification.sendNewBookingNotification(bookingData).then(emailResult => {
            if (emailResult.success) {
              console.log('✅ 邮件通知已发送');
            } else {
              console.warn('⚠️ 邮件通知发送失败:', emailResult.error);
            }
          });
        }

        // 发送推送通知
        if (typeof pushNotification !== 'undefined') {
          pushNotification.sendNewBookingPush(bookingData).then(() => {
            console.log('✅ 推送通知已发送');
          }).catch(err => {
            console.warn('⚠️ 推送通知发送失败:', err);
          });
        }
        // ========== 通知结束 ==========
        
        // 成功后关闭面板
        setTimeout(() => {
          this.closePanel();
          this.clearForm();
        }, 2000);
      } else {
        this.showAlert('error', '预约失败', result.error || '请稍后重试');
      }
    } catch (error) {
      console.error('❌ 提交错误:', error);
      this.showAlert('error', '系统错误', '提交失败，请稍后重试');
    } finally {
      this.isSubmitting = false;
      this.showLoadingState(false);
    }
  }

  /**
   * 显示加载状态
   */
  showLoadingState(isLoading) {
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (!confirmBtn) return;

    if (isLoading) {
      confirmBtn.textContent = '提交中...';
      confirmBtn.disabled = true;
      confirmBtn.style.opacity = '0.6';
    } else {
      confirmBtn.textContent = '确认预约';
      confirmBtn.disabled = false;
      confirmBtn.style.opacity = '1';
    }
  }

  /**
   * 显示提示框
   */
  showAlert(type, title, message) {
    const alertBox = document.getElementById('bookingAlert');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');

    if (alertBox && alertTitle && alertMessage) {
      alertTitle.textContent = title;
      alertMessage.textContent = message;
      
      // 根据类型设置样式
      alertBox.className = 'booking-alert show';
      if (type === 'success') {
        alertBox.style.borderColor = '#4CAF50';
        alertTitle.style.color = '#4CAF50';
      } else {
        alertBox.style.borderColor = '#f44336';
        alertTitle.style.color = '#f44336';
      }

      // 自动关闭
      setTimeout(() => {
        alertBox.classList.remove('show');
      }, type === 'success' ? 3000 : 4000);
    } else {
      // 备用：使用浏览器原生提示
      alert(`${title}\n\n${message}`);
    }
  }

  /**
   * 关闭预约面板
   */
  closePanel() {
    const panel = document.getElementById('functionPanel');
    const overlay = document.getElementById('panelOverlay');
    
    if (panel) panel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

  /**
   * 清空表单
   */
  clearForm() {
    // 清空输入框
    const inputs = ['customerName', 'customerPhone', 'bookingNotes'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    // 取消所有选择
    document.querySelectorAll('.selected').forEach(el => {
      el.classList.remove('selected');
    });
  }

  /**
   * 格式化日期时间显示
   */
  formatDateTime(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  }
}

// 创建全局实例并初始化
const bookingIntegration = new BookingIntegration();
bookingIntegration.init();

console.log('✅ 预约集成模块已加载');
