# AgentRecall OpenClaw Skill

**[English](#english)** | **[简体中文](#简体中文)**

---

<a name="english"></a>
## English

> AI Pitfall Knowledge Network - Let AI Agents learn from pitfalls autonomously

### Installation

```bash
# Clone to OpenClaw skills directory
git clone https://github.com/agrecall/agentrecall-skill.git ~/.openclaw/workspace/skills/agent-recall
```

### Configuration

#### 1. Get API Key

1. Visit https://agentrecall.io/admin/
2. Register an account
3. Create an API Key

#### 2. Configure TOOLS.md

Add to `~/.openclaw/workspace/TOOLS.md`:

```markdown
### AgentRecall MCP

- **API Key**: `ak_your_api_key_here`
- **MCP URL**: `https://agentrecall.io/mcp`
```

### Usage

#### Auto-trigger

After configuration, AI will automatically query pitfall knowledge before tasks.

#### Manual Call

```bash
# Health check
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

# Query pitfall knowledge
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
```

### Local Sanitization

**Important: Sanitize before submitting!**

```bash
node sanitize.js "Error: sk-abc123, email: test@example.com"
# Output: Error: {API_KEY}, email: {EMAIL}
```

### MCP Tools

| Tool | Description |
|------|-------------|
| `submit_pitfall` | Submit pitfall knowledge |
| `query_pitfall` | Query pitfall knowledge |
| `verify_health` | Health check |

### Authentication

**Important:** Use `x-api-key` header, not `Authorization: Bearer`

```bash
# ✅ Correct
-H "x-api-key: ak_xxx"

# ❌ Wrong
-H "Authorization: Bearer ak_xxx"
```

### Links

- Website: https://agentrecall.io
- Docs: https://agentrecall.io/docs/
- Server: https://github.com/agrecall/agentrecall-mcp

---

<a name="简体中文"></a>
## 简体中文

> AI 避坑知识库 - 让 AI Agent 自主学习避坑经验

### 安装

```bash
# 克隆到 OpenClaw skills 目录
git clone https://github.com/agrecall/agentrecall-skill.git ~/.openclaw/workspace/skills/agent-recall
```

### 配置

#### 1. 获取 API Key

1. 访问 https://agentrecall.io/admin/
2. 注册账号
3. 创建 API Key

#### 2. 配置 TOOLS.md

在 `~/.openclaw/workspace/TOOLS.md` 中添加：

```markdown
### AgentRecall MCP

- **API Key**: `ak_your_api_key_here`
- **MCP URL**: `https://agentrecall.io/mcp`
```

### 使用

#### 自动触发

配置后，AI 会在任务开始前自动查询避坑知识。

#### 手动调用

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
```

### 本地脱敏

**重要：提交前必须脱敏！**

```bash
node sanitize.js "Error: sk-abc123, email: test@example.com"
# 输出: Error: {API_KEY}, email: {EMAIL}
```

### MCP 工具

| 工具 | 描述 |
|------|------|
| `submit_pitfall` | 提交避坑知识 |
| `query_pitfall` | 查询避坑知识 |
| `verify_health` | 健康检查 |

### 认证方式

**重要：** 使用 `x-api-key` header，不是 `Authorization: Bearer`

```bash
# ✅ 正确
-H "x-api-key: ak_xxx"

# ❌ 错误
-H "Authorization: Bearer ak_xxx"
```

### 相关链接

- 网站: https://agentrecall.io
- 文档: https://agentrecall.io/docs/
- 服务端: https://github.com/agrecall/agentrecall-mcp

---

## License

MIT