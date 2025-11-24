[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/pgyer-pgyer-mcp-server-badge.png)](https://mseep.ai/app/pgyer-pgyer-mcp-server)

# PGYER MCP Server

[English](./README.en.md) | 中文

这是一个用于上传应用到 PGYER 平台的 MCP (Model Context Protocol) 服务器.

![Claude Screenshot](https://raw.githubusercontent.com/PGYER/pgyer-mcp-server/refs/heads/main/assets/claude-screenshot.png)

## 功能特点

- 兼容 MCP (Model Context Protocol) 协议，支持多平台集成（如 Claude、VSCode 等）
- 提供三大核心工具：
  - `upload-app`：上传应用（ipa/apk）到 PGYER 平台，支持多种上传参数
  - `list-my-apps`：查询当前账号下已上传的应用列表，支持分页
  - `get-app-info-by-shortcut`：通过应用短链接（shortcut）查询详细信息
- 支持通过环境变量 `PGYER_API_KEY` 配置 API 密钥，安全灵活
- 简单易用的 API 接口，支持命令行、Node.js、Docker 等多种运行方式
- 支持自定义上传参数（如安装方式、安装密码、更新描述、有效期等）
- 适用于 iOS/Android 应用分发、测试、内测等多种场景

## 使用场景

- **应用分发与内测**：通过 PGYER 平台快速分发 iOS/Android 应用，支持公开安装、密码安装、邀请安装等多种方式，适合团队内测、公测等场景。
- **持续集成与自动化**：结合 CI/CD 工具（如 Jenkins、GitHub Actions），实现应用自动打包、上传、分发，提升开发效率。
- **多平台集成**：支持与 Claude、VSCode 等平台集成，方便开发者在不同环境中使用 PGYER 服务。
- **应用版本管理**：通过 `list-my-apps` 和 `get-app-info-by-shortcut` 工具，轻松查询和管理已上传的应用版本信息。

## 集成方式

### 在 VSCode 中集成

使用一键命令快速安装：

```bash
code --add-mcp '{"name":"pgyer","command":"npx","args":["-y","pgyer-mcp-server"],"env":{"PGYER_API_KEY":"<your_pgyer_api_key>"}}'
```

> **注意：** 请将 `<your_pgyer_api_key>` 替换为你的 PGYER API 密钥。

### 与 Claude Code 集成

如果你使用 Claude Code（命令行工具），可以通过以下命令快速添加 PGYER MCP Server：

```bash
claude mcp add --transport stdio pgyer --env PGYER_API_KEY=<your_pgyer_api_key> -- npx -y pgyer-mcp-server
```

请将 `<your_pgyer_api_key>` 替换为你的 PGYER API 密钥。

### 与 Codex 集成

如果你使用 Codex，可以通过以下命令快速添加 PGYER MCP Server：

```bash
codex mcp add pgyer --env PGYER_API_KEY=<your_pgyer_api_key> -- npx -y pgyer-mcp-server
```

请将 `<your_pgyer_api_key>` 替换为你的 PGYER API 密钥。

## 工具配置

有以下几组工具可用（默认情况下全部启用）：

1. `upload-app`：上传应用到 PGYER 平台
2. `list-my-apps`：查询自己上传的 App 列表
3. `get-app-info-by-shortcut`：通过短链接（App shortcut）查询 App 信息

## 许可证

MIT

## 贡献

欢迎提交 Pull Request 或创建 Issue 来帮助改进项目。 
