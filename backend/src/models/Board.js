import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    columns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column", // Keep reference to Column model for relational mapping
        default: [],
      },
    ],
  },
  { timestamps: true },
);
export default mongoose.model("Board", boardSchema);
