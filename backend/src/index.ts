import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from "./api/user";
import teamRoutes from "./api/team";
import locationRoutes from "./api/location";
import alertRoutes from "./api/alert";
import { clerkMiddleware } from "@clerk/express";
dotenv.config();

const app: Express = express(); // ✅ Explicitly set app type

app.use(clerkMiddleware());

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

app.use("/api/user", userRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/alert", alertRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
