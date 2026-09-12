import express from "express";
import {
  createCard,
  updateCardPosition,
  deleteCard,
} from "../controllers/cardControllers.js";

const router = express.Router();
router.post("/", createCard);
router.put("/:cardId/position", updateCardPosition);
router.delete("/:cardId", deleteCard);

export default router;
