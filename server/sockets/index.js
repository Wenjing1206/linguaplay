// server/sockets/index.js
import Room from '../models/Room.js';

const onlineUsers = {}; // roomId -> [username]

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('🟢 用户已连接', socket.id);

    // 加入房间
    socket.on('joinRoom', async ({ roomId, username }) => {
      socket.join(roomId);

      if (!onlineUsers[roomId]) onlineUsers[roomId] = [];
      if (!onlineUsers[roomId].includes(username)) onlineUsers[roomId].push(username);

      io.to(roomId).emit('updatePlayers', onlineUsers[roomId]);
      console.log(`📥 ${username} 加入房间 ${roomId}`);
    });

    // 广播题目开始
    socket.on('startGame', ({ roomId, questions }) => {
      io.to(roomId).emit('gameStarted', { questions });
    });

    // 断开
    socket.on('disconnect', () => {
      for (const roomId in onlineUsers) {
        onlineUsers[roomId] = onlineUsers[roomId].filter(u => u !== socket.username);
        io.to(roomId).emit('updatePlayers', onlineUsers[roomId]);
      }
    });
  });
}