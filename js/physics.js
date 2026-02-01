// ==================== physics.js ====================
// 【职责】球的物理引擎：重力、碰撞、倾斜控制
// 【修改指南】
//   - 改球的速度/重力 → 去 config.js 改 CONFIG 常量
//   - 改球的颜色/样式 → 去 style.css 改 .glass-ball
//   - 改球的收集逻辑 → 修改 checkUCollection 函数
// 【不要改】其他文件的代码

const Physics = {
  balls: [],
  ballsInU: [],
  tiltX: 0,
  tiltY: 0,
  groundY: 0,
  
  init() {
    this.groundY = window.innerHeight - CONFIG.GROUND_Y_OFFSET;
    
    // 手机陀螺仪
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null) {
          this.tiltX = e.gamma / 90;
          this.tiltY = 0;
        }
      });
    }
    
    window.addEventListener('resize', () => {
      this.groundY = window.innerHeight - CONFIG.GROUND_Y_OFFSET;
    });
  },
  
  // 创建新球
  createBall(x, y) {
    const ball = document.createElement("div");
    ball.className = "glass-ball";
    
    const random = Math.random() * 100;
    let ballType, ballScore;
    
    if (random < 5) {
      ballType = 'gold';
      ballScore = 3;
      ball.textContent = '⭐';
    } else if (random < 30) {
      ballType = 'silver';
      ballScore = 2;
      ball.textContent = '✨';
    } else {
      ballType = 'normal';
      ballScore = 1;
    }
    
    ball.classList.add(ballType);
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    document.body.appendChild(ball);
    
    // 球正常掉落（恢复原来的逻辑）
    const ballObj = {
      element: ball,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,  // 小的随机水平速度
      vy: 0,
      eaten: false,
      hasPlayedSound: false,
      type: ballType,
      score: ballScore
    };
    
    this.balls.push(ballObj);
    this.animateBall(ballObj);
    return ballObj;
  },
  
  // 球物理动画
  animateBall(ball) {
    const update = () => {
      if (ball.eaten) return;
      
      // 重力
      ball.vy += CONFIG.GRAVITY;
      
      // 倾斜力（只影响水平）
      ball.vx += this.tiltX * CONFIG.TILT_FORCE;
      
      // 空气阻力
      ball.vx *= CONFIG.AIR_FRICTION;
      ball.vy *= CONFIG.AIR_FRICTION;
      
      // 更新位置
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      // 地面碰撞
      if (ball.y >= this.groundY) {
        ball.y = this.groundY;
        ball.vy = -ball.vy * CONFIG.BOUNCE;
        ball.vx *= CONFIG.GROUND_FRICTION;
        
        // 🏐 只在垂直速度很小时归零，保持水平滚动能力
        if (Math.abs(ball.vy) < 0.2) {
          ball.vy = 0;
          // 不限制水平速度，让倾斜力能持续作用
        }
        
        // 落地音效（通过事件通知）
        if (!ball.hasPlayedSound && Math.abs(ball.vy) > 0.5) {
          document.dispatchEvent(new CustomEvent('ballDrop'));
          ball.hasPlayedSound = true;
        }
      }
      
      // 左右边界
      if (ball.x < 0) {
        ball.x = 0;
        ball.vx = -ball.vx * 0.7;
      }
      if (ball.x > window.innerWidth - 40) {
        ball.x = window.innerWidth - 40;
        ball.vx = -ball.vx * 0.7;
      }
      
      // 更新DOM
      ball.element.style.left = `${ball.x}px`;
      ball.element.style.top = `${ball.y}px`;
      
      // 检测收集
      this.checkUCollection(ball);
      
      if (!ball.eaten) requestAnimationFrame(update);
    };
    
    update();
  },
  
  // 检测球是否进入U字母
  checkUCollection(ball) {
    if (ball.eaten) return;
    
    const letterU = document.getElementById('letterU');
    if (!letterU) return;
    
    const uRect = letterU.getBoundingClientRect();
    const ballRect = ball.element.getBoundingClientRect();
    
    const ballCenterX = ballRect.left + ballRect.width / 2;
    const ballCenterY = ballRect.top + ballRect.height / 2;
    
    const uLeft = uRect.left + uRect.width * 0.1;
    const uRight = uRect.right - uRect.width * 0.1;
    const uTop = uRect.top;
    const uBottom = uRect.top + uRect.height * 0.6;
    
    if (ballCenterX >= uLeft && ballCenterX <= uRight &&
        ballCenterY >= uTop && ballCenterY <= uBottom) {
      
      ball.eaten = true;
      this.ballsInU.push(ball);
      
      // 通知其他模块
      document.dispatchEvent(new CustomEvent('ballEaten'));
      document.dispatchEvent(new CustomEvent('ballCollected', {
        detail: { score: ball.score, totalBalls: this.ballsInU.length }
      }));
      
      // 球堆叠效果
      const offsetX = (Math.random() - 0.5) * 30;
      const stackY = this.ballsInU.length * 15;
      
      ball.element.style.transition = 'all 0.3s ease';
      ball.element.style.left = `${uRect.left + uRect.width / 2 - 20 + offsetX}px`;
      ball.element.style.top = `${uRect.bottom - stackY - 40}px`;
    }
  },
  
  // 清除所有球
  clearAll() {
    this.balls.forEach(ball => {
      if (ball.element) ball.element.remove();
    });
    this.balls = [];
    this.ballsInU = [];
  }
};
