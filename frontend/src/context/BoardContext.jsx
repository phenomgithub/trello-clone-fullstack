import React, { createContext, useState, useEffect } from "react";
import {
  fetchBoards,
  createBoard,
  createColumn,
  createCard,
  updateCardPositionAPI,
  deleteCardAPI,
  deleteColumnAPI,
} from "../services/api";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch initial board data from database on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetchBoards();
        setBoards(response.data);

        if (response.data.length > 0) {
          setCurrentBoard(response.data[0]);
        }
      } catch (error) {
        console.error("Error loading full-stack database records:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 2. Add a new Board
  const handleCreateBoard = async (title) => {
    try {
      const response = await createBoard({ title });
      setBoards((prev) => [...prev, response.data]);
      if (!currentBoard) setCurrentBoard(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to add fresh canvas instance:", error);
    }
  };

  // 3. Add a new Column to the current active Board
  const handleCreateColumn = async (title) => {
    if (!currentBoard) return;
    try {
      const order = currentBoard.columns ? currentBoard.columns.length : 0;
      const response = await createColumn({
        title,
        boardId: currentBoard._id,
        order,
      });

      const updatedBoard = {
        ...currentBoard,
        columns: [
          ...(currentBoard.columns || []),
          { ...response.data, cards: [] },
        ],
      };
      setCurrentBoard(updatedBoard);
      setBoards((prev) =>
        prev.map((b) => (b._id === currentBoard._id ? updatedBoard : b)),
      );
    } catch (error) {
      console.error("Failed to sync structural column item:", error);
    }
  };

  // 4. Add a new Card to a specific targeting Column
  const handleCreateCard = async (title, columnId) => {
    try {
      const targetColumn = currentBoard.columns.find((c) => c._id === columnId);
      const order =
        targetColumn && targetColumn.cards ? targetColumn.cards.length : 0;

      const response = await createCard({ title, columnId, order });

      const updatedColumns = currentBoard.columns.map((col) => {
        if (col._id === columnId) {
          return { ...col, cards: [...(col.cards || []), response.data] };
        }
        return col;
      });

      const updatedBoard = { ...currentBoard, columns: updatedColumns };
      setCurrentBoard(updatedBoard);
      setBoards((prev) =>
        prev.map((b) => (b._id === currentBoard._id ? updatedBoard : b)),
      );
    } catch (error) {
      console.error("Failed to push task card collection layer:", error);
    }
  };

  // 5. Delete a Column List completely
  const handleDeleteColumn = async (columnId) => {
    if (!currentBoard) return;

    const updatedColumns = currentBoard.columns.filter(
      (col) => col._id !== columnId,
    );
    const updatedBoard = { ...currentBoard, columns: updatedColumns };

    setCurrentBoard(updatedBoard);
    setBoards((prev) =>
      prev.map((b) => (b._id === currentBoard._id ? updatedBoard : b)),
    );

    try {
      await deleteColumnAPI(columnId, currentBoard._id);
    } catch (error) {
      console.error("Database failed to clear target column reference:", error);
    }
  };

  // 6. Delete a Task Card completely
  const handleDeleteCard = async (cardId, columnId) => {
    if (!currentBoard) return;

    const updatedColumns = currentBoard.columns.map((col) => {
      if (col._id === columnId) {
        return {
          ...col,
          cards: col.cards.filter((c) => c._id !== cardId),
        };
      }
      return col;
    });

    const updatedBoard = { ...currentBoard, columns: updatedColumns };
    setCurrentBoard(updatedBoard);
    setBoards((prev) =>
      prev.map((b) => (b._id === currentBoard._id ? updatedBoard : b)),
    );

    try {
      await deleteCardAPI(cardId, columnId);
    } catch (error) {
      console.error(
        "Database failed to clear target task card entity reference:",
        error,
      );
    }
  };

  // 7. Optimistic UI Drag-and-Drop Handler function
  const handleDragCard = async (
    cardId,
    sourceColumnId,
    destinationColumnId,
    destinationOrder,
  ) => {
    if (!currentBoard) return;

    const sourceColumn = currentBoard.columns.find(
      (c) => c._id === sourceColumnId,
    );
    const destColumn = currentBoard.columns.find(
      (c) => c._id === destinationColumnId,
    );
    const movingCard = sourceColumn.cards.find((c) => c._id === cardId);

    const newSourceCards = sourceColumn.cards.filter((c) => c._id !== cardId);

    let newDestCards = [...destColumn.cards];
    if (sourceColumnId === destinationColumnId) {
      newDestCards = newSourceCards;
    } else {
      newDestCards.splice(destinationOrder, 0, {
        ...movingCard,
        columnId: destinationColumnId,
      });
    }

    const updatedColumns = currentBoard.columns.map((col) => {
      if (col._id === sourceColumnId) return { ...col, cards: newSourceCards };
      if (col._id === destinationColumnId)
        return { ...col, cards: newDestCards };
      return col;
    });

    const updatedBoard = { ...currentBoard, columns: updatedColumns };
    setCurrentBoard(updatedBoard);

    try {
      await updateCardPositionAPI(cardId, {
        sourceColumnId,
        destinationColumnId,
        destinationOrder,
      });
    } catch (error) {
      console.error(
        "Database failed to sync dropped item placement properties:",
        error,
      );
    }
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        currentBoard,
        setCurrentBoard,
        loading,
        handleCreateBoard,
        handleCreateColumn,
        handleCreateCard,
        handleDeleteColumn,
        handleDeleteCard,
        handleDragCard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
