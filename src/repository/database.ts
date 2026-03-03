import mongoose from "mongoose";


export  async function  testConnection() {
    try {
        await connect();
        await disconnect();
        console.log("Database connection test successful");
    }
    catch (error) {
        console.log("Database connection test failed. Error: " + error);
    }
}


export async function connect () {
    try 
    {
        if (!process.env.DBHOST) {
            throw new Error("DBHOST is not defined in environment variables");
        }
        await mongoose.connect (process.env.DBHOST);

        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ping: 1});
            console.log("Connected to the database successfully");
        }
        else {
            throw new Error("Failed to connect to the database");
    
        }
    }
    catch (error)
    {
        console.log("Error connecting to the database. Error:" + error);
    }
}

export async function disconnect () {
    try 
    {
        await mongoose.disconnect();
        console.log("Disconnected from the database successfully");
    }
    catch (error)
    {
        console.log("Error disconnecting from the database. Error:" + error);
    }
}