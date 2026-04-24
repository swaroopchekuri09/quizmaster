# QuizMaster — Online Quiz / Test Platform

A complete **MERN Stack** online quiz platform for students. Practice topic-wise MCQs, compete on leaderboards, and track your progress.

---

## 🚀 Features

### User Features
- Register & Login with JWT authentication
- Browse and filter quizzes by topic (JavaScript, Java, DBMS, OS, CN, Aptitude)
- Take timed MCQ quizzes with countdown timer
- Auto-submit when timer expires
- View instant result with score, percentage, and pass/fail status
- Answer review page showing correct and wrong answers
- View past attempt history
- Global leaderboard ranked by score and speed
- Dark mode toggle

### Admin Features
- Admin dashboard with analytics (users, quizzes, attempts, avg score)
- Create, edit, delete quizzes
- Publish / unpublish quizzes
- Manage topics/categories
- Add/edit/delete questions for any quiz
- View all registered users
- View recent quiz attempts

### Security
- Server-side score calculation (frontend answers never trusted for marks)
- JWT-based authentication with localStorage persistence
- Protected routes (user & admin)
- bcrypt password hashing

---

## 🛠️ Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React 18, React Router DOM 6  |
| Styling    | Bootstrap 5, Bootstrap Icons  |
| HTTP       | Axios                         |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB, Mongoose             |
| Auth       | JWT, bcryptjs                 |

---

## 📁 Folder Structure

```
QuizMaster/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Business logic
│   ├── middleware/     → Auth, admin, error handlers
│   ├── models/         → Mongoose schemas
│   ├── routes/         → API routes
│   ├── seed/           → Database seeder
│   ├── utils/          → Token generation
│   ├── server.js       → Entry point
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── components/ → Navbar, Footer, Cards, etc.
        ├── context/    → AuthContext
        ├── pages/      → All pages (user + admin)
        ├── services/   → Axios API service layer
        ├── App.js
        └── index.js
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally on port 27017
- npm installed

---

### Step 1 — Clone / Open the Project

```bash
cd C:\QuizMaster
```

---

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizmaster
JWT_SECRET=quizmaster_super_secret_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

---

### Step 3 — Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### Step 4 — Start MongoDB

**Windows (if MongoDB is installed as a service):**
```bash
net start MongoDB
```

**Or run manually:**
```bash
mongod --dbpath "C:\data\db"
```

---

### Step 5 — Seed the Database

This creates sample admin, users, topics, quizzes, and questions.

```bash
cd backend
npm run seed
```

**Expected output:**
```
✅ Connected to MongoDB for seeding...
🗑️  Cleared existing data
👤 Created Admin + 3 Users
📚 Created 6 Topics
📝 Created 3 Quizzes
❓ Created 30 Questions (10 per quiz)
✅ DATABASE SEEDED SUCCESSFULLY!
```

---

### Step 6 — Start Backend Server

```bash
cd backend
npm run dev
```

Server runs at: `http://localhost:5000`

Test it: `http://localhost:5000/api/health`

---

### Step 7 — Start Frontend

```bash
cd frontend
npm start
```

App runs at: `http://localhost:3000`

---

## 🔑 Default Credentials

| Role  | Email                    | Password |
|-------|--------------------------|----------|
| Admin | admin@quizmaster.com     | admin123 |
| User  | alice@example.com        | user1234 |
| User  | bob@example.com          | user1234 |
| User  | carol@example.com        | user1234 |

---

## 🧪 Test the Project Flow

### As Admin:
1. Go to `http://localhost:3000/login`
2. Use **Admin** quick-fill button → Login
3. You'll be redirected to the Admin Dashboard
4. Go to **Topics** → Create topics
5. Go to **Quizzes** → Create a quiz → Add questions
6. Publish the quiz

### As User:
1. Open new tab → `http://localhost:3000/register`
2. Register a new account (or use Alice's credentials)
3. Browse quizzes → Click a quiz → Start it
4. Answer questions, monitor timer, submit
5. View result and answer review
6. Check Leaderboard

---

## 📡 API Routes Summary

### Auth
| Method | Route                  | Access  |
|--------|------------------------|---------|
| POST   | /api/auth/register     | Public  |
| POST   | /api/auth/login        | Public  |
| GET    | /api/auth/profile      | Private |

### Topics
| Method | Route              | Access       |
|--------|--------------------|--------------|
| GET    | /api/topics        | Public       |
| POST   | /api/topics        | Admin only   |
| PUT    | /api/topics/:id    | Admin only   |
| DELETE | /api/topics/:id    | Admin only   |

### Quizzes
| Method | Route                      | Access     |
|--------|----------------------------|------------|
| GET    | /api/quizzes               | Public     |
| GET    | /api/quizzes/:id           | Public     |
| POST   | /api/quizzes               | Admin only |
| PUT    | /api/quizzes/:id           | Admin only |
| DELETE | /api/quizzes/:id           | Admin only |
| PATCH  | /api/quizzes/:id/publish   | Admin only |

### Questions
| Method | Route                        | Access     |
|--------|------------------------------|------------|
| GET    | /api/questions/quiz/:quizId  | Private    |
| POST   | /api/questions               | Admin only |
| PUT    | /api/questions/:id           | Admin only |
| DELETE | /api/questions/:id           | Admin only |

### Attempts
| Method | Route                      | Access     |
|--------|----------------------------|------------|
| POST   | /api/attempts/submit       | Private    |
| GET    | /api/attempts/my           | Private    |
| GET    | /api/attempts/quiz/:quizId | Admin only |
| GET    | /api/attempts/:id          | Private    |

### Leaderboard
| Method | Route                         | Access |
|--------|-------------------------------|--------|
| GET    | /api/leaderboard/overall      | Public |
| GET    | /api/leaderboard/quiz/:quizId | Public |
| GET    | /api/leaderboard/topic/:id    | Public |

### Admin
| Method | Route             | Access     |
|--------|-------------------|------------|
| GET    | /api/admin/stats  | Admin only |
| GET    | /api/admin/users  | Admin only |

---

## 🐛 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `MongoDB Connection Error` | MongoDB not running | Start MongoDB service |
| `CORS error` | Frontend URL mismatch | Check `server.js` CORS origin is `http://localhost:3000` |
| `401 Unauthorized` | Token expired or missing | Log out and log in again |
| `Cannot GET /api/...` | Backend not running | Run `npm run dev` in backend folder |
| `Network Error` in React | Backend not started | Start backend first, then frontend |
| `Module not found` | Dependencies not installed | Run `npm install` in both frontend and backend |
| Seed script fails | MongoDB not connected | Check MONGO_URI in `.env` |

---

## 📝 Environment Variables Reference

### Backend `.env`
```env
PORT=5000                                          # Server port
MONGO_URI=mongodb://localhost:27017/quizmaster     # MongoDB connection string
JWT_SECRET=your_secret_key_here                    # JWT signing secret (keep private!)
JWT_EXPIRES_IN=7d                                  # Token expiry
NODE_ENV=development                               # 'development' or 'production'
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api        # Backend API URL
```

---

## 👨‍💻 Author

Built with ❤️ as a MERN Stack Mini Project

**Tech Stack:** MongoDB · Express.js · React.js · Node.js · Bootstrap 5 · JWT
# quizmaster
