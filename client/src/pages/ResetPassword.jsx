import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: ""
  });
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/reset-password", form);
    setMessage(data.message);
    setTimeout(() => navigate("/login"), 900);
  };

  return (
    <form className="wide-form panel" onSubmit={submit}>
      <h1>Reset Password</h1>
      {message && <div className="alert alert-success">{message}</div>}
      <label className="form-label">Email</label>
      <input className="form-control mb-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <label className="form-label">Reset OTP</label>
      <input className="form-control mb-3" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} required />
      <label className="form-label">New Password</label>
      <input className="form-control mb-3" type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
      <button className="btn btn-primary">Reset Password</button>
      <Link className="btn btn-outline-primary ms-2" to="/forgot-password">Resend OTP</Link>
    </form>
  );
};

export default ResetPassword;
