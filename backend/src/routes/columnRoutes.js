import express from "express";
import {
  createColumn,
  deleteColumn,
} from "../controllers/columnControllers.js";

const router = express.Router();
router.post("/", createColumn);
router.delete("/:columnId", deleteColumn);

export default router;
