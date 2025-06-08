import dotenv from 'dotenv';
dotenv.config(); // ✅ 必须放在最前面，确保 .env 中的 JWT_SECRET 被正确加载

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("❌ JWT_SECRET not found in environment variables.");
} else {
  console.log("🔐 JWT_SECRET loaded");
}

// 登录或注册
router.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).json({ error: '用户名不能为空' });
  }

  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.create({ username });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });

    res.json({ success: true, username: user.username });
  } catch (err) {
    console.error('❌ 登录接口错误:', err.message);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ username: decoded.username });
  } catch {
    res.status(401).json({ error: '无效 token' });
  }
});

export default router;
