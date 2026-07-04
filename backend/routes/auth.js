import express from 'express';
import jwt from 'jsonwebtoken';
import { Soc_User, Admin_User } from '../models.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { authenticateToken } from '../middleware.js';

const router = express.Router();

const SECRET_KEY = "dev-secret-key";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eventsmbcet@gmail.com',
    pass: 'etoo syvd rpgc trej'
  }
});

router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { username, email, role, name, category } = req.body;

    if (role !== 'Admin' && role !== 'SoC') {
      return res.status(400).json({ msg: 'Invalid Role specified' });
    }

    const UserModel = role === 'Admin' ? Admin_User : Soc_User;

    const existingAdmin = await Admin_User.findOne({
      $or: [{ email: email }, { username: username }]
    });
    
    const existingSoc = await Soc_User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingAdmin || existingSoc) {
      const match = existingAdmin || existingSoc;
      if (match.email === email) {
        return res.status(400).json({ msg: 'This email is already registered in the system.' });
      }
      if (match.username === username) {
        return res.status(400).json({ msg: 'This username is already taken.' });
      }
    }

    const generatedPassword = crypto.randomUUID().slice(0, 12);

    if (role === 'Admin') {
      const user = new Admin_User({ username, email, password: generatedPassword, name });
      await user.save();
    } 
    else if (role === 'SoC') {
      const user = new Soc_User({ username, email, password: generatedPassword, name, category });
      await user.save();
    } 

    await transporter.sendMail({
      from: 'eventsmbcet@gmail.com',
      to: email,
      subject: "Your Event Manager Account Credentials",
      html: `
        <h2>Welcome to Event Manager!</h2>
        <p>Your account has been created.</p>
        <p><b>Role:</b> ${role}</p>
        <p><b>Username:</b> ${username}</p>
        <p><b>Password:</b> ${generatedPassword}</p>
        <br/>
        <p>Please log in using these credentials. We recommend changing your password after your first login.</p>
      `
    });

    res.status(201).json({ msg: `${role} account created successfully! Credentials sent to email.` });
  } 
  catch (err) {
    res.status(500).json({ msg: 'Internal server error. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    let user = null;

    if (role === 'Admin') {
      user = await Admin_User.findOne({ username });
    } else if (role === 'SoC') {
      user = await Soc_User.findOne({ username });
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Username' });
    }

    if (user.password !== password) {
      return res.status(400).json({ msg: 'Invalid Password' });
    }

    const payload = {
        id: user._id,
        role: role,
        username: user.username 
    };

    jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: role, username: user.username, UserId: user._id });
    });

  }
  catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/users/:role', authenticateToken, async (req, res) => {
  try {
    const { role } = req.params;
    let users = [];

    if (role === 'Admin') {
      users = await Admin_User.find({}).select('-password -otp -otpVerified');
    } 
    else if (role === 'SoC') {
      users = await Soc_User.find({}).select('-password -otp -otpVerified');
    } 
    else {
      return res.status(400).json({ msg: 'Invalid role.' });
    }

    res.json(users);
  }
  catch (err) {
    res.status(500).json({ msg: 'Server error while fetching users.' });
  }
});

router.delete('/delete/:id/:role', authenticateToken, async (req, res) => {
  try {
    const { id, role } = req.params;

    let deletedUser;

    if (role === 'Admin') {
      deletedUser = await Admin_User.findByIdAndDelete(id);
    }
    else if (role === 'SoC') {
      deletedUser = await Soc_User.findByIdAndDelete(id);
    }
    else {
      return res.status(400).json({ msg: 'Invalid role.' });
    }

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    res.json({ msg: `${role} account deleted successfully!` });

  }
  catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email, role } = req.body;

    const UserModel = role === 'Admin' ? Admin_User : Soc_User;
    if (!UserModel) return res.status(400).json({ msg: "Invalid role specified." });

    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({ msg: "User not found in this role" });

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    await user.save();

    await transporter.sendMail({
        from: 'eventsmbcet@gmail.com',
        to: email,
        subject: "Password Reset OTP - Event Manager",
      html: `
        <h2>Event Manager Password Reset</h2>
        <p><b>Role:</b> ${role}</p>
        <p><b>Username:</b> ${user.username}</p>
        <p>Your one-time password is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>Use this OTP to reset your password. Do not share it with anyone.</p>
      `,
    });

    res.json({ msg: "OTP sent successfully" });
  }
  catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    const UserModel = role === 'Admin' ? Admin_User : Soc_User;
    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp) 
        return res.status(400).json({ msg: "Invalid OTP" });

    user.otpVerified = true;
    user.otp = null;

    await user.save();

    res.json({ msg: "OTP Verified" });
  }
  catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/set-password", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const UserModel = role === 'Admin' ? Admin_User : Soc_User;
    const user = await UserModel.findOne({ email });

    if (!user)
      return res.status(404).json({ msg: "User not found" });

    if (!user.otpVerified)
      return res.status(400).json({ msg: "Verify OTP first" });

    user.password = password;
    user.otpVerified = false;

    await user.save();

    res.json({ msg: "Password created successfully" });
  }
  catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

export default router;
