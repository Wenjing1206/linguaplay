// 📁 server/models/TotalScore.js
import mongoose from 'mongoose';

const totalScoreSchema = new mongoose.Schema({
  username: String,
  wordMatchScore: Number,
  wordMatchTime: Number,
  wordClearScore: Number,
  wordClearTime: Number,
  totalScore: Number,
  totalTime: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('TotalScore', totalScoreSchema);