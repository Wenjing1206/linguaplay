// src/pages/SentenceGame.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const questions = [
  { zh: ['我', '爱', '你'], en: ['I', 'love', 'you'] },
  { zh: ['她', '在', '学习'], en: ['She', 'is', 'studying'] },
];

export default function SentenceGame() {
  const [username, setUsername] = useState('');
  const [current, setCurrent] = useState(0);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  const zhWords = questions[current].zh;
  const enWords = [...questions[current].en].sort(() => Math.random() - 0.5);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUsername(res.data.username))
      .catch(() => setUsername('Guest'));
    setStartTime(Date.now());
  }, []);

  const handleDrop = (index, word) => {
    if (questions[current].en[index] === word && !matched.includes(index)) {
      setMatched((prev) => [...prev, index]);
      setScore((s) => s + 10);

      if (matched.length + 1 === zhWords.length) {
        if (current + 1 < questions.length) {
          setCurrent((c) => c + 1);
          setMatched([]);
        } else {
          handleSubmit();
        }
      }
    }
  };

  const handleSubmit = async () => {
    const timeUsed = Math.floor((Date.now() - startTime) / 1000);
    try {
      await api.post('/score/submit', {
        gameName: 'SentenceBuilderGame',
        score,
        time: timeUsed,
      });
    } catch (err) {
      console.error('提交失败', err);
    }
    setFinished(true);
    setTimeout(() => navigate('/leaderboard/SentenceBuilderGame'), 1500);
  };

  if (finished) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">🎉 游戏完成！</h2>
        <p className="text-lg">得分：{score}</p>
        <p className="text-gray-500 mt-2">即将跳转到排行榜...</p>
      </div>
    );
  }

  return (
    <main className="p-6">
      <h2 className="text-xl font-bold mb-4">🧠 中英句子配对游戏</h2>

      <section className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          {zhWords.map((zh, idx) => (
            <div key={idx} className="p-2 bg-gray-100 border rounded text-center">
              <div className="font-semibold">{zh}</div>
              <div
                className="mt-2 h-12 border-2 border-dashed rounded flex items-center justify-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(idx, e.dataTransfer.getData('text/plain'))}
              >
                {matched.includes(idx) ? questions[current].en[idx] : '⬇️ 拖到这里'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">可拖拽的英文词：</h3>
        <div className="flex gap-2 flex-wrap">
          {enWords.map((word, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', word)}
              className="cursor-grab px-3 py-2 bg-blue-100 rounded shadow"
            >
              {word}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}