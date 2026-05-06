#!/usr/bin/env node
/**
 * SQLite MCP Server
 *
 * This server provides tools to interact with SQLite databases via
 * the Model Context Protocol (MCP). It supports opening/closing databases,
 * querying, executing statements, listing tables, and describing schemas.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSqliteTools } from "./tools/sqlite.js";

// Create MCP server instance
const server = new McpServer({
  name: "easy-sqlite-mcp",
  version: "1.0.2",
});

// Register all SQLite tools
registerSqliteTools(server);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SQLite MCP server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
