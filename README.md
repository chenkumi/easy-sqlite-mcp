# Easy SQLite MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server implemented in Node.js and TypeScript, designed to enable LLMs to interact directly with SQLite databases.

## Features

This server provides 7 core tools covering all requirements from connection management to data querying:

1.  **Connection Management**:
    *   `sqlite_open`: Open a specific SQLite database file path.
    *   `sqlite_close`: Close the current database connection.
    *   `sqlite_status`: Check connection status, file path, and database summary.
2.  **Data Operations**:
    *   `sqlite_query`: Execute read-only `SELECT` queries and return results in a structured format.
    *   `sqlite_execute`: Execute write or modification operations (e.g., `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP`).
3.  **Schema Discovery**:
    *   `sqlite_list_tables`: List all user-defined tables in the database.
    *   `sqlite_describe_table`: Get column information, types, and total row count for a specific table.

## Installation and Execution

### 1. Run via npx
If the project is published on npm, you can start it directly using `npx` without prior installation:
```bash
npx easy-sqlite-mcp
```

### 2. Local Development and Build
To develop locally or build from source, follow these steps:
```bash
npm install
npm run build
npm run dev # Watch for changes and run in development mode
```

## Claude Desktop Example

```json
{
  "mcpServers": {
    "easy-mysql-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "easy-mysql-mcp"
      ]
    }
  }
}
```

## Codex config.toml Example

```
[mcp_servers.easy-sqlite-mcp]
args = ["-y", "easy-sqlite-mcp"]
command = "npx"
enabled = true
```

## OpenCode opencode.jsonc Example

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "easy-mysql-mcp": {
      "type": "local",
      "command": ["npx", "-y", "easy-mysql-mcp"],
      "enabled": true,
    },
  },
}
```

## Agent Skills (`/skills`)

The `/skills` directory contains Agent Skills designed to work in conjunction with this MCP Server. These skill documents provide Large Language Models (LLMs) with the knowledge of how to use this server for professional, high-level database operations. You can add these skills to your AI agent's workspace.

## Tech Stack
- **Runtime**: Node.js (>= 18)
- **Language**: TypeScript
- **SDK**: @modelcontextprotocol/sdk
- **Database**: better-sqlite3 (High performance with support for synchronous operations)
- **Validation**: Zod (Strict parameter validation)

---
Developed with the assistance of Antigravity.
