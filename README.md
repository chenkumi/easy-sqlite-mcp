# easy-sqlite-mcp

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server implemented in Node.js and TypeScript, designed to enable LLMs to interact directly with SQLite databases.

This project uses Node.js, TypeScript, the official MCP SDK, and `better-sqlite3`. It runs over stdio, so it can be used directly by MCP clients such as Claude Desktop, Codex, and OpenCode.

## Features

- SQLite connection management for manual and fixed startup modes
- Read-only query tool for data retrieval
- Execute tool for data modification and schema statements
- Schema discovery tools for tables, views, indexes, and triggers
- Lightweight, synchronous SQLite access powered by `better-sqlite3`

`better-sqlite3` in this project requires Node.js 20 or newer.

## Requirements

- Node.js 20 or newer
- npm
- A reachable SQLite database file

## Installation

Run the server directly with `npx`:

```bash
npx -y easy-sqlite-mcp
```

For local development after cloning the repository:

```bash
cd easy-sqlite-mcp
npm install
npm run build
```

## Configuration

Configure the server with environment variables in your MCP client configuration or shell environment.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `SQLITE_PATH` | No | - | Absolute or relative path to a SQLite database file. When set, the server starts in fixed mode |

Example shell configuration:

```bash
SQLITE_PATH=/absolute/path/to/database.sqlite npx -y easy-sqlite-mcp
```

In PowerShell:

```powershell
$env:SQLITE_PATH = "C:\data\database.sqlite"
npx -y easy-sqlite-mcp
```

The server communicates over stdio and is normally launched by an MCP client rather than run manually.

If you are unsure how a tool should be used, or an operation fails, call `sqlite_manual` first. It returns the built-in manual with safe usage rules, placeholder guidance, and lifecycle notes.

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

## Claude Desktop Example

Manual mode:

```json
{
  "mcpServers": {
    "easy-sqlite-mcp": {
      "command": "npx",
      "args": ["-y", "easy-sqlite-mcp"]
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
      "args": ["-y", "easy-sqlite-mcp"],
      "env": {
        "SQLITE_PATH": "/absolute/path/to/database.sqlite"
      }
    }
  }
}
```

Restart Claude Desktop after updating the configuration.

## Codex config.toml Example

Manual mode:

```toml
[mcp_servers.easy-sqlite-mcp]
args = ["-y", "easy-sqlite-mcp"]
command = "npx"
enabled = true
```

Fixed mode example:

```toml
[mcp_servers.easy-sqlite-mcp]
args = ["-y", "easy-sqlite-mcp"]
command = "npx"
enabled = true

[mcp_servers.easy-sqlite-mcp.env]
SQLITE_PATH = "/absolute/path/to/database.sqlite"
```

## OpenCode opencode.jsonc Example

Manual mode:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "easy-sqlite-mcp": {
      "type": "local",
      "command": ["npx", "-y", "easy-sqlite-mcp"],
      "enabled": true
    }
  }
}
```

Fixed mode example:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "easy-sqlite-mcp": {
      "type": "local",
      "command": ["npx", "-y", "easy-sqlite-mcp"],
      "enabled": true,
      "environment": {
        "SQLITE_PATH": "/absolute/path/to/database.sqlite"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
| --- | --- |
| `sqlite_manual` | Return the built-in manual. Use this first when you are unsure how to use SQLite tools or need help diagnosing an operation error |
| `sqlite_open` | Open a SQLite database file. Manual mode only |
| `sqlite_close` | Close the current database connection. Manual mode only |
| `sqlite_status` | Return connection status and current database summary |
| `sqlite_query` | Execute a read-only `SELECT` query |
| `sqlite_execute` | Execute a write or modification SQL statement |
| `sqlite_list_tables` | List all user tables in the database |
| `sqlite_describe_table` | Describe the schema of a table |

## Manual Mode Notes

- Use `sqlite_open(path)` before calling query or execute tools.
- Use `sqlite_close` when finished.
- Only one database file can be open at a time.
- Use `sqlite_manual` when you need lifecycle or placeholder guidance.

## Development

```bash
npm run build
npm run dev
npm test
```

## License

MIT. See [LICENSE.md](LICENSE.md).
