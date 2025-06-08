// 中文注释：Lobby 页面用于输入用户名和创建房间
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (username.trim()) {
      localStorage.setItem('username', username); // 存一下用户名
      navigate('/game'); // 跳转到游戏页面
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🎮 Welcome to LinguaPlay</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded mb-4 w-64"
      />
      <button onClick={handleStart} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Start Game
      </button>
    </div>
  );
}