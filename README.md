# Trello Clone - Full Stack Project

A full-stack project management application inspired by Trello. This application allows users to organize tasks dynamically using custom column boards with full database persistence.

# Live Demo
Checkout the live application here:[ https://trello-clone-fullstack-bice.vercel.app]
## 🚀 Features

- **Full CRUD Columns:** Create, view, update, and delete workflow columns dynamically.
- **Modern UI:** Styled using **Tailwind CSS** for a clean, responsive user experience.
- **Robust Backend:** Built with Express and Node.js to serve structured API endpoints.
- **Cloud Database:** Integrated with **MongoDB Atlas** for secure, real-time data persistence.

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (via Mongoose)

## 📋 Setup Instructions

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed on your computer.

### 2. Environment Configuration

Navigate to the `backend` directory. Copy the environment template file and create your local `.env`:

```bash
cp .env.example .env
```

Open the newly created `.env` file and replace the placeholder text with your actual **MongoDB Atlas connection string**.

### 3. Installation & Running Locally

#### Run Backend:

```bash
cd backend
npm install
npm start
```

#### Run Frontend:

```bash
cd ../frontend
npm install
npm run dev
```
