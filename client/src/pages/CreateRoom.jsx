import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateRoom() {
  const [roomId, setRoomId] = useState('');
  const [gameName, setGameName] = useState('WordClearGame');
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!roomId.trim()) return;
    await api.post('/room/create', { roomId, gameName });
    navigate(`/game/${roomId}/${gameName}`);
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">创建游戏房间</h2>
      <input
        className="border px-2 py-1"
        placeholder="输入房间号"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <select
        className="border px-2 py-1"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
      >
        <option value="WordClearGame">Word Clear</option>
        <option value="SpellMatchGame">Spelling Match</option>
        <option value="HanziMemoryGame">Hanzi Memory</option>
        <option value="SentenceBuilderGame">Sentence Builder</option>
      </select>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={createRoom}
      >
        创建并进入游戏
      </button>
    </div>
  );
}