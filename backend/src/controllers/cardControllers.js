import card from "../models/Card.js";
import Column from "../models/Column.js";

// Create a task card inside a specific column
export const createCard = async (req, res) => {
  try {
    const { title, description, columnId, order } = req.body;

    const newCard = new card({ title, description, columnId, order });
    await newCard.save();

    // Push the new card's ID into the parent's column's cards array
    await Column.findByIdAndUpdate(columnId, {
      $push: { cards: newCard._id },
    });

    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a card's column placement or order sequence index
export const updateCardPosition = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { sourceColumnId, destinationColumnId, destinationOrder } = req.body;

    // 1. Remove card ID reference from the old source column array pull channel
    await Column.findByIdAndUpdate(sourceColumnId, {
      $pull: { cards: cardId },
    });

    // 2. Insert card ID reference into the targeting destination column array push index
    await Column.findByIdAndUpdate(destinationColumnId, {
      $push: {
        cards: {
          $each: [cardId],
          $position: destinationOrder, // Injects card precisely into its dropped index slot!
        },
      },
    });

    // 3. Update the specific Card model object itself to know its new column placement context
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { columnId: destinationColumnId, order: destinationOrder },
      { new: true },
    );

    res
      .status(200)
      .json({ message: "Position synced successfully", updatedCard });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a card completely and pull its reference out of its parent column
export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { columnId } = req.body; // Pass the columnId down to clean up array references

    // 1. Pull the card reference identifier out of its matching parent column array
    if (columnId) {
      await Column.findByIdAndUpdate(columnId, { $pull: { cards: cardId } });
    }

    // 2. Delete the card object itself from the collection
    await Card.findByIdAndDelete(cardId);

    res.status(200).json({ message: "Task card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
