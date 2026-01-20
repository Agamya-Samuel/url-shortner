"use server";
import mongoose from "mongoose";

/**
 * Global connection cache for MongoDB
 * In serverless environments, connections are reused across function invocations
 * This prevents opening a new connection for every API request
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDb = async () => {
    // If already connected, return the existing connection
    if (cached.conn) {
        // console.log("Using cached MongoDB connection ✅");
        return cached.conn;
    }

    // If connection is in progress, wait for it
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 10, // Maximum number of connections in the pool
            serverSelectionTimeoutMS: 5000, // Timeout for server selection
            socketTimeoutMS: 45000, // Timeout for socket operations
        };

        console.log("Creating new MongoDB connection... 🔃");
        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            console.log("MongoDB connected successfully ✅");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        console.error("MongoDB connection error:", err);
        throw err;
    }

    return cached.conn;
};
