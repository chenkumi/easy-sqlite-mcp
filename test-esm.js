import { SqliteManager } from "./dist/services/sqlite-manager.js";
import path from "path";
import fs from "fs";

async function runTest() {
  const manager = new SqliteManager();
  const dbPath = path.resolve("test-esm.db");
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

  console.log("--- ESM Core Test Started ---");
  console.log("1. Open:", manager.open(dbPath));
  console.log("2. Execute Create:", manager.execute("CREATE TABLE test (val TEXT)"));
  console.log("3. Execute Insert:", manager.execute("INSERT INTO test VALUES ('Hello World')"));
  console.log("4. Query:", manager.query("SELECT * FROM test"));
  console.log("5. Tables:", manager.listTables());
  console.log("6. Describe:", manager.describeTable("test"));
  console.log("7. Status:", manager.status());
  console.log("8. Close:", manager.close());
  console.log("--- Test Completed ---");
}

runTest().catch(console.error);
