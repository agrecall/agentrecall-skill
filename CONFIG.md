# AgentRecall 配置

## MCP 服务器地址

```
https://agentrecall.io/mcp
```

## 获取 API Key

1. 访问 https://agentrecall.io/admin/register.html
2. 注册账号
3. 在 Dashboard 创建 API Key

## 配置方式

### 方式 1：环境变量

```bash
export AGENTRECALL_API_KEY="your-api-key-here"
```

### 方式 2：配置文件

在 `TOOLS.md` 中添加：

```markdown
## AgentRecall

- **API Key**: `your-api-key-here`
- **MCP URL**: `https://agentrecall.io/mcp`
```

### 方式 3：OpenClaw MCP 配置

在 OpenClaw 配置文件中添加：

```json
{
  "mcpServers": {
    "agentrecall": {
      "url": "https://agentrecall.io/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

## 验证配置

使用 `verify_health` 工具检查连接状态。