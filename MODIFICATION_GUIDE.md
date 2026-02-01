# 🎯 NEW PROUD NAILS - 模块化修改指南

## 📁 项目结构

```
/final-project
├─ index.html          纯HTML结构
├─ css/
│   └─ style.css      所有样式
├─ js/
│   ├─ config.js      配置数据
│   ├─ main.js        入口+协调
│   ├─ physics.js     球物理
│   ├─ animation.js   精灵+烟花
│   └─ interaction.js 交互+UI+预约
└─ config-sound.js    音效配置（可选）
```

---

## 🎨 需要改什么？只改对应文件！

### 1️⃣ 改文字/翻译/价格 → `config.js`

```javascript
// 改中文文字
TEXTS.zh.buttonBook = '立即预约';  // 按钮文字

// 改价格
SERVICES.manicure[0].price = '$15';  // 改 Regular Mani 价格

// 增加新员工
STAFF.push({ id: 5, name: 'Emily' });

// 改球速度
CONFIG.GRAVITY = 0.8;  // 重力变大，球掉得更快
CONFIG.TILT_FORCE = 2.0;  // 倾斜更灵敏
```

---

### 2️⃣ 改颜色/样式/布局 → `style.css`

```css
/* 改主题颜色 */
:root {
  --primary-gradient: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
  --accent-color: #1abc9c;
}

/* 改按钮大小 */
.glass-btn {
  min-width: 160px;  /* 变宽 */
  height: 70px;      /* 变高 */
}

/* 改Logo位置 */
#logo {
  top: 50px;  /* 往上移 */
}
```

---

### 3️⃣ 改球物理（重力/弹跳）→ `physics.js`

```javascript
// 在 checkUCollection 函数里改收集逻辑
const uBottom = uRect.top + uRect.height * 0.8;  // 改收集区域大小
```

⚠️ **不要改**：其他文件的代码！

---

### 4️⃣ 改精灵动画 → `animation.js`

```javascript
// 改眨眼频率（在 startBlinking 函数）
setTimeout(blink, 1000 + Math.random() * 2000);  // 更频繁眨眼

// 改移动速度（在 startWalking 函数）
}, 2000);  // 改成 2000 = 2秒移动一次（更快）

// 改烟花颜色
Fireworks.colors = ['#ff0000', '#00ff00', '#0000ff'];  // 只要红绿蓝
```

⚠️ **不要改**：球物理、UI、预约相关！

---

### 5️⃣ 改预约/UI/音效 → `interaction.js`

```javascript
// 改营业时间（在 renderTimePicker 函数）
for (let h = 9; h < 20; h++) {  // 改成 9:00-20:00

// 改预约检测
if (this.bookings.includes(key)) {
  // 这里可以改冲突提示逻辑
}

// 改音效音量
this.bgm.volume = 0.5;  // BGM音量 0-1
```

⚠️ **不要改**：球物理、精灵动画！

---

### 6️⃣ 改游戏流程/分数规则 → `main.js`

```javascript
// 改达成目标所需的球数（在 config.js）
const CONFIG = {
  TARGET_SCORE: 30,  // 改成需要30个球
  // ...
};

// 改奖励触发逻辑（在 triggerReward 函数）
setTimeout(() => this.triggerReward(), 2000);  // 延迟2秒
```

⚠️ **不要改**：具体功能实现，去对应模块改！

---

## ✅ 修改流程示例

### 例子1：我想改球掉落速度

1. 打开 `config.js`
2. 找到 `CONFIG.GRAVITY`
3. 改成 `0.8` （更快）或 `0.4` （更慢）
4. 保存，刷新页面

**只改这1个文件！** ✅

---

### 例子2：我想改预约营业时间

1. 打开 `interaction.js`
2. 搜索 `renderTimePicker`
3. 找到 `for (let h = 10; h < 19; h++)`
4. 改成 `for (let h = 9; h < 21; h++)`  (9点到21点)
5. 保存，刷新

**只改这1个函数！** ✅

---

### 例子3：我想改主题颜色

1. 打开 `style.css`
2. 找到 `:root` 
3. 改 `--primary-gradient` 和 `--accent-color`
4. 保存，刷新

**只改CSS变量！** ✅

---

## ⚠️ 重要原则

### ✅ 好的修改方式
```javascript
// ✅ 在 config.js 改配置
CONFIG.GRAVITY = 0.8;

// ✅ 在 style.css 改样式
.glass-btn { height: 70px; }

// ✅ 在对应模块改功能
Sprite.showScared() { /* 改这里 */ }
```

### ❌ 不好的修改方式
```javascript
// ❌ 不要在 main.js 里写物理代码
main.js 里写: ball.vy += 0.5;  // 错误！应该在 physics.js

// ❌ 不要在 physics.js 里写UI代码
physics.js 里写: panel.style.left = 0;  // 错误！应该在 interaction.js

// ❌ 不要跨文件乱改
到处复制粘贴代码  // 错误！保持模块独立
```

---

## 🔧 常见修改任务

| 任务 | 修改文件 | 搜索关键词 |
|------|----------|-----------|
| 改文字/翻译 | config.js | TEXTS |
| 改价格 | config.js | SERVICES |
| 改员工 | config.js | STAFF |
| 改颜色 | style.css | :root |
| 改按钮样式 | style.css | .glass-btn |
| 改球速度 | config.js | CONFIG.GRAVITY |
| 改收集区域 | physics.js | checkUCollection |
| 改眨眼频率 | animation.js | startBlinking |
| 改营业时间 | interaction.js | renderTimePicker |
| 改分数目标 | config.js | TARGET_SCORE |

---

## 📞 模块通信

模块之间通过**事件**通信，互不干扰：

```javascript
// physics.js 发出事件
document.dispatchEvent(new CustomEvent('ballCollected'));

// main.js 监听事件
document.addEventListener('ballCollected', (e) => {
  // 处理收集事件
});
```

**好处**：改 physics.js 不影响 main.js！

---

## 🎯 总结

**核心理念**：
1. 每个文件职责单一
2. 改哪儿动哪儿
3. 模块之间用事件通信
4. 配置和代码分离

**修改前**：
- 看看要改的是什么功能
- 查表找到对应文件
- 只改那个文件

**这样的好处**：
- 不会改坏其他功能
- 容易找到要改的代码
- 团队协作不冲突
- 维护成本低

---

Happy Coding! 🎨
