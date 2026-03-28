import mongoose from "mongoose";

export async function testConnection() {
    try {
        await connect();
        await disconnect();
        console.log("Database connection test successful");
    } catch (error) {
        console.log("Database connection test failed. Error: " + error);
        throw error;
    }
}

export async function connect() {
    if (!process.env.DBHOST) {
        throw new Error("DBHOST is not defined in environment variables");
    }

    await mongoose.connect(process.env.DBHOST);

    if (!mongoose.connection.db) {
        throw new Error("Failed to connect to the database");
    }

    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connected to the database successfully");
}

export async function disconnect() {
    await mongoose.disconnect();
    console.log("Disconnected from the database successfully");
}