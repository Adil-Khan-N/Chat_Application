import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL); // No need for useNewUrlParser and useUnifiedTopology
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

export { connectDb };
