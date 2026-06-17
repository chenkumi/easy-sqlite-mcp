# easy-sqlite-mcp

一個以 Node.js 與 TypeScript 實作的 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server，讓 LLM 可以直接操作 SQLite 資料庫。

本專案使用 Node.js、TypeScript、官方 MCP SDK，以及 `better-sqlite3`。它透過 stdio 執行，因此可以直接被 Claude Desktop、Codex、OpenCode 等 MCP client 使用。

## 功能

- 支援 manual 與 fixed 兩種啟動模式
- 用於資料讀取的唯讀查詢工具
- 用於資料修改與 schema statement 的執行工具
- tables、views、indexes、triggers 的 schema discovery tools
- 使用同步式 `better-sqlite3` 存取 SQLite

本專案使用的 `better-sqlite3` 需要 Node.js 20 或更新版本。

## 需求

- Node.js 20 或更新版本
- npm
- 可連線的 SQLite database file

## 安裝

直接使用 `npx` 啟動：

```bash
npx -y easy-sqlite-mcp
```

本機開發：

```bash
cd easy-sqlite-mcp
npm install
npm run build
```

## 設定

你可以透過 MCP client configuration 或 shell environment variables 設定。

| 變數 | 必填 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `SQLITE_PATH` | 否 | - | SQLite database file 的路徑。設定後會進入 fixed mode |

Shell 設定範例：

```bash
SQLITE_PATH=/absolute/path/to/database.sqlite npx -y easy-sqlite-mcp
```

PowerShell 設定範例：

```powershell
$env:SQLITE_PATH = "C:\\data\\database.sqlite"
npx -y easy-sqlite-mcp
```

此 server 透過 stdio 通訊，通常會由 MCP client 啟動，而不是手動直接執行。

如果你不確定某個工具該怎麼用，或操作失敗，請先呼叫 `sqlite_manual`。它會回傳內建手冊，包含安全使用規則、placeholder 指引，以及生命週期說明。

## 模式

Easy SQLite MCP 支援兩種啟動模式，server description 會在啟動時產生，讓 MCP client 與 agent 清楚知道目前模式。

### Manual Mode

未設定 `SQLITE_PATH` 時，會使用 manual mode。

在這個模式下，agent 必須手動開啟與關閉資料庫：

1. 先呼叫 `sqlite_open(path)`。
2. 使用 query、execute 與 schema discovery tools。
3. 完成後呼叫 `sqlite_close`。

同一時間只能開啟一個 SQLite database file。若再開啟其他檔案，會先關閉前一個連線。

Server description：

```text
Manual: This is a SQLite tool. Before using it, call sqlite_open(path) to open a database file. After use, call sqlite_close to close it. Only one database file can be open at a time.
```

Manual mode 可用工具：

- `sqlite_open`
- `sqlite_close`
- `sqlite_status`
- `sqlite_query`
- `sqlite_execute`
- `sqlite_list_tables`
- `sqlite_describe_table`

### Fixed Mode

設定 `SQLITE_PATH` 時，會使用 fixed mode。

在這個模式下，server 會在啟動時自動開啟指定的 SQLite database。agent 不需要再呼叫 `sqlite_open`，也不能切換連線。

Server description：

```text
Fixed: This is a SQLite tool connected to Path:<SQLITE_PATH>
```

Fixed mode 可用工具：

- `sqlite_status`
- `sqlite_query`
- `sqlite_execute`
- `sqlite_list_tables`
- `sqlite_describe_table`

## Claude Desktop 範例

Manual mode：

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

Fixed mode：

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

更新設定後，請重新啟動 Claude Desktop。

## Codex config.toml 範例

Manual mode：

```toml
[mcp_servers.easy-sqlite-mcp]
args = ["-y", "easy-sqlite-mcp"]
command = "npx"
enabled = true
```

Fixed mode：

```toml
[mcp_servers.easy-sqlite-mcp]
args = ["-y", "easy-sqlite-mcp"]
command = "npx"
enabled = true

[mcp_servers.easy-sqlite-mcp.env]
SQLITE_PATH = "/absolute/path/to/database.sqlite"
```

## OpenCode opencode.jsonc 範例

Manual mode：

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

Fixed mode：

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

## 可用工具

| 工具 | 說明 |
| --- | --- |
| `sqlite_manual` | 回傳內建手冊。當你不確定如何使用 SQLite 工具，或需要排查操作錯誤時，請先查這個工具 |
| `sqlite_open` | 開啟 SQLite database file，僅 manual mode 可用 |
| `sqlite_close` | 關閉目前資料庫連線，僅 manual mode 可用 |
| `sqlite_status` | 回傳目前連線狀態與資料庫摘要 |
| `sqlite_query` | 執行唯讀 `SELECT` query |
| `sqlite_execute` | 執行寫入或修改 SQL statement |
| `sqlite_list_tables` | 列出 database 中所有 user tables |
| `sqlite_describe_table` | 顯示 table 的 schema |

## Manual Mode 注意事項

- 使用 query 或 execute 工具前，請先呼叫 `sqlite_open(path)`。
- 使用完畢後請呼叫 `sqlite_close`。
- 同一時間只能開啟一個 database file。
- 若需要生命週期或 placeholder 指引，請先查 `sqlite_manual`。

## 開發

```bash
npm run build
npm run dev
npm test
```

## 授權

MIT。請參閱 [LICENSE.md](LICENSE.md)。
