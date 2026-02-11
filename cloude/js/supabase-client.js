// ==================== supabase-client.js ====================
// Supabase 客户端配置和连接
// 【功能】初始化 Supabase 客户端，提供数据库操作接口

const SUPABASE_CONFIG = {
  url: 'https://rlkzcohocatggszmlewj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsa3pjb2hvY2F0Z2dzem1sZXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMzM5OTIsImV4cCI6MjA4NTgwOTk5Mn0._toXOopqDriCFc5HXoP5pCKXDi4G7JI7KgJvrQBOj0I'
};

// 初始化 Supabase 客户端
const supabaseClient = supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// Supabase 预约管理类
class SupabaseBookingManager {
  constructor() {
    this.client = supabaseClient;
    this.tableName = 'bookings';
  }

  /**
   * 创建新预约
   * @param {Object} bookingData - 预约数据
   * @returns {Promise} Supabase 响应
   */
  async createBooking(bookingData) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .insert([
          {
            customer_name: bookingData.customerName,
            customer_phone: bookingData.customerPhone,
            booking_time: bookingData.bookingTime, // ISO 8601 格式
            service_name: bookingData.serviceName,
            staff_name: bookingData.staffName,
            status: bookingData.status || 'pending',
            notes: bookingData.notes || ''
          }
        ])
        .select();

      if (error) {
        console.error('❌ Supabase 插入错误:', error);
        throw error;
      }

      console.log('✅ 预约创建成功:', data);
      return { success: true, data };
    } catch (err) {
      console.error('❌ 创建预约失败:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 查询指定时间段的预约
   * @param {string} date - 日期 (YYYY-MM-DD)
   * @returns {Promise} 预约列表
   */
  async getBookingsByDate(date) {
    try {
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;

      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .gte('booking_time', startOfDay)
        .lte('booking_time', endOfDay)
        .order('booking_time', { ascending: true });

      if (error) throw error;

      console.log(`📅 ${date} 的预约:`, data);
      return { success: true, data };
    } catch (err) {
      console.error('❌ 查询预约失败:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 检查时间段是否已被预约
   * @param {string} datetime - 时间 (ISO 8601)
   * @param {string} staffName - 技师名称
   * @returns {Promise<boolean>} 是否已预约
   */
  async isTimeSlotBooked(datetime, staffName) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('id')
        .eq('booking_time', datetime)
        .eq('staff_name', staffName)
        .neq('status', 'cancelled');

      if (error) throw error;

      return data && data.length > 0;
    } catch (err) {
      console.error('❌ 检查时间段失败:', err);
      return false;
    }
  }

  /**
   * 获取所有预约（可选：按状态筛选）
   * @param {string} status - 状态筛选 (可选)
   * @returns {Promise} 预约列表
   */
  async getAllBookings(status = null) {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*')
        .order('booking_time', { ascending: true });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('📋 所有预约:', data);
      return { success: true, data };
    } catch (err) {
      console.error('❌ 获取预约列表失败:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 更新预约状态
   * @param {string} bookingId - 预约ID
   * @param {string} newStatus - 新状态
   * @returns {Promise}
   */
  async updateBookingStatus(bookingId, newStatus) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select();

      if (error) throw error;

      console.log('✅ 状态更新成功:', data);
      return { success: true, data };
    } catch (err) {
      console.error('❌ 更新状态失败:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 删除预约
   * @param {string} bookingId - 预约ID
   * @returns {Promise}
   */
  async deleteBooking(bookingId) {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      console.log('🗑️ 预约已删除');
      return { success: true };
    } catch (err) {
      console.error('❌ 删除预约失败:', err);
      return { success: false, error: err.message };
    }
  }
}

// 创建全局实例
const bookingManager = new SupabaseBookingManager();

console.log('✅ Supabase 客户端已初始化');
