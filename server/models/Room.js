// server/models/Room.js
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  gameName: { type: String, required: true },
  host: { type: String, required: true },
  players: [{ type: String }], // username 数组
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);