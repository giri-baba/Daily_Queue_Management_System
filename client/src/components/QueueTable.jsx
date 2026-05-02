import StatusBadge from "./StatusBadge.jsx";

const QueueTable = ({
  tokens,
  onComplete,
  onSkip,
  onCancel,
  onReschedule,
  onForward,
  canManage = false,
  canUserEdit = false
}) => {
  const showActions = canManage || canUserEdit;
  const terminalStatuses = ["Completed", "Cancelled"];
  const isActionDisabled = (token) => terminalStatuses.includes(token.status);
  console.log(tokens)
  return (
    <div className="table-responsive panel">
      <table className="table align-middle mb-0">
        <thead>
          <tr>
            <th>Token</th>
            <th>User</th>
            <th>Collector</th>
            <th>Counter</th>
            <th>Status</th>
            <th>Details</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token._id}>
              <td className="fw-semibold">{token.tokenNumber}</td>
              <td>{token.user?.name || "Current user"}</td>
              <td>{token.collectedBy?.name || "Self"}</td>
              <td>{token.counterNumber}</td>
              <td>
                <StatusBadge status={token.status} />
              </td>
              <td className="small">
                {token.forwardedToDepartment && <div>To: {token.forwardedToDepartment}</div>}
                {token.scheduledFor && <div>On: {new Date(token.scheduledFor).toLocaleString()}</div>}
                {token.note && <div>{token.note}</div>}
              </td>
              {showActions && (
                <td>
                  <div className="token-actions">
                    {canManage && (
                      <>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => onComplete(token._id)}
                          disabled={isActionDisabled(token)}
                          title={isActionDisabled(token) ? `Token is ${token.status}` : "Mark token completed"}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => onSkip(token._id)}
                          disabled={isActionDisabled(token)}
                          title={isActionDisabled(token) ? `Token is ${token.status}` : "Skip token"}
                        >
                          Skip
                        </button>
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => onForward(token._id)}
                          disabled={isActionDisabled(token)}
                          title={isActionDisabled(token) ? `Token is ${token.status}` : "Forward token"}
                        >
                          Forward
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => onReschedule(token._id)}
                      disabled={isActionDisabled(token)}
                      title={isActionDisabled(token) ? `Token is ${token.status}` : "Reschedule token"}
                    >
                      Reschedule
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onCancel(token._id)}
                      disabled={isActionDisabled(token)}
                      title={isActionDisabled(token) ? `Token is ${token.status}` : "Cancel token"}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {!tokens.length && (
            <tr>
              <td colSpan={showActions ? 7 : 6} className="text-center text-muted py-4">
                No queue tokens found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QueueTable;
