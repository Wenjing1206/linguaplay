import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// 路由和功能模块
import authRoute from './routes/auth.js';
import scoreRoute from './routes/score.js';
import roomRoute from './routes/room.js';
import socketHandler from './sockets/index.js';
import redis from './redis.js';


dotenv.config();

// 环境变量加载
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linguaplay';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
});

// 静态文件路径支持（可选）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/client', express.static(path.join(__dirname, '../client/dist')));

// 中间件
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 数据库连接
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Redis 启动检查
redis.ping()
  .then(() => console.log('✅ Redis connected'))
  .catch(() => console.warn('⚠️ Redis not connected'));

// 路由挂载
app.use('/api/auth', authRoute);
app.use('/api/score', scoreRoute);
app.use('/api/room', roomRoute);

// Socket.io 实时通信
socketHandler(io);

// 默认根接口（可用于健康检查）
app.get('/', (req, res) => {
  res.send('LinguaPlay Server is running 🧠');
});

// 启动服务
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});