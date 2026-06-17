import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const { SqliteManager } = await import("../dist/services/sqlite-manager.js");

test("SqliteManager supports the main manual workflow", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "easy-sqlite-mcp-"));
  const dbPath = path.join(tmpDir, "test.db");
  const manager = new SqliteManager();

  const opened = manager.open(dbPath);
  assert.equal(opened.success, true);

  const initialStatus = manager.status();
  assert.equal(initialStatus.isOpen, true);
  assert.equal(initialStatus.filePath, dbPath);

  const created = manager.execute(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)"
  );
  assert.equal(created.changes, 0);

  const inserted = manager.execute(
    "INSERT INTO users (name) VALUES (?)",
    ["Alice"]
  );
  assert.equal(inserted.changes, 1);

  const queryResult = manager.query(
    "SELECT id, name FROM users WHERE name = ?",
    ["Alice"]
  );
  assert.equal(queryResult.rowCount, 1);
  assert.deepEqual(queryResult.columns, ["id", "name"]);
  assert.equal(queryResult.rows[0][1], "Alice");

  const tables = manager.listTables();
  assert.deepEqual(tables.tables, ["users"]);

  const schema = manager.describeTable("users");
  assert.equal(schema.name, "users");
  assert.equal(schema.rowCount, 1);
  assert.equal(schema.columns[0].name, "id");
  assert.equal(schema.columns[1].name, "name");

  const closed = manager.close();
  assert.equal(closed.success, true);
  assert.equal(manager.status().isOpen, false);
});

test("SqliteManager rejects operations before open", () => {
  const manager = new SqliteManager();
  assert.throws(() => manager.query("SELECT 1"), /No database is currently open/);
  assert.throws(() => manager.execute("CREATE TABLE test (id INTEGER)"), /No database is currently open/);
  assert.throws(() => manager.listTables(), /No database is currently open/);
  assert.throws(() => manager.describeTable("test"), /No database is currently open/);
});
