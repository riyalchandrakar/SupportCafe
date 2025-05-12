import mongoose from 'mongoose';

let isConnected = false;

const dbConnect = async () => {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  if (mongoose.connections.length > 0) {
    isConnected = mongoose.connections[0].readyState;

    if (isConnected === 1) {
      console.log("✅ Using existing database connection");
      return;
    }

    await mongoose.disconnect();
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ New connection to MongoDB Atlas established");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB Atlas:", error.message);
    throw new Error("Database connection failed");
  }
};

export default dbConnect;
