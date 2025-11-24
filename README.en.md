# PGYER MCP Server

An MCP (Model Context Protocol) server for uploading applications to the PGYER platform.

![Claude Screenshot](https://raw.githubusercontent.com/PGYER/pgyer-mcp-server/refs/heads/main/assets/claude-screenshot.png)

## Features

- Compatible with MCP (Model Context Protocol) protocol, supporting multi-platform integration (such as Claude, VSCode, etc.)
- Provides three core tools:
  - `upload-app`: Upload applications (ipa/apk) to the PGYER platform, supporting multiple upload parameters
  - `list-my-apps`: Query the list of uploaded applications in the current account, supporting pagination
  - `get-app-info-by-shortcut`: Query detailed application information through the app shortcut
- Support for configuring API keys through the `PGYER_API_KEY` environment variable, secure and flexible
- Simple and easy-to-use API interface, supporting multiple running methods including command line, Node.js, Docker, etc.
- Support for custom upload parameters (such as installation method, installation password, update description, validity period, etc.)
- Applicable to various scenarios such as iOS/Android application distribution, testing, beta testing, etc.

## Use Cases

- **Application Distribution and Beta Testing**: Quickly distribute iOS/Android applications through the PGYER platform, supporting public installation, password installation, invitation installation and other methods, suitable for team beta testing, public testing and other scenarios.
- **Continuous Integration and Automation**: Integrated with CI/CD tools (such as Jenkins, GitHub Actions), achieving automatic application packaging, uploading, and distribution, improving development efficiency.
- **Multi-platform Integration**: Support integration with platforms such as Claude and VSCode, making it convenient for developers to use PGYER services in different environments.
- **Application Version Management**: Through `list-my-apps` and `get-app-info-by-shortcut` tools, easily query and manage information of uploaded application versions.

## Integration Methods

### Integration with VSCode

Quick installation with a single command:

```bash
code --add-mcp '{"name":"pgyer","command":"npx","args":["-y","pgyer-mcp-server"],"env":{"PGYER_API_KEY":"<your_pgyer_api_key>"}}'
```

> **Note:** Replace `<your_pgyer_api_key>` with your PGYER API key.

### Integration with Claude Code

If you are using Claude Code (command line tool), you can quickly add PGYER MCP Server with the following command:

```bash
claude mcp add --transport stdio pgyer --env PGYER_API_KEY=<your_pgyer_api_key> -- npx -y pgyer-mcp-server
```

Replace `<your_pgyer_api_key>` with your PGYER API key.

### Integration with Codex

If you are using Codex, you can quickly add PGYER MCP Server with the following command:

```bash
codex mcp add pgyer --env PGYER_API_KEY=<your_pgyer_api_key> -- npx -y pgyer-mcp-server
```

Replace `<your_pgyer_api_key>` with your PGYER API key.

## Tool Configuration

The following tool groups are available (all enabled by default):

1. `upload-app`: Upload applications to the PGYER platform
2. `list-my-apps`: Query the list of apps uploaded by yourself
3. `get-app-info-by-shortcut`: Query app information through shortcut

## License

MIT

## Contributing

Welcome to submit Pull Requests or create Issues to help improve the project.

[中文文档](./README.md)
