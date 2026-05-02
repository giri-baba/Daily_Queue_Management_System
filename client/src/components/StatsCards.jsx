const labels = [
  ["users", "Users"],
  ["staff", "Staff"],
  ["managers", "Managers"],
  ["waiting", "Waiting"],
  ["serving", "Serving"],
  ["completed", "Completed"],
  ["skipped", "Skipped"],
  ["cancelled", "Cancelled"],
  ["forwarded", "Forwarded"],
  ["rescheduled", "Rescheduled"],
  ["feedback", "Feedback"],
  ["relationships", "Approved Relations"]
];

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      {labels.map(([key, label]) => (
        <div className="stat-card" key={key}>
          <span>{label}</span>
          <strong>{stats?.[key] ?? 0}</strong>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
