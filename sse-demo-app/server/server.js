const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

/**
 * 1. MySQL接続プールなどを削除
 * 2. SSE用のエンドポイントを /api/sse に変更
 * 3. GETに変え、クエリから user_id を取得
 * 4. サンプルデータを返すだけに変更
 */

// SSEエンドポイント (GET)
app.get("/api/sse", (req, res) => {
  const userId = req.query.user_id; // ★ クエリパラメータから取得
  console.log(`(Debug) Received user_id: ${userId}`);

  // 例: userIdに応じてユーザー名を振り分け (サンプル)
  let userName;
  if (userId === "12345") {
    userName = "Alice";
  } else if (userId === "2") {
    userName = "Bob";
  } else {
    userName = "UnknownUser";
  }

  // SSEのレスポンスヘッダ
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  // SSEストリームを通じて定期的にデータを送る (サンプル)
  const intervalId = setInterval(() => {
    // 株価データのモック生成
    const aTechPrice = (Math.random() * 2 + 20).toFixed(2);
    const bTechPrice = (Math.random() * 4 + 22).toFixed(2);

    const payload = {
      time: new Date().toLocaleTimeString(),
      user_name: userName,
      aTechStockPrice: aTechPrice,
      bTechStockPrice: bTechPrice,
    };
    // SSEでは "data: <文字列>\n\n" の形式
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, 5000);

  // クライアント切断をハンドリング
  req.on("close", () => {
    console.log("クライアントとの接続が切断されました");
    clearInterval(intervalId);
    res.end();
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で動作しています`);
});
