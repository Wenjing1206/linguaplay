import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const wordPairs = [
  { word: "apple", translation: "苹果" },
  { word: "run", translation: "跑步" },
  { word: "eat", translation: "吃" },
  { word: "read", translation: "读书" },
];

export default function WordMatchGame() {
  const [leftCards, setLeftCards] = useState([]);
  const [rightCards, setRightCards] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matchedWords, setMatchedWords] = useState([]);
  const [wrongMatch, setWrongMatch] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLeftCards(shuffle([...wordPairs]));
    setRightCards(shuffle([...wordPairs]));
    setMatchedWords([]);
    setSelected(null);
    setScore(0);
    setTime(0);
    setGameFinished(false);
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (matchedWords.length === wordPairs.length) {
      setGameFinished(true);

      axios
        .post(
          "http://localhost:3000/api/score/submit-wordMatch",
          { score, time },
          { withCredentials: true }
        )
        .then(() => {
          console.log("✅ Submitted");
        })
        .catch((err) => {
          console.error("❌ failed", err);
        });
    }
  }, [matchedWords]);

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const handleLeftClick = (item) => {
    if (gameFinished || matchedWords.includes(item.word)) return;
    setSelected(item);
  };

  const handleRightClick = (item) => {
    if (gameFinished || !selected || matchedWords.includes(item.word)) return;

    if (item.word === selected.word) {
      setMatchedWords([...matchedWords, item.word]);
      setScore((prev) => prev + 10);
    } else {
      setWrongMatch(item.word);
      setTimeout(() => setWrongMatch(null), 400);
    }

    setSelected(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-4">
      <div className="mb-2 text-lg text-gray-700 self-end w-full max-w-3xl text-right">
        👤 玩家：{username}
      </div>

      <h1 className="text-3xl font-bold text-indigo-800 mb-2">Word Match Game</h1>

      <div className="flex gap-6 text-lg text-gray-700 mb-6">
        <div>
          Score: <span className="font-bold text-green-600">{score}</span>
        </div>
        <div>
          Time: <span className="font-bold text-blue-600">{time}s</span>
        </div>
      </div>

      {gameFinished && (
        <div className="mb-6 text-xl text-purple-700 font-semibold bg-purple-100 px-4 py-3 rounded shadow flex flex-col items-center">
          🎉 You finished the game!
          <button
            onClick={() => navigate("/lobby")}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            🏠 Back to GameHub
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-3xl border rounded-lg shadow bg-white p-6">
        <div className="flex flex-col pr-4 border-r">
          {leftCards.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg text-center text-lg font-medium shadow-sm transition-all cursor-pointer transform
              ${
                matchedWords.includes(item.word)
                  ? "bg-green-400 text-white"
                  : selected?.word === item.word
                  ? "bg-blue-400 text-white ring-4 ring-blue-200"
                  : "bg-white hover:bg-blue-100 hover:scale-105"
              }`}
              onClick={() => handleLeftClick(item)}
            >
              {item.word}
            </div>
          ))}
        </div>

        <div className="flex flex-col pl-4">
          {rightCards.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg text-center text-lg font-medium shadow-sm transition-all cursor-pointer transform
              ${
                matchedWords.includes(item.word)
                  ? "bg-green-400 text-white"
                  : wrongMatch === item.word
                  ? "bg-red-200 animate-pulse"
                  : "bg-white hover:bg-green-100 hover:scale-105"
              }`}
              onClick={() => handleRightClick(item)}
            >
              {item.translation}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}