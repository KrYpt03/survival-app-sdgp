import express, { Express } from "express";
import dotenv from "dotenv";
import userRoutes from "../api/user.js";
import teamRoutes from "../api/team.js";
import locationRoutes from "../api/location.js";
import alertRoutes from "../api/alert.js";
import adminRoutes from "../api/admin.js";
import { clerkMiddleware } from "@clerk/express";
import { registerMiddleware, registerErrorHandlers } from "../api/middlewares/index.js";
import { ApiError } from "../api/middlewares/errorHandler.js";
import { getPerformanceReport } from "./monitoring.js";
import os from "os";

export async function createServer(): Promise<Express> {
  // Load environment variables
  dotenv.config();

  // Create Express application
  const app: Express = express();

  // Add basic express.json middleware for parsing request bodies
  app.use(express.json());

  // Health check endpoint - defined before any authentication middleware
  app.get("/health", (req, res) => {
    const startTime = process.uptime();
    const memoryUsage = process.memoryUsage();
    let dbStatus = "ok";
    
    // Simple db connection check
    try {
      // This is a placeholder - implement actual db check based on your database
      const dbCheck = true;
      if (!dbCheck) dbStatus = "error";
    } catch (error) {
      dbStatus = "error";
    }
    
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(startTime / 60 / 60)}h ${Math.floor(startTime / 60) % 60}m ${Math.floor(startTime) % 60}s`,
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        loadAvg: os.loadavg(),
      },
      services: {
        database: dbStatus
      },
    };
    
    // Include performance metrics in detailed health checks
    if (req.query.detailed === "true") {
      healthData["performance"] = getPerformanceReport();
    }
    
    res.status(200).json(healthData);
  });

  // Apply Clerk middleware to all routes EXCEPT /health
  app.use(/^(?!\/health).*$/, clerkMiddleware());

  // Register other middleware
  registerMiddleware(app);

  // Register API routes
  app.use("/api/user", userRoutes);
  app.use("/api/team", teamRoutes);
  app.use("/api/location", locationRoutes);
  app.use("/api/alert", alertRoutes);
  app.use("/api/admin", adminRoutes);

  // 404 handler for undefined routes
  app.use((req, res) => {
    throw new ApiError(404, `Route '${req.originalUrl}' not found`);
  });

  // Register error handlers (must be last)
  registerErrorHandlers(app);

  return app;
} 