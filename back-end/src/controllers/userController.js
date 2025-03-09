import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

// Function to create and set JWT token in cookies
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,  
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Lax for local testing
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


// Function to generate JWT token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const google = async (req, res, next) => {
  const { name, email, displayImage } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const token = generateToken(user._id, user.isAdmin);
      setTokenCookie(res, token);

      const { password, ...rest } = user.toObject();
      return res.status(200).json({
        meta: { success: true, message: "Login successful", status: 200 },
        data: { user: rest },
        error: null,
      });
    }

    // Generate and hash password
    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(generatePassword, 10);

    // Create new user
    const newUser = new User({
      username:
        name.toLowerCase().replace(/\s+/g, "") +
        Math.random().toString().slice(-4),
      email,
      password: hashedPassword,
      profilePicture: displayImage,
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.isAdmin);
    setTokenCookie(res, token);

    const { password, ...rest } = newUser.toObject();

    return res.status(201).json({
      meta: { success: true, message: "User registered successfully", status: 201 },
      data: { user: rest },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      meta: { success: true, message: "Logout successful", status: 200 },
      data: null,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
