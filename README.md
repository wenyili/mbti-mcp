# MBTI MCP Server

一个用于MBTI人格测试的MCP服务器，支持AI助手引导用户完成人格测试并给出结果分析。

## 功能特性

- **两种测试模式**
  - 简化版（28题）：基于四个维度（E/I, S/N, T/F, J/P）的快速测试
  - 认知功能版（48题）：基于Jung的8种认知功能的深度测试

- **无状态设计**：所有测试状态通过JSON在工具调用间传递，无需服务端持久化

- **完整的测试流程**
  - 开始测试并选择类型
  - 逐题回答（1-5分李克特量表）
  - 查询测试进度
  - 计算最终MBTI类型

## 配置

### 方式1：使用npx（推荐，无需安装）

在MCP客户端配置文件中添加（如 Claude Desktop 的 `claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "mbti": {
      "command": "npx",
      "args": ["-y", "mbti-mcp"]
    }
  }
}
```

### 方式2：全局安装

```bash
npm install -g mbti-mcp
```

然后在MCP配置文件中添加：

```json
{
  "mcpServers": {
    "mbti": {
      "command": "mbti-mcp"
    }
  }
}
```

### 方式3：从源码安装

```bash
git clone https://github.com/wenyili/mbti-mcp.git
cd mbti-mcp
pnpm install
pnpm build
```

在MCP配置文件中添加：

```json
{
  "mcpServers": {
    "mbti": {
      "command": "node",
      "args": ["<项目路径>/dist/index.js"]
    }
  }
}
```

注意：将 `<项目路径>` 替换为你的实际项目路径。

## 使用方法

### 1. 开始测试

使用 `start_mbti_test` 工具，选择测试类型：

```json
{
  "testType": "simplified"
}
```

或

```json
{
  "testType": "cognitive"
}
```

服务器将返回第一道题目和测试会话状态（session）。

### 2. 回答问题

使用 `answer_question` 工具提交答案：

```json
{
  "session": { /* 上一步返回的session对象 */ },
  "score": 4
}
```

评分标准：
- 1 = 强烈不同意
- 2 = 不同意
- 3 = 中立
- 4 = 同意
- 5 = 强烈同意

服务器将返回下一道题目和更新后的session。

### 3. 查询进度（可选）

使用 `get_progress` 工具查看当前进度：

```json
{
  "session": { /* 当前的session对象 */ }
}
```

### 4. 计算结果

完成所有题目后，使用 `calculate_mbti_result` 工具：

```json
{
  "session": { /* 包含所有答案的session对象 */ }
}
```

服务器将返回：
- MBTI类型（如INTJ、ENFP等）
- 各维度或认知功能的得分
- 类型描述

## AI助手使用示例

用户可以这样与AI助手交互：

```
用户：我想做一个MBTI测试
AI：好的！我们提供两种测试：
    1. 简化版（28题）- 快速评估
    2. 认知功能版（48题）- 深度分析
    你想选择哪一种？

用户：简化版
AI：[调用 start_mbti_test]
    测试已开始！第1题：我在社交聚会上感到精力充沛
    请从1-5分选择你的同意程度...

用户：4分
AI：[调用 answer_question]
    答案已记录。第2题：独处时我能更好地恢复精力...
```

## 项目结构

```
mbti/
├── src/
│   ├── index.ts          # MCP服务器主文件
│   ├── types.ts          # TypeScript类型定义
│   ├── questions.ts      # 题库数据
│   └── calculator.ts     # MBTI类型计算算法
├── dist/                 # 编译输出
├── package.json
├── tsconfig.json
└── README.md
```

## 技术栈

- TypeScript
- @modelcontextprotocol/sdk
- Node.js

## 16种MBTI类型

- **分析师**: INTJ(建筑师), INTP(逻辑学家), ENTJ(指挥官), ENTP(辩论家)
- **外交官**: INFJ(提倡者), INFP(调停者), ENFJ(主人公), ENFP(竞选者)
- **守护者**: ISTJ(物流师), ISFJ(守卫者), ESTJ(总经理), ESFJ(执政官)
- **探险家**: ISTP(鉴赏家), ISFP(探险家), ESTP(企业家), ESFP(表演者)

## 许可证

MIT
