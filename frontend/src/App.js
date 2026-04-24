// src/App.js
// Main React application with all routes defined

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home     from './pages/Home';
import Login    from './pages/Login';
import Register from './pages/Register';

// User Pages
import QuizList    from './pages/QuizList';
import QuizDetail  from './pages/QuizDetail';
import TakeQuiz    from './pages/TakeQuiz';
import Result      from './pages/Result';
import MyAttempts  from './pages/MyAttempts';
import Leaderboard from './pages/Leaderboard';
import Profile     from './pages/Profile';

// Admin Pages
import AdminDashboard   from './pages/admin/AdminDashboard';
import ManageTopics     from './pages/admin/ManageTopics';
import ManageQuizzes    from './pages/admin/ManageQuizzes';
import CreateQuiz       from './pages/admin/CreateQuiz';
import EditQuiz         from './pages/admin/EditQuiz';
import ManageQuestions  from './pages/admin/ManageQuestions';
import ViewUsers        from './pages/admin/ViewUsers';
import ViewAttempts     from './pages/admin/ViewAttempts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/"         element={<Home />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ── Public Leaderboard ── */}
              <Route path="/leaderboard" element={<Leaderboard />} />

              {/* ── Protected User Routes ── */}
              <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
              <Route path="/quiz/:id" element={<ProtectedRoute><QuizDetail /></ProtectedRoute>} />
              <Route path="/quiz/:id/take" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
              <Route path="/result/:id" element={<ProtectedRoute><Result /></ProtectedRoute>} />
              <Route path="/my-attempts" element={<ProtectedRoute><MyAttempts /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* ── Admin Routes ── */}
              <Route path="/admin/dashboard"                element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/topics"                   element={<AdminRoute><ManageTopics /></AdminRoute>} />
              <Route path="/admin/quizzes"                  element={<AdminRoute><ManageQuizzes /></AdminRoute>} />
              <Route path="/admin/quizzes/create"           element={<AdminRoute><CreateQuiz /></AdminRoute>} />
              <Route path="/admin/quizzes/:id/edit"         element={<AdminRoute><EditQuiz /></AdminRoute>} />
              <Route path="/admin/quizzes/:id/questions"    element={<AdminRoute><ManageQuestions /></AdminRoute>} />
              <Route path="/admin/users"                    element={<AdminRoute><ViewUsers /></AdminRoute>} />
              <Route path="/admin/attempts"                 element={<AdminRoute><ViewAttempts /></AdminRoute>} />

              {/* ── Fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
