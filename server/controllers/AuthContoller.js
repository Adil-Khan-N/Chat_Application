import pkg from "jsonwebtoken";
const { sign } = pkg;
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

// Function to create JWT token
const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: "3d" });
};

// Signup Controller
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.create({ email, password });

    if (!user) {
      throw new Error("User creation failed");
    }

    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      httpOnly: true,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// Login Controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User Not found");
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).send("Incorrect Password");
    }

    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        colors: user.colors,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// Update Profile Controller
export const updateProfile = async (req, res, next) => {
  const { userId } = req;
  const { firstName, lastName, color } = req.body;
  if (!firstName || !lastName || color === undefined) {
    return res.status(400).send("Firstname, lastname, and color are required.");
  }

  const userData = await User.findByIdAndUpdate(
    userId,
    {
      firstName,
      lastName,
      color,
      profileSetup: true,
    },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    id: userData.id,
    email: userData.email,
    profileSetup: userData.profileSetup,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    color: userData.color,
  });
};

// Get User Info Controller
export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User with given id not found");
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      colors: userData.colors,
      profileSetup: userData.profileSetup,
    });
  } catch (error) {
    console.error("Get User Info error:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

// Add Profile Image Controller
export const addProfileImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("File is required.");
  }

  const date = Date.now();
  const fileName = "uploads/profiles/" + date + req.file.originalname;
  renameSync(req.file.path, fileName);

  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    {
      image: fileName,
    },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    image: updatedUser.image,
  });
};

// Remove Profile Image Controller
export const removeProfileImage = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.image) {
      unlinkSync(user.image); // Delete the existing image file
    }

    user.image = null; // Clear the image field

    await user.save();

    return res.status(200).send("Profile image removed successfully.");
  } catch (error) {
    console.error("Remove Profile Image error:", error.message);
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite:"None" });

    return response.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.log({ error });

    return response.status(500).send("Internal Server Error");
  }
};