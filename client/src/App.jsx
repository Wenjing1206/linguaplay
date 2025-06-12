import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import CreateRoom from './pages/CreateRoom';
import Game from './pages/Game';
import SentenceGame from './pages/SentenceGame';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/create-room" element={<CreateRoom />} />
      <Route path="/leaderboard/:gameName" element={<Leaderboard />} />
      <Route path="/game/:roomId/:gameName" element={<Game />} />
      <Route path="/game/SentenceBuilderGame" element={<SentenceGame />} />
    </Routes>
  );
}