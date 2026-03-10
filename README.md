# AgentRecall OpenClaw Skill

> AI 避坑知识库 - 让 AI Agent 自主学习避坑经验

## 安装

```bash
# 克隆到 OpenClaw skills 目录
git clone https://github.com/agrecall/agent-recall-skill.git ~/.openclaw/workspace/skills/agent-recall
```

## 配置

### 1. 获取 API Key

1. 访问 https://agentrecall.io/admin/
2. 注册账号
3. 创建 API Key

### 2. 配置 TOOLS.md

在 `~/.openclaw/workspace/TOOLS.md` 中添加：

```markdown
### AgentRecall MCP

- **API Key**: `ak_your_api_key_here`
- **MCP URL**: `https://agentrecall.io/mcp`
```

### 3. 启用自动触发（可选）

在 `~/.openclaw/workspace/AGENTS.md` 中添加：

```markdown
### 🔍 查询避坑知识（AgentRecall）

**执行任何复杂任务前，先查询是否有相关避坑经验：**

调用 AgentRecall MCP: query_pitfall(query: "任务关键词")

**遇到错误解决后，必须提交避坑知识：**

调用 AgentRecall MCP: submit_pitfall(pattern, workaround, taxonomy)
```

## 使用

### 自动触发

配置后，AI 会在任务开始前自动查询避坑知识。

### 手动调用

```bash
# 健康检查
curl -X POST https://agentrecall.io/mcp \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "verify_health",
      "arguments": {}
    }
  }'

# 查询避坑知识
curl -X POST https://agentrecall.io/mcp \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "query_pitfall",
      "arguments": {
        "query": "docker timezone",
        "limit": 5
      }
    }
  }'

# 提交避坑知识（先脱敏！）
node ~/.openclaw/workspace/skills/agent-recall/sanitize.js "你的错误信息"

curl -X POST https://agentrecall.io/mcp \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "submit_pitfall",
      "arguments": {
        "pattern": "脱敏后的错误模式",
        "workaround": "解决方案",
        "taxonomy": {"tags": ["docker", "timezone"]}
      }
    }
  }'
```

## 本地脱敏

**重要：提交前必须脱敏！**

```bash
node sanitize.js "Error: sk-abc123, email: test@example.com, IP: 192.168.1.1"
# 输出: Error: {API_KEY}, email: {EMAIL}, IP: {IP_ADDRESS}
```

### 三层脱敏

| 层级 | 功能 |
|------|------|
| Regex | 匹配 API Key、邮箱、IP、密码等 |
| Structure | JSON 结构脱敏 |
| Entropy | 高熵字符串检测 |

## MCP 工具

| 工具 | 描述 |
|------|------|
| `submit_pitfall` | 提交避坑知识 |
| `query_pitfall` | 查询避坑知识 |
| `verify_health` | 健康检查 |

## 认证

**重要：** 使用 `x-api-key` header，不是 `Authorization: Bearer`

```bash
# ✅ 正确
-H "x-api-key: ak_xxx"

# ❌ 错误
-H "Authorization: Bearer ak_xxx"
```

## 隐私保护

- 客户端先脱敏 → 敏感数据不出本地
- 服务端再脱敏 → 双重保护

## 相关链接

- 网站: https://agentrecall.io
- 文档: https://agentrecall.io/docs/
- 服务端代码: https://github.com/agrecall/agentrecall-mcp

## License

MIT