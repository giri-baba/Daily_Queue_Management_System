import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const roleRoutes = { Admin: "/admin", Manager: "/manager", Staff: "/staff", User: "/user" };

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", role: "User" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password, form.role);
      navigate(roleRoutes[user.role]);
    } catch (err) {
      if (err.response?.data?.email) {
        navigate("/verify-otp", {
          state: {
            email: err.response.data.email,
            maskedEmail: err.response.data.maskedEmail
          }
        });
        return;
      }
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <h1>Smart Digital Queue Management System</h1>
        <p>
          Manage queue tokens, live counters, relationship approvals, QR pickup authorization,
          and feedback from one simple MERN project.
        </p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <label className="form-label">Role</label>
        <select
          className="form-select mb-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option>User</option>
          <option>Staff</option>
          <option>Manager</option>
          <option>Admin</option>
        </select>
        <label className="form-label">Email</label>
        <input
          className="form-control mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label className="form-label">Password</label>
        <input
          className="form-control mb-4"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-primary w-100 mb-3">
          <LogIn size={18} /> Login
        </button>
        <a className="btn btn-outline-dark w-100 mb-3" href="http://localhost:5000/api/auth/google">
          Continue with Google
        </a>
        <p className="mb-0 text-center">
          New here? <Link to="/signup">Create account</Link>
        </p>
        <p className="mb-0 text-center mt-2">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
