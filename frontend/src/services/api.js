import axios from "axios";

// Base Axios instance pointing directly to our running Node backend
const API = axios.create({
  baseURL: "https://trello-clone-fullstack.onrender.com/api",
});

// Front-to-back communication hooks matching our Express controllers
export const fetchBoards = () => API.get("/boards");
export const createBoard = (boardData) => API.post("/boards", boardData);
export const createColumn = (columnData) => API.post("/columns", columnData);
export const createCard = (cardData) => API.post("/cards", cardData);

// CRUD Syncing Actions for Deletion & Drag Position Updates
export const updateCardPositionAPI = (cardId, positionData) =>
  API.put(`/cards/${cardId}/position`, positionData);
export const deleteCardAPI = (cardId, columnId) =>
  API.delete(`/cards/${cardId}`, { data: { columnId } });
export const deleteColumnAPI = (columnId, boardId) =>
  API.delete(`/columns/${columnId}`, { data: { boardId } });

export default API;
