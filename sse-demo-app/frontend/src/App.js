import { useState, useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// 相対パスで /api を指定
// const serverBaseURL = "http://localhost:5000/api";
// const serverBaseURL = "/api";
const serverBaseURL = process.env.REACT_APP_SERVER_BASE_URL;

const App = () => {
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState(""); // userNameを保持するための状態
  const userId = "2"; // ユーザーIDをフロントエンドで指定

  useEffect(() => {
    const fetchData = async () => {
      // ★ GET で user_id をクエリパラメータで渡す
      await fetchEventSource(`${serverBaseURL}/sse?user_id=${userId}`, {
        method: "GET",
        // SSEなので通常 GET。Content-Type や body は不要

        onopen(res) {
          if (res.ok && res.status === 200) {
            console.log("Connection made ", res);
          } else if (
            res.status >= 400 &&
            res.status < 500 &&
            res.status !== 429
          ) {
            console.log("Client side error ", res);
          }
        },

        onmessage(event) {
          console.log(event.data);
          const parsedData = JSON.parse(event.data);
          setData((prevData) => [...prevData, parsedData]);

          // userNameが含まれているか確認し、セット
          if (parsedData.user_name) {
            setUserName(parsedData.user_name); // userNameを更新
          }
        },

        onclose() {
          console.log("Connection closed by the server");
        },

        onerror(err) {
          console.log("There was an error from server", err);
        },
      });
    };
    fetchData();
  }, []); // 初回のみ実行

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <h1>Rondom numbers of {userName || "Loading..."}</h1>
      <LineChart width={1000} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[20, 26]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="aTechStockPrice" stroke="#8884d8" />
        <Line type="monotone" dataKey="bTechStockPrice" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
};

export default App;
