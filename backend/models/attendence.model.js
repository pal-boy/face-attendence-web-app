import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  image: { type: String }, // captured live image (base64 or S3 link)
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;