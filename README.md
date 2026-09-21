# Pulse Chat API 💬

A real-time one-to-one chat backend built with **Node.js, Express.js, Socket.io, and MongoDB**.

Pulse Chat combines a traditional **REST API** for authentication, users, and message history with **Socket.io** for real-time communication, including instant messaging, typing indicators, and online/offline presence.

---

## ✨ Features

* 🔐 **JWT Authentication** — Secure register/login with hashed passwords using bcrypt
* 💬 **Real-time Messaging** — Instant message delivery with Socket.io
* 🟢 **Online/Offline Presence** — Track users' real-time connection status
* ⌨️ **Typing Indicators** — Notify users when someone is typing
* 🚦 **Rate Limiting** — Protect API routes from excessive requests
* 💾 **Message Persistence** — Store conversations and messages in MongoDB
* 🐳 **Docker Support** — Run the API and database with Docker Compose
* 🧪 **Automated Testing** — API tests with Jest and Supertest
* 🏗️ **Clean Structure** — Organized controllers, routes, models, middleware, and services

---

## 🛠️ Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js                 |
| Framework        | Express.js              |
| Database         | MongoDB                 |
| ODM              | Mongoose                |
| Real-time        | Socket.io               |
| Authentication   | JWT                     |
| Password Hashing | bcrypt                  |
| Testing          | Jest + Supertest        |
| Containerization | Docker + Docker Compose |

---

## 📁 Project Structure

```text
pulse-chat-api/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── socket.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Conversation.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── messageController.js
│   │   └── userController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   │
│   ├── sockets/
│   │   └── chatHandler.js
│   │
│   ├── utils/
│   │   └── validators.js
│   │
│   └── app.js
│
├── tests/
│   └── message.test.js
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js 18+
* npm
* MongoDB
* Git

### 1. Clone the repository

```bash
git clone https://github.com/abdelaziz-mahmoud-dev/pulse-chat-api.git
cd pulse-chat-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pulse-chat
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> Never commit your `.env` file or expose your JWT secret.

### 4. Start the development server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

---

## 🐳 Running with Docker

You can run the application and MongoDB using Docker Compose:

```bash
docker-compose up --build
```

To stop the containers:

```bash
docker-compose down
```

---

# 📡 REST API

Base URL:

```text
http://localhost:5000/api
```

## 🔐 Authentication

### Register

```http
POST /auth/register
```

Creates a new user account.

**Request body:**

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

---

### Login

```http
POST /auth/login
```

Authenticates a user and returns a JWT.

**Request body:**

```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

---

## 👤 Users

| Method | Endpoint     | Description                          | Auth |
| ------ | ------------ | ------------------------------------ | ---- |
| GET    | `/users/me`  | Get the authenticated user's profile | ✅    |
| GET    | `/users`     | Get all users                        | ✅    |
| GET    | `/users/:id` | Get a specific user                  | ✅    |

---

## 💬 Messages

| Method | Endpoint                    | Description               | Auth |
| ------ | --------------------------- | ------------------------- | ---- |
| POST   | `/messages`                 | Send a message            | ✅    |
| GET    | `/messages/:conversationId` | Get conversation messages | ✅    |

---

# 🔌 Real-time Communication

Pulse Chat uses **Socket.io** for real-time events.

## Client → Server

| Event              | Payload                                   | Description                    |
| ------------------ | ----------------------------------------- | ------------------------------ |
| `joinConversation` | `conversationId`                          | Join a conversation room       |
| `sendMessage`      | `{ conversationId, receiverId, content }` | Send a real-time message       |
| `typing`           | `{ conversationId }`                      | Notify that the user is typing |

## Server → Client

| Event          | Payload                          | Description                     |
| -------------- | -------------------------------- | ------------------------------- |
| `newMessage`   | Message object                   | Delivers a new message          |
| `notification` | `{ type, from, conversationId }` | Notifies the receiver           |
| `userTyping`   | `{ userId }`                     | Indicates that a user is typing |
| `userOnline`   | `{ userId }`                     | User connected                  |
| `userOffline`  | `{ userId }`                     | User disconnected               |

---

## 🔌 Socket.io Client Example

```javascript
const socket = io("http://localhost:5000", {
  auth: {
    token: "your_jwt_token_here"
  }
});

socket.emit("joinConversation", conversationId);

socket.emit("sendMessage", {
  conversationId,
  receiverId,
  content: "Hello!"
});

socket.on("newMessage", (message) => {
  console.log("New message:", message);
});
```

---

# 🔐 Authentication Flow

Pulse Chat uses JWT-based authentication.

```text
Client
   │
   │ POST /auth/login
   ▼
Express API
   │
   │ Validate credentials
   ▼
MongoDB
   │
   │ User verified
   ▼
JWT Token
   │
   ▼
Client
   │
   │ Authorization: Bearer <token>
   ▼
Protected API / Socket.io
```

Passwords are hashed using **bcrypt** and are never stored as plain text.

---

# 🧪 Testing

Run the test suite with:

```bash
npm test
```

Or:

```bash
npx jest
```

For API testing, the project uses:

* **Jest**
* **Supertest**

---

# 🗺️ Roadmap

Planned improvements include:

* [ ] Message pagination
* [ ] Group conversations
* [ ] File and image attachments
* [ ] Read receipts
* [ ] Push notifications
* [ ] Message editing
* [ ] Message deletion

---

## 👤 Author

**Abdelaziz Mahmoud**

Computer Science & AI Student — Benha University

* GitHub: [abdelaziz-mahmoud-dev](https://github.com/abdelaziz-mahmoud-dev)
* LinkedIn: [Abdelaziz Mahmoud](https://linkedin.com/in/abdelazizmahmoudcs)

---

## 📄 License

This project is for educational and portfolio purposes.
