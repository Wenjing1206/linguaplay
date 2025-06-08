import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function HomePage() {
  const navigate = useNavigate();
  const [gameType, setGameType] = useState("wordmatch");

  const handleCreateRoom = () => {
    socket.emit("create-room", { gameType });
    socket.once("room-created", (roomId) => {
      navigate(`/room/${roomId}`);
    });
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">LinguaPlay 游戏大厅</h1>

      <label className="block mb-4">
        <span className="text-white mr-2">选择游戏类型：</span>
        <select value={gameType} onChange={e => setGameType(e.target.value)} className="p-2 rounded">
          <option value="wordmatch">词语配对游戏</option>
          <option value="panda">🐼 词语消消乐</option>
        </select>
      </label>

      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreateRoom}>
        创建房间
      </button>
    </div>
  );
}