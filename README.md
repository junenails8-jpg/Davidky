# 🎨 NEW PROUD NAILS - 模块化项目

## 📦 快速开始

1. 解压所有文件到同一个文件夹
2. 双击 `index.html` 打开
3. 点击屏幕开始游戏

## 📁 文件说明

| 文件 | 作用 | 修改指南 |
|------|------|----------|
| index.html | HTML结构 | 一般不需要改 |
| css/style.css | 所有样式 | 改颜色、布局 → 改这里 |
| js/config.js | 配置数据 | 改文字、价格、员工 → 改这里 |
| js/main.js | 程序入口 | 改游戏流程 → 改这里 |
| js/physics.js | 球物理 | 改重力、弹跳 → 改这里 |
| js/animation.js | 精灵动画 | 改动画效果 → 改这里 |
| js/interaction.js | 交互/UI/预约 | 改预约逻辑 → 改这里 |
| config-sound.js | 音效配置 | 可选，外部音效 |

## 🎯 核心原则

**改哪儿动哪儿，绝不全幅改动！**

- 要改球速度？ → 只改 `config.js` 的 CONFIG.GRAVITY
- 要改颜色？ → 只改 `style.css` 的 :root 变量
- 要改预约时间？ → 只改 `interaction.js` 的 renderTimePicker 函数

## ✨ 完整功能

✅ 球物理引擎（重力、碰撞、倾斜控制）
✅ 精灵动画（眨眼、移动、表情）
✅ 完整多语言（中英西三语切换）
✅ 预约系统（时间+服务+技师）
✅ 音效系统（背景音乐+音效）
✅ 烟花特效
✅ 防缓存机制

## 📖 详细教程

请查看 `MODIFICATION_GUIDE.md` 获取详细的修改指南，包含：
- 每个文件的职责说明
- 常见修改任务列表
- 修改流程示例
- 模块通信机制

## 🔧 常见修改

```bash
# 改球速度
打开 config.js → 修改 CONFIG.GRAVITY

# 改主题颜色
打开 style.css → 修改 :root 变量

# 改预约时间
打开 interaction.js → 搜索 renderTimePicker

# 改服务价格
打开 config.js → 修改 SERVICES 对象
```

## 🎉 享受模块化开发！

有任何问题，参考 MODIFICATION_GUIDE.md
