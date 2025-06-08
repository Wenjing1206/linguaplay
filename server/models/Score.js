// 中文注释：定义用户分数的 MongoDB 模型
import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Score', ScoreSchema);