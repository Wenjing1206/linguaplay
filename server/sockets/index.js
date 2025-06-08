const rooms = {};
const scores = {};

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log("📡 Socket connected:", socket.id);

    // 创建房间（带用户名）
    socket.on('create-room', ({ username }) => {
      const roomId = Math.random().toString(36).substr(2, 6);
      rooms[roomId] = {
        host: socket.id,
        players: [{ id: socket.id, username }]
      };
      scores[roomId] = {};
      socket.join(roomId);
      io.to(socket.id).emit('room-created', roomId);
      io.to(roomId).emit('players-updated', rooms[roomId].players);
      console.log(`🆕 Room ${roomId} created by ${socket.id} (${username})`);
    });

    // 加入房间（带用户名）
    socket.on('join-room', ({ roomId, username }) => {
      if (!rooms[roomId]) {
        socket.emit('error', '房间不存在');
        return;
      }

      const alreadyInRoom = rooms[roomId].players.some(p => p.id === socket.id);
      if (!alreadyInRoom) {
        rooms[roomId].players.push({ id: socket.id, username });
        socket.join(roomId);
        io.to(roomId).emit('players-updated', rooms[roomId].players);
        console.log(`👤 ${socket.id} (${username}) joined room ${roomId}`);
      }
    });

    // 离开时清理玩家
    socket.on('disconnect', () => {
      console.log("❌ Socket disconnected:", socket.id);

      for (const roomId in rooms) {
        const room = rooms[roomId];
        const index = room.players.findIndex(p => p.id === socket.id);

        if (index !== -1) {
          const username = room.players[index].username;
          room.players.splice(index, 1);

          if (room.players.length === 0) {
            delete rooms[roomId];
            delete scores[roomId];
            console.log(`🧹 Room ${roomId} deleted (empty)`);
          } else {
            io.to(roomId).emit('players-updated', room.players);
            console.log(`👤 ${socket.id} (${username}) left room ${roomId}`);
          }
        }
      }
    });
  });
}
