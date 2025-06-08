import { useEffect, useState } from 'react';

export default function Ranking() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const res = await fetch('http://localhost:3000/api/score', {
        credentials: 'include'
      });
      const data = await res.json();
      setScores(data);
    };
    fetchScores();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">🏆 Leaderboard</h1>
      <ul className="space-y-2">
        {scores.map((item, index) => (
          <li key={index}>
            {index + 1}. {item.username}: {item.score}
          </li>
        ))}
      </ul>
    </div>
  );
}