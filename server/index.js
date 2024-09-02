import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/database.js";
import AuthRoutes from "./routes/AuthRoute.js";
import contactsRoutes from "./routes/ContactRoute.js";

dotenv.config(); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.PORT || 3001; // Use PORT from environment or default to 3001

// Middleware
app.use(cors({
  origin: [process.env.ORIGIN], // Corrected `process.env.origin` to `process.env.ORIGIN`
  methods: ["GET", "PUT", "DELETE", "POST"],
  credentials: true
})); // Enable CORS

app.use("/uploads/profiles", express.static("uploads/profiles"))

app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
connectDb();

app.use("/api/auth",AuthRoutes)
app.use('/api/contacts',contactsRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
