import { useCallback, useEffect, useState } from "react";
import { StepForward } from "lucide-react";
import api from "../api/api.js";
import QueueTable from "../components/QueueTable.jsx";
import StatsCards from "../components/StatsCards.jsx";
import useQueueSocket from "../hooks/useQueueSocket.js";

const StaffDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState({});

  const loadData = useCallback(async () => {
    const [queueRes, statsRes] = await Promise.all([
      api.get("/queues"),
      api.get("/dashboard/stats")
    ]);
    setTokens(queueRes.data);
    setStats(statsRes.data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useQueueSocket("general", loadData);

  const nextToken = async () => {
    await api.patch("/queues/next", { queueName: "general" });
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
    const reason = window.prompt("Reason for cancellation?", "Cancelled by staff");
    if (!reason) return;
    await api.patch(`/queues/${id}/cancel`, { reason });
    loadData();
  };

  const rescheduleToken = async (id) => {
    const scheduledFor = window.prompt("Enter new date and time, example: 2026-05-03T10:30");
    if (!scheduledFor) return;
    await api.patch(`/queues/${id}/reschedule`, { scheduledFor, note: "Rescheduled by staff" });
    loadData();
  };

  const forwardToken = async (id) => {
    const department = window.prompt("Forward to which department?", "Verification");
    if (!department) return;
    await api.patch(`/queues/${id}/forward`, { department });
    loadData();
  };

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>Staff Dashboard</h1>
          <p>Call the next token, complete service, or skip unavailable customers.</p>
        </div>
        <button className="btn btn-primary" onClick={nextToken}>
          <StepForward size={18} /> Next Token
        </button>
      </div>
      <StatsCards stats={stats} />
      <QueueTable
        tokens={tokens}
        canManage
        onComplete={completeToken}
        onSkip={skipToken}
        onCancel={cancelToken}
        onReschedule={rescheduleToken}
        onForward={forwardToken}
      />
    </section>
  );
};

export default StaffDashboard;
