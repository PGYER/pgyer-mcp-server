# PGYER MCP Server

English | [中文](./README.md)

An MCP (Model Context Protocol) server for [PGYER](https://www.pgyer.com). Upload Android (.apk), iOS (.ipa) and HarmonyOS (.hap) packages, look up apps and their versions, and change app settings from AI clients such as Claude, Cursor, VS Code and Codex.

![Claude Screenshot](https://raw.githubusercontent.com/PGYER/pgyer-mcp-server/refs/heads/main/assets/claude-screenshot.png)

Since 2.0 this package is only a launcher: the server ships with the PGYER command-line tool [`@pgyer/cli`](https://github.com/PGYER/pgyer-cli) (`pgyer mcp`), and both offer the same tools. Existing `npx -y pgyer-mcp-server` configurations keep working.

## Requirements

- Node.js 20.19 or later
- A PGYER API key from the [API page](https://www.pgyer.com/account/api)

The server reads `PGYER_API_KEY` first. Without it, it uses the credentials saved on this machine by `pgyer auth login`.

## Setup

### Claude Code

```bash
claude mcp add pgyer --env PGYER_API_KEY=<your_pgyer_api_key> -- npx -y pgyer-mcp-server
```

### Claude Desktop

Edit `claude_desktop_config.json` (Settings → Developer → Edit Config):

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

Add to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` in a project:

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

Add it with one command:

```bash
code --add-mcp '{"name":"pgyer","command":"npx","args":["-y","pgyer-mcp-server"],"env":{"PGYER_API_KEY":"<your_pgyer_api_key>"}}'
```

Or add it to `.vscode/mcp.json` in a project. VS Code then asks for the API key when the server starts, so the key is not stored in the file:

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

Or edit `~/.codex/config.toml`. Codex stops tools after 60 seconds by default, so raise the limit for large uploads:

```toml
[mcp_servers.pgyer]
command = "npx"
args = ["-y", "pgyer-mcp-server"]
env = { PGYER_API_KEY = "<your_pgyer_api_key>" }
tool_timeout_sec = 900
```

> With `@pgyer/cli` installed globally and `pgyer auth login` done, you can run `pgyer mcp` instead and leave out `PGYER_API_KEY`.

## Tools

| Tool | What it does | Read-only | Overwrites state |
| --- | --- | --- | --- |
| `upload_app` | Uploads an .apk/.ipa/.hap, waits until PGYER has processed it, and returns the download page, QR code and version. Takes the install type, install password, release notes, app description, install period, channel shortcut, overseas or mainland upload, and processing timeout. Sends upload and processing progress when the client gives a progressToken | No | No |
| `get_upload_status` | Checks an upload by its buildKey (after `upload_app` reached its processing timeout), optionally waiting | Yes | No |
| `list_apps` | Lists the account's apps and their latest versions, page by page | Yes | No |
| `get_app` | Gets an app's details by appKey or shortcut (or a full download page URL), optionally for one historical build | Yes | No |
| `list_versions` | Lists an app's versions by appKey or shortcut, page by page | Yes | No |
| `set_latest_version` | Sets or removes a build's latest-version mark | No | Yes |
| `update_app_settings` | Changes the shortcut, install type and password, install period, download page language, version source, auto sync and copyright display. Other settings stay as they are; supports dryRun | No | Yes |

- An upload sends only the settings you give; the app keeps its current values for the rest
- There are no tools that delete apps or versions, and install passwords are never returned
- If `www.pgyer.com` cannot be reached, the server falls back to `www.xcxwo.com` and `www.pgyerapp.com`
- The API key is sent only in HTTPS request bodies, never in a URL

## Upgrading from 1.x

2.0 renames the tools to snake_case and adds new ones. Update prompts or client tool allowlists that use the old names:

| 1.x | 2.0 |
| --- | --- |
| `upload-app` | `upload_app` (now with every upload setting and progress notifications) |
| `list-my-apps` | `list_apps` |
| `get-app-info-by-shortcut` | `get_app` (argument `shortcut`) |

Results are now structured data instead of raw API responses. 1.x put the API key in the URL used to check uploads; 2.0 no longer does.

## Docker

```bash
docker build -t pgyer-mcp-server .
docker run -i --rm -e PGYER_API_KEY=<your_pgyer_api_key> pgyer-mcp-server
```

## Development and releases

The server code lives in `src/mcp/` of [PGYER/pgyer-cli](https://github.com/PGYER/pgyer-cli); please file issues and changes there. This repository holds only the launcher, the MCP Registry metadata (`server.json`) and the documentation. See [RELEASING.md](./RELEASING.md) for publishing.

## License

MIT
