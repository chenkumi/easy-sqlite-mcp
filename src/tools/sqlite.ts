import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SqliteManager } from "../services/sqlite-manager.js";

const sqliteManager = new SqliteManager();

/**
 * Register all SQLite tools on the MCP server.
 */
export function registerSqliteTools(server: McpServer): void {
  // ─── sqlite_open ───────────────────────────────────────────────
  server.registerTool(
    "sqlite_open",
    {
      title: "Open SQLite Database",
      description: `Open an SQLite database file at the specified path.

Args:
  - file_path (string): Absolute or relative path to the .db / .sqlite file.

Returns:
  { "success": boolean, "message": string }

Examples:
  - "Open the users database" -> file_path="/data/users.db"

Error Handling:
  - Returns success=false with message if the file cannot be opened.`,
      inputSchema: {
        file_path: z
          .string()
          .min(1, "file_path is required")
          .describe("Path to the SQLite database file"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ file_path }) => {
      const result = sqliteManager.open(file_path);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // ─── sqlite_close ──────────────────────────────────────────────
  server.registerTool(
    "sqlite_close",
    {
      title: "Close SQLite Database",
      description: `Close the currently open SQLite database connection.

Returns:
  { "success": boolean, "message": string }

Error Handling:
  - Returns success=false if no database is currently open.`,
      inputSchema: {},
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const result = sqliteManager.close();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // ─── sqlite_status ─────────────────────────────────────────────
  server.registerTool(
    "sqlite_status",
    {
      title: "SQLite Database Status",
      description: `Get the current status of the SQLite database connection.

Returns:
  {
    "isOpen": boolean,
    "filePath": string | null,
    "memoryUsage": number | null,
    "tables": number | null
  }`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const result = sqliteManager.status();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // ─── sqlite_query ──────────────────────────────────────────────
  server.registerTool(
    "sqlite_query",
    {
      title: "Query SQLite Database",
      description: `Execute a read-only SQL query (SELECT) on the currently open database.

Args:
  - sql (string): The SQL SELECT statement to execute.
  - params (object, optional): Named parameters for the query (e.g. { ":id": 1 }).

Returns:
  { "columns": string[], "rows": unknown[][], "rowCount": number }

Error Handling:
  - Throws if no database is open. Use sqlite_open first.
  - Returns SQL error message if the query is invalid.`,
      inputSchema: {
        sql: z
          .string()
          .min(1, "SQL query is required")
          .describe("SQL SELECT statement to execute"),
        params: z
          .record(z.unknown())
          .optional()
          .describe("Optional named parameters for the query"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ sql, params }) => {
      try {
        const result = sqliteManager.query(sql, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // ─── sqlite_execute ────────────────────────────────────────────
  server.registerTool(
    "sqlite_execute",
    {
      title: "Execute SQL Statement",
      description: `Execute a write SQL statement (INSERT, UPDATE, DELETE, CREATE, DROP, ALTER) on the currently open database.

Args:
  - sql (string): The SQL statement to execute.
  - params (object, optional): Named parameters for the statement.

Returns:
  { "changes": number, "lastInsertRowid": number }

Error Handling:
  - Throws if no database is open. Use sqlite_open first.
  - Returns SQL error message if the statement is invalid.`,
      inputSchema: {
        sql: z
          .string()
          .min(1, "SQL statement is required")
          .describe("SQL statement to execute (INSERT, UPDATE, DELETE, etc.)"),
        params: z
          .record(z.unknown())
          .optional()
          .describe("Optional named parameters for the statement"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ sql, params }) => {
      try {
        const result = sqliteManager.execute(sql, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // ─── sqlite_list_tables ────────────────────────────────────────
  server.registerTool(
    "sqlite_list_tables",
    {
      title: "List SQLite Tables",
      description: `List all user tables in the currently open SQLite database.

Returns:
  { "tables": string[] }

Error Handling:
  - Throws if no database is open. Use sqlite_open first.`,
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const result = sqliteManager.listTables();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // ─── sqlite_describe_table ─────────────────────────────────────
  server.registerTool(
    "sqlite_describe_table",
    {
      title: "Describe SQLite Table",
      description: `Describe the schema of a specific table in the currently open SQLite database.

Args:
  - table_name (string): Name of the table to describe.

Returns:
  {
    "name": string,
    "columns": [
      { "cid": number, "name": string, "type": string, "notnull": boolean, "defaultValue": unknown, "pk": boolean }
    ],
    "rowCount": number
  }

Error Handling:
  - Throws if no database is open. Use sqlite_open first.
  - Returns error if the table does not exist.`,
      inputSchema: {
        table_name: z
          .string()
          .min(1, "Table name is required")
          .describe("Name of the table to describe"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ table_name }) => {
      try {
        const result = sqliteManager.describeTable(table_name);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
