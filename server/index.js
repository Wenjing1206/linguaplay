import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoute from './routes/auth.js';
import socketHandler from './sockets/index.js';
import scoreRoutes from './routes/score.js';


// 中间件
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 路由
app.use('/api/score', scoreRoutes);

// 数据库连接
mongoose.connect('mongodb://localhost:27017/linguaplay')
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));


// ✅ 解析 __dirname（兼容 ES Module）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 加载 .env 配置
dotenv.config({ path: path.resolve(__dirname, './.env') });

// ✅ 检查 JWT_SECRET 是否加载
if (!process.env.JWT_SECRET) {
  console.warn('❌ JWT_SECRET is not set in .env file!');
} else {
  console.log('🔐 JWT_SECRET loaded');
}

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 中间件
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ 路由
app.use('/api/auth', authRoute);
app.get('/api/hello', (req, res) => {
  res.send('Hello World');
});

// ✅ MongoDB 连接
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB error:', err.message);
      process.exit(1);
    });
} else {
  console.warn('⚠️ MONGO_URI not set, skipping MongoDB connection');
}

// ✅ Redis 连接（可选）
if (process.env.REDIS_URL) {
  const redis = createClient({ url: process.env.REDIS_URL });
  redis.connect()
    .then(() => console.log('✅ Redis connected'))
    .catch(err => console.error('❌ Redis error:', err.message));
} else {
  console.warn('⚠️ REDIS_URL not set, skipping Redis connection');
}

// ✅ 创建 HTTP Server 和 Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ 初始化 socket 事件
socketHandler(io);

// ✅ 启动服务
httpServer.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    throw err;
  }
});
