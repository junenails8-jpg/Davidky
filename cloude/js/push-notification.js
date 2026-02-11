// ==================== push-notification.js ====================
// 推送通知功能
// 【使用说明】
//   1. 选择推送服务: Web Push / OneSignal / Firebase FCM
//   2. 填写配置信息
//   3. 用户访问网站时会请求通知权限

class PushNotification {
  constructor() {
    // ==================== 配置区域 ====================
    this.config = {
      enabled: true, // 是否启用推送通知
      provider: 'local', // 推送服务: 'local' | 'webpush' | 'onesignal' | 'fcm'
      
      // 本地通知配置（推荐，最简单）
      // 无需额外配置，开箱即用
      local: {
        // 无需配置
      },
      
      // Web Push 配置 (浏览器原生推送，完全免费)
      webpush: {
        vapidPublicKey: 'YOUR_VAPID_PUBLIC_KEY', // VAPID 公钥
        serverEndpoint: 'YOUR_SERVER_ENDPOINT'    // 您的推送服务器地址
      },

      // OneSignal 配置
      // 注册地址: https://onesignal.com
      // 免费额度: 10,000 用户
      onesignal: {
        appId: 'YOUR_ONESIGNAL_APP_ID'
      },

      // Firebase Cloud Messaging 配置
      // 注册地址: https://console.firebase.google.com
      // 完全免费
      fcm: {
        apiKey: 'YOUR_FCM_API_KEY',
        authDomain: 'YOUR_PROJECT.firebaseapp.com',
        projectId: 'YOUR_PROJECT_ID',
        storageBucket: 'YOUR_PROJECT.appspot.com',
        messagingSenderId: 'YOUR_SENDER_ID',
        appId: 'YOUR_APP_ID',
        vapidKey: 'YOUR_FCM_VAPID_KEY'
      }
    };

    this.isInitialized = false;
    this.subscription = null;
  }

  /**
   * 初始化推送通知
   */
  async init() {
    if (!this.config.enabled) {
      console.log('🔕 推送通知已禁用');
      return;
    }

    if (this.isInitialized) return;

    const provider = this.config.provider;

    try {
      switch (provider) {
        case 'local':
          await this.initLocal();
          break;
        case 'webpush':
          await this.initWebPush();
          break;
        case 'onesignal':
          await this.initOneSignal();
          break;
        case 'fcm':
          await this.initFCM();
          break;
        default:
          console.error('❌ 未知的推送服务提供商:', provider);
      }
      
      this.isInitialized = true;
      console.log('✅ 推送通知已初始化');
    } catch (error) {
      console.error('❌ 推送通知初始化失败:', error);
    }
  }

  /**
   * 初始化本地通知（浏览器原生，最简单）
   */
  async initLocal() {
    if (!('Notification' in window)) {
      console.warn('⚠️ 浏览器不支持通知');
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ 通知权限已授予');
    } else {
      console.log('🔕 用户未授予通知权限');
    }
  }

