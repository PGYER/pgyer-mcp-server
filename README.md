# PGYER MCP Server

这是一个用于上传应用到 PGYER 平台的 MCP (Model Context Protocol) 服务器。

<img src="https://raw.githubusercontent.com/PGYER/pgyer-mcp-server/refs/heads/main/assets/claude-screenshot.png" width="60%" alt="Claude Screenshot">

## 功能特点

- 支持通过 MCP 协议上传应用到 PGYER 平台
- 简单易用的 API 接口
- 支持环境变量配置

## 安装

```bash
# 克隆仓库
git clone https://github.com/PGYER/pgyer-mcp-server.git
cd pgyer-mcp-server

# 安装依赖
npm install
```

### 与 Claude App 集成

如果你想要与 Claude App 集成，需要在 Claude App 的配置文件中添加以下配置：

#### 使用 Node.js 运行

```json
{
  "mcpServers": {
    "pgyer": {
      "command": "node",
      "args": ["/path/to/pgyer-mcp-server/build/index.js"],
      "env": {
        "PGYER_API_KEY": "<your_pgyer_api_key>"
      }
    }
  }
}
```

#### 使用 Docker 运行

```json
{
  "mcpServers": {
    "pgyer": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "PGYER_API_KEY",
        "--mount", "type=bind,src=/Users/username/Downloads,dst=/Users/username/Downloads",
        "pgyer/pgyer-mcp-server"
      ],
      "env": {
        "PGYER_API_KEY": "<your_pgyer_api_key>"
      }
    }
  }
}
```

请确保：
1. 将 `/path/to/pgyer-mcp-server` 替换为你的实际项目路径
2. 将 `your_pgyer_api_key` 替换为你的 PGYER API 密钥
3. 如果使用 Docker，请根据你的实际需求调整挂载目录的路径

## 工具配置

有以下几组工具可用（默认情况下全部启用）：

1. `upload-app`：上传应用到 PGYER 平台
2. `list-my-apps`：查询自己上传的 App 列表
3. `get-app-info-by-shortcut`：通过短链接（App shortcut）查询 App 信息

## 许可证

MIT

## 贡献

欢迎提交 Pull Request 或创建 Issue 来帮助改进项目。 
