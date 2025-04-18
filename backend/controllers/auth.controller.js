import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const cookieOptions = {
  maxAge: 60*60*1000 , // 1 hour
  httpOnly: true,
  secure: true
};

export const register = async (req, res) => {
    try {
        // console.log("Request Body:", req.body);
        const { name, email, password, role, referenceImage } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });
    
        if (!referenceImage) return res.status(400).json({ message: 'Reference image is required' });
    
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          role,
          referenceImage
        });
        await newUser.save();

        const token = await jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        // Set the token in a cookie
        res.cookie('token', token, cookieOptions);

    
        res.status(201).json({success: true , message: 'User registered successfully', newUser,token });
      } catch (error) {
        console.log("Error in register:", error.message);
        res.status(500).json({ error: error.message });
      }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};