  /**
   * 初始化 Web Push (浏览器原生)
   */
  async initWebPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('⚠️ 浏览器不支持 Web Push');
      return;
    }

    // 请求通知权限
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('🔕 用户未授予通知权限');
      return;
    }

    // 注册 Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service Worker 已注册');

    // 订阅推送
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(this.config.webpush.vapidPublicKey)
    });

    this.subscription = subscription;

    // 发送订阅信息到服务器
    await this.sendSubscriptionToServer(subscription);
  }

  /**
   * 初始化 OneSignal
   */
  async initOneSignal() {
    const config = this.config.onesignal;

    // 加载 OneSignal SDK
    if (!window.OneSignal) {
      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
      script.async = true;
      document.head.appendChild(script);

      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // 初始化 OneSignal
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(function() {
      window.OneSignal.init({
        appId: config.appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false
        }
      });

      // 请求权限
      window.OneSignal.showNativePrompt();
    });

    console.log('✅ OneSignal 已初始化');
  }

  /**
   * 初始化 Firebase Cloud Messaging
   */
  async initFCM() {
    const config = this.config.fcm;

    // 加载 Firebase SDK
    if (!window.firebase) {
      // 动态加载 Firebase SDK
      await this.loadScript('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
      await this.loadScript('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');
    }

    // 初始化 Firebase
    firebase.initializeApp(config);

    // 获取 Messaging 实例
    const messaging = firebase.messaging();

    // 请求权限并获取 token
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await messaging.getToken({ vapidKey: config.vapidKey });
      console.log('✅ FCM Token:', token);
      
      // 发送 token 到服务器
      await this.sendTokenToServer(token);
    }

    // 监听消息
    messaging.onMessage((payload) => {
      console.log('📬 收到推送消息:', payload);
      this.showNotification(payload.notification);
    });

    console.log('✅ Firebase FCM 已初始化');
  }

  /**
   * 发送新预约推送通知
   */
  async sendNewBookingPush(bookingData) {
    if (!this.config.enabled || !this.isInitialized) {
      console.log('🔕 推送通知未启用或未初始化');
      return;
    }

    const provider = this.config.provider;

    try {
      switch (provider) {
        case 'local':
          await this.sendLocalNotification(bookingData);
          break;
        case 'webpush':
          await this.sendWebPush(bookingData);
          break;
        case 'onesignal':
          await this.sendOneSignalPush(bookingData);
          break;
        case 'fcm':
          await this.sendFCMPush(bookingData);
          break;
      }
      
      console.log('✅ 推送通知已发送');
    } catch (error) {
      console.error('❌ 推送通知发送失败:', error);
    }
  }

  /**
   * 发送本地通知
   */
  async sendLocalNotification(bookingData) {
    if (Notification.permission !== 'granted') {
      console.log('🔕 未授予通知权限');
      return;
    }

    const dateTime = this.formatDateTime(new Date(bookingData.bookingTime));

    new Notification('🎉 新预约通知', {
      body: `${bookingData.customerName} 预约了 ${bookingData.serviceName}\n时间: ${dateTime}`,
      icon: '/images/logo.png',
      badge: '/images/badge.png',
      tag: 'booking-notification',
      requireInteraction: true,
      data: bookingData,
      vibrate: [200, 100, 200]
    });
    
    console.log('✅ 本地通知已显示');
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
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  /**
   * 发送 Web Push 通知
   */
  async sendWebPush(bookingData) {
    const config = this.config.webpush;
    
    const notificationData = {
      title: '🎉 新预约通知',
      body: `${bookingData.customerName} 预约了 ${bookingData.serviceName}`,
      icon: '/images/logo.png',
      badge: '/images/badge.png',
      data: bookingData
    };

    // 发送到您的推送服务器
    const response = await fetch(config.serverEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscription: this.subscription,
        notification: notificationData
      })
    });

    if (!response.ok) {
      throw new Error('Web Push 发送失败');
    }
  }

  /**
   * 发送 OneSignal 推送
   */
  async sendOneSignalPush(bookingData) {
    if (!window.OneSignal) {
      console.error('❌ OneSignal 未初始化');
      return;
    }

    // 使用 OneSignal REST API 发送推送
    const config = this.config.onesignal;
    
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YOUR_REST_API_KEY' // 需要配置
      },
      body: JSON.stringify({
        app_id: config.appId,
        included_segments: ['All'], // 发送给所有订阅用户
        headings: { en: '🎉 新预约通知' },
        contents: { 
          en: `${bookingData.customerName} 预约了 ${bookingData.serviceName}` 
        },
        data: bookingData
      })
    });

    if (!response.ok) {
      throw new Error('OneSignal 推送发送失败');
    }
  }

  /**
   * 发送 FCM 推送
   */
  async sendFCMPush(bookingData) {
    // FCM 推送需要从服务器端发送
    // 这里只是客户端示例，实际应该通过您的后端服务器发送
    
    const response = await fetch('YOUR_SERVER_ENDPOINT/send-fcm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '🎉 新预约通知',
        body: `${bookingData.customerName} 预约了 ${bookingData.serviceName}`,
        data: bookingData
      })
    });

    if (!response.ok) {
      throw new Error('FCM 推送发送失败');
    }
  }

  /**
   * 显示本地通知（备用方案）
   */
  showNotification(notificationData) {
    if (Notification.permission === 'granted') {
      new Notification(notificationData.title || '新通知', {
        body: notificationData.body,
        icon: notificationData.icon || '/images/logo.png',
        badge: notificationData.badge || '/images/badge.png',
        data: notificationData.data
      });
    }
  }

  /**
   * 辅助函数：加载外部脚本
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * 辅助函数：VAPID Key 转换
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * 发送订阅信息到服务器
   */
  async sendSubscriptionToServer(subscription) {
    // 实现您自己的服务器端点
    console.log('📤 发送订阅信息到服务器:', subscription);
    
    // 示例:
    // await fetch('/api/save-subscription', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscription)
    // });
  }

  /**
   * 发送 FCM Token 到服务器
   */
  async sendTokenToServer(token) {
    console.log('📤 发送 FCM Token 到服务器:', token);
    
    // 示例:
    // await fetch('/api/save-fcm-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token })
    // });
  }
}

// 创建全局实例
const pushNotification = new PushNotification();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => pushNotification.init());
} else {
  pushNotification.init();
}

console.log('🔔 推送通知模块已加载');
