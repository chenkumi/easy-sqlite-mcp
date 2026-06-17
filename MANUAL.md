# easy-sqlite-mcp Manual

`easy-sqlite-mcp` 是一個用來操作 SQLite 的 MCP server，提供開啟資料庫、查詢、寫入與 schema 檢查工具。

## Overview

適合用在：
- 單機 SQLite 檔案操作
- 讀取資料
- 新增、更新、刪除資料
- 建表與索引管理

不適合用在：
- 未先開啟資料庫就直接操作
- 同時維持多個資料庫連線
- 把未驗證字串直接拼接 SQL

## When to Consult This Manual

如果你遇到以下情況，先看這份手冊：
- 不確定 `sqlite_open`、`sqlite_query`、`sqlite_execute` 要怎麼用
- 查詢或寫入時回傳錯誤
- 不確定 `?` 或 named parameters 要怎麼綁定
- 不確定目前是不是已經開啟資料庫
- 不確定應該先查 schema 還是直接執行

## Modes / Lifecycle

SQLite 共有兩種啟動模式：

- `Manual`: 先呼叫 `sqlite_open(path)`，使用完後再呼叫 `sqlite_close`
- `Fixed`: 啟動時已透過 `SQLITE_PATH` 連到指定檔案

重要限制：
- 同一時間只能開啟一個資料庫
- 使用前要確認 DB 已開啟
- 使用完建議關閉

## Tools

- `sqlite_open`: 開啟資料庫
- `sqlite_close`: 關閉資料庫
- `sqlite_status`: 查看目前連線狀態
- `sqlite_query`: 讀取資料
- `sqlite_execute`: 執行寫入或變更 SQL
- `sqlite_list_tables`: 列出資料表
- `sqlite_list_views`: 列出檢視表
- `sqlite_describe_table`: 查看欄位資訊
- `sqlite_describe_index`: 查看索引
- `sqlite_list_triggers`: 查看 trigger
- `sqlite_get_current_privileges`: 查看目前權限

## Execute Usage

`sqlite_execute` 適合單一 SQL 指令，例如：
- `INSERT`
- `UPDATE`
- `DELETE`
- `CREATE TABLE`
- `CREATE INDEX`

使用前請先確認：
- DB 已開啟
- 目標資料表存在
- SQL 是單一語句

參數寫法以 `better-sqlite3` 的 binding 方式為準：
- 匿名佔位符可使用 `?`
- 命名參數可使用 `@name`、`:name`、`$name`
- 你目前的工具介面也支援用 `params` 物件傳遞命名參數

建議慣例：
- 需要簡單位置綁定時，用 `?`
- 需要更清楚可讀性時，用命名參數

## SQL Algebra / Composition Rules

SQLite 的查詢組裝與一般 SQL 類似：

1. 先選資料來源：`FROM`
2. 再加條件：`WHERE`
3. 需要聚合時使用 `GROUP BY`
4. 聚合後條件放在 `HAVING`
5. 排序使用 `ORDER BY`
6. 最後限制筆數：`LIMIT`

SQLite 常見注意事項：
- 型別彈性較高，但不要依賴隱式轉型
- 日期時間常以字串或數字儲存，格式要統一
- `rowid` 可能有用，但不應過度依賴

## Safety Rules

- 同一時間只允許一個 DB 連線
- 寫入前先確認目前打開的是正確檔案
- 未開啟 DB 時不要執行查詢
- 不要把未驗證字串直接拼進 SQL

## Examples

- 開啟資料庫：
  - `sqlite_open('/path/to/app.db')`
- 查詢資料：
  - `SELECT * FROM users WHERE id = ?`
- 建表：
  - `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)`
- 新增資料：
  - `INSERT INTO users (name) VALUES (?)`
- 使用命名參數查詢：
  - `SELECT * FROM users WHERE id = :id`
- 關閉資料庫：
  - `sqlite_close()`

## Troubleshooting

- 查詢失敗時，先確認是否已 `sqlite_open`
- 結果異常時，確認目前連的是不是正確檔案
- 欄位不存在時，先用 `sqlite_describe_table`
- 寫入沒生效時，確認是否在正確的資料庫檔案上操作
