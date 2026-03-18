const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

async function runTest() {
  // Note: Directly test better-sqlite3 here to ensure environment compatibility
  const dbPath = path.resolve('test-js.db');
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

  console.log("--- JS Logic Test Started ---");
  const db = new Database(dbPath);
  console.log("1. Database opened");

  db.prepare(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT
    )
  `).run();
  console.log("2. Table created");

  const insert = db.prepare("INSERT INTO users (name) VALUES (?)");
  insert.run("Antigravity");
  console.log("3. Data inserted");

  const row = db.prepare("SELECT * FROM users WHERE name = ?").get("Antigravity");
  console.log("4. Query result:", row);

  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("5. Table list:", tables);

  db.close();
  console.log("6. Database closed");
  console.log("--- Test Completed ---");
}

runTest();
