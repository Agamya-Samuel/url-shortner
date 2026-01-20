"use server";
import { connect } from "mongoose";

export const connectToDb = async () => {
    try{
        console.log("Connecting to MongoDB... 🔃");
        await connect(process.env.MONGODB_URI);
    }
    catch(err) {
        console.log(err);
    }
};