import mongoose from "mongoose";
import { env } from "./config.js";

const connectToDataBase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.DB_URI);
    console.log(`Connected to DataBase in ${env.NODE_ENV} mode.`);
  } catch (error) {
    console.log("Error connecting to DB", error);
    process.exit(1);
  }
};

export default connectToDataBase;
