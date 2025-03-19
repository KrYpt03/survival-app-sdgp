import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./api/user";
import teamRoutes from "./api/team";
import locationRoutes from "./api/location";
import alertRoutes from "./api/alert";
import adminRoutes from "./api/admin";
import { clerkMiddleware } from "@clerk/express";
import { registerMiddleware, registerErrorHandlers, ApiError } from "./api/middlewares";

// Load environment variables
dotenv.config();

// Create Express application
const app: Express = express();

// Register middleware
app.use(clerkMiddleware());
registerMiddleware(app);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Register API routes
app.use("/api/user", userRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  throw new ApiError(404, `Route '${req.originalUrl}' not found`);
});

// Register error handlers (must be last)
registerErrorHandlers(app);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  
  // Gracefully close server before exiting
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
