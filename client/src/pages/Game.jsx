// src/pages/Game.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const words = ['苹果', '苹果', '跑', '跑'];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Game() {
  const { gameName } = useParams();
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selected, setSelected] = useState([]);
  const [cleared, setCleared] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setShuffledWords(shuffle(words));
    setStartTime(Date.now());
  }, []);

  const handleClick = (idx) => {
    if (cleared.includes(idx)) return;
    const newSelected = [...selected, idx];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [i1, i2] = newSelected;
      if (shuffledWords[i1] === shuffledWords[i2]) {
        setCleared([...cleared, i1, i2]);
        setScore((prev) => prev + 1);
      }
      setTimeout(() => setSelected([]), 500);
    }
  };

  const handleFinish = async () => {
    const usedTime = Math.floor((Date.now() - startTime) / 1000);
    await api.post('/score/submit', {
      gameName,
      score,
      time: usedTime,
    });
    navigate(`/leaderboard/${gameName}`);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold mb-2">游戏：{gameName}</h2>
      <div className="grid grid-cols-4 gap-2">
        {shuffledWords.map((word, idx) => (
          <div
            key={idx}
            className={`border p-4 rounded text-center cursor-pointer ${
              cleared.includes(idx) ? 'opacity-30' :
              selected.includes(idx) ? 'bg-yellow-200' : 'bg-white'
            }`}
            onClick={() => handleClick(idx)}
          >
            {word}
          </div>
        ))}
      </div>
      {cleared.length === shuffledWords.length && (
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleFinish}
        >
          提交成绩
        </button>
      )}
    </div>
  );
}