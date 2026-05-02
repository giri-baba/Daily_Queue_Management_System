import { useCallback, useEffect, useState } from "react";
import api from "../api/api.js";
import QueueTable from "../components/QueueTable.jsx";
import StatsCards from "../components/StatsCards.jsx";
import useQueueSocket from "../hooks/useQueueSocket.js";

const ManagerDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState({});
  const [feedback, setFeedback] = useState([]);

  const loadData = useCallback(async () => {
    const [queueRes, statsRes, feedbackRes] = await Promise.all([
      api.get("/queues"),
      api.get("/dashboard/stats"),
      api.get("/feedback")
    ]);
    setTokens(queueRes.data);
    setStats(statsRes.data);
    setFeedback(feedbackRes.data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useQueueSocket("general", loadData);

  const completeToken = async (id) => {
    await api.patch(`/queues/${id}/complete`);
    loadData();
  };

  const skipToken = async (id) => {
    await api.patch(`/queues/${id}/skip`);
    loadData();
  };

  const cancelToken = async (id) => {
    const reason = window.prompt("Reason for cancellation?", "Cancelled by manager");
    if (!reason) return;
    await api.patch(`/queues/${id}/cancel`, { reason });
    loadData();
  };

  const rescheduleToken = async (id) => {
    const scheduledFor = window.prompt("Enter new date and time, example: 2026-05-03T10:30");
    if (!scheduledFor) return;
    await api.patch(`/queues/${id}/reschedule`, { scheduledFor, note: "Rescheduled by manager" });
    loadData();
  };

  const forwardToken = async (id) => {
    const department = window.prompt("Forward to which department?", "Manager Review");
    if (!department) return;
    await api.patch(`/queues/${id}/forward`, { department });
    loadData();
  };

  return (
    <section>
      <div className="section-head">
        <div>
          <h1>Manager Dashboard</h1>
          <p>Monitor queue performance, service status, and user feedback.</p>
        </div>
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
      <div className="panel mt-4">
        <h3>Recent Feedback</h3>
        {feedback.map((item) => (
          <div className="feedback-row" key={item._id}>
            <strong>{item.rating}/5</strong>
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ManagerDashboard;
