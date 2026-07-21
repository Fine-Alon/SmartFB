# SmartFB 🚀

SmartFB is an intelligent feedback, survey, and review management platform designed to streamline how organizations collect, monitor, and resolve user submissions. It features an asynchronous Python backend and a dynamic React frontend with role-based access control.

---

## 🛠️ Tech Stack

### Backend
*   **Framework:** FastAPI (Python)
*   **Database Driver:** Motor (Async MongoDB Driver)
*   **Data Validation:** Pydantic
*   **Security & Auth:** Custom Role-Based Access Control (RBAC)

### Frontend
*   **Library:** React (Vite)
*   **State Management:** Redux
*   **HTTP Client:** Axios

---

## ✨ Key Features

*   **Survey Management:** Create, track, and manage dynamic surveys and templates.
*   **Human Review & Moderation Queue:** Dedicated endpoints and views to handle flagged submissions, allowing internal staff to review, add notes, and resolve tickets.
*   **Role-Based Access Control (RBAC):** Granular endpoint protection supporting internal staff roles (`admin` and `support`).
*   **Asynchronous Architecture:** Fully async database interactions ensuring high performance and concurrent request handling.

---

## 📁 Project Structure

```text
smart-fb/
├── backend/
│   ├── app/
│   │   ├── core/           # Security, database connection, and role checkers
│   │   ├── routers/        # API route handlers (e.g., reviews.py, surveys)
│   │   └── services/       # Business logic and database CRUD operations
│   └── main.py             # FastAPI application entry point
└── frontend/               # React client application (Vite / Redux / Axios)
    ├── src/
    │   ├── components/     # UI components (e.g., FeedbackPage.jsx)
    │   └── ...
