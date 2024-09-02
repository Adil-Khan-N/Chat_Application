import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http"; // Import createServer from http
import { Server as SocketIOServer } from "socket.io"; // Import Socket.IO
import { connectDb } from "./config/database.js";
import AuthRoutes from "./routes/AuthRoute.js";
import contactsRoutes from "./routes/ContactRoute.js";
import setupSocket from "./socket.js"; // Import the setupSocket function

dotenv.config(); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.PORT || 3001; // Use PORT from environment or default to 3001

// Create a HTTP server using the Express app
const server = createServer(app);

// Initialize Socket.IO with the server and CORS options
const io = new SocketIOServer(server, {
  cors: {
    origin: [process.env.ORIGIN], // Allow the frontend origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    credentials: true, // Allow credentials
  },
});

// Call setupSocket to configure event listeners
setupSocket(io); // Pass the Socket.IO server instance to the setup function

// Middleware
app.use(
  cors({
    origin: [process.env.ORIGIN], // Corrected `process.env.origin` to `process.env.ORIGIN`
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  })
); // Enable CORS

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
connectDb();

// Define routes
app.use("/api/auth", AuthRoutes);
app.use("/api/contacts", contactsRoutes);

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
