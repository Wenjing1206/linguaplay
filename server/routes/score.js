// server/routes/score.js
import express from 'express';
import Score from '../models/Score.js';
import { verifyToken } from '../middleware/verifyToken.js';
import redis from '../redis.js';

const router = express.Router();

// 提交分数接口 
router.post('/submit', verifyToken, async (req, res) => {
  const { gameName, score, time } = req.body;
  const username = req.user.username;

  if (!gameName || score == null || time == null) {
    return res.status(400).json({ error: '信息不完整' });
  }

  // 保存分数
  const newScore = await Score.create({ username, gameName, score, time });

  // 清除缓存
  const cacheKey = `leaderboard:${gameName}`;
  await redis.del(cacheKey);

  res.json({ success: true, newScore });
});

// 获取排行榜接口 -（累加分数，保留最短时间）
router.get('/:gameName', async (req, res) => {
  const { gameName } = req.params;
  const cacheKey = `leaderboard:${gameName}`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const scores = await Score.find({ gameName }).lean();

  const merged = {}; // 按用户名累加总分，同时保留最短时间
  for (const entry of scores) {
    const { username, score, time } = entry;
    if (!merged[username]) {
      merged[username] = { username, score, time };
    } else {
      merged[username].score += score;
      // 更新为更短的时间（注意是 Math.min）
      merged[username].time = Math.min(merged[username].time, time);
    }
  }

  // 排序：先按分数降序，再按时间升序
  const sorted = Object.values(merged).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });

  // 缓存结果（60 秒）
  await redis.set(cacheKey, JSON.stringify(sorted), { EX: 60 });
  res.json(sorted);
});

export default router;