# 簡單報名 Web App（有 Admin 登入睇名單）

呢個專案係一個簡單 Node.js + Express 報名系統：

- 一般用戶：進入 `/`（首頁）填寫名字／備註報名
- 發起人（Admin）：進入 `/admin`，輸入管理員密碼登入之後，就可以睇到所有報名名單

## 功能

- 前台報名表單（只有「名字」+「備註」兩個欄位，可自行加）
- 後台 Admin 頁面：
  - 管理員密碼登入
  - 顯示所有報名紀錄（編號、名字、備註、報名時間）
  - 支援重新整理、登出
- 報名資料會儲存在 `data/signups.json` 檔案

> 注意：呢個示例係方便本地或小型部署用，未做進階安全機制；正式公開用之前請自行再加強安全設定。

## 安裝及本地啟動

1. 確認已安裝 [Node.js](https://nodejs.org/)（建議 18+）
2. 解壓縮本專案 zip 檔，或 `git clone` 到本地
3. 在專案根目錄執行：

   ```bash
   npm install
   ```

4. （可選）設定環境變數：

   - `ADMIN_PASSWORD`：Admin 登入密碼（預設：`changeme123`）
   - `SESSION_SECRET`：Session 用 secret（預設為一個示例字串，建議自己改）

   例如：

   **macOS / Linux：**

   ```bash
   export ADMIN_PASSWORD="你自己的密碼"
   export SESSION_SECRET="一個長少少嘅 secret 字串"
   ```

   **Windows PowerShell：**

   ```powershell
   setx ADMIN_PASSWORD "你自己的密碼"
   setx SESSION_SECRET "一個長少少的 secret 字串"
   ```

5. 啟動伺服器：

   ```bash
   npm start
   ```

6. 打開瀏覽器：

   - 前台報名頁面：<http://localhost:3000/>
   - Admin 後台頁面：<http://localhost:3000/admin>

## 部署到線上（簡單建議）

可以將整個專案推上 GitHub，然後用以下其中一種服務部署：

- Render
- Railway
- Fly.io
- 或其他支援 Node.js 的平台

在平台設定：

- 建立 Node.js Web Service
- Build 命令可以留空或 `npm install`
- Start 命令設為：`npm start`
- 環境變數記得設定：`ADMIN_PASSWORD`、`SESSION_SECRET`

完成後平台會提供一條網址：

- 報名用網址：`https://yourapp.example.com/`
- Admin 登入網址：`https://yourapp.example.com/admin`

## 檔案結構簡介

```text
signup-webapp/
  ├─ server.js        # Node.js + Express 主程式
  ├─ package.json     # npm 設定
  ├─ public/
  │   ├─ index.html   # 報名表單頁
  │   └─ admin.html   # Admin 後台頁
  └─ data/
      └─ signups.json # 報名資料（程式自動建立及更新）
```

如有需要加欄位（例如電話、email 等），修改：

- `public/index.html` 表單欄位
- `server.js` 的 `/api/signup` 讀取同儲存欄位邏輯
- `public/admin.html` 顯示欄位
```
