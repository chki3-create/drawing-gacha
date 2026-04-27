import React, { useState, useEffect } from "react";

const prompts = [
  "侍の猫",
  "空を飛ぶパン",
  "未来都市の高校生",
  "地下都市",
  "宇宙猫",
  "ドラゴン牧場",
  "ホラーな水族館",
  "未来の東京",
  "海底列車",
  "夢の世界の入口"
];

export default function App() {
  const [result, setResult] = useState("ボタンを押してお題を引こう！");
  const [views, setViews] = useState(0);
  const [totalRolls, setTotalRolls] = useState(0);

  useEffect(() => {
    const currentViews = parseInt(localStorage.getItem("views") || "0");
    localStorage.setItem("views", currentViews + 1);
    setViews(currentViews + 1);

    const currentRolls = parseInt(localStorage.getItem("totalRolls") || "0");
    setTotalRolls(currentRolls);
  }, []);

  const rollGacha = () => {
    const randomPrompt =
      prompts[Math.floor(Math.random() * prompts.length)];

    const currentRolls =
      parseInt(localStorage.getItem("totalRolls") || "0") + 1;

    localStorage.setItem("totalRolls", currentRolls);
    setTotalRolls(currentRolls);

    setResult(randomPrompt);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ff9a9e, #89f7fe)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
        width: "400px"
      }}>
        <h1>🎨 絵のお題ガチャ</h1>
        <p>👀 閲覧数: {views}</p>
        <p>🎲 総ガチャ回数: {totalRolls}</p>

        <div style={{
          background: "#eee",
          padding: "20px",
          margin: "20px 0",
          borderRadius: "10px"
        }}>
          {result}
        </div>

        <button onClick={rollGacha}>
          ガチャを回す
        </button>
      </div>
    </div>
  );
}