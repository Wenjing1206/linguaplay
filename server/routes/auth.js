// server/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config(); 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 登录或注册
router.post('/login', async (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === '') {
    return res.status(400).json({ error: '用户名不能为空' });
  }

  try {
    let user = await User.findOne({ username });
    if (!user) user = await User.create({ username });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false, // ✅ 若部署上线记得改成 true
    });

    res.json({ success: true, username: user.username });
  } catch (err) {
    res.status(500).json({ error: '登录失败，请重试' });
  }
});


// 验证当前用户
router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: '未登录' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ username: decoded.username });
  } catch {
    res.status(401).json({ error: '无效的 token' });
  }
});

export default router;