import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // 你的后端端口

export default function Lobby() {
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on('room-created', id => setRoomId(id));
    socket.on('players-updated', setPlayers);
  }, []);

  const createRoom = () => socket.emit('create-room');
  const joinRoom = () => socket.emit('join-room', roomId);

  return (
    <div>
      <h1>Lobby</h1>
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
      {roomId && <p>Room ID: {roomId}</p>}
      <ul>{players.map((p, i) => <li key={i}>{p}</li>)}</ul>
    </div>
  );
}