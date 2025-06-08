// src/pages/WordMatchGame.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ 新增
import "./WordMatchGame.css";

const wordPairs = [
  { word: "apple", translation: "苹果" },
  { word: "run", translation: "跑步" },
  { word: "eat", translation: "吃" },
  { word: "read", translation: "读书" },
];

export default function WordMatchGame() {
  const [leftColumn, setLeftColumn] = useState([]);
  const [rightColumn, setRightColumn] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const navigate = useNavigate(); // ⬅️ 新增

  useEffect(() => {
    const shuffledLeft = [...wordPairs].sort(() => Math.random() - 0.5);
    const shuffledRight = [...wordPairs].sort(() => Math.random() - 0.5);
    setLeftColumn(shuffledLeft);
    setRightColumn(shuffledRight);
    setSelectedLeft(null);
    setMatches([]);
    setScore(0);
  }, []);

  const handleLeftClick = (item) => {
    setSelectedLeft(item);
  };

  const handleRightClick = (item) => {
    if (!selectedLeft) return;

    const correct =
      selectedLeft.translation === item.translation &&
      selectedLeft.word === item.word;

    if (correct) {
      setMatches([...matches, item.word]);
      setScore(score + 10);
    }

    setSelectedLeft(null);
  };

  // ⬇️ 游戏结束：发送分数并跳转
  const handleGameEnd = async () => {
    const username = localStorage.getItem("username") || "Guest";

    try {
      await fetch("http://localhost:3000/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, score }),
      });

      navigate("/ranking"); // 跳转到排行榜页面
    } catch (error) {
      console.error("Failed to save score:", error);
    }
  };

  return (
    <div className="match-game">
      <h1>词汇匹配游戏</h1>
      <div className="score">得分：{score}</div>
      <div className="columns">
        <div className="column">
          {leftColumn.map((item, i) => (
            <div
              key={i}
              className={`card ${selectedLeft?.word === item.word ? "selected" : ""} ${
                matches.includes(item.word) ? "matched" : ""
              }`}
              onClick={() => handleLeftClick(item)}
            >
              {item.word}
            </div>
          ))}
        </div>
        <div className="column">
          {rightColumn.map((item, i) => (
            <div
              key={i}
              className={`card ${matches.includes(item.word) ? "matched" : ""}`}
              onClick={() => handleRightClick(item)}
            >
              {item.translation}
            </div>
          ))}
        </div>
      </div>

      {/* ⬇️ 游戏结束按钮 */}
      <button
        onClick={handleGameEnd}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-6"
      >
        结束游戏（提交分数）
      </button>
    </div>
  );
}