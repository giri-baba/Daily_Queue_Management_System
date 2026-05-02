import { useEffect } from "react";
import { io } from "socket.io-client";

const useQueueSocket = (queueName, onUpdate) => {
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.emit("joinQueueRoom", queueName);
    socket.on("queueUpdated", onUpdate);
    socket.on("dashboardUpdated", onUpdate);

    return () => socket.disconnect();
  }, [queueName, onUpdate]);
};

export default useQueueSocket;
