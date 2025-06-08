
import axios from "axios";
// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import WordMatchGame from "./pages/WordMatchGame"; //
import Result from "./pages/RankingPages";


axios.defaults.withCredentials = true;


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game/match" element={<WordMatchGame />} />
       </Routes>
    </BrowserRouter>
  );
}