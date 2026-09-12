import express from "express";
import { createBoard, getBoards } from "../controllers/boardControllers.js";

const router = express.Router();

router.post("/", createBoard); // post request to /API/boards - will create a new board
router.get("/", getBoards); // get request to /API/boards - will fetch all boards

export default router;
