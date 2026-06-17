import { SqliteManager } from "./src/services/sqlite-manager.js";
import path from "path";
import fs from "fs";

async function runTest() {
  const manager = new SqliteManager();
  const dbPath = path.resolve("test-verify.db");

  // Clean up previous test
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  console.log("--- Test Started ---");

  // 1. Open Database
  console.log("\n1. Testing sqlite_open:");
  const openRes = manager.open(dbPath);
  console.log(JSON.stringify(openRes, null, 2));

  // 2. Create Table
  console.log("\n2. Testing sqlite_execute (CREATE TABLE):");
  const createRes = manager.execute(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL,
      stock INTEGER DEFAULT 0
    )
  `);
  console.log(JSON.stringify(createRes, null, 2));

  // 3. Insert Data
  console.log("\n3. Testing sqlite_execute (INSERT):");
  const insert1 = manager.execute("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", { ":name": "iPhone 15", ":price": 29900, ":stock": 50 });
  const insert2 = manager.execute("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", { ":name": "MacBook Pro", ":price": 59900, ":stock": 10 });
  console.log("Inserted 2 items. Last ID:", insert2.lastInsertRowid);

  // 4. Query Data
  console.log("\n4. Testing sqlite_query (SELECT):");
  const queryRes = manager.query("SELECT * FROM products WHERE price > ?", { ":price": 30000 });
  console.log(JSON.stringify(queryRes, null, 2));

  // 5. List Tables
  console.log("\n5. Testing sqlite_list_tables:");
  const listRes = manager.listTables();
  console.log(JSON.stringify(listRes, null, 2));

  // 6. Describe Table
  console.log("\n6. Testing sqlite_describe_table:");
  const descRes = manager.describeTable("products");
  console.log(JSON.stringify(descRes, null, 2));

  // 7. Check Status
  console.log("\n7. Testing sqlite_status:");
  const statusRes = manager.status();
  console.log(JSON.stringify(statusRes, null, 2));

  // 8. Close Database
  console.log("\n8. Testing sqlite_close:");
  const closeRes = manager.close();
  console.log(JSON.stringify(closeRes, null, 2));

  console.log("\n--- Test Completed ---");
}

runTest().catch(console.error);
