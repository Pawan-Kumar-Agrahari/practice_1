# Personal Expense Management System

A Complete MERN stack application allowing users to register, login, and securely manage their daily expenses.

## 📂 Folder Structure
- `frontend/` - React application powered by Vite, tailormade CSS dashboard.
- `backend/` - Node.js + Express backend, Mongoose models, routing architecture.

## 🚀 How to Run locally

### 1. Database (MongoDB)
Ensure you have MongoDB Community Edition or matching service running locally at `mongodb://127.0.0.1:27017/expense_management`. (The `.env` variable parses this by default).

### 2. Backend Setup
Open a terminal and navigate to the backend folder:
```bash
cd "backend"
# Dependencies are already installed via `npm install`
node server.js
```
The server will boot up and listen on `http://localhost:5000`.

### 3. Frontend Setup
Open a second terminal and navigate to the frontend folder:
```bash
cd "frontend"
# Dependencies are already installed via `npm install`
npm run dev
```
Follow the local URL provided to open the application graphically inside the Browser (usually `http://localhost:5173`).
