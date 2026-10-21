#!/usr/bin/env node
// pgyer-mcp-server 2.x starts the MCP server that ships with the PGYER CLI
// (@pgyer/cli, `pgyer mcp`). Only MCP messages are written to stdout.
import { runStdioServer } from '@pgyer/cli/mcp';

runStdioServer().catch((error) => {
  console.error(`pgyer-mcp-server: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
