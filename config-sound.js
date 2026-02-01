// ==================== config-sound.js ====================
// 音效配置文件
// 【修改指南】
//   - 改音效路径 → 修改 sounds 对象里的路径
//   - 改音量 → 修改 audioSettings 里的音量值
//   - 添加新音效 → 在 sounds 对象里添加新的键值对

const ASSETS = {
  // 音效设置
  audioSettings: {
    enableBGM: true,        // 是否启用背景音乐
    enableEffects: true,    // 是否启用音效
    enableVoice: true,      // 是否启用语音
    bgmVolume: 0.3,         // 背景音乐音量 (0-1)
    effectVolume: 0.5,      // 音效音量 (0-1)
    voiceVolume: 0.7        // 语音音量 (0-1)
  },
  
  // 音效文件路径
  sounds: {
    bgm: 'sounds/bgm.mp3',                    // 背景音乐
    ballDrop: 'sounds/ball-drop.mp3',         // 球落地
    ballEaten: 'sounds/ball-eaten.mp3',       // 球被收集
    spriteAppear: 'sounds/sprite-appear.mp3', // 精灵出现
    spriteEscape: 'sounds/sprite-escape.mp3', // 精灵逃跑
    spriteHit: 'sounds/sprite-hit.mp3',       // 点击精灵
    panelSlide: 'sounds/panel-slide.mp3',     // 面板滑动
    success: 'sounds/success.mp3',            // 成功
    promoAppear: 'sounds/promo-appear.mp3',   // 促销卡片
    logoClick: 'sounds/logo-click.mp3'        // Logo点击
  },
  
  // 多语言语音（可选）
  languages: {
    zh: {
      greeting: '哈喽！',
      voice: {
        greeting: 'sounds/voice/zh/greeting.mp3',
        buttonBook: 'sounds/voice/zh/button-book.mp3',
        buttonServices: 'sounds/voice/zh/button-services.mp3',
        buttonMember: 'sounds/voice/zh/button-member.mp3'
      }
    },
    en: {
      greeting: 'Hello!',
      voice: {
        greeting: 'sounds/voice/en/greeting.mp3',
        buttonBook: 'sounds/voice/en/button-book.mp3',
        buttonServices: 'sounds/voice/en/button-services.mp3',
        buttonMember: 'sounds/voice/en/button-member.mp3'
      }
    },
    es: {
      greeting: '¡Hola!',
      voice: {
        greeting: 'sounds/voice/es/greeting.mp3',
        buttonBook: 'sounds/voice/es/button-book.mp3',
        buttonServices: 'sounds/voice/es/button-services.mp3',
        buttonMember: 'sounds/voice/es/button-member.mp3'
      }
    }
  }
};
