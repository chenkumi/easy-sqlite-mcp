#!/usr/bin/env node
/**
 * SQLite MCP Server
 *
 * This server provides tools to interact with SQLite databases via
 * the Model Context Protocol (MCP). It supports opening/closing databases,
 * querying, executing statements, listing tables, and describing schemas.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
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

const manualText = readFileSync(fileURLToPath(new URL("../MANUAL.md", import.meta.url)), "utf8");

// Register all SQLite tools
registerSqliteTools(server, { fixedDatabasePath: sqlitePath });

server.registerTool(
  "sqlite_manual",
  {
    title: "SQLite Manual",
    description: "Return the SQLite MCP manual. Use this first when you are unsure how to use sqlite_open, sqlite_query, sqlite_execute, or when an operation fails and you need the safe usage rules, placeholder rules, or database lifecycle guidance.",
    inputSchema: z.object({}),
  },
  async () => ({
    content: [{ type: "text", text: manualText }],
    structuredContent: { manual: manualText },
  })
);

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
