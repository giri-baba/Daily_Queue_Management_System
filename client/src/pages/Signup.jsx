import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "User",
    department: "General",
    counterNumber: 1
  });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await signup(form);
      navigate("/verify-otp", { state: { email: data.email, maskedEmail: data.maskedEmail } });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form className="wide-form panel" onSubmit={submit}>
      <h2>Create Account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Account Type</label>
          <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>User</option>
            <option>Staff</option>
          </select>
        </div>
        {form.role === "Staff" && (
          <>
            <div className="col-md-4">
              <label className="form-label">Department</label>
              <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Counter</label>
              <input className="form-control" type="number" value={form.counterNumber} onChange={(e) => setForm({ ...form, counterNumber: e.target.value })} />
            </div>
          </>
        )}
      </div>
      <button className="btn btn-primary mt-4">
        <UserPlus size={18} /> Create Account
      </button>
    </form>
  );
};

export default Signup;
