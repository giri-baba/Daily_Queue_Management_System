import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PATCH"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinQueueRoom", (queueName) => {
      socket.join(queueName || "general");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export const sendQueueUpdate = (queueName, payload) => {
  if (io) {
    io.to(queueName || "general").emit("queueUpdated", payload);
    io.emit("dashboardUpdated", payload);
  }
};
