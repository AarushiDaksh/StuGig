import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { NextApiResponseWithSocket } from "@/types/socket"; // ✅ CORRECT

const ioHandler = (_req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io...");

    const io = new Server(res.socket.server as any, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("send-message", (data) => {
        socket.broadcast.emit("receive-message", data);
      });
    });
  }
  res.end();
};

export default ioHandler;
