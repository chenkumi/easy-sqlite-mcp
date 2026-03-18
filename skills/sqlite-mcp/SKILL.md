---
name: sqlite-mcp
description: A skill specialized in operating SQLite databases. Use this skill when users mention "query database", "read .db or .sqlite files", "store structured data in SQLite", or need to perform SQL operations. This skill provides functionality to open/close databases, execute SQL queries (SELECT), perform write operations (INSERT/UPDATE/DELETE), and explore table schemas.
---

# SQLite MCP Skill

This skill allows you to interact with SQLite databases through a series of MCP tools.

## Core Workflow

### 1. Open Database
Before any operation, you must use `sqlite_open` to open the database file.
- **Tool**: `sqlite_open`
- **Parameters**: `file_path` (Absolute or relative path)

### 2. Explore Structure (Optional)
If the database content is unclear, you can list tables or view table definitions first.
- **List Tables**: `sqlite_list_tables`
- **View Structure**: `sqlite_describe_table` (requires `table_name`)

### 3. Data Operation
- **Read Data**: Use `sqlite_query` to execute `SELECT` statements.
- **Write Data**: Use `sqlite_execute` to execute `INSERT`, `UPDATE`, `DELETE`, or DDL statements (e.g., `CREATE TABLE`).
- **Parameterized Queries**: It is recommended to use the `params` parameter (e.g., `{ ":id": 1 }`) to prevent SQL injection.

### 4. Check Status
You can use `sqlite_status` at any time to confirm the current database path and connection status.

### 5. Close Database
After work is finished, use `sqlite_close` to release resources.

## Best Practices
- **Security First**: Prioritize parameterized queries over direct SQL string concatenation.
- **Transaction Management**: Ensure logical consistency for multi-step write operations.
- **Path Handling**: Ensure correct path formatting (supports `/` or `\\`).
- **Error Handling**: If an operation fails, check `sqlite_status` to ensure the database is correctly opened.
