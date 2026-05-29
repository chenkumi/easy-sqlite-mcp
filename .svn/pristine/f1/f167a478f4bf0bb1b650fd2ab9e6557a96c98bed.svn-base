# Easy SQLite MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server implemented in Node.js and TypeScript, designed to enable LLMs to interact directly with SQLite databases.

## Modes

Easy SQLite MCP supports two startup modes. The server description is generated at startup so MCP clients and agents can clearly understand which mode is active.

### Manual Mode

Manual mode is used when `SQLITE_PATH` is not provided.

In this mode, the agent must explicitly open and close a database:

1. Call `sqlite_open(path)` before using database tools.
2. Use query, execute, and schema discovery tools.
3. Call `sqlite_close` when finished.

Only one SQLite database file can be open at a time. Opening another file closes the previous connection first.

Server description:

```text
Manual: This is a SQLite tool. Before using it, call sqlite_open(path) to open a database file. After use, call sqlite_close to close it. Only one database file can be open at a time.
```

Available tools in Manual mode:

- `sqlite_open`
- `sqlite_close`
- `sqlite_status`
- `sqlite_query`
- `sqlite_execute`
- `sqlite_list_tables`
- `sqlite_describe_table`

### Fixed Mode

Fixed mode is used when `SQLITE_PATH` is provided as an environment variable.

In this mode, the server automatically opens the configured SQLite database during startup. The agent does not need to call `sqlite_open`, and connection switching is disabled.

Server description:

```text
Fixed: This is a SQLite tool connected to Path:<SQLITE_PATH>
```

Available tools in Fixed mode:

- `sqlite_status`
- `sqlite_query`
- `sqlite_execute`
- `sqlite_list_tables`
- `sqlite_describe_table`

Example:

```bash
SQLITE_PATH=/data/app.sqlite npx easy-sqlite-mcp
```

## Features

This server provides SQLite tools covering all requirements from connection management to data querying:

1.  **Connection Management**:
    *   `sqlite_open`: Open a specific SQLite database file path. Manual mode only.
    *   `sqlite_close`: Close the current database connection. Manual mode only.
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

Manual mode:

```json
{
  "mcpServers": {
    "easy-sqlite-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "easy-sqlite-mcp"
      ]
    }
  }
}
```

Fixed mode example:

```json
{
  "mcpServers": {
    "easy-sqlite-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "easy-sqlite-mcp"
      ],
      "env": {
        "SQLITE_PATH": "/absolute/path/to/database.sqlite"
      }
    }
  }
}
```

## Codex config.toml Example

Manual mode:

```
[mcp_servers.easy-sqlite-mcp]
args = ["-y", "easy-sqlite-mcp"]
command = "npx"
enabled = true
```

Fixed mode example:

```
[mcp_servers.easy-sqlite-mcp]
args = ["-y", "easy-sqlite-mcp"]
command = "npx"
enabled = true

[mcp_servers.easy-sqlite-mcp.env]
SQLITE_PATH = "/absolute/path/to/database.sqlite"
```

## OpenCode opencode.jsonc Example

Manual mode:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "easy-sqlite-mcp": {
      "type": "local",
      "command": ["npx", "-y", "easy-sqlite-mcp"],
      "enabled": true,
    },
  },
}
```

Fixed mode example:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "easy-sqlite-mcp": {
      "type": "local",
      "command": ["npx", "-y", "easy-sqlite-mcp"],
      "enabled": true,
      "environment": {
        "SQLITE_PATH": "/absolute/path/to/database.sqlite"
      },
    },
  },
}
```

## Tech Stack
- **Runtime**: Node.js (>= 18)
- **Language**: TypeScript
- **SDK**: @modelcontextprotocol/sdk
- **Database**: better-sqlite3 (High performance with support for synchronous operations)
- **Validation**: Zod (Strict parameter validation)

---
Developed with the assistance of Antigravity.
