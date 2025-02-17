import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
  
const connection: ConnectionObject = {};


async function dbConnect(): Promise<void> {
  console.log("Attempting to connect to the database...");

  if (connection.isConnected) {
    console.log("Already connected to the database!");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI||"",{} 
    );

    console.log("DB connection status:", db.connection.readyState);
    if (db.connection.readyState === 1) {
      connection.isConnected = db.connection.readyState;
      console.log("Database connected successfully!");
    } else {
      console.log("Database connection failed with readyState: ", db.connection.readyState);
    }
  } catch (error) {
    console.error("Database connection failed!", error);
    process.exit(1); // Exit if connection fails
  }
}

export default dbConnect;
