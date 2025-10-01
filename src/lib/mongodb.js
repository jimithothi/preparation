import mongoose from "mongoose";

const connection = {};

async function connect() {
    if (connection.isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        connection.isConnected = 0;
        process.exit(1);
    }
}

export default connect;