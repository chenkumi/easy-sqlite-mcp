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

const sqlitePath = process.env.SQLITE_PATH?.trim();

// Create MCP server instance
const server = new McpServer({
  name: "easy-sqlite-mcp",
  version: "1.0.3",
  description: sqlitePath
    ? `Fixed: This is a SQLite tool connected to Path:${sqlitePath}`
    : "Manual: This is a SQLite tool. Before using it, call sqlite_open(path) to open a database file. After use, call sqlite_close to close it. Only one database file can be open at a time.",
});

// Register all SQLite tools
registerSqliteTools(server, { fixedDatabasePath: sqlitePath });

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
