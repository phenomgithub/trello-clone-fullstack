import React, { useContext, useState } from "react";
import { BoardContext } from "./context/BoardContext";
import { Plus, Kanban, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {
  const {
    currentBoard,
    loading,
    handleCreateBoard,
    handleCreateColumn,
    handleCreateCard,
    handleDragCard,
    handleDeleteCard,
    handleDeleteColumn,
  } = useContext(BoardContext);

  const [columnTitle, setColumnTitle] = useState("");
  const [cardTitles, setCardTitles] = useState({});

  // 1. Loading Fallback Screen
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white font-semibold">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mr-3"></div>
        Loading Kanban Infrastructure...
      </div>
    );
  }

  // 2. Empty State Screen
  if (!currentBoard) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-900 text-slate-200 px-4 text-center">
        <Kanban size={64} className="text-blue-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold mb-2">
          Create Your First Portfolio Board Workspace
        </h1>
        <p className="text-slate-400 mb-6 max-w-sm">
          Deploy an operational data canvas on your cloud server pipeline to
          initialize task columns.
        </p>
        <button
          onClick={() => handleCreateBoard("Main Portfolio Project Canvas")}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          Initialize App Workspace Board
        </button>
      </div>
    );
  }

  // 3. Add column submission
  const onAddColumnSubmit = (e) => {
    e.preventDefault();
    if (!columnTitle.trim()) return;
    handleCreateColumn(columnTitle);
    setColumnTitle("");
  };

  // 4. Add task card submission
  const onAddCardSubmit = (e, columnId) => {
    e.preventDefault();
    const title = cardTitles[columnId];
    if (!title || !title.trim()) return;
    handleCreateCard(title, columnId);
    setCardTitles((prev) => ({ ...prev, [columnId]: "" }));
  };

  // 5. Drag-and-Drop Handler Interceptor
  const onDragEndHandler = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    handleDragCard(
      draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index,
    );
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900 text-slate-100 flex flex-col overflow-x-hidden">
      {/* Top Navbar Header Dashboard */}
      <header className="bg-slate-800/60 backdrop-blur-md border-b border-slate-700/50 px-6 py-3.5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
            <Kanban size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate">
            {currentBoard.title}
          </h1>
        </div>

        {/* Navbar form tool controls */}
        <div className="flex items-center gap-4 shrink-0">
          <form
            onSubmit={onAddColumnSubmit}
            className="flex items-center gap-2 bg-slate-900/50 border border-slate-700/60 p-1 rounded-xl shadow-inner"
          >
            <input
              type="text"
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              placeholder="New list title..."
              className="bg-transparent text-slate-100 placeholder-slate-500 text-xs px-3 py-1.5 w-44 min-w-0 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus size={13} /> Add List
            </button>
          </form>

          <div className="text-xs font-mono px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1.5 select-none shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Pipeline Active
          </div>
        </div>
      </header>

      {/* DragDropContext Horizontal Workspace Runway */}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start w-full overflow-y-auto select-none">
          {/* Render columns loop dynamically */}
          {currentBoard.columns &&
            currentBoard.columns.map((column) => (
              <div
                key={column._id}
                className="w-full min-w-0 bg-slate-800 rounded-xl p-4 border border-slate-700/60 shadow-lg flex flex-col h-[70vh] transition-all duration-200"
              >
                {/* Column Header title with hover-triggered delete option */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-700/40 pb-2.5 px-1 shrink-0 group/column">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 truncate">
                    {column.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteColumn(column._id)}
                    className="text-slate-500 hover:text-rose-400 opacity-0 group-hover/column:opacity-100 transition-all duration-150 p-1 rounded hover:bg-slate-700 cursor-pointer shrink-0"
                    title="Delete column list"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Droppable Card Drop Target Area — min-h-0 is what keeps this
                  from blowing past the column's fixed height and shoving the
                  add-card form out from under it */}
                <Droppable droppableId={column._id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 min-h-0 overflow-y-auto space-y-3 mb-3 pr-1 scrollbar-thin"
                    >
                      {column.cards && column.cards.length > 0 ? (
                        column.cards.map((card, index) => (
                          /* Draggable Individual Task Card Item */
                          <Draggable
                            key={card._id}
                            draggableId={card._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`min-h-12 border rounded-lg px-4 py-3 text-sm shadow-sm transition-all duration-150 text-slate-200 flex items-center justify-between gap-2 group ${
                                  snapshot.isDragging
                                    ? "bg-blue-600 border-blue-400 scale-[1.02] rotate-1 shadow-xl"
                                    : "bg-slate-700/70 hover:bg-slate-700 border-slate-600/40"
                                }`}
                              >
                                <span className="truncate font-medium tracking-wide flex-1 min-w-0">
                                  {card.title}
                                </span>
                                <button
                                  onClick={() =>
                                    handleDeleteCard(card._id, column._id)
                                  }
                                  className="text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-150 p-1.5 rounded hover:bg-slate-600/60 cursor-pointer shrink-0"
                                  title="Delete task card"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <div className="text-xs text-slate-500 text-center py-8 bg-slate-900/30 rounded-lg border border-dashed border-slate-700/40">
                          No tasks inside column yet
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Add card inline input form — pinned to the bottom of the
                  column by flex-col + the sibling above shrinking properly */}
                <form
                  onSubmit={(e) => onAddCardSubmit(e, column._id)}
                  className="shrink-0 pt-3 border-t border-slate-700/40 w-full"
                >
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      value={cardTitles[column._id] || ""}
                      onChange={(e) =>
                        setCardTitles((prev) => ({
                          ...prev,
                          [column._id]: e.target.value,
                        }))
                      }
                      placeholder="Add card item..."
                      className="flex-1 min-w-0 bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-medium shadow-inner"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 rounded-lg text-xs flex items-center justify-center cursor-pointer transition-all duration-150 shrink-0 shadow-md shadow-blue-900/20 active:scale-95 border border-blue-500/10 font-bold"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </form>
              </div>
            ))}
        </main>
      </DragDropContext>
    </div>
  );
}

export default App;
