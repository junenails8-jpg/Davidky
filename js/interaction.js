// ==================== interaction.js ====================
// 【职责】用户交互、音效、UI控制、预约系统、多语言切换
// 【修改指南】
//   - 改预约逻辑 → 修改 Booking 对象
//   - 改面板样式 → 去 style.css 改
//   - 改音效 → 修改 Audio 对象或 config-sound.js
//   - 改按钮行为 → 修改对应的事件监听器
// 【不要改】球物理、精灵动画代码

// ========== 音效管理 ==========
const AudioManager = {  // ← 改名避免冲突
  bgm: null,
  sounds: {},
  isMuted: false,
  
  init() {
    if (typeof ASSETS === 'undefined') return;
    
    if (ASSETS.sounds && ASSETS.sounds.bgm) {
      this.bgm = new window.Audio(ASSETS.sounds.bgm);  // ← 使用 window.Audio
      this.bgm.loop = true;
      this.bgm.volume = 0.3;
    }
    
    if (ASSETS.sounds) {
      Object.keys(ASSETS.sounds).forEach(key => {
        if (key !== 'bgm' && ASSETS.sounds[key]) {
          this.sounds[key] = new window.Audio(ASSETS.sounds[key]);  // ← 使用 window.Audio
          this.sounds[key].volume = 0.5;
        }
      });
    }
    
    this.loadMuteState();
    
    // 监听音效事件
    document.addEventListener('ballDrop', () => this.play('ballDrop'));
    document.addEventListener('ballEaten', () => this.play('ballEaten'));
    document.addEventListener('spriteEscape', () => this.play('spriteEscape'));
    document.addEventListener('spriteHit', () => this.play('spriteHit'));
  },
  
  play(name) {
    if (this.isMuted || !this.sounds[name]) return;
    this.sounds[name].currentTime = 0;
    this.sounds[name].play().catch(() => {});
  },
  
  playBGM() {
    if (!this.isMuted && this.bgm) {
      this.bgm.play().catch(() => {});
    }
  },
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.bgm) {
      this.bgm.pause();
    } else {
      this.playBGM();
    }
    this.saveMuteState();
    this.updateButton();
  },
  
  updateButton() {
    const icon = document.getElementById('musicIcon');
    const btn = document.getElementById('musicToggle');
    if (icon) icon.textContent = this.isMuted ? '🔇' : '🔊';
    if (btn) btn.classList.toggle('muted', this.isMuted);
  },
  
  saveMuteState() {
    try { localStorage.setItem('musicMuted', this.isMuted.toString()); } catch {}
  },
  
  loadMuteState() {
    try {
      const saved = localStorage.getItem('musicMuted');
      if (saved !== null) this.isMuted = saved === 'true';
      this.updateButton();
    } catch {}
  }
};

// ========== 多语言管理 ==========
const Lang = {
  current: 'zh',
  
  init() {
    try {
      const saved = localStorage.getItem('preferredLanguage');
      if (saved && TEXTS[saved]) this.current = saved;
    } catch {}
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switch(btn.dataset.lang));
    });
    
    this.updateAll();
  },
  
  switch(lang) {
    if (!TEXTS[lang]) return;
    this.current = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    this.updateAll();
    
    try { localStorage.setItem('preferredLanguage', lang); } catch {}
    AudioManager.play('panelSlide');
  },
  
  get(key) {
    return TEXTS[this.current][key] || key;
  },
  
  updateAll() {
    const t = TEXTS[this.current];
    const elems = {
      btnBook: 'buttonBook',
      btnGiftFull: 'buttonGift',
      btnServices: 'buttonServices',
      btnMember: 'buttonMember',
      promoText: 'promoTitle',
      promoSubtitle: 'promoSubtitle',
      confirmBookingBtn: 'confirmBooking'
    };
    
    Object.keys(elems).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = t[elems[id]];
    });
  },
  
  getServiceName(service) {
    if (this.current === 'zh') return service.nameZh;
    if (this.current === 'es') return service.nameEs;
    return service.name;
  }
};

