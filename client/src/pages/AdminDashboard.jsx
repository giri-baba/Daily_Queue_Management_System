import { useEffect, useState } from "react";
import api from "../api/api.js";
import QueueTable from "../components/QueueTable.jsx";
import StatsCards from "../components/StatsCards.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [tokens, setTokens] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Manager" });
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [statsRes, logsRes, queueRes, usersRes] = await Promise.all([
      api.get("/dashboard/stats"),
      api.get("/audit-logs"),
      api.get("/queues"),
      api.get("/auth/users/verification-status")
    ]);
    setStats(statsRes.data);
    setLogs(logsRes.data);
    setTokens(queueRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createRoleUser = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/admin-or-manager", form);
    setMessage(data.message);
    setForm({ name: "", email: "", password: "", role: "Manager" });
    loadData();
  };

  const completeToken = async (id) => {
    await api.patch(`/queues/${id}/complete`);
    loadData();
  };

  const skipToken = async (id) => {
    await api.patch(`/queues/${id}/skip`);
    loadData();
  };

  const cancelToken = async (id) => {
    const reason = window.prompt("Reason for cancellation?", "Cancelled by admin");
    if (!reason) return;
    await api.patch(`/queues/${id}/cancel`, { reason });
    loadData();
  };

  const rescheduleToken = async (id) => {
    const scheduledFor = window.prompt("Enter new date and time, example: 2026-05-03T10:30");
    if (!scheduledFor) return;
    await api.patch(`/queues/${id}/reschedule`, { scheduledFor, note: "Rescheduled by admin" });
    loadData();
  };

  const forwardToken = async (id) => {
    const department = window.prompt("Forward to which department?", "Admin Review");
    if (!department) return;
    await api.patch(`/queues/${id}/forward`, { department });
    loadData();
  };

  return (
    <div className="dashboard-grid">
      <section>
        <div className="section-head">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage high-level users, queue tickets, audit logs, and system totals.</p>
          </div>
        </div>
        <StatsCards stats={stats} />
        <div className="mt-4">
          <h3>Queue Control</h3>
          <QueueTable
            tokens={tokens}
            canManage
            onComplete={completeToken}
            onSkip={skipToken}
            onCancel={cancelToken}
            onReschedule={rescheduleToken}
            onForward={forwardToken}
          />
        </div>
        <div className="panel mt-4">
          <h3>User Verification Status</h3>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.emailVerified ? "Verified" : "Pending"}</td>
                    <td>{user.verificationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel mt-4">
          <h3>Audit Logs</h3>
          {logs.map((log) => (
            <div className="log-row" key={log._id}>
              <strong>{log.action}</strong>
              <span>{log.user?.name || "System"} - {new Date(log.createdAt).toLocaleString()}</span>
              <small>{log.details}</small>
            </div>
          ))}
        </div>
      </section>
      <aside>
        <form className="panel" onSubmit={createRoleUser}>
          <h3>Create Admin / Manager</h3>
          {message && <div className="alert alert-success">{message}</div>}
          <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="form-control mb-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select className="form-select mb-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Manager</option>
            <option>Admin</option>
          </select>
          <button className="btn btn-primary w-100">Create User</button>
        </form>
      </aside>
    </div>
  );
};

export default AdminDashboard;
