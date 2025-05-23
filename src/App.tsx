import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/dashboard/Dashboard';
import ChatPage from './pages/chat/ChatPage';
import PDFViewer from './pages/pdf/PDFViewer';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import RequireAuth from './components/auth/RequireAuth';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:folderId?/:sessionId?" element={<ChatPage />} />
          <Route path="/pdf/:fileId" element={<PDFViewer />} />
        </Route>
      </Route>

      {/* Redirect to dashboard if logged in, otherwise to login */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;