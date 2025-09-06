# 🧭 Masterplan

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

### ✨ Overview

**Masterplan** is a modern project management tool designed to help teams efficiently plan, track, and collaborate on tasks and projects. It provides a centralized platform to keep your team organized and productive.

---

### ⚡ Features

-   **Task & Project Management:** Easily create and assign tasks with deadlines and priorities.
-   **Team Collaboration:** Role-based access control and collaborative workspaces for teams.
-   **Real-time Notifications:** Stay updated on project progress and mentions.
-   **Chart Visualization:** Visualize project timelines and data with interactive charts.
-   **Secure Authentication:** Simple and secure login with OAuth 2.0.

---

### 🛠️ Tech Stack

-   **Frontend:** React.js with TypeScript
-   **Backend:** Node.js with Express.js
-   **Database:** PostgreSQL
-   **Authentication:** OAuth 2.0

---

### 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

#### Prerequisites

-   Node.js and npm
-   PostgreSQL Server

#### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/miqd2d/masterplan.git](https://github.com/miqd2d/masterplan.git)
    cd masterplan
    ```

2.  **Install Frontend Dependencies:**
    ```sh
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```sh
    cd ../backend
    npm install
    ```

4.  **Configure Environment Variables:**
    In both the `frontend` and `backend` directories, create a `.env` file by copying the `.env.example`.
    ```sh
    # In ./frontend
    cp .env.example .env

    # In ./backend
    cp .env.example .env
    ```
    Update both `.env` files with your database credentials, OAuth keys, and other configurations.

5.  **Run the Application:**
    Open two separate terminals to run the backend and frontend servers concurrently.
    ```sh
    # In terminal 1 (from ./backend)
    npm run start

    # In terminal 2 (from ./frontend)
    npm run start
    ```
    The application will be accessible at `http://localhost:3000`.

---

### 📂 Project Structure
-

---

### 🧪 Usage

1.  Navigate to `http://localhost:3000` in your browser.
2.  **Sign in** using the available OAuth provider.
3.  **Create** a new project or **join** an existing one.
4.  Start creating tasks, assigning them to team members, and tracking progress through the dashboard.

---

### 🤝 Contributing

Contributions are welcome! To contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourAwesomeFeature`).
3.  Commit your changes (`git commit -m 'Add some AwesomeFeature'`).
4.  Push to the branch (`git push origin feature/YourAwesomeFeature`).
5.  Open a Pull Request.

---

### 📜 License

This project is distributed under the MIT License.

© 2025
