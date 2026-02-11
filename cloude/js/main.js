// ==================== main.js ====================
// 【职责】应用入口、初始化、协调各模块、游戏逻辑
// 【修改指南】
//   - 改初始化顺序 → 修改 init() 函数
//   - 改游戏流程 → 修改 GameFlow 对象
//   - 改分数规则 → 修改 updateScore 函数
// 【不要改】具体功能实现（去对应模块改）

// 全局状态
const State = {
  currentScore: 0,
  totalBalls: 0,
  hasStarted: false
};

// 游戏流程控制
const GameFlow = {
  
  // 启动应用
  start() {
    if (State.hasStarted) return;
    State.hasStarted = true;
    
    // 请求手机倾斜权限（必须在用户交互时请求）
    Physics.requestMotionPermission();
    
    // 初始化音效
    AudioManager.init();
    AudioManager.playBGM();
    
    // 启动精灵
    Sprite.appear();
    
    // 播放音效
    AudioManager.play('spriteAppear');
  },
  
  // 更新分数
  updateScore(score, totalBalls) {
    State.currentScore = score;
    State.totalBalls = totalBalls;
    
    const scoreEl = document.getElementById('scoreValue');
    const ballCountEl = document.getElementById('ballCount');
    
    if (scoreEl) scoreEl.textContent = score;
    if (ballCountEl) ballCountEl.textContent = `(${totalBalls}/${CONFIG.TARGET_SCORE})`;
    
    // 检查是否达到目标
    if (totalBalls >= CONFIG.TARGET_SCORE) {
      setTimeout(() => this.triggerReward(), 1000);
    }
  },
  
  // 触发奖励动画
  triggerReward() {
    // 停止精灵
    Sprite.stop();
    
    // 清除球
    Physics.clearAll();
    
    // 播放音效
    AudioManager.play('success');
    
    // U字母倾倒
    const letterU = document.getElementById('letterU');
    if (letterU) letterU.classList.add('tilting');
    
    // 球飞向GIFT按钮
    setTimeout(() => {
      const giftBtn = document.getElementById('giftBtn');
      if (!giftBtn) return;
      
      Physics.ballsInU.forEach((ball, index) => {
        setTimeout(() => {
          const giftRect = giftBtn.getBoundingClientRect();
          ball.element.style.transition = 'all 0.5s ease';
          ball.element.style.left = `${giftRect.left + giftRect.width / 2 - 20}px`;
          ball.element.style.top = `${giftRect.top + giftRect.height / 2 - 20}px`;
          ball.element.style.transform = 'scale(0)';
          setTimeout(() => ball.element.remove(), 500);
        }, index * 100);
      });
    }, 500);
    
    // GIFT按钮动画
    setTimeout(() => {
      document.getElementById('giftBtn').classList.add('satisfied');
    }, 2000);
    
    // 烟花
    setTimeout(() => {
      Fireworks.burst(window.innerWidth / 2, window.innerHeight / 2);
      AudioManager.play('promoAppear');
    }, 2500);
    
    // 显示促销卡片
    setTimeout(() => {
      const promoCard = document.getElementById('promoCard');
      if (promoCard) promoCard.classList.add('show');
    }, 4000);
  },
  
  // 重置游戏
  reset() {
    State.currentScore = 0;
    State.totalBalls = 0;
    this.updateScore(0, 0);
    
    // 移除CSS类
    const letterU = document.getElementById('letterU');
    const giftBtn = document.getElementById('giftBtn');
    const promoCard = document.getElementById('promoCard');
    
    if (letterU) letterU.classList.remove('tilting');
    if (giftBtn) giftBtn.classList.remove('satisfied');
    if (promoCard) promoCard.classList.remove('show');
    
    // 重启精灵
    Sprite.restart();
    
    // 重置物理
    Physics.clearAll();
  }
};

// 初始化
function init() {
  console.log('%c🎨 NEW PROUD NAILS 已加载', 'color: #667eea; font-size: 20px; font-weight: bold');
  console.log('%c✅ 模块化架构 - 完整多语言支持', 'color: #32CD32; font-size: 12px');
  console.log('%c版本: ' + new Date().toLocaleString(), 'color: #FF5B5F; font-size: 14px');
  
  // 初始化各模块
  Lang.init();
  Physics.init();
  Sprite.init();
  Fireworks.init();
  UI.init();
  
  // 监听事件
  document.addEventListener('ballCollected', (e) => {
    GameFlow.updateScore(State.currentScore + e.detail.score, e.detail.totalBalls);
  });
  
  // Logo点击
  document.getElementById('logo').addEventListener('click', () => {
    AudioManager.play('logoClick');
  });
  
  // 音乐切换
  document.getElementById('musicToggle').addEventListener('click', () => {
    AudioManager.toggleMute();
  });
  
  // 促销卡片点击
  document.getElementById('promoCard').addEventListener('click', () => {
    GameFlow.reset();
  });
  
  // 确认预约按钮
  document.getElementById('confirmBookingBtn').addEventListener('click', () => {
    Booking.confirm();
  });
  
  // 页面可见性
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && AudioManager.bgm) {
      AudioManager.bgm.pause();
    }
  });
  
  // 等待用户交互启动
  document.addEventListener('click', () => GameFlow.start(), { once: true });
  document.addEventListener('touchstart', () => GameFlow.start(), { once: true });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
