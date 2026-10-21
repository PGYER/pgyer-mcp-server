# PGYER MCP Server

[English](./README.en.md) | 中文

蒲公英（[PGYER](https://www.pgyer.com)）的 MCP（Model Context Protocol）服务器。在 Claude、Cursor、VS Code、Codex 等 AI 客户端里直接上传 Android（.apk）、iOS（.ipa）和鸿蒙（.hap）安装包，查询应用与历史版本，修改应用设置。

![Claude Screenshot](https://raw.githubusercontent.com/PGYER/pgyer-mcp-server/refs/heads/main/assets/claude-screenshot.png)

从 2.0 开始，本包只是一个启动器：服务器本身由蒲公英命令行工具 [`@pgyer/cli`](https://github.com/PGYER/pgyer-cli)（`pgyer mcp`）提供，两者的工具和行为完全相同。原有的 `npx -y pgyer-mcp-server` 配置无需修改。

## 准备

- Node.js 20.19 或更高版本
- 蒲公英 API Key：在 [API 信息页面](https://www.pgyer.com/account/api) 获取

服务器优先读取环境变量 `PGYER_API_KEY`；没有设置时，使用 `pgyer auth login` 保存在本机的凭证。

## 配置

### Claude Code

```bash
claude mcp add pgyer --env PGYER_API_KEY=<your_pgyer_api_key> -- npx -y pgyer-mcp-server
```

### Claude Desktop

编辑 `claude_desktop_config.json`（设置 → 开发者 → 编辑配置）：

```json
{
  "mcpServers": {
    "pgyer": {
      "command": "npx",
      "args": ["-y", "pgyer-mcp-server"],
      "env": { "PGYER_API_KEY": "<your_pgyer_api_key>" }
    }
  }
}
```

### Cursor

在 `~/.cursor/mcp.json`（全局）或项目内的 `.cursor/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "pgyer": {
      "command": "npx",
      "args": ["-y", "pgyer-mcp-server"],
      "env": { "PGYER_API_KEY": "<your_pgyer_api_key>" }
    }
  }
}
```

### VS Code

一键添加：

```bash
code --add-mcp '{"name":"pgyer","command":"npx","args":["-y","pgyer-mcp-server"],"env":{"PGYER_API_KEY":"<your_pgyer_api_key>"}}'
```

或在项目的 `.vscode/mcp.json` 中添加（启动时提示输入 API Key，不会写进文件）：

```json
{
  "inputs": [
    { "type": "promptString", "id": "pgyer-api-key", "description": "PGYER API Key", "password": true }
  ],
  "servers": {
    "pgyer": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "pgyer-mcp-server"],
      "env": { "PGYER_API_KEY": "${input:pgyer-api-key}" }
    }
  }
}
```

### Codex

```bash
codex mcp add pgyer --env PGYER_API_KEY=<your_pgyer_api_key> -- npx -y pgyer-mcp-server
```

或编辑 `~/.codex/config.toml`。Codex 默认的工具超时是 60 秒，上传较大的安装包时请调大：

```toml
[mcp_servers.pgyer]
command = "npx"
args = ["-y", "pgyer-mcp-server"]
env = { PGYER_API_KEY = "<your_pgyer_api_key>" }
tool_timeout_sec = 900
```

> 已全局安装 `@pgyer/cli` 并执行过 `pgyer auth login` 时，也可以把命令换成 `pgyer mcp`，并省略 `PGYER_API_KEY`。

## 工具

| 工具 | 作用 | 只读 | 覆盖已有状态 |
| --- | --- | --- | --- |
| `upload_app` | 上传 .apk/.ipa/.hap 并等待蒲公英处理完成，返回下载页地址、二维码、版本号等；支持安装方式、安装密码、更新说明、应用介绍、安装有效期、渠道短链接、海外/国内上传和处理超时；客户端提供 progressToken 时发送上传和处理进度 | 否 | 否 |
| `get_upload_status` | 按 buildKey 查询上传的处理结果（`upload_app` 处理超时后使用），可设置等待时间 | 是 | 否 |
| `list_apps` | 分页列出账号下的应用及其最新版本 | 是 | 否 |
| `get_app` | 按 appKey 或短链接（也可以是完整的下载页地址）查询应用详情，可指定历史版本 | 是 | 否 |
| `list_versions` | 按 appKey 或短链接分页列出历史版本 | 是 | 否 |
| `set_latest_version` | 设置或取消某个版本的「最新版本」标记 | 否 | 是 |
| `update_app_settings` | 修改短链接、安装方式与密码、安装有效期、下载页语言、版本号来源、自动同步和版权显示；未指定的设置保持不变，支持 dryRun | 否 | 是 |

- 上传只发送你指定的设置，未指定的设置保持应用当前的值
- 不提供删除应用或版本的工具，也不会返回安装密码
- 主域名 `www.pgyer.com` 无法访问时，自动改用 `www.xcxwo.com`、`www.pgyerapp.com`
- API Key 只在 HTTPS 请求正文中发送，不会出现在 URL 里

## 从 1.x 升级

2.0 的工具名称改为 snake_case 并增加了新工具。如果你的提示词或客户端的工具白名单写了旧名称，请相应修改：

| 1.x | 2.0 |
| --- | --- |
| `upload-app` | `upload_app`（新增全部上传设置与进度通知） |
| `list-my-apps` | `list_apps` |
| `get-app-info-by-shortcut` | `get_app`（参数 `shortcut`） |

工具的返回结果也改为整理后的结构化数据，不再原样返回 API 响应。1.x 把 API Key 放在查询上传结果的 URL 中，2.0 已修复。

## Docker

```bash
docker build -t pgyer-mcp-server .
docker run -i --rm -e PGYER_API_KEY=<your_pgyer_api_key> pgyer-mcp-server
```

## 开发与发布

服务器代码在 [PGYER/pgyer-cli](https://github.com/PGYER/pgyer-cli) 的 `src/mcp/` 中，问题与改进请提交到该仓库。本仓库只包含启动器、MCP Registry 元数据（`server.json`）和文档。发布步骤见 [RELEASING.md](./RELEASING.md)。

## 许可证

MIT
