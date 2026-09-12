import Board from "../models/Board.js";

//Create a new board
export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Board Title is required" });
    }
    const newBoard = new Board({ title });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Get all boards
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find().populate({
      path: "columns",
      populate: {
        path: "cards",
      },
    });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
