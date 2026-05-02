import { useCallback, useEffect, useState } from "react";
import { QrCode, TicketPlus, UserRoundPlus } from "lucide-react";
import api from "../api/api.js";
import QueueTable from "../components/QueueTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import useQueueSocket from "../hooks/useQueueSocket.js";

const UserDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [relationForm, setRelationForm] = useState({ email: "", relationType: "Friend" });
  const [otpForm, setOtpForm] = useState({ relationshipId: "", otp: "" });
  const [collectorId, setCollectorId] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    const [tokenRes, relationRes] = await Promise.all([
      api.get("/queues/mine"),
      api.get("/relationships")
    ]);
    setTokens(tokenRes.data);
    setRelationships(relationRes.data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useQueueSocket("general", loadData);

  const createToken = async () => {
    const payload = { queueName: "general" };
    if (collectorId) payload.collectedBy = collectorId;

    const { data } = await api.post("/queues", payload);
    setMessage(`Token generated: ${data.tokenNumber}`);
    loadData();
  };

  const approvedCollectors = relationships.filter((item) => item.status === "Approved");

  const addRelationship = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/relationships", relationForm);
    setMessage(`${data.message} Demo OTP: ${data.demoOtp}`);
    setRelationForm({ email: "", relationType: "Friend" });
    loadData();
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/relationships/verify", otpForm);
    setMessage(data.message);
    setOtpForm({ relationshipId: "", otp: "" });
    loadData();
  };

  const cancelToken = async (id) => {
    const reason = window.prompt("Reason for cancellation?", "Cancelled by user");
    if (!reason) return;
    await api.patch(`/queues/${id}/cancel`, { reason });
    loadData();
  };

  const rescheduleToken = async (id) => {
    const scheduledFor = window.prompt("Enter new date and time, example: 2026-05-03T10:30");
    if (!scheduledFor) return;
    await api.patch(`/queues/${id}/reschedule`, { scheduledFor, note: "Rescheduled by user" });
    loadData();
  };

  return (
    <div className="dashboard-grid">
      <section>
        <div className="section-head">
          <div>
            <h1>User Dashboard</h1>
            <p>Generate queue tokens and manage friends or relatives for pickup.</p>
          </div>
          <button className="btn btn-primary" onClick={createToken}>
            <TicketPlus size={18} /> Generate Token
          </button>
        </div>
        {message && <div className="alert alert-info">{message}</div>}
        <QueueTable
          tokens={tokens}
          canUserEdit
          onCancel={cancelToken}
          onReschedule={rescheduleToken}
        />
        {tokens[0]?.qrCode && (
          <div className="panel mt-4 qr-panel">
            <QrCode size={24} />
            <div>
              <h3>Latest QR Authorization</h3>
              <img src={tokens[0].qrCode} alt="Queue authorization QR code" />
            </div>
          </div>
        )}
      </section>
      <aside className="side-stack">
        <div className="panel">
          <h3>QR Pickup Collector</h3>
          <select
            className="form-select"
            value={collectorId}
            onChange={(e) => setCollectorId(e.target.value)}
          >
            <option value="">Self pickup</option>
            {approvedCollectors.map((item) => (
              <option key={item._id} value={item.relatedPerson?._id}>
                {item.relatedPerson?.name} ({item.relationType})
              </option>
            ))}
          </select>
        </div>
        <form className="panel" onSubmit={addRelationship}>
          <h3><UserRoundPlus size={20} /> Add Friend / Relative</h3>
          <input className="form-control mb-2" placeholder="Person email" value={relationForm.email} onChange={(e) => setRelationForm({ ...relationForm, email: e.target.value })} required />
          <select className="form-select mb-3" value={relationForm.relationType} onChange={(e) => setRelationForm({ ...relationForm, relationType: e.target.value })}>
            <option>Friend</option>
            <option>Relative</option>
          </select>
          <button className="btn btn-outline-primary w-100">Send OTP Request</button>
        </form>
        <form className="panel" onSubmit={verifyOtp}>
          <h3>Approve Request</h3>
          <input className="form-control mb-2" placeholder="Relationship ID" value={otpForm.relationshipId} onChange={(e) => setOtpForm({ ...otpForm, relationshipId: e.target.value })} required />
          <input className="form-control mb-3" placeholder="OTP" value={otpForm.otp} onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })} required />
          <button className="btn btn-outline-success w-100">Verify OTP</button>
        </form>
        <div className="panel">
          <h3>Relationships</h3>
          {relationships.map((item) => (
            <div className="relation-row" key={item._id}>
              <div>
                <strong>{item.relatedPerson?.name}</strong>
                <span>{item.relationType}</span>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default UserDashboard;
