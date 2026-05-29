import Database from "better-sqlite3";

/**
 * Manages a single SQLite database connection.
 */
export class SqliteManager {
  private db: Database.Database | null = null;
  private filePath: string | null = null;

  /**
   * Open an SQLite database file.
   */
  open(filePath: string): { success: boolean; message: string } {
    try {
      // Close existing connection if any
      if (this.db) {
        this.close();
      }

      this.db = new Database(filePath);
      // Enable WAL mode for better concurrency
      this.db.pragma("journal_mode = WAL");
      this.filePath = filePath;

      return { success: true, message: `Database opened: ${filePath}` };
    } catch (error) {
      return {
        success: false,
        message: `Failed to open database: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Close the current database connection.
   */
  close(): { success: boolean; message: string } {
    if (!this.db) {
      return { success: false, message: "No database is currently open." };
    }

    try {
      this.db.close();
      const closedPath = this.filePath;
      this.db = null;
      this.filePath = null;
      return { success: true, message: `Database closed: ${closedPath}` };
    } catch (error) {
      return {
        success: false,
        message: `Failed to close database: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Get the current database status.
   */
  status(): {
    isOpen: boolean;
    filePath: string | null;
    memoryUsage: number | null;
    tables: number | null;
  } {
    if (!this.db) {
      return { isOpen: false, filePath: null, memoryUsage: null, tables: null };
    }

    let tableCount: number | null = null;
    try {
      const result = this.db
        .prepare(
          "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )
        .get() as { count: number };
      tableCount = result.count;
    } catch {
      // ignore
    }

    return {
      isOpen: true,
      filePath: this.filePath,
      memoryUsage: null,
      tables: tableCount,
    };
  }

  /**
   * Execute a read-only SELECT query.
   */
  query(
    sql: string,
    params?: Record<string, unknown>
  ): { columns: string[]; rows: unknown[][]; rowCount: number } {
    this.ensureOpen();

    const stmt = this.db!.prepare(sql);
    const rows = params ? stmt.all(params) : stmt.all();

    if (rows.length === 0) {
      return { columns: [], rows: [], rowCount: 0 };
    }

    const columns = Object.keys(rows[0] as Record<string, unknown>);
    const dataRows = rows.map((row) =>
      columns.map((col) => (row as Record<string, unknown>)[col])
    );

    return { columns, rows: dataRows, rowCount: rows.length };
  }

  /**
   * Execute a write operation (INSERT, UPDATE, DELETE, CREATE, DROP, ALTER).
   */
  execute(
    sql: string,
    params?: Record<string, unknown>
  ): { changes: number; lastInsertRowid: number | bigint } {
    this.ensureOpen();

    const stmt = this.db!.prepare(sql);
    const result = params ? stmt.run(params) : stmt.run();

    return {
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid,
    };
  }

  /**
   * List all tables in the database.
   */
  listTables(): { tables: string[] } {
    this.ensureOpen();

    const rows = this.db!.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all() as { name: string }[];

    return { tables: rows.map((r) => r.name) };
  }

  /**
   * Describe the schema of a specific table.
   */
  describeTable(tableName: string): {
    name: string;
    columns: {
      cid: number;
      name: string;
      type: string;
      notnull: boolean;
      defaultValue: unknown;
      pk: boolean;
    }[];
    rowCount: number;
  } {
    this.ensureOpen();

    const columns = this.db!.prepare(
      `PRAGMA table_info('${tableName}')`
    ).all() as {
      cid: number;
      name: string;
      type: string;
      notnull: number;
      dflt_value: unknown;
      pk: number;
    }[];

    if (columns.length === 0) {
      throw new Error(`Table '${tableName}' not found.`);
    }

    const countResult = this.db!.prepare(
      `SELECT COUNT(*) as count FROM "${tableName}"`
    ).get() as { count: number };

    return {
      name: tableName,
      columns: columns.map((col) => ({
        cid: col.cid,
        name: col.name,
        type: col.type,
        notnull: col.notnull === 1,
        defaultValue: col.dflt_value,
        pk: col.pk === 1,
      })),
      rowCount: countResult.count,
    };
  }

  /**
   * Ensure the database is open before running a query.
   */
  private ensureOpen(): void {
    if (!this.db) {
      throw new Error(
        "No database is currently open. Use sqlite_open to open a database first."
      );
    }
  }
}
