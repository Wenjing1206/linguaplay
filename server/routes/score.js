// 中文注释：分数 API，保存与获取
import express from 'express';
import Score from '../models/Score.js';

const router = express.Router();

// POST: 保存分数
router.post('/', async (req, res) => {
  try {
    const { username, score } = req.body;
    const newScore = new Score({ username, score });
    await newScore.save();
    res.status(201).json({ message: 'Score saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// GET: 获取所有分数（按高到低）
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

export default router;