// ========== UI控制 ==========
const UI = {
  panel: null,
  overlay: null,
  
  init() {
    this.panel = document.getElementById('functionPanel');
    this.overlay = document.getElementById('panelOverlay');
    
    document.querySelector('.panel-close-btn').addEventListener('click', () => this.closePanel());
    this.overlay.addEventListener('click', () => this.closePanel());
    
    document.querySelectorAll('.glass-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action) {
          AudioManager.play('panelSlide');
          this.openPanel(action);
        }
      });
    });
    
    document.querySelector('.booking-alert-btn').addEventListener('click', () => {
      document.getElementById('bookingAlert').classList.remove('show');
    });
  },
  
  openPanel(type) {
    const title = document.getElementById('panelTitle');
    const content = document.getElementById('panelContentArea');
    const footer = document.getElementById('panelFooter');
    const t = TEXTS[Lang.current];
    
    if (type === 'book') {
      title.textContent = t.bookingTitle;
      footer.style.display = 'block';
      content.innerHTML = Booking.renderPanel();
    } else {
      title.textContent = type === 'services' ? '💅 ' + t.buttonServices : '👑 ' + t.buttonMember;
      footer.style.display = 'none';
      content.innerHTML = '<div class="content-section"><div class="section-title">功能开发中...</div></div>';
    }
    
    this.overlay.classList.add('show');
    this.panel.classList.add('show');
  },
  
  closePanel() {
    this.panel.classList.remove('show');
    this.overlay.classList.remove('show');
    document.getElementById('panelFooter').style.display = 'none';
  },
  
  showAlert(type, message) {
    const alert = document.getElementById('bookingAlert');
    const title = document.getElementById('alertTitle');
    const msg = document.getElementById('alertMessage');
    const t = TEXTS[Lang.current];
    
    title.className = 'booking-alert-title ' + type;
    title.textContent = type === 'error' ? t.bookingError : t.bookingSuccess;
    msg.textContent = message;
    
    alert.classList.add('show');
    AudioManager.play('panelSlide');
  }
};

