// ========================================
// NEW PROUD NAILS - 音效版配置文件
// 支持中文、英文、西班牙语 + 完整音效系统
// ========================================

const ASSETS = {
    // 图片素材（所有语言共用）
    images: {
        background: 'glass-bg.jpg',
        logoTexture: 'marble-text.jpg'
    },
    
    // 颜色主题（所有语言共用）
    colors: {
        primary: '#FF3B3F',
        secondary: '#FF6B6F'
    },
    
    // 通用音效（所有语言共用）
    sounds: {
        // 背景音乐
        bgm: 'sounds/bgm.mp3',
        
        // 载入音效
        pageLoad: 'sounds/page-load.mp3',
        
        // 精灵音效
        spriteAppear: 'sounds/sprite-appear.mp3',    // 精灵出现
        spriteEscape: 'sounds/sprite-escape.mp3',    // 精灵逃跑
        spriteHit: 'sounds/sprite-hit.mp3',          // 精灵被击中
        
        // 玻璃球音效
        ballDrop: 'sounds/ball-drop.mp3',            // 球落地
        ballEaten: 'sounds/ball-eaten.mp3',          // 球被吃掉
        
        // 面板音效
        panelSlide: 'sounds/panel-slide.mp3',        // 侧滑面板
        
        // 其他音效
        promoAppear: 'sounds/promo-appear.mp3',      // 优惠卡出现
        logoClick: 'sounds/logo-click.mp3'           // Logo点击
    },
    
    // 多语言文字内容 + 语音
    languages: {
        // 中文
        zh: {
            mainLogo: 'NEW PROUD NAILS',
            greeting: '哈喽！',
            promoTitle: '🎁 恭喜！',
            promoSubtitle: '您获得了专属优惠',
            
            // 按钮文字
            buttonBook: '预约',
            buttonGift: '礼物',
            buttonServices: '服务',
            buttonMember: '会员',
            
            // 弹窗内容
            bookingTitle: '📅 在线预约系统',
            servicesTitle: '💅 服务项目',
            memberTitle: '👑 会员中心',
            
            // 语音文件（中文特有）
            voice: {
                greeting: 'sounds/voice/zh/hello.mp3',           // 哈喽
                buttonBook: 'sounds/voice/zh/book.mp3',          // 预约
                buttonGift: 'sounds/voice/zh/gift.mp3',          // 礼物
                buttonServices: 'sounds/voice/zh/services.mp3',  // 服务
                buttonMember: 'sounds/voice/zh/member.mp3'       // 会员
            }
        },
        
        // 英文
        en: {
            mainLogo: 'NEW PROUD NAILS',
            greeting: 'Hello!',
            promoTitle: '🎁 Congratulations!',
            promoSubtitle: 'You got an exclusive offer',
            
            // 按钮文字
            buttonBook: 'BOOK',
            buttonGift: 'GIFT',
            buttonServices: 'SERVICES',
            buttonMember: 'MEMBER',
            
            // 弹窗内容
            bookingTitle: '📅 Online Booking',
            servicesTitle: '💅 Our Services',
            memberTitle: '👑 Membership',
            
            // 语音文件（英文特有）
            voice: {
                greeting: 'sounds/voice/en/hello.mp3',           // Hello
                buttonBook: 'sounds/voice/en/book.mp3',          // BOOK
                buttonGift: 'sounds/voice/en/gift.mp3',          // GIFT
                buttonServices: 'sounds/voice/en/services.mp3',  // SERVICES
                buttonMember: 'sounds/voice/en/member.mp3'       // MEMBER
            }
        },
        
        // 西班牙语
        es: {
            mainLogo: 'NEW PROUD NAILS',
            greeting: '¡Hola!',
            promoTitle: '🎁 ¡Felicidades!',
            promoSubtitle: 'Tienes una oferta exclusiva',
            
            // 按钮文字
            buttonBook: 'RESERVAR',
            buttonGift: 'REGALO',
            buttonServices: 'SERVICIOS',
            buttonMember: 'MIEMBRO',
            
            // 弹窗内容
            bookingTitle: '📅 Reserva en línea',
            servicesTitle: '💅 Nuestros Servicios',
            memberTitle: '👑 Membresía',
            
            // 语音文件（西班牙语特有）
            voice: {
                greeting: 'sounds/voice/es/hola.mp3',            // ¡Hola!
                buttonBook: 'sounds/voice/es/reservar.mp3',      // RESERVAR
                buttonGift: 'sounds/voice/es/regalo.mp3',        // REGALO
                buttonServices: 'sounds/voice/es/servicios.mp3', // SERVICIOS
                buttonMember: 'sounds/voice/es/miembro.mp3'      // MIEMBRO
            }
        }
    },
    
    // 默认语言
    defaultLanguage: 'zh',  // zh=中文, en=英文, es=西班牙语
    
    // 音效设置
    audioSettings: {
        bgmVolume: 0.3,        // 背景音乐音量 (0-1)
        effectVolume: 0.7,     // 音效音量 (0-1)
        voiceVolume: 1.0,      // 语音音量 (0-1)
        enableBGM: true,       // 是否开启背景音乐
        enableEffects: true,   // 是否开启音效
        enableVoice: true      // 是否开启语音
    }
};