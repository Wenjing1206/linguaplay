// server/routes/room.js
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import Room from '../models/Room.js';

const router = express.Router();

// 创建房间
router.post('/create', verifyToken, async (req, res) => {
  const { gameName, roomId } = req.body;
  const username = req.user.username;

  if (!roomId || !gameName) return res.status(400).json({ error: '房间信息缺失' });

  const existing = await Room.findOne({ roomId });
  if (existing) return res.status(400).json({ error: '房间号已存在' });

  const room = await Room.create({ roomId, gameName, host: username, players: [username] });
  res.json({ success: true, room });
});

// 加入房间
router.post('/join', verifyToken, async (req, res) => {
  const { roomId } = req.body;
  const username = req.user.username;

  const room = await Room.findOne({ roomId });
  if (!room) return res.status(404).json({ error: '房间不存在' });

  if (!room.players.includes(username)) {
    room.players.push(username);
    await room.save();
  }

  res.json({ success: true, room });
});

export default router;