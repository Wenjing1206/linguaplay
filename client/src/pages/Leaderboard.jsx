// src/pages/Leaderboard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Leaderboard() {
  const { gameName } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/score/${gameName}`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Leaderboard Load Failed', err);
        setData([]);
      });
  }, [gameName]);

  return (
    <main className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">{gameName} 🏆 Leaderboard</h1>

      {data.length === 0 ? (
        <p className="text-gray-500">NO any score yet</p>
      ) : (
        <table className="table-auto border w-full max-w-xl">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Ranking</th>
              <th className="border px-4 py-2">username</th>
              <th className="border px-4 py-2">Overall Score</th>
              <th className="border px-4 py-2">Use Time (quickest)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-1">{idx + 1}</td>
                <td className="border px-4 py-1">{entry.username}</td>
                <td className="border px-4 py-1">{entry.score}</td>
                <td className="border px-4 py-1">{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
        onClick={() => navigate('/lobby')}
      >
        🔙 back Lobby
      </button>
    </main>
  );
}