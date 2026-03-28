import mongoose from "mongoose";
import {config }from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("connected to Database");
  } catch (err) {
    console.error("Error connecting to Database", err);
  }
};

export default connectDB;
''