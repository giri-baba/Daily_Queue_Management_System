import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import QueueMonitor from "./pages/QueueMonitor.jsx";
import Feedback from "./pages/Feedback.jsx";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("dqmsTheme") || "light");
  const [starting, setStarting] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dqmsTheme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setStarting(false), 900);
    const handleLoading = (event) => setApiLoading(event.detail);

    window.addEventListener("api-loading", handleLoading);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("api-loading", handleLoading);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  if (starting) {
    return (
      <div className="app-loader">
        <div className="loader-mark">
          <span />
          <LoaderCircle size={42} />
        </div>
        <h1>Smart DQMS</h1>
        <p>Preparing your digital queue workspace</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      {apiLoading && (
        <div className="api-loader">
          <LoaderCircle size={18} /> Loading
        </div>
      )}
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/queue-monitor" element={<QueueMonitor />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["Admin", "Manager", "Staff", "User"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute roles={["User"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={["Staff"]}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={["Manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute roles={["User"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
};

export default App;
