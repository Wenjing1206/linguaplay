// server/models/Score.js
import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  username: String,
  gameName: String,
  score: Number,
  time: Number
});

export default mongoose.model('Score', scoreSchema);