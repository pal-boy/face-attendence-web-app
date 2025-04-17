import { compareFaces } from "../helpers/faceCompare.js";
import Attendance from "../models/attendence.model.js";
import User from "../models/user.model.js";


export const markAttendance = async (req, res) => {
  try {
    const { userId, image } = req.body;
    if (!image) return res.status(400).json({ message: 'No image provided' });

    const user = await User.findById(userId);
    if (!user || !user.referenceImage) return res.status(404).json({ message: 'User or reference image not found' });

    const isMatch = await compareFaces(user.referenceImage, image);
    if (!isMatch) return res.status(401).json({ message: 'Face does not match' });

    const attendance = new Attendance({ userId, image });
    await attendance.save();

    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAttendanceByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await Attendance.find({ userId }).sort({ timestamp: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
