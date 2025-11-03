#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import PGYERAppUploader from "./PGYERAppUploader.js";
const PGYER_API_HOST = "https://api.pgyer.com/apiv2";
async function makePGYERRequest(endpoint, params) {
    const API_KEY = process.env.PGYER_API_KEY;
    if (!API_KEY) {
        throw new Error("PGYER_API_KEY environment variable is not set");
    }
    const postData = new URLSearchParams({ _api_key: API_KEY, ...params });
    const response = await fetch(`${PGYER_API_HOST}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: postData.toString()
    });
    return response.json();
}
// Create server instance
const server = new McpServer({
    name: "pgyer-mcp-server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.tool("upload-app", "Upload app to PGYER", {
    filePath: z.string().describe("Path to the app file"),
}, async ({ filePath }) => {
    const API_KEY = process.env.PGYER_API_KEY;
    if (!API_KEY) {
        return {
            content: [{
                    type: "text",
                    text: "Error: PGYER_API_KEY environment variable is not set"
                }],
            isError: true
        };
    }
    const uploader = new PGYERAppUploader(API_KEY);
    try {
        const result = await uploader.upload({ filePath });
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
server.tool("list-my-apps", "List my apps on PGYER", {
    page: z.number().optional().describe("Page number, optional, default is 1")
}, async ({ page }) => {
    try {
        const params = {};
        if (page)
            params.page = String(page);
        const result = await makePGYERRequest("app/listMy", params);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
server.tool("get-app-info-by-shortcut", "Get app info by app shortcut on PGYER", {
    buildShortcutUrl: z.string().describe("App shortcut on PGYER")
}, async ({ buildShortcutUrl }) => {
    try {
        const params = { buildShortcutUrl };
        const result = await makePGYERRequest("app/getByShortcut", params);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify(result, null, 2)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
            isError: true
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("PGYER MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