// ========== 预约系统 ==========
const Booking = {
  bookings: [],
  selected: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: 1,
    time: null,
    staff: { id: 0, name: 'any' },
    service: null
  },
  
  renderPanel() {
    const t = TEXTS[Lang.current];
    return `
      <div class="expandable-section">
        <div class="section-header" onclick="toggleSection(0)">
          <div class="section-title">${t.selectTime}</div>
          <div class="expand-icon expanded" id="icon-0">▼</div>
        </div>
        <div class="section-details expanded" id="details-0">
          ${this.renderTimePicker()}
        </div>
      </div>
      
      <div class="expandable-section">
        <div class="section-header" onclick="toggleSection(1)">
          <div class="section-title">${t.selectService}</div>
          <div class="expand-icon" id="icon-1">▼</div>
        </div>
        <div class="section-details" id="details-1">
          ${this.renderServices()}
        </div>
      </div>
      
      <div class="expandable-section">
        <div class="section-header" onclick="toggleSection(2)">
          <div class="section-title">${t.selectStaff}</div>
          <div class="expand-icon" id="icon-2">▼</div>
        </div>
        <div class="section-details" id="details-2">
          ${this.renderStaff()}
        </div>
      </div>
      
      <div class="content-section">
        <div class="section-title">${t.contactInfo}</div>
        <ul class="feature-list">
          ${t.contacts.map(c => `<li class="feature-item">${c}</li>`).join('')}
        </ul>
      </div>
    `;
  },
  
  renderTimePicker() {
    const t = TEXTS[Lang.current];
    const now = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now);
      d.setMonth(d.getMonth() + i);
      months.push({ value: d.getMonth() + 1, year: d.getFullYear() });
    }
    
    const days = Array.from({length: 30}, (_, i) => i + 1);
    const times = [];
    for (let h = 10; h < 19; h++) {
      for (let m = 0; m < 60; m += 30) {
        times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    
    return `
      <div class="time-picker-container">
        <div class="picker-column">
          <div class="picker-label">${t.monthLabel}</div>
          <div class="picker-wheel">
            ${months.map((m, i) => `
              <div class="picker-option ${i === 0 ? 'selected' : ''}" onclick="selectMonth(${m.value}, ${m.year})">${m.value}${t.monthSuffix}</div>
            `).join('')}
          </div>
        </div>
        <div class="picker-column">
          <div class="picker-label">${t.dayLabel}</div>
          <div class="picker-wheel">
            ${days.map((d, i) => `
              <div class="picker-option ${i === 0 ? 'selected' : ''}" onclick="selectDay(${d})">${d}${t.daySuffix}</div>
            `).join('')}
          </div>
        </div>
        <div class="picker-column">
          <div class="picker-label">${t.timeLabel}</div>
          <div class="picker-wheel">
            ${times.map((t, i) => `
              <div class="picker-option ${i === 0 ? 'selected' : ''}" onclick="selectTime('${t}')">${t}</div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
  
  renderServices() {
    let html = '';
    Object.keys(SERVICES).forEach(cat => {
      html += `<div class="section-title" style="font-size: 20px; margin: 15px 0 10px;">${cat.toUpperCase()}</div>`;
      SERVICES[cat].forEach(s => {
        html += `
          <div class="detail-item" onclick="selectService('${s.name}', '${s.price}')">
            <div class="detail-name">${Lang.getServiceName(s)}</div>
            <div class="detail-price">${s.price}</div>
          </div>
        `;
      });
    });
    return html;
  },
  
  renderStaff() {
    const t = TEXTS[Lang.current];
    return `
      <div class="staff-selector">
        ${STAFF.map(s => `
          <div class="staff-option ${s.id === 0 ? 'selected' : ''}" onclick="selectStaff(${s.id}, '${s.name}')">
            ${s.id === 0 ? t.anyStaff : s.name}
          </div>
        `).join('')}
      </div>
    `;
  },
  
  confirm() {
    const t = TEXTS[Lang.current];
    
    if (!this.selected.time) {
      UI.showAlert('error', t.selectTimeFirst);
      return;
    }
    
    // 检测冲突
    if (this.selected.staff.id !== 0) {
      const key = `${this.selected.year}-${this.selected.month}-${this.selected.day}-${this.selected.time}-${this.selected.staff.id}`;
      if (this.bookings.includes(key)) {
        UI.showAlert('error', `${this.selected.staff.name} ${this.selected.month}${t.monthSuffix}${this.selected.day}${t.daySuffix} ${this.selected.time} ${t.alreadyBooked}`);
        return;
      }
      this.bookings.push(key);
    }
    
    let message = `${this.selected.year}年${this.selected.month}${t.monthSuffix}${this.selected.day}${t.daySuffix} ${this.selected.time}`;
    if (this.selected.staff.id !== 0) message += `\n${this.selected.staff.name}`;
    if (this.selected.service) message += `\n${this.selected.service.name} ${this.selected.service.price}`;
    
    UI.showAlert('success', message);
    AudioManager.play('success');
    
    setTimeout(() => {
      document.getElementById('bookingAlert').classList.remove('show');
      UI.closePanel();
      this.selected.time = null;
      this.selected.service = null;
    }, 3000);
  }
};

// ========== 全局函数（供HTML调用）==========
function toggleSection(index) {
  const details = document.getElementById(`details-${index}`);
  const icon = document.getElementById(`icon-${index}`);
  if (details && icon) {
    details.classList.toggle('expanded');
    icon.classList.toggle('expanded');
    AudioManager.play('panelSlide');
  }
}

function selectMonth(month, year) {
  Booking.selected.month = month;
  Booking.selected.year = year;
  document.querySelectorAll('.picker-wheel .picker-option').forEach(o => {
    if (o.onclick && o.onclick.toString().includes(`selectMonth(${month}`)) {
      o.classList.add('selected');
    } else if (o.onclick && o.onclick.toString().includes('selectMonth')) {
      o.classList.remove('selected');
    }
  });
  AudioManager.play('panelSlide');
}

function selectDay(day) {
  Booking.selected.day = day;
  document.querySelectorAll('.picker-wheel .picker-option').forEach(o => {
    if (o.onclick && o.onclick.toString().includes(`selectDay(${day})`)) {
      o.classList.add('selected');
    } else if (o.onclick && o.onclick.toString().includes('selectDay')) {
      o.classList.remove('selected');
    }
  });
  AudioManager.play('panelSlide');
}

function selectTime(time) {
  Booking.selected.time = time;
  document.querySelectorAll('.picker-wheel .picker-option').forEach(o => {
    if (o.onclick && o.onclick.toString().includes(`selectTime('${time}')`)) {
      o.classList.add('selected');
    } else if (o.onclick && o.onclick.toString().includes('selectTime')) {
      o.classList.remove('selected');
    }
  });
  AudioManager.play('panelSlide');
}

function selectStaff(id, name) {
  Booking.selected.staff = { id, name };
  document.querySelectorAll('.staff-option').forEach(o => {
    o.classList.toggle('selected', o.onclick.toString().includes(`selectStaff(${id}`));
  });
  AudioManager.play('panelSlide');
}

function selectService(name, price) {
  Booking.selected.service = { name, price };
  document.querySelectorAll('.detail-item').forEach(i => i.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  const t = TEXTS[Lang.current];
  UI.showAlert('success', `${t.serviceSelected}: ${name} ${price}`);
  setTimeout(() => document.getElementById('bookingAlert').classList.remove('show'), 1500);
}
