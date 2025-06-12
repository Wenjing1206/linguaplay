// src/pages/Lobby.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const games = [
  'WordMatchGame',
  'SentenceBuilderGame',
];

export default function Lobby() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUsername(res.data.username))
      .catch(() => navigate('/'));
  }, []);

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Hi, {username} 👋</h1>
      <p className="text-gray-600">Please select the game you want to start      ：</p>
      {games.map((game) => (
        <button
          key={game}
          className="bg-blue-600 text-white px-4 py-2 rounded w-64"
          onClick={() => navigate(`/game/${game}`)}
        >
          {game}
        </button>
      ))}
    </div>
  );
}