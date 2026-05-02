import { useState } from "react";
import api from "../api/api.js";

const Feedback = () => {
  const [form, setForm] = useState({ rating: 5, message: "" });
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/feedback", form);
    setMessage("Feedback submitted successfully");
    setForm({ rating: 5, message: "" });
  };

  return (
    <form className="panel wide-form" onSubmit={submit}>
      <h1>Feedback</h1>
      {message && <div className="alert alert-success">{message}</div>}
      <label className="form-label">Rating</label>
      <select className="form-select mb-3" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
        <option value={5}>5 - Excellent</option>
        <option value={4}>4 - Good</option>
        <option value={3}>3 - Average</option>
        <option value={2}>2 - Poor</option>
        <option value={1}>1 - Bad</option>
      </select>
      <label className="form-label">Message</label>
      <textarea className="form-control mb-3" rows="5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
      <button className="btn btn-primary">Submit Feedback</button>
    </form>
  );
};

export default Feedback;
