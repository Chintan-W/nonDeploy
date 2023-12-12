import mongoose from 'mongoose';
import User from './models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwtSecret = 'pnc';

export default {
  getUserByUsername: async (username) => {
    return await User.findOne({ username });
  },

  getUserById: async (id) => {
    return await User.findById(id);
  },

  createUser: async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
  },

  // Verify user credentials for login
  verifyLoginCredentials: async (username, password) => {
    console.log('Entered verifyLoginCredentials:', username, password);
  
    const user = await User.findOne({ username });
    console.log('User found:', user);
  
    if (!user) {
      console.log('User not found');
      return null; // User not found
    }
  
    const isPasswordMatch = await user.compare(password, user.password);
    console.log('Is password match?', isPasswordMatch);
  
    if (!isPasswordMatch) {
      console.log('Incorrect password');
      return null; // Incorrect password
    }
  
    console.log('Credentials verified, returning user');
    return user; // User and password are valid
  },
  
};
