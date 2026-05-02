import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      navigate("/reset-password", { state: { email } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="wide-form panel" onSubmit={submit}>
      <h1>Forgot Password</h1>
      <p className="text-muted">Enter your registered email. We will send a reset OTP.</p>
      <label className="form-label">Email</label>
      <input className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Sending..." : "Send Reset OTP"}
      </button>
    </form>
  );
};

export default ForgotPassword;
