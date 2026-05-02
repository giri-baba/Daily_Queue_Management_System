const styles = {
  Waiting: "text-bg-warning",
  Serving: "text-bg-primary",
  Completed: "text-bg-success",
  Skipped: "text-bg-secondary",
  Cancelled: "text-bg-danger",
  Forwarded: "text-bg-info",
  Rescheduled: "text-bg-dark",
  Approved: "text-bg-success",
  Pending: "text-bg-warning",
  Rejected: "text-bg-danger"
};

const StatusBadge = ({ status }) => {
  return <span className={`badge ${styles[status] || "text-bg-light"}`}>{status}</span>;
};

export default StatusBadge;
