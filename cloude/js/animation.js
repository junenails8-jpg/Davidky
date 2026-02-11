// ==================== animation.js ====================
// 【职责】精灵角色动画、烟花特效
// 【修改指南】
//   - 改精灵移动速度 → 修改 startWalking 函数
//   - 改眨眼频率 → 修改 startBlinking 函数
//   - 改烟花颜色 → 修改 Fireworks.colors 数组
//   - 改精灵表情 → 修改 showScared, showHappy 等函数
// 【不要改】球物理、UI、预约相关代码

const Sprite = {
  element: null,
  eyes: null,
  mouth: null,
  speechBubble: null,
  walkTimer: null,
  isScared: false,
  clickCount: 0,
  
  init() {
    this.element = document.querySelector('.light-dot');
    this.eyes = this.element.querySelectorAll('.eye');
    this.mouth = this.element.querySelector('.mouth');
    this.speechBubble = document.querySelector('.speech-bubble');
    
    // 眼睛跟随鼠标
    document.addEventListener("mousemove", (e) => {
      this.updatePupils(e.clientX, e.clientY);
    });
    
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        this.updatePupils(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    
    // 点击精灵
    this.element.addEventListener("click", (e) => this.handleClick(e));
    this.element.addEventListener("touchstart", (e) => this.handleClick(e), { passive: false });
  },
  
  // 出现
  appear() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    this.element.style.left = `${centerX - 30}px`;
    this.element.style.transition = 'top 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    this.element.style.top = `${centerY - 30}px`;
    this.element.classList.add('visible');
    
    setTimeout(() => {
      this.showSpeech('哈喽！', 3000);
      this.startWalking();
      this.startBlinking();
    }, 1500);
  },
  
  // 眼睛跟随
  updatePupils(mouseX, mouseY) {
    this.eyes.forEach(eye => {
      const pupil = eye.querySelector(".pupil");
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const max = 10;
      pupil.style.left = 50 + Math.max(-max, Math.min(dx / 10, max)) + "%";
      pupil.style.top = 50 + Math.max(-max, Math.min(dy / 10, max)) + "%";
    });
  },
  
  // 眨眼
  startBlinking() {
    const blink = () => {
      this.eyes.forEach(eye => eye.classList.add("closed"));
      setTimeout(() => this.eyes.forEach(eye => eye.classList.remove("closed")), 100);
      setTimeout(blink, 2000 + Math.random() * 3000);
    };
    blink();
  },
  
  // 随机走动
  startWalking() {
    this.walkTimer = setInterval(() => {
      if (this.isScared) return;
      
      const leaveScreen = Math.random() < 0.2;
      let x, y;
      
      if (leaveScreen) {
        const side = Math.floor(Math.random() * 4);
        switch(side) {
          case 0: x = -100; y = Math.random() * window.innerHeight; break;
          case 1: x = window.innerWidth + 100; y = Math.random() * window.innerHeight; break;
          case 2: x = Math.random() * window.innerWidth; y = -100; break;
          case 3: x = Math.random() * window.innerWidth; y = window.innerHeight + 100; break;
        }
        
        this.element.style.transition = 'left 2s ease-out, top 2s ease-out';
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        
        setTimeout(() => {
          const returnX = Math.random() * (window.innerWidth - 60);
          const returnY = Math.random() * (window.innerHeight - 200) + 100;
          this.element.style.left = `${returnX}px`;
          this.element.style.top = `${returnY}px`;
        }, 2500);
      } else {
        x = Math.random() * (window.innerWidth - 60);
        y = Math.random() * (window.innerHeight - 200) + 100;
        
        this.element.style.transition = 'left 2s ease-out, top 2s ease-out';
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
      }
    }, 3000);
  },
  
  // 显示对话
  showSpeech(text, duration = 3000) {
    const rect = this.element.getBoundingClientRect();
    this.speechBubble.textContent = text;
    this.speechBubble.style.left = `${rect.left + rect.width / 2}px`;
    this.speechBubble.style.top = `${rect.top - 50}px`;
    this.speechBubble.classList.add('show');
    setTimeout(() => this.speechBubble.classList.remove('show'), duration);
  },
  
  // 害怕表情
  showScared() {
    this.isScared = true;
    this.eyes.forEach(eye => eye.classList.add("scared"));
    this.mouth.classList.add("scared");
    this.element.classList.add("scared");
    
    setTimeout(() => {
      this.eyes.forEach(eye => eye.classList.remove("scared"));
      this.mouth.classList.remove("scared");
      this.element.classList.remove("scared");
      this.isScared = false;
    }, 800);
  },
  
  // 点击处理
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.clickCount++;
    
    if (this.clickCount === 1) {
      this.showScared();
      document.dispatchEvent(new CustomEvent('spriteEscape'));
      
      const currentX = parseFloat(this.element.style.left);
      const currentY = parseFloat(this.element.style.top);
      const angle = Math.random() * Math.PI * 2;
      const distance = 150;
      const escapeX = currentX + Math.cos(angle) * distance;
      const escapeY = currentY + Math.sin(angle) * distance;
      
      this.element.style.transition = 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      this.element.style.left = `${Math.max(0, Math.min(window.innerWidth - 60, escapeX))}px`;
      this.element.style.top = `${Math.max(0, Math.min(window.innerHeight - 200, escapeY))}px`;
      
      setTimeout(() => {
        this.element.style.transition = 'left 2s ease-out, top 2s ease-out';
      }, 300);
    } else if (this.clickCount === 2) {
      this.showScared();
      document.dispatchEvent(new CustomEvent('spriteHit'));
      
      // 掉球
      const rect = this.element.getBoundingClientRect();
      Physics.createBall(rect.left + rect.width / 2 - 20, rect.top + rect.height);
      
      this.clickCount = 0;
    }
  },
  
  // 停止移动
  stop() {
    clearInterval(this.walkTimer);
    this.element.style.display = "none";
  },
  
  // 重启
  restart() {
    this.element.style.display = 'flex';
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    this.element.style.left = `${centerX - 30}px`;
    this.element.style.top = `${centerY - 30}px`;
    this.startWalking();
  }
};

// 烟花效果
const Fireworks = {
  canvas: null,
  ctx: null,
  colors: ['#FF3B3F', '#FFD700', '#32CD32', '#1E90FF', '#FF69B4', '#FFA500'],
  
  init() {
    this.canvas = document.getElementById('fireworkCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  },
  
  burst(x, y) {
    const particles = [];
    
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = 2 + Math.random() * 5;
      const size = 2 + Math.random() * 4;
      particles.push({
        x, y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size,
        alpha: 1
      });
    }
    
    let frames = 0;
    const animate = () => {
      frames++;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.08;
        p.alpha *= 0.97;
        
        const c = parseInt(p.color.slice(1), 16);
        const rgb = `${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}`;
        this.ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        this.ctx.fill();
      });
      
      if (frames < 60) requestAnimationFrame(animate);
      else this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    
    animate();
  }
};
