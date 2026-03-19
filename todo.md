# 芯颜AI Agent功能升级 TODO

## Step 1: 数据层
- [x] agentStorage.ts - 统一存储模块
- [x] mockAgentData.ts - 14天日记+默认方案+12天打卡+3个已保存产品
- [x] ingredientDatabase.ts - 80+成分条目
- [x] conflictRules.ts - 15+冲突规则+8+安全搭配
- [x] diaryInsights.ts - 6条AI洞察规则

## Step 2: 新页面
- [ ] Diary.tsx - 皮肤日记页
- [ ] Routine.tsx - 护肤方案+打卡页
- [ ] Ingredients.tsx - 成分分析器页
- [ ] Conflict.tsx - 产品冲突检测页
- [ ] Discover.tsx - 发现/工具集合页

## Step 3: 导航更新
- [ ] App.tsx - 添加新路由
- [ ] MobileTabBar.tsx - 重构5个tab (首页/AI对话/方案/发现/我的)
- [ ] Home.tsx - 重构为今日仪表盘

## Step 4: 集成更新
- [ ] Chat.tsx - 添加功能快捷入口+更新快捷问题
- [ ] Profile.tsx - 添加新统计数据+新设置项

## Step 5: 打磨
- [ ] 所有页面入场动画
- [ ] 空状态设计
- [ ] toast反馈
- [ ] 桌面端双栏适配
- [ ] 全面测试
