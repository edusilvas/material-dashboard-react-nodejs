import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = () => {
  mongoose.connection.once("open", () => console.log("DB connection"));
  
  const connectionString = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_LINK}?retryWrites=true&w=majority`;
  
  return mongoose.connect(
    connectionString,
    { keepAlive: true }
  );
};
