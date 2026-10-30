const mongoose = require('mongoose');
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };
module.exports = async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  if (!cached.promise) cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
  try { cached.conn = await cached.promise; return cached.conn; } catch (e) { cached.promise = null; throw e; }
};
