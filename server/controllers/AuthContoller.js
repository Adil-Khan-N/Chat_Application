import pkg from 'jsonwebtoken';
const { sign } = pkg;
import User from "../models/UserModel.js";
import { compare } from 'bcrypt';
const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

const createToken = (email, userId) => {
  return sign({ email, userId }, process.env.JWT_KEY, { expiresIn: '3d' });
};

export const signup = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send("Email and password are required");
      }
  
      const user = await User.create({ email, password });
  
      // Check if user is created successfully
      if (!user) {
        throw new Error("User creation failed");
      }
  
      const token = createToken(email, user.id);
      res.cookie("jwt", token, {
        maxAge,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        httpOnly: true,
      });
  
      return res.status(201).json({
        user: {
            id:user.id,
          email: user.email,
          profileSetup: user.profileSetup,
        },
      });
    } catch (error) {
      console.error('Signup error:', error.message); // Log detailed error message
      return res.status(500).send("Internal Server Error");
    }
  };
  
export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send("Email and password are required");
      }
  
      const user = await User.findOne({ email });
  
      // Check if user is created successfully
      if (!user) {
        return res.status(404).send("User Not found");
      }
      
      const auth = await compare(password,user.password)
      if (!auth) {
        return res.status(400).send("Incorrect Password");
      }

      const token = createToken(email, user.id);
      res.cookie("jwt", token, {
        maxAge,
        secure: true,
        sameSite:"None"
      });
  
      return res.status(200).json({
        user: {
            id:user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          colors: user.colors,
          profileSetup: user.profileSetup,
        },
      });
    } catch (error) {
      console.error('Signup error:', error.message); // Log detailed error message
      return res.status(500).send("Internal Server Error");
    }
  };
  
  
export const getUserInfo = async (req, res, next) => {
    try {
         const userData = await User.findById(req.userId)
         if(!userData){
          return res.status(404).send("User with given id not found")
         }
         return res.status(200).json({
          
              id:userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            colors: userData.colors,
            profileSetup: userData.profileSetup,
        
        });
    } catch (error) {
      console.error('Signup error:', error.message); // Log detailed error message
      return res.status(500).send("Internal Server Error");
    }
  };
  