import { useCallback, useEffect, useState } from "react";
import api from "../api/api.js";
import QueueTable from "../components/QueueTable.jsx";
import useQueueSocket from "../hooks/useQueueSocket.js";

const QueueMonitor = () => {
  const [tokens, setTokens] = useState([]);

  const loadData = useCallback(async () => {
    const { data } = await api.get("/queues");
    setTokens(data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useQueueSocket("general", loadData);

  const current = tokens.find((token) => token.status === "Serving");

  return (
    <section>
      <div className="monitor-board">
        <span>Now Serving</span>
        <strong>{current?.tokenNumber || "Waiting for next token"}</strong>
      </div>
      <QueueTable tokens={tokens} />
    </section>
  );
};

export default QueueMonitor;
