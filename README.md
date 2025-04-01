# 座位表管理系统

一个基于Vue 3和Node.js的座位表管理系统，支持座位编辑、用户分配等功能。

## 功能特点

- 可视化座位编辑器
- 支持拖拽编辑座位位置
- 座位状态管理（空闲/占用/禁用）
- 用户-座位绑定
- 数据持久化存储

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Pinia (状态管理)
- Vue Router
- Element Plus (UI组件库)
- Konva.js (画布操作)

### 后端
- Node.js
- TypeScript
- Express
- 文件系统存储 (JSON)

## 开发环境设置

1. 克隆项目
```bash
git clone [项目地址]
cd seating-chart-system
```

2. 安装前端依赖
```bash
cd frontend
npm install
```

3. 安装后端依赖
```bash
cd ../backend
npm install
```

4. 启动开发服务器

前端（新终端）：
```bash
cd frontend
npm run dev
```

后端（新终端）：
```bash
cd backend
npm run dev
```

5. 访问应用
打开浏览器访问 http://localhost:5173/room-editor

## 项目结构

```
seating-chart-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── seating/
│   │   ├── stores/
│   │   ├── services/
│   │   ├── types/
│   │   ├── views/
│   │   └── router/
│   └── package.json
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   ├── routes/
    │   └── types/
    └── package.json
```

## 使用说明

1. 创建新房间
2. 进入编辑模式
3. 添加和编辑座位
4. 保存布局
5. 分配用户到座位

## 开发计划

- [ ] 添加用户管理功能
- [ ] 实现座位属性编辑
- [ ] 添加撤销/重做功能
- [ ] 支持导入/导出布局
- [ ] 添加数据库支持

## 许可证

MIT 