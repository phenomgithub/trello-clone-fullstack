import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import boardRoutes from "./routes/boardRoutes.js";
import columnRoutes from "./routes/columnRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware configuration
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/cards", cardRoutes);

//Base Health Check Endpoint
app.get("/", (req, res) => {
  res.send("trello-clone backend API is running");
});

//Database and Server initiation block
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
