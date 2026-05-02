import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(location.state?.maskedEmail ? `OTP sent to ${location.state.maskedEmail}` : "");

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((value) => value - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const updateOtp = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-email", { email, otp: otp.join("") });
      saveSession(data);
      navigate(data.user.role === "Staff" ? "/staff" : "/user");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    const { data } = await api.post("/auth/resend-email-otp", { email });
    setMessage(data.message);
    setTimer(data.waitSeconds || 60);
  };

  return (
    <form className="otp-card panel" onSubmit={verify}>
      <ShieldCheck size={42} />
      <h1>Email Verification</h1>
      <p>{message || "Enter your email and the 6-digit OTP sent to your inbox."}</p>
      <input className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <div className="otp-boxes">
        {otp.map((digit, index) => (
          <input
            id={`otp-${index}`}
            key={index}
            value={digit}
            onChange={(e) => updateOtp(index, e.target.value)}
            maxLength="1"
            inputMode="numeric"
            required
          />
        ))}
      </div>
      <button className="btn btn-primary w-100 mt-4" disabled={loading || otp.join("").length !== 6}>
        {loading ? "Verifying..." : "Verify Account"}
      </button>
      <button className="btn btn-outline-primary w-100 mt-2" type="button" onClick={resend} disabled={timer > 0 || !email}>
        {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
      </button>
      <Link className="d-block text-center mt-3" to="/login">Back to login</Link>
    </form>
  );
};

export default VerifyOtp;
