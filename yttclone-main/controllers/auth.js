import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

/**
 * Create Account or Register User
 */

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    //calling the error middleware in index.js
    next(err);
    // by error.js we can create our own error
    // next(createError(404, "User not found!"));
  }
};



export const signin = async (req, res, next) => {
  try {
    console.log("Signin called")
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;
    // to get out of cors error try to remove the httpOnly thing 
    res
      .cookie("access_token", token, {
        httpOnly: false,
      })
      .status(200)
      .json(others);
  } catch (err) {
    console.log(err)
    next(err);

  }
};

export const logout = async (req, res) => {

  try {

    req.cookies.delete("access_token")
    res.status(200).json({ success: true, mgs: "Logout Successfully" })
  }
  catch (error) {
    res.json({
      success: false,
      error: error.message,
    })
  }
}

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = await jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: false,
        })
        .status(200)
        .json(user._doc);
    } else {
      console.log(req.body)
      const newUser = new User({
        name: req.body.email,
        email: req.body.email,
        img: req.body.img,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = await jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: false,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    console.log(err.message);

    next(err);
  }
};
