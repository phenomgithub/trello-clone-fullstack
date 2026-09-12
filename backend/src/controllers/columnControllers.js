import Column from "../models/Column.js";
import Board from "../models/Board.js";

// Create a new column inside a specific board
export const createColumn = async (req, res) => {
  try {
    const { title, boardId, order } = req.body;

    const newColumn = new Column({ title, boardId, order });
    await newColumn.save();

    //Push the new column's ID into the parent's board's columns array
    await Board.findByIdAndUpdate(boardId, {
      $push: { columns: newColumn._id },
    });

    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a column completely and pull its reference out of its parent board
export const deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { boardId } = req.body; // Pass the boardId down to clean up parent array references

    // 1. Pull the column reference out of the parent board's columns array
    if (boardId) {
      await Board.findByIdAndUpdate(boardId, { $pull: { columns: columnId } });
    }

    // 2. Delete the column object itself from the collection
    await Column.findByIdAndDelete(columnId);

    // Optional Portfolio Polish: Wipe all tasks belonging to this column as well
    // await Card.deleteMany({ columnId });

    res.status(200).json({ message: "Column list deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
